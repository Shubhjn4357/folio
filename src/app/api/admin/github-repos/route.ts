import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { fetchUserRepos, fetchReadmeImage } from '@/services/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_USERNAME = 'Shubhjn4357';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated && process.env.NODE_ENV === 'production') {
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

    let repos = await fetchUserRepos(username, 100);

    // Fallback: If GitHub API fails or rate-limits, load local cache for default user
    if ((!repos || repos.length === 0) && username.toLowerCase() === DEFAULT_USERNAME.toLowerCase()) {
      try {
        const cachePath = path.join(process.cwd(), 'data', 'github-repos-cache.json');
        if (fs.existsSync(cachePath)) {
          const raw = fs.readFileSync(cachePath, 'utf-8');
          repos = JSON.parse(raw);
        }
      } catch (cacheErr) {
        console.error('Error reading repo cache:', cacheErr);
      }
    }

    const filteredRepos = (repos || []).filter((r) => r.name && !r.name.includes('.github'));

    return NextResponse.json(
      {
        success: true,
        username,
        count: filteredRepos.length,
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
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching admin github repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories' },
      { status: 500 }
    );
  }
}
