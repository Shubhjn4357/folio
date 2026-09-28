import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { fetchUserRepos, fetchReadmeImage } from '@/services/github';

export const dynamic = 'force-dynamic';

const DEFAULT_USERNAME = 'Shubhjn4357';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || DEFAULT_USERNAME;
    const fetchImageForRepo = searchParams.get('repo'); // optional: fetch preview image for specific repo

    if (fetchImageForRepo) {
      const branch = searchParams.get('branch') || 'main';
      const image = await fetchReadmeImage(username, fetchImageForRepo, branch);
      return NextResponse.json({
        success: true,
        image,
      });
    }

    const repos = await fetchUserRepos(username, 100);
    const filteredRepos = repos.filter((r) => !r.name.includes('.github'));

    return NextResponse.json({
      success: true,
      data: filteredRepos.map((r) => ({
        id: r.id,
        name: r.name,
        displayName: r.name.replace(/[-_]/g, ' '),
        description: r.description || '',
        html_url: r.html_url,
        topics: r.topics || [],
        homepage: r.homepage || '',
        language: r.language || '',
        default_branch: r.default_branch || 'main',
        stargazers_count: r.stargazers_count || 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin github repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories' },
      { status: 500 }
    );
  }
}
