'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa6";
import { socialLinks } from "../constants";

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen pt-32 pb-20 flex flex-col justify-center items-center overflow-hidden">
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-8 flex flex-col items-start z-10">
        
        {/* Monospace Credibility Pill from thinkingods */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill text-xs mb-8"
        >
          <p className="mono-label text-secondary text-[11px]">
            <span>Creative Engineer</span>
            <span className="mx-2 opacity-30">·</span>
            <span>8+ Years Exp</span>
            <span className="mx-2 opacity-30 hidden sm:inline">·</span>
            <span className="hidden sm:inline">WebGL & Full-Stack</span>
          </p>
        </motion.div>

        {/* Oversized Modern Display Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[0.98] tracking-[-0.04em] text-[var(--text-main)] mb-6">
            Design-led engineering <br className="hidden sm:inline" />
            <span className="text-secondary font-light">and immersive web</span> <br />
            <span className="gradient-text font-semibold">built to scale.</span>
          </h1>

          <p className="text-secondary text-base sm:text-xl font-normal max-w-2xl leading-relaxed mb-10">
            Hi, I'm <strong className="text-[var(--text-main)] font-semibold">Shubham</strong>. A creative technologist and full-stack engineer partnering with forward-thinking teams, startups, and agencies to build fluid, high-conversion digital products.
          </p>
        </motion.div>

        {/* Interactive Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <Link
            href="#project"
            className="btn-wipe px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
          >
            <span>Explore Selected Work</span>
            <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#contact"
            className="glass-pill px-6 py-3.5 text-xs font-semibold text-[var(--text-main)] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <span>Start a Conversation</span>
            <span className="text-xs opacity-60">↗</span>
          </Link>

          {/* Social icons pill */}
          <div className="flex items-center gap-2 pl-2">
            <a
              href="https://github.com/Shubhjn4357"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-secondary hover:text-[var(--text-main)] hover:scale-105 transition-all"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/shubham-jain-b46999135/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-secondary hover:text-[var(--text-main)] hover:scale-105 transition-all"
            >
              <FaLinkedin className="w-4 h-4 text-blue-500" />
            </a>
          </div>
        </motion.div>

        {/* Minimal Interactive Floating Glassmorphism Cards Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Card 1 */}
          <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <span className="mono-label text-[10px] text-secondary">01 / Frontend Core</span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mt-2 mb-1 group-hover:text-neon-blue transition-colors">
                Next.js & React Architecture
              </h3>
              <p className="text-secondary text-xs leading-relaxed">
                App Router, SSR, Turbopack, responsive layouts and sub-second load times engineered for high conversions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-secondary">
              <span>99.9% Uptime</span>
              <span className="text-emerald-500 font-medium">Optimal LCP</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <span className="mono-label text-[10px] text-secondary">02 / Creative Tech</span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mt-2 mb-1 group-hover:text-neon-purple transition-colors">
                GLSL Shaders & 3D Motion
              </h3>
              <p className="text-secondary text-xs leading-relaxed">
                Custom WebGL shaders, fluid mouse physics, and GPU-accelerated micro-interactions that engage visitors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-secondary">
              <span>60 FPS Fluid</span>
              <span className="text-neon-purple font-medium">GPU Driven</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <span className="mono-label text-[10px] text-secondary">03 / Systems & Backend</span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mt-2 mb-1 group-hover:text-neon-pink transition-colors">
                Serverless & Database APIs
              </h3>
              <p className="text-secondary text-xs leading-relaxed">
                Neon Postgres, Drizzle ORM, secure authentication, real-time sync, and scalable cloud deployments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-secondary">
              <span>Serverless Edge</span>
              <span className="text-cyan-500 font-medium">Type-Safe</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Floating Scroll Indicator Pill */}
      <div className="mt-14 w-full flex justify-center items-center">
        <a
          href="#about"
          className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-secondary hover:text-[var(--text-main)] transition-colors group"
        >
          <span className="mono-label text-[10px]">Scroll Down</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
