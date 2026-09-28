'use client';

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight, FaBars, FaMoon, FaSun, FaXmark } from "react-icons/fa6";
import { navLinks, socialLinks } from "../constants";
import { useTheme } from "../context/ThemeContext";

export const Navbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);

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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 mx-auto z-50 flex justify-between px-4 sm:px-16 pointer-events-none">
      {/* Floating Glassmorphism Pill Dock (Brand & First Name) */}
      <motion.nav
        initial={{ y: -24, x: isMobile ? 0 : -70, opacity: 0 }}
        animate={{
          y: [-24, 0, 0],
          x: isMobile ? [0, 0, 0] : [-70, -70, 0],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.8,
          delay: 0.15,
          times: [0, 0.45, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`w-full sm:w-auto pointer-events-auto mx-auto sm:mx-8 glass-pill px-3 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${isScrolled ? "scale-[0.98] shadow-2xl backdrop-blur-2xl" : "shadow-lg"
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
          <span className="font-display font-semibold text-sm tracking-tight xs:inline sm:hidden lg:inline text-[var(--text-main)]">
            Shubham <span className="text-secondary font-normal">/ Dev</span>
          </span>
        </Link>

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
            onClick={() => setMobileMenuOpen(true)}
            className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-black dark:hover:text-white cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <FaBars className="w-4 h-4" />
          </button>
        </div>
      </motion.nav>

      {/* Desktop Navigation Dock (Nav Links) */}
      <motion.nav
        initial={{ y: -24, x: 70, opacity: 0 }}
        animate={{
          y: [-24, 0, 0],
          x: [70, 70, 0],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.8,
          delay: 0,
          times: [0, 0.45, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`pointer-events-auto glass-effect mx-8 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full hidden sm:flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${isScrolled ? "scale-[0.98] shadow-2xl backdrop-blur-2xl" : "shadow-lg"
          }`}
      >
        {/* Desktop Tab Pills */}
        <div className="flex items-center gap-1 relative bg-black/5 dark:bg-white/5 p-1 rounded-full">
          {navLinks.map((nav) => {
            const isSelected = activeTab === nav.id || (nav.id === 'blog' && pathname?.startsWith('/blog'));
            return (
              <Link
                key={nav.id}
                href={nav.link || `#${nav.id}`}
                onClick={() => setActiveTab(nav.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 z-10 ${isSelected
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
      </motion.nav>

      {/* Full-Screen Mobile Menu with Snappy Hardware-Accelerated Reveal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            className="fixed inset-0 w-full h-[100dvh] overflow-y-auto overscroll-contain z-[100] pointer-events-auto bg-[#f8f9fa]/98 dark:bg-[#060914]/98 backdrop-blur-2xl text-[var(--text-main)] touch-pan-y"
          >
            <div className="min-h-full w-full flex flex-col justify-between p-6 sm:p-10 gap-8">
              {/* Top Bar inside Fullscreen Menu */}
              <div className="w-full flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black font-display font-bold text-xs flex items-center justify-center">
                    SJ
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-[var(--text-main)]">Shubham Jain</p>
                    <p className="mono-label text-[10px] text-secondary">Creative Engineer</p>
                  </div>
                </div>

                {/* Close Button Pill */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer border border-black/10 dark:border-white/20 active:scale-95"
                  aria-label="Close Navigation"
                >
                  <span>Close</span>
                  <FaXmark className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Middle Section: Oversized Big Words with Staggered Reveal */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.04,
                      delayChildren: 0.06,
                    },
                  },
                }}
                className="py-6 flex flex-col gap-3 sm:gap-5 my-auto"
              >
                {navLinks.map((nav, index) => {
                  const isCurrent = activeTab === nav.id;
                  return (
                    <div key={nav.id} className="overflow-hidden">
                      <motion.div
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          show: {
                            y: 0,
                            opacity: 1,
                            transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                      >
                        <Link
                          href={nav.link || `#${nav.id}`}
                          onClick={() => {
                            setActiveTab(nav.id);
                            setMobileMenuOpen(false);
                          }}
                          className="group flex items-baseline gap-4 sm:gap-6 py-2 transition-all duration-300"
                        >
                          {/* Number Index */}
                          <span className="font-mono text-xs sm:text-sm text-secondary group-hover:text-neon-blue transition-colors">
                            0{index + 1}
                          </span>

                          {/* Big Word Display with Hover Reveal Effect */}
                          <span className="font-display font-medium text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-[-0.04em] text-[var(--text-main)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:via-neon-purple group-hover:to-neon-pink group-hover:translate-x-3 sm:group-hover:translate-x-5 transition-all duration-300 inline-flex items-center gap-3">
                            {nav.title}
                            <FaArrowRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-neon-blue hidden xs:inline" />
                          </span>

                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-neon-purple mb-2 animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Bottom Footer Section of Fullscreen Menu */}
              <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono shrink-0">
                <Link
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-wipe px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider rounded-full shadow-md hover:scale-[1.02] transition-transform active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Start a Conversation</span>
                  <span className="text-xs opacity-80">↗</span>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-secondary">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--text-main)] transition-colors"
                    >
                      {social.name} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
