'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div 
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        >
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue opacity-20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-primary flex items-center justify-center">
              <span className="text-6xl">⚠️</span>
            </div>
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Something broke
        </motion.h1>

        {/* Error Message */}
        <motion.p 
          className="text-secondary text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Don&apos;t worry, even the best code has its bad days. Let&apos;s get you back on track.
        </motion.p>

        {/* Error Details (if available) */}
        {error.message && (
          <motion.div 
            className="mb-8 p-4 bg-tertiary/50 rounded-lg border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-secondary font-mono truncate">
              {error.message}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-tertiary text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Go Home
          </Link>
        </motion.div>

        {/* Decorative code snippet */}
        <motion.div 
          className="mt-12 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <pre className="text-xs text-secondary/50 font-mono overflow-hidden">
{`try {
  await renderAwesomePage();
} catch (err) {
  // You are here 🎯
  showThisPage();
}`}
          </pre>
        </motion.div>
      </motion.div>
    </div>
  );
}
