import { NextRequest, NextResponse } from 'next/server';
import { getResumeSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const resumeData = await getResumeSettings();
    const downloadParam = request.nextUrl.searchParams.get('download');

    // If download flag is requested, redirect to the direct file URL
    if (downloadParam && resumeData.resumeUrl) {
      if (resumeData.resumeUrl.startsWith('http://') || resumeData.resumeUrl.startsWith('https://')) {
        return NextResponse.redirect(resumeData.resumeUrl);
      }
      return NextResponse.redirect(new URL(resumeData.resumeUrl, request.url));
    }

    return NextResponse.json({
      success: true,
      url: resumeData.resumeUrl || null,
      filename: resumeData.resumeFilename || 'resume.pdf',
      updatedAt: resumeData.updatedAt || null,
    });
  } catch (error) {
    console.error('Error fetching resume settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume settings' },
      { status: 500 }
    );
  }
}
