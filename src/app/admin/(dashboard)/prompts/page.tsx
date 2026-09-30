'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptProject, PromptItem } from '@/types/prompts';
import { MarkdownRenderer, CustomSelect } from '@/components/ui';
import { PromptCardSkeleton } from '@/components/ui/Skeleton';
import {
  FaTerminal,
  FaPlus,
  FaGithub,
  FaArrowUpRightFromSquare,
  FaTrash,
  FaPenToSquare,
  FaCloudArrowUp,
  FaCheck,
  FaXmark,
  FaEye,
  FaCode,
  FaMagnifyingGlass,
  FaWandMagicSparkles,
  FaArrowsRotate,
  FaCircleExclamation,
  FaSpinner,
} from 'react-icons/fa6';
import {
  fetchAdminPromptProjects,
  savePromptProject,
  deletePromptProject,
  uploadProjectImage,
  fetchGitHubReposForAdmin,
  fetchRepoPreviewImage,
  GitHubRepoItem,
} from '@/services';

export default function AdminPromptsPage() {
  const [projects, setProjects] = useState<PromptProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // GitHub Repos for Select List
  const [gitRepos, setGitRepos] = useState<GitHubRepoItem[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState('Shubhjn4357');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [customUserInput, setCustomUserInput] = useState('Shubhjn4357');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: 'p1',
      title: '01 - Core System Prompt',
      description: 'System instructions and architectural layout specification.',
      content: '### Architecture Blueprint\nDescribe your UI layout, motion coordinates, and component architecture here in markdown.',
    },
  ]);

  // Image Uploading State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewTab, setPreviewTab] = useState<number | null>(null); // prompt index to preview

  // Success / Error Feedback
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchGitHubRepos();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminPromptProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching admin prompt projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubRepos = async (customUser?: string) => {
    const targetUser = (customUser !== undefined ? customUser : githubUser).trim() || 'Shubhjn4357';
    try {
      setLoadingRepos(true);
      setRepoError(null);
      const data = await fetchGitHubReposForAdmin(targetUser);
      setGitRepos(data);
      if (data.length === 0) {
        setRepoError(`No public repositories found for @${targetUser}`);
      }
    } catch (err: any) {
      console.error('Error fetching GitHub repos:', err);
      setRepoError(err?.message || 'Network error fetching repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  // Handle selecting a GitHub repo from list system
  const handleSelectRepo = async (repo: GitHubRepoItem) => {
    setTitle(repo.displayName);
    const generatedSlug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSlug(generatedSlug);
    setDescription(repo.description || `Open source project on GitHub: ${repo.name}`);
    setRepoUrl(repo.html_url);
    if (repo.homepage) {
      setLiveUrl(repo.homepage);
    }
    if (repo.topics && repo.topics.length > 0) {
      setTagsInput(repo.topics.join(', '));
    }
    setIsRepoDropdownOpen(false);

    // Try fetching preview README image for this repo
    try {
      const preview = await fetchRepoPreviewImage(repo.name, repo.default_branch, githubUser);
      if (preview) {
        setImage(preview);
      }
    } catch {
      // fallback
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadProjectImage(file);
      setImage(url);
      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error uploading image file', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Prompt Management
  const handleAddPrompt = () => {
    const newIdx = prompts.length + 1;
    setPrompts([
      ...prompts,
      {
        id: `p-${Date.now()}`,
        title: `0${newIdx} - Prompt Spec`,
        description: 'Component spec or motion instructions.',
        content: '',
      },
    ]);
  };

  const handleRemovePrompt = (idx: number) => {
    if (prompts.length <= 1) return;
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  const handleUpdatePrompt = (idx: number, field: keyof PromptItem, val: string) => {
    const updated = [...prompts];
    updated[idx] = { ...updated[idx], [field]: val };
    setPrompts(updated);
  };

  // Edit existing project
  const handleEdit = (project: PromptProject) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setRepoUrl(project.repoUrl);
    setLiveUrl(project.liveUrl || '');
    setTagsInput(project.tags.join(', '));
    setImage(project.image);
    setIsFeatured(project.isFeatured !== false);
    setPrompts(
      project.prompts && project.prompts.length > 0
        ? project.prompts
        : [
            {
              id: 'p1',
              title: '01 - Core Prompt',
              content: '',
            },
          ]
    );
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setRepoUrl('');
    setLiveUrl('');
    setTagsInput('');
    setImage('');
    setIsFeatured(true);
    setPrompts([
      {
        id: 'p1',
        title: '01 - Core System Prompt',
        description: 'System instructions and architectural layout specification.',
        content: '',
      },
    ]);
    setIsFormOpen(false);
  };

  // Submit project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ text: 'Title is required', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingId || undefined,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        repoUrl,
        liveUrl: liveUrl || undefined,
        tags: tagsArray,
        image: image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        prompts,
        isFeatured,
      };

      await savePromptProject({
        id: editingId || undefined,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        repoUrl,
        liveUrl: liveUrl || undefined,
        tags: tagsArray,
        image: image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        prompts,
        isFeatured,
      });

      setMessage({
        text: editingId ? 'Prompt project updated successfully!' : 'Prompt project created successfully!',
        type: 'success',
      });
      handleResetForm();
      fetchProjects();
    } catch (err: any) {
      setMessage({ text: err.message || 'Error saving prompt project', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt project?')) return;

    try {
      await deletePromptProject(id);
      setMessage({ text: 'Prompt project deleted successfully', type: 'success' });
      fetchProjects();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete project', type: 'error' });
    }
  };

  // Filtered git repos for dropdown
  const filteredGitRepos = gitRepos.filter(
    (r) =>
      r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-blue flex items-center gap-2">
            <FaTerminal className="w-3.5 h-3.5" />
            AI Prompt Projects
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Prompt Projects Studio
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Create, edit, and connect GitHub repositories with 1 or more custom Markdown generation prompts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isFormOpen && !editingId) {
              setIsFormOpen(false);
            } else {
              handleResetForm();
              setIsFormOpen(true);
            }
          }}
          className="btn-wipe inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold bg-neon-blue text-slate-950 shadow-md shadow-neon-blue/20 cursor-pointer"
        >
          {isFormOpen ? <FaXmark className="w-3.5 h-3.5" /> : <FaPlus className="w-3.5 h-3.5" />}
          <span>{isFormOpen ? 'Close Editor' : 'New Prompt Project'}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-mono border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            <FaXmark className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Editor Form Modal / Section */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl space-y-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
              <h2 className="font-display font-semibold text-xl text-[var(--text-main)] flex items-center gap-2">
                <FaWandMagicSparkles className="w-4 h-4 text-neon-blue" />
                <span>{editingId ? 'Edit Prompt Project' : 'Create New Prompt Project'}</span>
              </h2>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-secondary hover:text-[var(--text-main)] text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* GitHub Repo Quick Selector */}
              <div className="glass-card rounded-2xl p-5 border border-neon-blue/20 bg-neon-blue/5 space-y-3 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FaGithub className="w-4 h-4 text-neon-blue" />
                    <span className="font-mono text-xs font-semibold text-[var(--text-main)]">
                      Select Project from GitHub Repos
                    </span>
                    <button
                      type="button"
                      onClick={() => fetchGitHubRepos(githubUser)}
                      disabled={loadingRepos}
                      title="Refresh repositories from GitHub"
                      className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-secondary hover:text-neon-blue transition-colors cursor-pointer"
                    >
                      <FaArrowsRotate className={`w-3 h-3 ${loadingRepos ? 'animate-spin text-neon-blue' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-secondary">User:</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingUser(!isEditingUser)}
                      className="px-2 py-0.5 rounded-full text-[11px] font-mono glass-pill text-neon-blue hover:text-white transition-colors"
                      title="Click to change GitHub user"
                    >
                      @{githubUser}
                    </button>
                    <span className="text-[11px] font-mono text-secondary">
                      ({loadingRepos ? 'fetching...' : `${gitRepos.length} repos`})
                    </span>
                  </div>
                </div>

                {/* Change username inline if toggled */}
                {isEditingUser && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/10 dark:bg-black/30 border border-black/10 dark:border-white/10">
                    <span className="text-xs font-mono text-secondary">https://github.com/</span>
                    <input
                      type="text"
                      value={customUserInput}
                      onChange={(e) => setCustomUserInput(e.target.value)}
                      placeholder="GitHub username"
                      className="flex-1 bg-transparent text-xs font-mono text-[var(--text-main)] outline-none border-b border-black/20 dark:border-white/20 focus:border-neon-blue py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = customUserInput.trim();
                        if (trimmed) {
                          setGithubUser(trimmed);
                          setIsEditingUser(false);
                          fetchGitHubRepos(trimmed);
                        }
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-neon-blue text-slate-950 font-semibold hover:bg-neon-blue/80 transition-colors cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingUser(false)}
                      className="p-1 text-secondary hover:text-[var(--text-main)] cursor-pointer"
                    >
                      <FaXmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Dropdown Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRepoDropdownOpen((prev) => {
                        const next = !prev;
                        if (next && gitRepos.length === 0 && !loadingRepos) {
                          fetchGitHubRepos();
                        }
                        return next;
                      });
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl glass-pill text-xs font-mono text-[var(--text-main)] border border-black/10 dark:border-white/10 hover:border-neon-blue/40 transition-all text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {loadingRepos ? (
                        <>
                          <FaArrowsRotate className="w-3 h-3 animate-spin text-neon-blue" />
                          <span>Fetching repositories from GitHub (@{githubUser})...</span>
                        </>
                      ) : gitRepos.length > 0 ? (
                        <span>Choose a repository to import ({gitRepos.length} available)...</span>
                      ) : (
                        <span>Click to load repositories from @{githubUser}...</span>
                      )}
                    </span>
                    <span className="text-secondary text-[11px]">
                      {loadingRepos ? 'Loading...' : `${gitRepos.length} repos available`}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isRepoDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-panel rounded-2xl p-3 shadow-2xl border border-black/10 dark:border-white/10 backdrop-blur-2xl max-h-80 overflow-y-auto space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary" />
                          <input
                            type="text"
                            placeholder="Search your repos by name or description..."
                            value={repoSearch}
                            onChange={(e) => setRepoSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 text-[var(--text-main)] placeholder-secondary outline-none focus:border-neon-blue/40"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fetchGitHubRepos()}
                          disabled={loadingRepos}
                          className="px-2.5 py-1.5 rounded-lg glass-pill text-[11px] font-mono text-neon-blue hover:text-white flex items-center gap-1.5 cursor-pointer"
                          title="Refresh repository list"
                        >
                          <FaArrowsRotate className={`w-3 h-3 ${loadingRepos ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">Refresh</span>
                        </button>
                      </div>

                      {repoError && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs font-mono text-amber-400">
                          <div className="flex items-center gap-2">
                            <FaCircleExclamation className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{repoError}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => fetchGitHubRepos()}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      )}

                      {loadingRepos ? (
                        <div className="p-6 text-center space-y-2">
                          <FaArrowsRotate className="w-5 h-5 text-neon-blue animate-spin mx-auto" />
                          <p className="text-secondary text-xs font-mono">Loading repositories from GitHub for @{githubUser}...</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-black/5 dark:divide-white/5 pt-1">
                          {filteredGitRepos.length === 0 ? (
                            <div className="p-4 text-center space-y-2">
                              <p className="text-secondary text-xs font-mono">
                                {repoSearch ? `No repositories matched "${repoSearch}".` : 'No repositories loaded.'}
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setRepoSearch('');
                                  fetchGitHubRepos();
                                }}
                                className="px-3 py-1 rounded-lg text-xs font-mono glass-pill text-neon-blue hover:text-white cursor-pointer"
                              >
                                Clear Search & Reload
                              </button>
                            </div>
                          ) : (
                            filteredGitRepos.map((repo) => (
                              <button
                                key={repo.id}
                                type="button"
                                onClick={() => handleSelectRepo(repo)}
                                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-semibold text-[var(--text-main)] group-hover:text-neon-blue transition-colors truncate">
                                      {repo.name}
                                    </span>
                                    {repo.language && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/10 dark:bg-white/10 text-secondary">
                                        {repo.language}
                                      </span>
                                    )}
                                  </div>
                                  {repo.description && (
                                    <div className="text-[11px] text-secondary truncate max-w-lg mt-0.5">
                                      {repo.description}
                                    </div>
                                  )}
                                  {repo.topics && repo.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {repo.topics.slice(0, 4).map((topic, idx) => (
                                        <span key={idx} className="text-[9px] font-mono text-neon-blue/80">
                                          #{topic}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 text-[10px] font-mono text-secondary">
                                  {repo.stargazers_count > 0 && (
                                    <span>★ {repo.stargazers_count}</span>
                                  )}
                                  <span className="glass-pill px-2.5 py-1 rounded-full group-hover:border-neon-blue/40 group-hover:text-neon-blue transition-colors">
                                    Import
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Liquid Dock & Floating Navigation"
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1.5">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. liquid-dock-navigation"
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                  />
                </div>

                {/* Repo URL */}
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1.5">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/Shubhjn4357/liquid-dock"
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1.5">Live Project URL (Optional)</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://liquid-dock.vercel.app"
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of the prompt project and what interface it builds..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">
                  Tags (comma-separated, e.g. Next.js, Framer Motion, AI)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js, Tailwind, Framer Motion, Canvas"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                />
              </div>

              {/* Image Upload & URL */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-secondary">
                  Cover Image / Screenshot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* File Upload Box */}
                  <label className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-neon-blue/40 cursor-pointer bg-black/5 dark:bg-white/5 transition-all">
                    <FaCloudArrowUp className="w-5 h-5 text-neon-blue" />
                    <span className="text-xs font-mono text-secondary">
                      {uploadingImage ? 'Uploading image...' : 'Upload Image File (PNG, JPG, WebP)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  {/* Or Image URL Input */}
                  <div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste direct image URL..."
                      className="w-full px-4 py-3 rounded-xl text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none focus:border-neon-blue/40"
                    />
                  </div>
                </div>

                {/* Preview Image Thumbnail */}
                {image && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0">
                      <Image src={image} alt="Preview" fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-mono text-secondary break-all">{image}</span>
                  </div>
                )}
              </div>

              {/* Prompts Section (1 or More Prompts with Markdown) */}
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaTerminal className="w-4 h-4 text-neon-blue" />
                    <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                      Generation Prompts ({prompts.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPrompt}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono glass-pill text-neon-blue hover:border-neon-blue/40 transition-all cursor-pointer"
                  >
                    <FaPlus className="w-3 h-3" />
                    <span>Add Another Prompt</span>
                  </button>
                </div>

                {prompts.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="glass-card rounded-2xl p-5 border border-black/10 dark:border-white/10 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="mono-label text-neon-blue">0{idx + 1}</span>
                        <input
                          type="text"
                          value={p.title}
                          onChange={(e) => handleUpdatePrompt(idx, 'title', e.target.value)}
                          placeholder="Prompt Title (e.g. 01 - Full System Blueprint)"
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 text-[var(--text-main)] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Preview toggle */}
                        <button
                          type="button"
                          onClick={() => setPreviewTab(previewTab === idx ? null : idx)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                            previewTab === idx
                              ? 'bg-neon-blue text-slate-950 font-semibold'
                              : 'glass-pill text-secondary hover:text-[var(--text-main)]'
                          }`}
                        >
                          {previewTab === idx ? <FaCode className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                          <span>{previewTab === idx ? 'Edit' : 'Preview MD'}</span>
                        </button>

                        {prompts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePrompt(idx)}
                            className="p-1.5 text-secondary hover:text-rose-400 transition-colors"
                            title="Remove prompt"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={p.description || ''}
                      onChange={(e) => handleUpdatePrompt(idx, 'description', e.target.value)}
                      placeholder="Prompt description or notes for the AI agent..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-mono text-secondary bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none"
                    />

                    {previewTab === idx ? (
                      <div className="p-4 rounded-xl bg-black/10 dark:bg-black/40 border border-black/5 dark:border-white/5 max-h-80 overflow-y-auto">
                        <MarkdownRenderer content={p.content || '*No prompt content yet.*'} />
                      </div>
                    ) : (
                      <textarea
                        rows={8}
                        value={p.content}
                        onChange={(e) => handleUpdatePrompt(idx, 'content', e.target.value)}
                        placeholder="Write custom markdown prompt here (headers #, code blocks ```, bullets, etc.)..."
                        className="w-full p-4 rounded-xl font-mono text-xs bg-slate-950/80 text-slate-200 border border-black/10 dark:border-white/10 outline-none resize-y leading-relaxed"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] glass-pill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-wipe inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-semibold bg-neon-blue text-slate-950 shadow-md shadow-neon-blue/20 cursor-pointer disabled:opacity-50"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Project' : 'Save Prompt Project'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-[var(--text-main)] flex items-center gap-2">
            <span>Configured Prompt Projects ({projects.length})</span>
          </h2>
          <Link
            href="/prompts"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-mono text-neon-blue hover:text-neon-purple transition-colors"
          >
            <span>View Public /prompts</span>
            <FaArrowUpRightFromSquare className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl border border-dashed border-black/10 dark:border-white/10">
            <p className="text-secondary text-sm font-mono">No prompt projects configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-3xl p-5 border border-black/10 dark:border-white/10 flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/10 dark:bg-white/5 mb-4">
                    <Image
                      src={project.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-neon-blue">
                        {project.prompts.length} {project.prompts.length === 1 ? 'Prompt' : 'Prompts'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-base text-[var(--text-main)] line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-secondary text-xs line-clamp-2 mt-1">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/5 text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Open full project / public view */}
                    <Link
                      href={`/prompts/${project.slug}?url=${encodeURIComponent(project.repoUrl || '')}`}
                      target="_blank"
                      className="p-2 rounded-xl glass-pill text-secondary hover:text-neon-blue transition-colors"
                      title="Open full project page"
                    >
                      <FaArrowUpRightFromSquare className="w-3 h-3" />
                    </Link>

                    {/* Live link if available */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-xl glass-pill text-[10px] font-mono text-emerald-400 hover:border-emerald-400/40 transition-colors"
                        title="See it Live"
                      >
                        Live
                      </a>
                    )}

                    {/* GitHub Repo */}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl glass-pill text-secondary hover:text-white transition-colors"
                        title="GitHub Repo"
                      >
                        <FaGithub className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="p-2 rounded-xl glass-pill text-secondary hover:text-[var(--text-main)] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <FaPenToSquare className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-xl glass-pill text-secondary hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
