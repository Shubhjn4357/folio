'use client';

import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { Project } from '@/constants';
import { fetchAllProjectsFromGitHub, fetchUserRepos, GitHubRepo } from '@/services/github';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaCodeFork,
  FaFilter,
  FaFolderOpen,
  FaGithub,
  FaLaptopCode,
  FaMagnifyingGlass,
  FaMobileScreenButton,
  FaStar
} from 'react-icons/fa6';

const GITHUB_USERNAME = 'Shubhjn4357';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Repositories', icon: FaFolderOpen },
  { id: 'web', label: 'Full-Stack & Web', icon: FaLaptopCode },
  { id: 'mobile', label: 'Mobile & Android', icon: FaMobileScreenButton },
];

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [rawRepos, setRawRepos] = useState<Record<string, GitHubRepo>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        // Fetch raw repos for star count, forks, language
        const [fetchedProjects, userRepos] = await Promise.all([
          fetchAllProjectsFromGitHub(GITHUB_USERNAME),
          fetchUserRepos(GITHUB_USERNAME, 100)
        ]);

        if (isMounted) {
          const repoMap: Record<string, GitHubRepo> = {};
          userRepos.forEach(r => {
            repoMap[r.name.toLowerCase()] = r;
          });
          setRawRepos(repoMap);
          setProjects(fetchedProjects);
        }
      } catch (err) {
        console.error('Failed to fetch repositories:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort repositories
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((t) => t.name.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        // Category filter
        if (activeCategory === 'all') return true;

        const tagNames = project.tags.map((t) => t.name.toLowerCase());
        const rawRepo = rawRepos[project.name.toLowerCase().replace(/\s+/g, '-')];
        const lang = rawRepo?.language?.toLowerCase() || '';

        if (activeCategory === 'web') {
          return (
            tagNames.some((t) =>
              ['react', 'next', 'web', 'tailwind', 'typescript', 'javascript', 'css', 'html', 'node', 'express', 'hono'].some(k => t.includes(k))
            ) || ['typescript', 'javascript', 'html', 'css'].includes(lang)
          );
        }

        if (activeCategory === 'mobile') {
          return (
            tagNames.some((t) =>
              ['native', 'mobile', 'android', 'ios', 'compose', 'kotlin', 'expo', 'flutter'].some(k => t.includes(k))
            ) || ['kotlin', 'java', 'dart'].includes(lang)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const repoA = rawRepos[a.name.toLowerCase().replace(/\s+/g, '-')];
        const repoB = rawRepos[b.name.toLowerCase().replace(/\s+/g, '-')];

        if (sortBy === 'stars') {
          return (repoB?.stargazers_count || 0) - (repoA?.stargazers_count || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0; // default order from GitHub updated
      });
  }, [projects, searchQuery, activeCategory, sortBy, rawRepos]);

  return (
    <div className="relative min-h-screen w-full pt-32 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Top Header Breadcrumb & Title */}
      <div className="flex flex-col gap-4 mb-10">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors self-start group mb-2"
        >
          <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Featured Work</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="mono-label text-neon-blue">Codebase & Archives</span>
              <span className="glass-pill px-3 py-1 rounded-full text-[11px] font-mono font-medium text-secondary">
                {projects.length > 0 ? `${projects.length} Repositories` : 'Loading...'}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-[var(--text-main)] tracking-tight mt-2">
              All Public Projects.
            </h1>
            <p className="mt-3 text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
              Complete index of open-source architectures, mobile applications, interactive WebGL shaders, full-stack templates, and native tools.
            </p>
          </div>

          {/* Direct GitHub Profile Link Pill */}
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="glass-pill px-5 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-mono text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-all self-start md:self-auto border border-black/10 dark:border-white/15 hover:scale-105 active:scale-95 shadow-sm"
          >
            <FaGithub className="w-4 h-4 text-neon-purple" />
            <span>github.com/{GITHUB_USERNAME}</span>
            <FaArrowUpRightFromSquare className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Floating Filter Controls & Search Bar */}
      <div className="glass-card p-4 rounded-3xl mb-10 flex flex-col lg:flex-row items-center justify-between gap-4 border border-black/10 dark:border-white/10 shadow-lg">
        {/* Search input */}
        <div className="relative w-full lg:w-96">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by repo, stack, tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-xs font-mono text-[var(--text-main)] placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-secondary hover:text-[var(--text-main)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${isSelected
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-secondary hover:text-black dark:hover:text-white'
                  }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="all-projects-filter"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="absolute inset-0 bg-white dark:bg-[#1a233a] rounded-full shadow-sm border border-black/5 dark:border-white/10 -z-10"
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <FaFilter className="w-3 h-3 text-secondary" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-3.5 py-1.5 text-xs font-mono text-[var(--text-main)] focus:outline-none cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Starred</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Repositories Grid with Dynamic Load-In View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center my-12 border border-black/10 dark:border-white/10">
          <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
            <FaFolderOpen className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="font-display font-semibold text-xl text-[var(--text-main)] mb-1">
            No repositories found
          </h3>
          <p className="text-secondary text-xs max-w-sm mb-6">
            We couldn't find any projects matching "{searchQuery}". Try searching with another term.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="btn-wipe px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const rawRepo = rawRepos[project.name.toLowerCase().replace(/\s+/g, '-')];
              const stars = rawRepo?.stargazers_count ?? 0;
              const forks = rawRepo?.forks_count ?? 0;
              const language = rawRepo?.language;

              return (
                <motion.div
                  key={project.source_code_link || project.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full group overflow-hidden relative border border-black/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300">
                    {/* Thumbnail Image Container */}
                    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 mb-5">
                      <Image
                        src={project.image || `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${project.name}`}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Direct GitHub Link Button (Theme Dynamic) */}
                      <div className="absolute top-3 right-3 z-10">
                        <a
                          href={project.source_code_link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Open ${project.name} repository`}
                          className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[var(--text-main)] hover:text-neon-blue bg-white/80 dark:bg-black/60 hover:scale-110 transition-all shadow-md border border-black/10 dark:border-white/15"
                        >
                          <FaGithub className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Language pill overlay */}
                      {language && (
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-[var(--text-main)] border border-black/10 dark:border-white/15 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                            {language}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta info & Description */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Repository Stats bar */}
                        <div className="flex items-center justify-between text-xs text-secondary font-mono mb-2">
                          <div className="flex items-center gap-3">
                            {stars > 0 && (
                              <span className="flex items-center gap-1 text-amber-500">
                                <FaStar className="w-3 h-3" />
                                {stars}
                              </span>
                            )}
                            {forks > 0 && (
                              <span className="flex items-center gap-1">
                                <FaCodeFork className="w-3 h-3" />
                                {forks}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] opacity-60">
                            {rawRepo?.default_branch ? `branch: ${rawRepo.default_branch}` : 'public'}
                          </span>
                        </div>

                        {/* Repo Title with Direct GitHub Link */}
                        <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-neon-blue transition-colors flex items-center justify-between">
                          <a
                            href={project.source_code_link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-2"
                          >
                            <span>{project.name}</span>
                            <FaArrowUpRightFromSquare className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue" />
                          </a>
                        </h3>

                        <p className="mt-2 text-secondary text-xs line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Tag badges & Action row */}
                      <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 4).map((tag) => (
                            <span
                              key={`${project.name}-${tag.name}`}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/5 dark:bg-white/5 text-secondary border border-black/5 dark:border-white/5"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>

                        {/* Card bottom direct actions */}
                        <div className="flex items-center justify-between pt-1">
                          <a
                            href={project.source_code_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono font-medium text-neon-blue hover:underline flex items-center gap-1.5"
                          >
                            <span>Repository</span>
                            <FaArrowUpRightFromSquare className="w-2.5 h-2.5" />
                          </a>

                          <Link
                            href={`/project/${index}?repo=${encodeURIComponent(project.source_code_link)}`}
                            className="text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
