import { NextRequest, NextResponse } from 'next/server';
import { getResumeSettings, formatGoogleDriveUrl } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const resumeData = await getResumeSettings();
    const downloadParam = request.nextUrl.searchParams.get('download');

    // If download flag is requested, redirect to the direct file URL
    if (downloadParam) {
      if (resumeData.resumeUrl) {
        const downloadUrl = formatGoogleDriveUrl(resumeData.resumeUrl, 'download');
        if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
          return NextResponse.redirect(downloadUrl, 307);
        }
        return NextResponse.redirect(new URL(downloadUrl, request.url), 307);
      }
      return NextResponse.json(
        { error: 'Resume link has not been configured yet.' },
        { status: 404 }
      );
    }

    const downloadUrl = resumeData.resumeUrl
      ? formatGoogleDriveUrl(resumeData.resumeUrl, 'download')
      : null;

    return NextResponse.json({
      success: true,
      url: resumeData.resumeUrl || null,
      downloadUrl,
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
