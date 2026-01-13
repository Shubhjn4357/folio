'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Blog } from '@/lib/db/schema';

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Blog Post</h1>
        <p className="text-secondary">Update your blog article</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-white font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-tertiary border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple"
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-white font-medium mb-2">Cover Image URL</label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-4 py-3 bg-tertiary border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-white font-medium mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 bg-tertiary border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple resize-none"
            rows={2}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-white font-medium mb-2">Content * (Markdown supported)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 bg-tertiary border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple resize-none font-mono text-sm"
            rows={15}
            required
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-5 h-5 rounded border-white/10 bg-tertiary text-neon-purple focus:ring-neon-purple"
          />
          <label htmlFor="isPublished" className="text-white">Published</label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-tertiary text-secondary rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
