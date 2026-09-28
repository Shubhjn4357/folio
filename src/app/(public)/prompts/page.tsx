'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptProject, INITIAL_PROMPT_PROJECTS } from '@/types/prompts';
import PromptStepsGuide from '@/components/prompts/PromptStepsGuide';
import PromptProjectCard from '@/components/prompts/PromptProjectCard';
import { FaTerminal, FaMagnifyingGlass, FaArrowLeft, FaFilter } from 'react-icons/fa6';

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

  // Compute all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
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

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-3xl border border-black/10 dark:border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          <input
            type="text"
            placeholder="Search prompts by keyword, tech, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] placeholder-secondary focus:outline-none focus:border-neon-blue/40 transition-all"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <FaFilter className="w-3 h-3 text-secondary flex-shrink-0 ml-1" />
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-neon-blue text-slate-950 font-semibold shadow-sm'
                  : 'glass-pill text-secondary hover:text-[var(--text-main)] hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <p className="text-secondary text-sm font-mono">No prompt projects matched your search criteria.</p>
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
