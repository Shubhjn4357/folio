'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Discovery & Architecture",
    description: "Aligning on core objectives, performance budgets, and technical requirements before writing code.",
  },
  {
    step: "02",
    title: "Design & Fluid Prototyping",
    description: "Iterating on tactile interfaces, design tokens, responsive layouts, and motion guidelines.",
  },
  {
    step: "03",
    title: "Production Build & Shaders",
    description: "Next.js App Router, type-safe APIs, custom WebGL shaders, and smooth micro-interactions.",
  },
  {
    step: "04",
    title: "Tuning, SEO & Scale",
    description: "Core Web Vitals optimization, Lighthouse audits, automated CI/CD, and resilient hosting.",
  },
];

export const About = () => {
  return (
    <div className="w-full">
      {/* Intro Header */}
      <div className="max-w-4xl">
        <span className="mono-label text-neon-blue">About the Engineer</span>
        <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[var(--text-main)] mt-2">
          A development partner you can count on.
        </h2>
        <p className="mt-4 text-secondary text-base sm:text-lg leading-relaxed">
          I bridge the gap between creative visual design and rock-solid systems engineering. With deep experience across TypeScript, React/Next.js, WebGL shaders, and cloud infrastructure, I help teams build immersive web applications that feel alive and load instantly.
        </p>
      </div>

      {/* Services Floating Glassmorphism Grid */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="mono-label text-secondary text-[11px]">0{index + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-neon-purple transition-colors">
                {service.title}
              </h3>
            </div>
            
            <p className="mt-4 text-secondary text-xs leading-relaxed pt-3 border-t border-black/5 dark:border-white/5">
              Refined craft, accessibility, and high performance across every screen size.
            </p>
          </motion.div>
        ))}
      </div>

      {/* How I Work - Journey Strip (inspired by thinkingods.com) */}
      <div className="mt-20">
        <div className="mb-8">
          <span className="mono-label text-neon-pink">Workflow & Process</span>
          <h3 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
            How a project moves from concept to launch.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {JOURNEY_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <span className="mono-label text-neon-blue text-xs font-bold">{item.step}</span>
                <h4 className="font-display font-semibold text-base text-[var(--text-main)] mt-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-secondary text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
