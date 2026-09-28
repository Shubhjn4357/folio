'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDuration = 1200 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter from 0 to 100
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / minDuration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDuration]);

  if (isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0.9,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] pointer-events-auto bg-[var(--primary)] text-[var(--text-main)] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Top Brand Pill Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-display font-bold text-xs flex items-center justify-center">
                SJ
              </div>
              <span className="font-display font-semibold text-sm tracking-tight">
                Shubham <span className="opacity-40 font-normal">/ Dev</span>
              </span>
            </div>

            <div className="glass-pill px-3 py-1 rounded-full flex items-center gap-2">
              
              <span className="mono-label text-[10px] text-secondary">Loading...</span>
            </div>
          </div>

          {/* Center Counter & Monogram */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            {/* Center Monogram Badge with Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 mb-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-3xl bg-neon-purple/20 blur-xl animate-pulse" />
              <div className="glass-card w-full h-full rounded-3xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-xl">
                <span className="font-display font-bold text-2xl gradient-text">SJ</span>
              </div>
            </motion.div>

            {/* Large Numeric Percentage */}
            <div className="font-mono text-5xl sm:text-7xl font-semibold tracking-tighter mb-4 text-[var(--text-main)]">
              {progress < 10 ? `0${progress}` : progress}
              <span className="text-xl sm:text-2xl font-light text-secondary ml-1">%</span>
            </div>

            {/* Status Line */}
            <p className="mono-label text-xs text-secondary tracking-widest uppercase">
              {progress < 30
                ? 'Initializing experience...'
                : progress < 70
                ? 'Compiling visual shaders...'
                : progress < 100
                ? 'Readying layout...'
                : 'Welcome'}
            </p>

            {/* Progress Bar Line Pill */}
            <div className="w-48 sm:w-64 h-1 bg-black/10 dark:bg-white/10 rounded-full mt-6 overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Bottom Metas */}
          <div className="w-full flex justify-between items-center text-xs font-mono text-secondary">
            <span>Thankyou For Your Patience</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
