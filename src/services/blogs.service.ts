import type { Blog } from '@/lib/db/schema';

export interface BlogInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished?: boolean;
}

/**
 * Fetch all blogs (public published or admin all)
 */
export async function fetchBlogs(all: boolean = false): Promise<Blog[]> {
  const url = all ? '/api/blogs?all=true' : '/api/blogs';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load blogs (${res.status})`);
  }
  const data = await res.json();
  return data.blogs || [];
}

/**
 * Fetch a single blog by ID
 */
export async function fetchBlogById(id: string | number): Promise<Blog> {
  const res = await fetch(`/api/blogs/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Blog post not found (${res.status})`);
  }
  const data = await res.json();
  return data.blog;
}

/**
 * Create a new blog post
 */
export async function createBlog(blogData: BlogInput): Promise<Blog> {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to create blog post');
  }

  const data = await res.json();
  return data.blog;
}

/**
 * Update an existing blog post
 */
export async function updateBlog(id: string | number, blogData: Partial<BlogInput>): Promise<Blog> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to update blog post');
  }

  const data = await res.json();
  return data.blog;
}

/**
 * Toggle publish status of a blog post
 */
export async function togglePublishBlog(id: string | number, isPublished: boolean): Promise<Blog> {
  return updateBlog(id, { isPublished });
}

/**
 * Delete a blog post
 */
export async function deleteBlog(id: string | number): Promise<boolean> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to delete blog post');
  }

  return true;
}
