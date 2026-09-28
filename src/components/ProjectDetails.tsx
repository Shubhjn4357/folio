'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects, Tag } from "../constants";
import { github } from "../assets";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { ProjectDetailsSkeleton } from "./ui/Skeleton";
import { FaArrowLeft, FaGithub, FaGlobe } from "react-icons/fa6";

interface ProjectDetailsProps {
  id: string | number;
  repoUrl?: string;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ id, repoUrl }) => {
  const projectIndex = typeof id === 'string' ? parseInt(id, 10) : id;
  const staticProject = projects[projectIndex] || null;

  const { project, loading } = useProjectDetails(repoUrl, staticProject);

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center px-4">
        <div className="glass-card p-8 rounded-3xl text-center max-w-md">
          <span className="mono-label text-neon-pink">Error 404</span>
          <h2 className="font-display font-semibold text-2xl text-[var(--text-main)] mt-2 mb-4">
            Project not found
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 glass-pill px-5 py-2.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-6xl mx-auto">
      {/* Back button pill */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/#project"
          className="glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to Projects</span>
        </Link>
      </motion.div>

      {/* Project Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[320px] sm:h-[480px] rounded-3xl overflow-hidden glass-card mb-12"
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="mono-label text-neon-blue">Case Study</span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-white mt-1">
              {project.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <FaGlobe className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
            <a
              href={project.source_code_link}
              target="_blank"
              rel="noreferrer"
              className="glass-pill px-4 py-2 rounded-full bg-black/60 text-white hover:bg-black/80 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Project Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <span className="mono-label text-secondary">01 / Executive Summary</span>
            <h2 className="font-display font-semibold text-2xl text-[var(--text-main)] mt-2 mb-4">
              Project Overview
            </h2>
            <p className="text-secondary text-base sm:text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <span className="mono-label text-secondary">02 / Engineering Highlights</span>
            <h3 className="font-display font-semibold text-xl text-[var(--text-main)] mt-2 mb-4">
              Architecture & Problem Solving
            </h3>
            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-4">
              Designed with strict attention to Core Web Vitals, modular component design, and responsive fluidity across viewport sizes.
            </p>
            <ul className="space-y-2 text-secondary text-sm font-mono list-disc list-inside">
              <li>High-efficiency client-side state handling and caching</li>
              <li>Type-safe component contracts and interfaces</li>
              <li>Micro-animations fine-tuned for smooth 60fps rendering</li>
            </ul>
          </div>
        </div>

        {/* Sidebar Specifications */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <span className="mono-label text-secondary">Tech Stack</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag: Tag) => (
                <span
                  key={tag.name}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-black/5 dark:bg-white/5 text-secondary border border-black/5 dark:border-white/5"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
              <span className="mono-label text-secondary">Deliverables</span>
              <p className="text-xs font-mono text-secondary">
                Production web application, CI/CD pipeline, and responsive user interface.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
