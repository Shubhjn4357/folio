import { NextRequest, NextResponse } from 'next/server';
import { getPromptProjects } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    let projects = await getPromptProjects();

    if (featuredOnly) {
      projects = projects.filter((p) => p.isFeatured !== false);
    }

    if (limit && limit > 0) {
      projects = projects.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching prompt projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt projects' },
      { status: 500 }
    );
  }
}
