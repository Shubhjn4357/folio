'use client';

import { useEffect } from "react";
import Lenis from "lenis";
import {
  Hero,
  About,
  Tech,
  ParallaxSection,
  Works,
  PromptsSection,
  Contact,
} from "@/components";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative z-0 min-h-screen font-sans text-[var(--text-main)] overflow-x-hidden selection:bg-neon-purple selection:text-white">
      <Hero />
      <About />
      <Tech />
      <ParallaxSection />
      <Works />
      <PromptsSection />
      <div className="relative z-0">
        <Contact />
      </div>
    </div>
  );
}
