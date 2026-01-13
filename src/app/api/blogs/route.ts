import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { isAuthenticated } from '@/lib/auth';

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET - Fetch all blogs (public: only published, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('all') === 'true';
    
    let query = db.select().from(blogs).orderBy(desc(blogs.createdAt));
    
    // If requesting all (including unpublished), check auth
    if (includeUnpublished) {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    const allBlogs = await query;
    
    // Filter published only for public access
    const filteredBlogs = includeUnpublished 
      ? allBlogs 
      : allBlogs.filter(blog => blog.isPublished);

    return NextResponse.json({ blogs: filteredBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST - Create new blog (admin only)
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const [newBlog] = await db.insert(blogs).values({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      coverImage,
      isPublished: isPublished || false,
    }).returning();

    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
