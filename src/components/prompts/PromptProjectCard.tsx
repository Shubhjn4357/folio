'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCopy, FaCheck, FaArrowUpRightFromSquare, FaGithub, FaTerminal, FaArrowRight } from 'react-icons/fa6';
import { PromptProject } from '@/types/prompts';

interface PromptProjectCardProps {
  project: PromptProject;
  index?: number;
}

export default function PromptProjectCard({ project, index = 0 }: PromptProjectCardProps) {
  const [copied, setCopied] = useState(false);

  const primaryPrompt = project.prompts[0]?.content || '';

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!primaryPrompt) return;

    try {
      await navigator.clipboard.writeText(primaryPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const projectDetailHref = `/prompts/${project.slug}?url=${encodeURIComponent(project.repoUrl || '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full group border border-black/10 dark:border-white/10 hover:border-neon-blue/30 transition-all duration-300 relative overflow-hidden"
    >
      <div>
        {/* Project Thumbnail Image */}
        <Link href={projectDetailHref} className="block relative w-full h-[210px] rounded-2xl overflow-hidden bg-black/10 dark:bg-white/5 mb-5 cursor-pointer">
          <Image
            src={project.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
            alt={project.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-mono font-medium text-neon-blue border border-neon-blue/20 backdrop-blur-md">
              <FaTerminal className="inline w-2.5 h-2.5 mr-1" />
              {project.prompts.length} {project.prompts.length === 1 ? 'Prompt' : 'Prompts'}
            </span>
          </div>

          {/* Live Link Indicator */}
          {project.liveUrl && (
            <div className="absolute top-3 right-3">
              <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 border border-emerald-400/20 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="space-y-2.5">
          <Link href={projectDetailHref} className="block group-hover:text-neon-blue transition-colors">
            <h3 className="font-display font-semibold text-lg text-[var(--text-main)] line-clamp-1">
              {project.title}
            </h3>
          </Link>

          <p className="text-secondary text-xs line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tag Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/5 text-secondary border border-black/5 dark:border-white/5"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-secondary">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-5 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
        {/* Copy Prompt Button */}
        <button
          type="button"
          onClick={handleCopyPrompt}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-sm'
              : 'glass-pill text-[var(--text-main)] hover:border-neon-blue/40 hover:text-neon-blue'
          }`}
          title="Quick copy primary prompt"
        >
          {copied ? (
            <>
              <FaCheck className="w-3 h-3 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaCopy className="w-3 h-3 opacity-70" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        {/* Links */}
        <div className="flex items-center gap-1.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-secondary hover:text-emerald-400 hover:border-emerald-400/40 transition-all"
              title="See it Live"
            >
              <FaArrowUpRightFromSquare className="w-3 h-3" />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-secondary hover:text-white hover:border-white/30 transition-all"
              title="GitHub Repo"
            >
              <FaGithub className="w-3.5 h-3.5" />
            </a>
          )}

          <Link
            href={projectDetailHref}
            className="flex items-center gap-1 pl-2 text-xs font-mono font-medium text-neon-blue hover:text-neon-purple transition-colors"
          >
            <span>Open</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
