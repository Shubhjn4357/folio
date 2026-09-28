import { NextRequest, NextResponse } from 'next/server';
import { getPromptProjectBySlug } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const project = await getPromptProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: 'Prompt project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching prompt project by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt project' },
      { status: 500 }
    );
  }
}
