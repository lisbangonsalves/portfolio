import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getPortfolioData, updatePortfolioData } from '@/lib/db';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ resume: data.resume || null });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type - only PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for resume)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Get current resume to delete old one
    const currentData = await getPortfolioData();
    const oldResumeUrl = currentData.resume;

    // Delete old resume from Cloudinary if it exists
    if (oldResumeUrl) {
      try {
        // Extract public_id from Cloudinary URL
        // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{public_id}.pdf
        const match = oldResumeUrl.match(/\/upload\/v\d+\/(.+?)\.pdf/);
        if (match) {
          const publicId = match[1];
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
      } catch (deleteError) {
        console.warn('Failed to delete old resume:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload new resume to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/resume',
          resource_type: 'raw',
          public_id: `resume_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Update database with new resume URL
    await updatePortfolioData('resume', result.secure_url);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const currentData = await getPortfolioData();
    const resumeUrl = currentData.resume;

    if (!resumeUrl) {
      return NextResponse.json({ error: 'No resume to delete' }, { status: 400 });
    }

    // Delete from Cloudinary
    try {
      const match = resumeUrl.match(/\/upload\/v\d+\/(.+?)\.pdf/);
      if (match) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      }
    } catch (deleteError) {
      console.warn('Failed to delete resume from Cloudinary:', deleteError);
    }

    // Remove from database
    await updatePortfolioData('resume', null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resume delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
