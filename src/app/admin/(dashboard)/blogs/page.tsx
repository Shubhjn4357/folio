'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Blog } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?all=true');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const togglePublish = async (id: number, isPublished: boolean) => {
    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      setBlogs(blogs.map(b =>
        b.id === id ? { ...b, isPublished: !isPublished } : b
      ));
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-secondary">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg hover:shadow-neon transition-all"
        >
          + New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-tertiary rounded-2xl p-12 text-center">
          <p className="text-6xl mb-4">📝</p>
          <p className="text-secondary mb-6">No blog posts yet. Create your first one!</p>
          <Link
            href="/admin/blogs/new"
            className="inline-block px-6 py-3 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-tertiary rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">{blog.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${blog.isPublished
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-secondary text-sm">/blog/{blog.slug}</p>
                </div>
                <p className="text-secondary text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>

              {blog.excerpt && (
                <p className="text-secondary mb-4 line-clamp-2">{blog.excerpt}</p>
              )}

              <div className="flex gap-3">
                <Link
                  href={`/admin/blogs/${blog.id}`}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-secondary text-sm rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-sm rounded-lg transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => togglePublish(blog.id, blog.isPublished ?? false)}
                  className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple text-sm rounded-lg transition-colors"
                >
                  {blog.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
