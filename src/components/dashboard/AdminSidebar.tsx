'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartPie,
  FaEnvelope,
  FaFileLines,
  FaChartLine,
  FaArrowRightFromBracket,
  FaGlobe,
  FaBars,
  FaXmark,
  FaFileArrowDown,
  FaTerminal,
} from 'react-icons/fa6';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: FaChartPie },
  { name: 'Contacts', href: '/admin/contacts', icon: FaEnvelope },
  { name: 'Blogs', href: '/admin/blogs', icon: FaFileLines },
  { name: 'Analytics', href: '/admin/analytics', icon: FaChartLine },
  { name: 'Prompt Projects', href: '/admin/prompts', icon: FaTerminal },
  { name: 'Resume / CV', href: '/admin/resume', icon: FaFileArrowDown },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const NavLink = ({ item, isMobile = false }: { item: typeof navItems[0]; isMobile?: boolean }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== '/admin' && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsOpen(false)}
        className="block"
      >
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono transition-all ${
            isActive
              ? 'glass-pill font-semibold text-[var(--text-main)] border border-black/10 dark:border-white/15 shadow-sm'
              : 'text-secondary hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <item.icon className={`w-4 h-4 ${isActive ? 'text-neon-purple' : 'opacity-70'}`} />
          <span>{item.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-pill border-b border-black/5 dark:border-white/5 flex items-center justify-between px-5 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-display font-bold text-xs flex items-center justify-center">
            SJ
          </div>
          <span className="font-display font-semibold text-sm">Admin Studio</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-[var(--text-main)]"
        >
          {isOpen ? <FaXmark className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 glass-card border-r border-black/10 dark:border-white/10 z-50 md:hidden flex flex-col pt-20 p-4"
            >
              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} isMobile />
                ))}
              </nav>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1.5">
                <Link href="/" target="_blank" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono text-secondary hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <FaGlobe className="w-4 h-4" />
                    <span>Live Portfolio ↗</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <FaArrowRightFromBracket className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 glass-card rounded-none border-r border-black/5 dark:border-white/10 flex-col justify-between p-5 z-40">
        <div>
          {/* Brand Header */}
          <div className="pb-6 mb-6 border-b border-black/5 dark:border-white/5">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-display font-bold text-xs flex items-center justify-center shadow-md">
                SJ
              </div>
              <div>
                <h2 className="font-display font-semibold text-sm text-[var(--text-main)]">Admin Studio</h2>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1.5">
          <Link href="/" target="_blank">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono text-secondary hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <FaGlobe className="w-4 h-4" />
              <span>Live Portfolio ↗</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <FaArrowRightFromBracket className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
