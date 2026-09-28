'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCopy, FaRobot, FaRocket, FaArrowRight, FaWandMagicSparkles } from 'react-icons/fa6';

interface PromptStepsGuideProps {
  showLibraryBanner?: boolean;
  className?: string;
}

export const PROMPT_STEPS = [
  {
    step: '01',
    title: 'Copy the prompt',
    description:
      'Open the prompt page and hit copy. It carries the layout, the motion and the numbers behind them.',
    icon: FaCopy,
    accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    border: 'hover:border-neon-blue/40',
    numberColor: 'text-neon-blue',
  },
  {
    step: '02',
    title: 'Paste it into your AI',
    description:
      'Claude, Cursor or whatever you build in. Nothing to attach, no prompt-engineering on top.',
    icon: FaRobot,
    accent: 'from-purple-500/20 via-pink-500/10 to-transparent',
    border: 'hover:border-neon-purple/40',
    numberColor: 'text-neon-purple',
  },
  {
    step: '03',
    title: 'Launch it live',
    description:
      'Swap the copy, drop in your own assets, and ship a page that actually moves.',
    icon: FaRocket,
    accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-400/40',
    numberColor: 'text-emerald-400',
  },
];

export default function PromptStepsGuide({
  showLibraryBanner = true,
  className = '',
}: PromptStepsGuideProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROMPT_STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`glass-card  rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 border border-black/10 dark:border-white/10 ${item.border}`}
            >
              {/* Subtle background glow gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-3xl sm:text-4xl font-black ${item.numberColor} tracking-tighter`}>
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-[var(--text-main)] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg sm:text-xl text-[var(--text-main)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Want the whole library? Banner */}
      {showLibraryBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-blue/20 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="mono-label text-neon-blue flex items-center gap-1.5">
                <FaWandMagicSparkles className="w-3 h-3 animate-pulse" />
                Prompt Library
              </span>
            </div>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-main)]">
              Want the whole library?
            </h4>
            <p className="text-secondary text-xs sm:text-sm leading-relaxed">
              Every prompt on this page is free, with new ones added as the work ships.
            </p>
          </div>

          <Link
            href="/prompts"
            className="flex-shrink-0 bg-black dark:bg-white text-white dark:text-black btn-wipe inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold bg-neon-blue/20 hover:bg-neon-blue text-white border border-neon-blue/40 transition-all duration-300 shadow-lg shadow-neon-blue/20"
          >
            <span>Explore All Prompts</span>
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
