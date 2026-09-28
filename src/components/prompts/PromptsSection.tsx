'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/hoc';
import { styles } from '@/styles';
import { PromptProject, INITIAL_PROMPT_PROJECTS } from '@/types/prompts';
import PromptStepsGuide from './PromptStepsGuide';
import PromptProjectCard from './PromptProjectCard';
import { FaTerminal, FaArrowRight, FaWandMagicSparkles } from 'react-icons/fa6';

function PromptsSectionInner() {
  const [projects, setProjects] = useState<PromptProject[]>(INITIAL_PROMPT_PROJECTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const res = await fetch('/api/prompt-projects?featured=true&limit=6');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setProjects(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load showcase prompt projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="space-y-12">
      {/* Section Heading */}
      <div className="text-center sm:text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-neon-blue/30 text-xs font-mono text-neon-blue">
          <FaWandMagicSparkles className="w-3 h-3 text-neon-blue animate-pulse" />
          <span>Interactive AI Blueprints</span>
        </div>

        <h2 className={`${styles.sectionHeadText} font-display tracking-tight text-[var(--text-main)]`}>
          Prompt Projects.
        </h2>

        <p className="text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
          Production-grade UI prompts and structural specs built to paste directly into Cursor, Claude, or your favorite AI agent to generate real, responsive interfaces.
        </p>
      </div>

      {/* 3 Steps Guide (01, 02, 03) */}
      <PromptStepsGuide showLibraryBanner={false} />

      {/* Showcase Grid (4-6 Projects) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-xl text-[var(--text-main)] flex items-center gap-2">
            <FaTerminal className="w-4 h-4 text-neon-blue" />
            <span>Featured Prompt Blueprints</span>
          </h3>

          <Link
            href="/prompts"
            className="group flex items-center gap-1.5 text-xs font-mono font-medium text-neon-blue hover:text-neon-purple transition-colors"
          >
            <span>View All ({projects.length})</span>
            <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project, idx) => (
            <PromptProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>

      {/* Bottom Callout: Want the whole library? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-blue/20 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="mono-label text-neon-blue flex items-center gap-1.5">
              <FaWandMagicSparkles className="w-3 h-3" />
              100% Free & Open Source
            </span>
          </div>
          <h4 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-main)]">
            Want the whole library?
          </h4>
          <p className="text-secondary text-xs sm:text-sm leading-relaxed">
            Every prompt on this page is free, with new ones added as the work ships. Explore the catalog, inspect markdown blueprints, or connect directly to GitHub.
          </p>
        </div>

        <Link
          href="/prompts"
          className="flex-shrink-0 btn-wipe inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-mono font-semibold bg-neon-blue/20 hover:bg-neon-blue text-white border border-neon-blue/40 transition-all duration-300 shadow-lg shadow-neon-blue/20"
        >
          <span>Explore All Prompts</span>
          <FaArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}

const PromptsSection = SectionWrapper(PromptsSectionInner, 'prompts');
export default PromptsSection;
