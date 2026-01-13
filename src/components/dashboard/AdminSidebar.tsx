'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Contacts', href: '/admin/contacts', icon: '📬' },
  { name: 'Blogs', href: '/admin/blogs', icon: '📝' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
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

  const NavLink = ({ item, isMobile = false }: { item: typeof navItems[0], isMobile?: boolean }) => {
    const isActive = pathname === item.href ||
      (item.href !== '/admin' && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsOpen(false)}
        className="block"
      >
        <motion.div
          whileHover={{ x: 4 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
              ? 'bg-neon-purple/20 text-white border border-neon-purple/30'
              : 'text-secondary hover:bg-white/5 hover:text-white'
            }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium">{item.name}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary border-b border-white/10 flex items-center justify-between px-4 z-50">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-bold text-white">Admin</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/5 rounded-lg"
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 h-full w-64 bg-tertiary border-r border-white/10 z-50 md:hidden flex flex-col pt-16"
            >
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} isMobile />
                ))}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <Link href="/" target="_blank" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-white/5 hover:text-white transition-colors">
                    <span className="text-xl">🌐</span>
                    <span className="font-medium">View Site</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (unchanged visually, but refactored structure) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-tertiary border-r border-white/10 flex-col z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h2 className="font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-secondary">Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" target="_blank">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-white/5 hover:text-white transition-colors">
              <span className="text-xl">🌐</span>
              <span className="font-medium">View Site</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
