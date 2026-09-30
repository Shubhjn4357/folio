'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaLock, FaUser } from 'react-icons/fa6';
import { loginAdmin } from '@/services';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin({ username, password });
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--text-main)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-neon-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-neon-blue/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-black/10 dark:border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-display font-bold text-base flex items-center justify-center mx-auto mb-4 shadow-lg">
              SJ
            </div>
            <span className="mono-label text-neon-blue">Authentication</span>
            <h1 className="font-display font-semibold text-2xl text-[var(--text-main)] mt-1">
              Admin Console
            </h1>
            <p className="text-secondary text-xs mt-2">
              Sign in to manage portfolio content, messages, and analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center font-mono"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="username" className="mono-label text-[11px] text-secondary mb-2 block">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary opacity-60" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                  placeholder="Enter administrator username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mono-label text-[11px] text-secondary mb-2 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary opacity-60" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm font-medium text-[var(--text-main)] placeholder:text-secondary/50 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                  placeholder="Enter administrator password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-wipe w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Console →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
            >
              <FaArrowLeft className="w-3 h-3" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
