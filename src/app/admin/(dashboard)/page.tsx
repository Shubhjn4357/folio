import { db } from '@/lib/db';
import { contacts, blogs, visitors } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
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
    recentContacts,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Messages', value: stats.contacts, icon: '📬', href: '/admin/contacts', color: 'from-blue-500 to-cyan-500' },
    { label: 'Blog Posts', value: stats.blogs, icon: '📝', href: '/admin/blogs', color: 'from-purple-500 to-pink-500' },
    { label: 'Total Visitors', value: stats.visitors, icon: '👁️', href: '/admin/analytics', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-secondary">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-tertiary p-6 rounded-2xl border border-white/10 hover:border-neon-purple/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${card.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
              </div>
              <p className="text-4xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-secondary text-sm">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="bg-tertiary rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Messages</h2>
          <Link href="/admin/contacts" className="text-neon-blue hover:underline text-sm">
            View All →
          </Link>
        </div>

        {stats.recentContacts.length === 0 ? (
          <p className="text-secondary text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {stats.recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-primary rounded-lg border border-white/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{contact.name}</p>
                    {!contact.isRead && (
                      <span className="px-2 py-0.5 bg-neon-blue/20 text-neon-blue text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-secondary text-sm truncate max-w-md">{contact.message}</p>
                </div>
                <p className="text-secondary text-xs">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
