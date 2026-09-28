'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "../hoc";
import { Tag } from "../constants";
import { useGitHubRepos } from "../hooks/useGitHubRepos";
import { ProjectCardSkeleton } from "./ui/Skeleton";
import { FaArrowUpRightFromSquare, FaGithub, FaArrowRight } from "react-icons/fa6";

const GITHUB_USERNAME = "Shubhjn4357";

const FILTER_TABS = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Applications" },
  { id: "mobile", label: "Mobile / Native" },
  { id: "blockchain", label: "Decentralized / Web3" },
];

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: Tag[];
  image: string;
  source_code_link: string;
  live_link?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="w-full"
    >
      <div
        className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full group cursor-pointer overflow-hidden relative"
        onClick={() => router.push(`/project/${index}?repo=${encodeURIComponent(source_code_link)}`)}
      >
        {/* Project Thumbnail Image with Parallax Scale */}
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 mb-5">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick GitHub pill */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(source_code_link, "_blank");
              }}
              aria-label="View Source Code"
              className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[var(--text-main)] hover:text-neon-blue bg-white/80 dark:bg-black/60 hover:scale-110 transition-all shadow-md border border-black/10 dark:border-white/15"
            >
              <FaGithub className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Metadata */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="mono-label text-[10px] text-secondary">Project 0{index + 1}</span>
              <span className="text-xs text-secondary font-mono">2024</span>
            </div>
            
            <h3 className="font-display font-semibold text-xl text-[var(--text-main)] group-hover:text-neon-blue transition-colors flex items-center justify-between">
              <span>{name}</span>
              <FaArrowUpRightFromSquare className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-neon-blue" />
            </h3>

            <p className="mt-2 text-secondary text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tags as subtle pill badges */}
          <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={`${name}-${tag.name}`}
                className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/5 dark:bg-white/5 text-secondary border border-black/5 dark:border-white/5"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Works: React.FC = () => {
  const { projects, loading } = useGitHubRepos(GITHUB_USERNAME, 6);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => {
      const tagNames = p.tags.map((t) => t.name.toLowerCase());
      if (activeFilter === "web") return tagNames.some((t) => t.includes("react") || t.includes("next") || t.includes("web") || t.includes("tailwind"));
      if (activeFilter === "mobile") return tagNames.some((t) => t.includes("native") || t.includes("mobile") || t.includes("android") || t.includes("ios"));
      return true;
    });
  }, [projects, activeFilter]);

  return (
    <div className="w-full" id="work">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="mono-label text-neon-blue">Selected Portfolio</span>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[var(--text-main)] mt-2">
            Featured Projects.
          </h2>
          <p className="mt-3 text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
            Real-world applications and digital products showcasing full-stack engineering, immersive interfaces, and scalable system design.
          </p>
        </div>

        {/* Minimal Interactive Floating Tab Pill Filter */}
        <div className="glass-pill p-1.5 rounded-full flex flex-wrap items-center gap-1 self-start md:self-auto">
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? "text-black dark:text-white font-semibold"
                    : "text-secondary hover:text-black dark:hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="works-filter-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="absolute inset-0 bg-white dark:bg-[#1a233a] rounded-full shadow-sm border border-black/5 dark:border-white/10 -z-10"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.name || `project-${index}`}
                index={index}
                name={project.name}
                description={project.description}
                tags={project.tags}
                image={typeof project.image === 'string' ? project.image : '/placeholder-project.svg'}
                source_code_link={project.source_code_link}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* View All Repositories & Prompt Blueprints Actions */}
      <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
        <Link
          href="/project"
          className="btn-wipe px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <span>View All Repositories</span>
          <span className="mono-label text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-black/20">
            Archive ↗
          </span>
          <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="#prompts"
          className="glass-pill px-6 py-3.5 text-xs font-mono font-medium text-neon-blue border border-neon-blue/30 rounded-full hover:bg-neon-blue/10 hover:border-neon-blue transition-all flex items-center gap-2 group"
        >
          <span>Explore AI Prompts Library</span>
          <span className="mono-label text-[10px] text-neon-blue/80">↓</span>
        </Link>
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "project");
