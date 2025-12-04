import { NextResponse } from 'next/server';
import { getMessages, createMessage, deleteMessage, toggleMessageRead } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET: Fetch all messages (admin only)
export async function GET() {
  try {
    const messages = await getMessages();
    // Convert MongoDB _id to id for frontend compatibility
    const formattedMessages = messages.map(msg => ({
      ...msg,
      id: msg._id.toString(),
      _id: undefined
    }));
    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Submit a new message or delete/update messages
export async function POST(request) {
  try {
    const body = await request.json();

    // Handle new message submission
    if (body.action === 'submit') {
      const { name, email, phone, message } = body;

      // Validation
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'Name, email, and message are required' },
          { status: 400 }
        );
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      // Create new message
      const messageData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        message: message.trim(),
      };

      await createMessage(messageData);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!'
      });
    }

    // Handle message deletion
    if (body.action === 'delete') {
      const { messageId } = body;

      if (!messageId) {
        return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
      }

      try {
        await deleteMessage(new ObjectId(messageId));
        return NextResponse.json({
          success: true,
          message: 'Message deleted successfully'
        });
      } catch (error) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
    }

    // Handle mark as read/unread
    if (body.action === 'toggleRead') {
      const { messageId } = body;

      if (!messageId) {
        return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
      }

      try {
        const newReadStatus = await toggleMessageRead(new ObjectId(messageId));
        if (newReadStatus === null) {
          return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          read: newReadStatus
        });
      } catch (error) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Message API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a message
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    try {
      await deleteMessage(new ObjectId(messageId));
      return NextResponse.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
