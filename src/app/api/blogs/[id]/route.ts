import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';

// GET - Fetch single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if id is numeric or slug
    const isNumeric = /^\d+$/.test(id);
    
    const [blog] = await db
      .select()
      .from(blogs)
      .where(isNumeric ? eq(blogs.id, parseInt(id)) : eq(blogs.slug, id));

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if blog is published or user is authenticated
    if (!blog.isPublished) {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id);
    const body = await request.json();

    const [updated] = await db
      .update(blogs)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, blogId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog: updated });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id);

    const [deleted] = await db
      .delete(blogs)
      .where(eq(blogs.id, blogId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
