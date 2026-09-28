'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Blog } from '@/lib/db/schema';
import { FaPlus, FaPen, FaTrash, FaGlobe, FaFileLines } from 'react-icons/fa6';

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-purple">Publications</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Blog Articles
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Create, edit, publish, and manage written editorial pieces.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="btn-wipe px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full flex items-center gap-2"
        >
          <FaPlus className="w-3 h-3" />
          <span>Write New Article</span>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-neon-blue">
            <FaFileLines className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mb-1">No Articles Yet</h3>
          <p className="text-secondary text-xs mb-6">
            Share engineering thoughts, technical case studies, and tutorials.
          </p>
          <Link
            href="/admin/blogs/new"
            className="glass-pill px-5 py-2 rounded-full text-xs font-mono font-semibold"
          >
            Create First Post &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                        {blog.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full font-semibold ${
                          blog.isPublished
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {blog.isPublished ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-secondary">
                      /blog/{blog.slug}
                    </p>
                  </div>

                  <p className="text-xs font-mono text-secondary shrink-0">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {blog.excerpt && (
                  <p className="text-secondary text-xs sm:text-sm line-clamp-2 leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <Link
                    href={`/admin/blogs/${blog.id}`}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors flex items-center gap-2"
                  >
                    <FaPen className="w-3 h-3 text-neon-blue" />
                    <span>Edit</span>
                  </Link>

                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors flex items-center gap-2"
                  >
                    <FaGlobe className="w-3 h-3" />
                    <span>Live Preview</span>
                  </Link>

                  <button
                    onClick={() => togglePublish(blog.id, blog.isPublished ?? false)}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-neon-purple hover:bg-neon-purple/10 transition-colors"
                  >
                    {blog.isPublished ? 'Convert to Draft' : 'Publish to Live'}
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 ml-auto"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
