'use client';

import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

export const Tech = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <span className="mono-label text-neon-purple">Arsenal & Tooling</span>
        <h3 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
          Technologies & Ecosystem
        </h3>
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {technologies.map((technology) => (
          <div
            key={technology.name}
            className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all cursor-default group"
          >
            <technology.icon
              className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
              style={{ color: technology.color || '#fff' }}
            />
            <span className="text-xs font-mono font-medium text-secondary group-hover:text-[var(--text-main)] transition-colors">
              {technology.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "skills");
