'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Suspense } from 'react';

function NewBlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create blog');

      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">New Blog Post</h1>
        <p className="text-secondary">Create a new blog article</p>
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
            placeholder="Enter blog title"
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
            placeholder="https://..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-white font-medium mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 bg-tertiary border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple resize-none"
            placeholder="Brief summary of the article..."
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
            placeholder="Write your blog content here..."
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
          <label htmlFor="isPublished" className="text-white">Publish immediately</label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg hover:shadow-neon transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
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

export default function NewBlogPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <NewBlogForm />
    </Suspense>
  );
}
