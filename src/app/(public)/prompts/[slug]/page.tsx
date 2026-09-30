'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { PromptProject } from '@/types/prompts';
import { MarkdownRenderer } from '@/components/ui';
import { PromptDetailSkeleton } from '@/components/ui/Skeleton';
import PromptStepsGuide from '@/components/prompts/PromptStepsGuide';
import { fetchPublicPromptProjectBySlug } from '@/services';
import {
  FaArrowLeft,
  FaCopy,
  FaCheck,
  FaGithub,
  FaArrowUpRightFromSquare,
  FaTerminal,
  FaCode,
  FaEye,
} from 'react-icons/fa6';

export default function PromptDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const urlParam = searchParams.get('url');

  const [project, setProject] = useState<PromptProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  useEffect(() => {
    if (!slug) return;

    async function loadProject() {
      try {
        setLoading(true);
        const data = await fetchPublicPromptProjectBySlug(slug);
        if (data) {
          setProject(data);
        }
      } catch (err) {
        console.error('Failed to load prompt project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  const activePrompt = project?.prompts[activePromptIndex] || project?.prompts[0];

  const handleCopyPrompt = async () => {
    if (!activePrompt) return;
    try {
      await navigator.clipboard.writeText(activePrompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const effectiveRepoUrl = urlParam || project?.repoUrl;

  if (loading) {
    return <PromptDetailSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-screen py-32 px-4 max-w-4xl mx-auto text-center space-y-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-main)]">Prompt Project Not Found</h1>
        <p className="text-secondary text-sm">We couldn't locate a prompt blueprint with slug "{slug}".</p>
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono glass-pill text-neon-blue"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Browse All Prompts</span>
        </Link>
      </div>
    );
  }

  // Token estimate roughly words * 1.3
  const wordCount = activePrompt?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const tokenEstimate = Math.round(wordCount * 1.35);

  return (
    <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors glass-pill px-4 py-2 rounded-full"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>All Prompts</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium text-emerald-400 glass-pill border border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>See it Live</span>
              <FaArrowUpRightFromSquare className="w-3 h-3" />
            </a>
          )}

          {effectiveRepoUrl && (
            <a
              href={effectiveRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium text-[var(--text-main)] glass-pill border border-black/10 dark:border-white/10 hover:border-white/30 transition-all"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>Open Full Project</span>
            </a>
          )}
        </div>
      </div>

      {/* Project Hero Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-mono bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[var(--text-main)] tracking-tight">
          {project.title}
        </h1>

        <p className="text-secondary text-base sm:text-lg leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Project Cover Image */}
        {project.image && (
          <div className="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden glass-panel border border-black/10 dark:border-white/10 shadow-2xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}
      </div>

      {/* 3 Step Guide (01, 02, 03) */}
      <PromptStepsGuide showLibraryBanner={false} />

      {/* Prompts Section (Multi-Prompt support) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <FaTerminal className="w-4 h-4 text-neon-blue" />
            <h2 className="font-display font-semibold text-2xl text-[var(--text-main)]">
              AI Generation Prompts
            </h2>
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-mono text-neon-blue">
              {project.prompts.length} {project.prompts.length === 1 ? 'Prompt' : 'Prompts'}
            </span>
          </div>

          {/* View Mode & Quick Copy */}
          <div className="flex items-center gap-2">
            <div className="flex items-center glass-pill rounded-full p-0.5 border border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  viewMode === 'preview'
                    ? 'bg-neon-blue text-slate-950 font-semibold shadow-sm'
                    : 'text-secondary hover:text-[var(--text-main)]'
                }`}
              >
                <FaEye className="w-3 h-3" />
                <span>Formatted</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  viewMode === 'raw'
                    ? 'bg-neon-blue text-slate-950 font-semibold shadow-sm'
                    : 'text-secondary hover:text-[var(--text-main)]'
                }`}
              >
                <FaCode className="w-3 h-3" />
                <span>Raw Markdown</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Tabs (if multiple prompts) */}
        {project.prompts.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {project.prompts.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setActivePromptIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activePromptIndex === idx
                    ? 'glass-card font-semibold text-neon-blue border border-neon-blue/40 shadow-sm'
                    : 'glass-pill text-secondary hover:text-[var(--text-main)]'
                }`}
              >
                <span className="mono-label text-[10px]">0{idx + 1}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Prompt Viewer Card */}
        {activePrompt && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl relative space-y-6">
            {/* Prompt Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                  {activePrompt.title}
                </h3>
                {activePrompt.description && (
                  <p className="text-secondary text-xs mt-1">
                    {activePrompt.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-secondary">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>~{tokenEstimate} tokens</span>
                </div>
              </div>

              {/* Big Copy Prompt Button */}
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`btn-wipe inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer shadow-lg ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-neon-blue hover:bg-cyan-400 text-slate-950 shadow-neon-blue/30'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="w-4 h-4" />
                    <span>Copy Complete Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Content */}
            {viewMode === 'preview' ? (
              <div className="p-4 sm:p-6 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 overflow-x-auto">
                <MarkdownRenderer content={activePrompt.content} />
              </div>
            ) : (
              <div className="relative">
                <textarea
                  readOnly
                  value={activePrompt.content}
                  rows={20}
                  className="w-full p-5 rounded-2xl font-mono text-xs bg-slate-950 text-slate-200 border border-black/10 dark:border-white/10 outline-none resize-none leading-relaxed select-all"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5 dark:border-white/5">
        <Link
          href="/prompts"
          className="text-xs font-mono text-secondary hover:text-neon-blue transition-colors flex items-center gap-2"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to All Prompt Projects</span>
        </Link>

        {effectiveRepoUrl && (
          <a
            href={effectiveRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-neon-blue hover:text-neon-purple transition-colors flex items-center gap-2"
          >
            <span>Inspect GitHub Repository</span>
            <FaGithub className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
