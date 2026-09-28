import { db, isDbConfigured } from '@/lib/db';
import { contacts, blogs, visitors } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
  FaEnvelope,
  FaFileLines,
  FaEye,
  FaArrowRight,
  FaPlus,
  FaFileArrowDown,
} from 'react-icons/fa6';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  if (!isDbConfigured) {
    return {
      contacts: 0,
      blogs: 0,
      visitors: 0,
      recentContacts: [],
    };
  }

  try {
    const [contactCount] = await db.select({ count: sql<number>`count(*)` }).from(contacts);
    const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogs);
    const [visitorCount] = await db.select({ count: sql<number>`count(*)` }).from(visitors);

    const recentContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(5);

    return {
      contacts: contactCount?.count || 0,
      blogs: blogCount?.count || 0,
      visitors: visitorCount?.count || 0,
      recentContacts: recentContacts || [],
    };
  } catch (error) {
    console.warn("Failed to query dashboard stats:", error);
    return {
      contacts: 0,
      blogs: 0,
      visitors: 0,
      recentContacts: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: 'Total Messages',
      value: stats.contacts,
      icon: FaEnvelope,
      href: '/admin/contacts',
      accent: 'text-neon-blue',
      badge: 'Inquiries',
    },
    {
      label: 'Published Articles',
      value: stats.blogs,
      icon: FaFileLines,
      href: '/admin/blogs',
      accent: 'text-neon-purple',
      badge: 'Articles',
    },
    {
      label: 'Tracked Visits',
      value: stats.visitors,
      icon: FaEye,
      href: '/admin/analytics',
      accent: 'text-emerald-500',
      badge: 'Telemetry',
    },
    {
      label: 'Resume / CV',
      value: 'Live',
      icon: FaFileArrowDown,
      href: '/admin/resume',
      accent: 'text-neon-pink',
      badge: 'Profile',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-blue">Dashboard Overview</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Studio Command Center
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Real-time activity, portfolio metrics, and content management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="btn-wipe px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs rounded-full flex items-center gap-2"
          >
            <FaPlus className="w-3 h-3" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <div className="glass-card p-6 rounded-3xl h-full flex flex-col justify-between group-hover:border-neon-purple/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="mono-label text-[10px] text-secondary">{card.badge}</span>
                <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <card.icon className={`w-4 h-4 ${card.accent}`} />
                </div>
              </div>

              <div>
                <p className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-main)] mb-1">
                  {card.value}
                </p>
                <p className="text-secondary text-xs">{card.label}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono text-secondary group-hover:text-[var(--text-main)] transition-colors">
                <span>View report</span>
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries List */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
          <div>
            <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">Recent Inquiries</h2>
            <p className="text-secondary text-xs mt-0.5">Latest client submissions received from the portfolio.</p>
          </div>
          <Link
            href="/admin/contacts"
            className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
          >
            All Messages &rarr;
          </Link>
        </div>

        {stats.recentContacts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary text-sm">No inquiries recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-neon-purple/20 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-[var(--text-main)]">{contact.name}</p>
                    {!contact.isRead && (
                      <span className="px-2 py-0.5 bg-neon-blue/15 text-neon-blue text-[10px] font-mono rounded-full font-semibold">
                        New
                      </span>
                    )}
                    <span className="text-xs text-secondary opacity-60">({contact.email})</span>
                  </div>
                  <p className="text-secondary text-xs truncate max-w-xl">{contact.message}</p>
                </div>

                <div className="text-xs font-mono text-secondary shrink-0">
                  {new Date(contact.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
