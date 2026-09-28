'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaBars, FaXmark } from "react-icons/fa6";
import { navLinks } from "../constants";

export const Navbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scroll spy for sections
      const sections = ['about', 'project', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveTab(section === 'project' ? 'work' : section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 mx-auto z-50 flex justify-center px-4 pointer-events-none">
      {/* Floating Glassmorphism Pill Dock */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto glass-pill px-3 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isScrolled ? "scale-[0.98] shadow-2xl backdrop-blur-2xl" : "shadow-lg"
        }`}
      >
        {/* Brand Mark Pill */}
        <Link
          href="/"
          onClick={() => {
            setActiveTab("");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group pr-1"
        >
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-display font-bold text-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            SJ
          </div>
          <span className="font-display font-semibold text-sm tracking-tight hidden lg:inline">
            Shubham <span className="opacity-40 font-normal">/ Studio</span>
          </span>
        </Link>

        {/* Live Availability Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="beacon-dot" />
          <span className="mono-label text-[10px]">Open to work</span>
        </div>

        {/* Desktop Tab Pills */}
        <div className="hidden sm:flex items-center gap-1 relative bg-black/5 dark:bg-white/5 p-1 rounded-full">
          {navLinks.map((nav) => {
            const isSelected = activeTab === nav.id || (nav.id === 'blog' && pathname?.startsWith('/blog'));
            return (
              <Link
                key={nav.id}
                href={nav.link || `#${nav.id}`}
                onClick={() => setActiveTab(nav.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 z-10 ${
                  isSelected
                    ? "text-black dark:text-white font-semibold"
                    : "text-secondary hover:text-black dark:hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white dark:bg-[#1a233a] rounded-full shadow-sm border border-black/5 dark:border-white/10 -z-10"
                  />
                )}
                {nav.title}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pl-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun className="w-3.5 h-3.5 text-amber-400" /> : <FaMoon className="w-3.5 h-3.5" />}
          </button>

          {/* Contact Pill Button */}
          <Link
            href="/#contact"
            onClick={() => setActiveTab("contact")}
            className="btn-wipe px-3.5 py-1.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-full hover:scale-[1.02] transition-transform active:scale-[0.98] hidden sm:inline-flex"
          >
            Talk
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-black dark:hover:text-white"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <FaXmark className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Pill Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-16 inset-x-4 mx-auto max-w-sm glass-pill p-4 rounded-3xl sm:hidden shadow-2xl flex flex-col gap-2 border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <span className="mono-label text-[10px] text-secondary">Navigation</span>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="beacon-dot" />
                <span className="mono-label text-[10px]">Available</span>
              </div>
            </div>

            {navLinks.map((nav) => (
              <Link
                key={nav.id}
                href={nav.link || `#${nav.id}`}
                onClick={() => {
                  setActiveTab(nav.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  activeTab === nav.id
                    ? "bg-black/10 dark:bg-white/10 text-black dark:text-white font-semibold"
                    : "text-secondary hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {nav.title}
              </Link>
            ))}

            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider uppercase"
            >
              Start a Conversation &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
