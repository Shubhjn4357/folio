import { NextRequest, NextResponse } from 'next/server';
import { getResumeSettings, formatGoogleDriveUrl } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const resumeData = await getResumeSettings();
    const downloadParam = request.nextUrl.searchParams.get('download');

    // If download flag is requested, redirect to direct file or view URL
    if (downloadParam) {
      if (resumeData.resumeUrl) {
        const downloadUrl = formatGoogleDriveUrl(resumeData.resumeUrl, 'download');
        if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
          return NextResponse.redirect(downloadUrl, {
            status: 307,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          });
        }
        return NextResponse.redirect(new URL(downloadUrl, request.url), {
          status: 307,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }

      return NextResponse.json(
        { error: 'Resume link has not been configured yet in Admin > Resume / CV.' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const downloadUrl = resumeData.resumeUrl
      ? formatGoogleDriveUrl(resumeData.resumeUrl, 'download')
      : null;

    return NextResponse.json(
      {
        success: true,
        url: resumeData.resumeUrl || null,
        downloadUrl: downloadUrl || resumeData.resumeUrl || null,
        filename: resumeData.resumeFilename || 'Curriculum_Vitae.pdf',
        updatedAt: resumeData.updatedAt || null,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching resume settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume settings' },
      { status: 500 }
    );
  }
}
