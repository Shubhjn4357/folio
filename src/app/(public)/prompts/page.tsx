'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptProject, INITIAL_PROMPT_PROJECTS } from '@/types/prompts';
import PromptStepsGuide from '@/components/prompts/PromptStepsGuide';
import PromptProjectCard from '@/components/prompts/PromptProjectCard';
import { FaTerminal, FaMagnifyingGlass, FaArrowLeft, FaFilter, FaXmark } from 'react-icons/fa6';

export default function PromptsPage() {
  const [projects, setProjects] = useState<PromptProject[]>(INITIAL_PROMPT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const res = await fetch('/api/prompt-projects');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setProjects(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching prompts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Compute tag counts and unique tag list
  const { allTags, tagCounts } = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    const tagSet = new Set<string>();

    projects.forEach((p) => {
      p.tags.forEach((t) => {
        tagSet.add(t);
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    return {
      allTags: ['All', ...Array.from(tagSet)],
      tagCounts: counts,
    };
  }, [projects]);

  // Filter projects by search query and tag
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag =
        selectedTag === 'All' ||
        project.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((t) => t.toLowerCase().includes(query)) ||
        project.prompts.some((p) => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));

      return matchesTag && matchesSearch;
    });
  }, [projects, selectedTag, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedTag !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTag('All');
  };

  return (
    <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header & Back Link */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors glass-pill px-4 py-1.5 rounded-full"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="space-y-2">
            <span className="mono-label text-neon-blue flex items-center gap-2">
              <FaTerminal className="w-3.5 h-3.5" />
              Prompt Engineering Library
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-[var(--text-main)]">
              AI Prompt Projects.
            </h1>
            <p className="text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
              Copy complete UI layouts, physics coordinates, and component architecture prompts. Zero prompt-engineering required—just copy, paste into your AI, and launch live.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Cards Guide */}
      <PromptStepsGuide showLibraryBanner={false} />

      {/* Filter and Search Controls: Spacious 2-Tier Layout with No Ugly Scrollbars */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 space-y-4 shadow-xl shadow-black/5 dark:shadow-white/[0.02]">
        {/* Tier 1: Full-Width Search Bar with Live Result Count & Clear Action */}
        <div className="relative w-full">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search prompts by keyword, tech stack, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-xs sm:text-sm font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] placeholder-secondary focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-secondary hover:text-[var(--text-main)] transition-colors cursor-pointer"
                title="Clear search"
              >
                <FaXmark className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-secondary">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Prompt' : 'Prompts'}
            </span>
          </div>
        </div>

        {/* Tier 2: Clean Flex-Wrapped Tag Pills (Zero horizontal overflow/scrollbars) */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-secondary text-xs font-mono mr-1">
            <FaFilter className="w-3 h-3 text-neon-blue" />
            <span className="text-[11px] uppercase tracking-wider">Filter:</span>
          </div>

          {allTags.map((tag) => {
            const count = tagCounts[tag] || 0;
            const isSelected = selectedTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neon-blue text-slate-950 font-bold shadow-md shadow-neon-blue/20 scale-[1.02]'
                    : 'glass-pill text-secondary hover:text-[var(--text-main)] hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                <span>{tag}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-black/5 dark:bg-white/5 text-secondary/80 group-hover:text-[var(--text-main)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-[11px] font-mono text-neon-blue hover:underline cursor-pointer flex items-center gap-1 py-1"
            >
              <FaXmark className="w-2.5 h-2.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-black/10 dark:border-white/10 space-y-3">
          <p className="text-secondary text-sm font-mono">No prompt projects matched your search criteria.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-mono text-neon-blue hover:underline cursor-pointer"
            >
              Clear filters and view all prompts
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <PromptProjectCard key={project.id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
