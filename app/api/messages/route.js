import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app', 'data', 'portfolio-data.json');

function readData() {
  const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(fileContents);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET: Fetch all messages (admin only)
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json({ messages: data.messages || [] });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Submit a new message or delete/update messages
export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();

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
      const newMessage = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };

      // Add message to data
      if (!data.messages) {
        data.messages = [];
      }
      data.messages.unshift(newMessage); // Add to beginning

      writeData(data);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!'
      });
    }

    // Handle message deletion
    if (body.action === 'delete') {
      const { messageId } = body;

      if (!data.messages) {
        return NextResponse.json({ error: 'No messages found' }, { status: 404 });
      }

      data.messages = data.messages.filter(msg => msg.id !== messageId);
      writeData(data);

      return NextResponse.json({
        success: true,
        message: 'Message deleted successfully'
      });
    }

    // Handle mark as read/unread
    if (body.action === 'toggleRead') {
      const { messageId } = body;

      if (!data.messages) {
        return NextResponse.json({ error: 'No messages found' }, { status: 404 });
      }

      const message = data.messages.find(msg => msg.id === messageId);
      if (message) {
        message.read = !message.read;
        writeData(data);
        return NextResponse.json({
          success: true,
          read: message.read
        });
      }

      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
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
    const messageId = parseInt(searchParams.get('id'));

    const data = readData();

    if (!data.messages) {
      return NextResponse.json({ error: 'No messages found' }, { status: 404 });
    }

    data.messages = data.messages.filter(msg => msg.id !== messageId);
    writeData(data);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
