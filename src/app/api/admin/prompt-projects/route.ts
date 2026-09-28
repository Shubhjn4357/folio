import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getPromptProjects, savePromptProject, deletePromptProject, PromptProject } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

// GET all prompt projects for admin
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await getPromptProjects();
    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error in admin GET prompt projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt projects' },
      { status: 500 }
    );
  }
}

// POST create or update prompt project
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, description, image, repoUrl, liveUrl, tags, prompts, isFeatured, order } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const cleanSlug = (slug?.trim() || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    const cleanRepoUrl = repoUrl?.trim() || '';

    // Validate prompts
    if (!Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: 'At least one prompt is required' }, { status: 400 });
    }

    const formattedPrompts = prompts.map((p, idx) => ({
      id: p.id || `prompt-${Date.now()}-${idx}`,
      title: p.title?.trim() || `Prompt ${idx + 1}`,
      description: p.description?.trim() || '',
      content: p.content || '',
    }));

    const formattedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const saved = await savePromptProject({
      id: id || undefined,
      title: title.trim(),
      slug: cleanSlug,
      description: description?.trim() || '',
      image: image?.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      repoUrl: cleanRepoUrl,
      liveUrl: liveUrl?.trim() || undefined,
      tags: formattedTags,
      prompts: formattedPrompts,
      isFeatured: isFeatured !== false,
      order: typeof order === 'number' ? order : 0,
    });

    return NextResponse.json({
      success: true,
      message: id ? 'Prompt project updated successfully!' : 'Prompt project created successfully!',
      data: saved,
    });
  } catch (error) {
    console.error('Error saving prompt project:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt project' },
      { status: 500 }
    );
  }
}

// DELETE prompt project
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const deleted = await deletePromptProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Prompt project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting prompt project:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt project' },
      { status: 500 }
    );
  }
}
