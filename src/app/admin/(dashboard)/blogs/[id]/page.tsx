'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Blog } from '@/lib/db/schema';
import { FaArrowLeft } from 'react-icons/fa6';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`);
      if (!res.ok) throw new Error('Blog not found');
      const data = await res.json();
      const blog: Blog = data.blog;
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        coverImage: blog.coverImage || '',
        isPublished: blog.isPublished || false,
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      router.push('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update blog');

      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-purple">Editing Article</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Update Post
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Modify text, metadata, and visibility state.
          </p>
        </div>

        <Link
          href="/admin/blogs"
          className="glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to Articles</span>
        </Link>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-3xl p-6 sm:p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="mono-label text-[11px] text-secondary mb-2 block">
            Article Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Article title..."
            required
            className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="mono-label text-[11px] text-secondary mb-2 block">
            Brief Summary / Excerpt
          </label>
          <input
            type="text"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A short summary of this article..."
            className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="mono-label text-[11px] text-secondary mb-2 block">
            Cover Image URL
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mono-label text-[11px] text-secondary mb-2 block">
            Article Content (Markdown Supported) *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={14}
            placeholder="Write your article markdown here..."
            required
            className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-mono text-[var(--text-main)] placeholder:text-secondary/50 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all resize-y"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded text-neon-purple focus:ring-neon-purple bg-transparent border-black/20 dark:border-white/20"
          />
          <label htmlFor="isPublished" className="text-xs font-mono text-[var(--text-main)] cursor-pointer">
            Published (visible publicly on the portfolio)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
          <Link
            href="/admin/blogs"
            className="glass-pill px-5 py-2.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="btn-wipe px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Update Article →'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
