import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { getResumeSettings, saveResumeSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

// GET - Get current resume configuration (Admin only)
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getResumeSettings();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching admin resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume settings' },
      { status: 500 }
    );
  }
}

// POST - Update resume link or upload resume file (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    // Handle Multipart Form Data (File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const customFilename = formData.get('filename') as string | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Buffer the uploaded file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory in public if not exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate a clean safe filename
      const originalName = file.name || 'resume.pdf';
      const ext = path.extname(originalName) || '.pdf';
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      // Write file
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;
      const displayName = customFilename || originalName;

      // Save settings
      const result = await saveResumeSettings(publicUrl, displayName);

      return NextResponse.json({
        success: true,
        message: 'Resume file uploaded successfully!',
        data: result,
      });
    }

    // Handle JSON (Direct Link / URL input)
    const body = await request.json();
    const { url, filename } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Valid resume link or URL is required' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    const displayName = filename?.trim() || 'Curriculum_Vitae.pdf';

    const result = await saveResumeSettings(cleanUrl, displayName);

    return NextResponse.json({
      success: true,
      message: 'Resume link updated successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error saving admin resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume settings' },
      { status: 500 }
    );
  }
}
