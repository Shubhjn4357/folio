'use client';

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaBolt, FaLayerGroup, FaShieldHalved } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

export const ParallaxSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !cardRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(textRef.current, { y: -50, ease: "none" }, 0)
      .to(cardRef.current, { y: 50, ease: "none" }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 px-6 sm:px-10 overflow-hidden flex items-center justify-center"
    >
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center max-w-6xl mx-auto w-full">
        {/* Left Statement */}
        <div ref={textRef} className="flex-1">
          <span className="mono-label text-neon-purple">Philosophy</span>
          <h2 className="font-display font-semibold text-4xl sm:text-6xl text-[var(--text-main)] mt-3 leading-tight">
            Infinite detail. <br />
            <span className="gradient-text font-bold">Zero compromise.</span>
          </h2>
          <p className="mt-5 text-secondary text-base sm:text-lg max-w-xl leading-relaxed">
            Every transition, pixel ratio, shader uniform, and API response is tuned for fluid 60fps performance and timeless aesthetics.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-secondary">
              <FaBolt className="text-amber-400 w-3 h-3" />
              <span>Sub-second TTFB</span>
            </div>
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-secondary">
              <FaLayerGroup className="text-neon-blue w-3 h-3" />
              <span>Modular Architecture</span>
            </div>
            <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-secondary">
              <FaShieldHalved className="text-emerald-400 w-3 h-3" />
              <span>Strict Type Safety</span>
            </div>
          </div>
        </div>

        {/* Right Floating Glassmorphism Showcase Card */}
        <div ref={cardRef} className="flex-1 flex justify-center w-full max-w-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-black/10 dark:border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-full blur-2xl group-hover:bg-neon-blue/30 transition-colors" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="mono-label text-[10px] text-secondary">LIVE_BENCHMARK</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                <span className="text-secondary">Next.js Turbopack</span>
                <span className="text-emerald-500 font-bold">Active · 16.3</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                <span className="text-secondary">GPU Shaders</span>
                <span className="text-neon-blue font-bold">WebGL 2.0</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                <span className="text-secondary">Frame Budget</span>
                <span className="text-neon-pink font-bold">16.6ms Target</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 text-center">
              <span className="mono-label text-[11px] text-secondary">
                Designed with precision in mind
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
