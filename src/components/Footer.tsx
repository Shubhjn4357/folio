'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { socialLinks } from '../constants';
import { FaArrowUp } from 'react-icons/fa6';

export const Footer = () => {
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-14 px-6 sm:px-12 relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black font-display font-bold text-[10px] flex items-center justify-center">
                SJ
              </div>
              <span className="font-display font-semibold text-lg text-[var(--text-main)]">
                Shubham Jain
              </span>
            </div>
            <p className="text-secondary text-xs max-w-sm leading-relaxed">
              Design-led engineering, fluid interactive shaders, and scalable full-stack web applications.
            </p>
          </div>

          {/* Social Links as Floating Glass Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] hover:scale-105 transition-all"
              >
                <social.icon className="w-3.5 h-3.5" />
                <span>{social.name}</span>
                <span className="text-[10px] opacity-40">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Details Bar */}
        <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-secondary">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Shubham Jain</span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>India {localTime ? `· ${localTime}` : ''}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-[var(--text-main)] transition-colors">
              Read Blog
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <FaArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;