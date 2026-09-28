import { db, isDbConfigured } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

export const revalidate = 60;

async function getBlogs() {
  if (!isDbConfigured) return [];
  try {
    return await db
      .select()
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.createdAt));
  } catch (error) {
    console.warn("Could not query database:", error);
    return [];
  }
}

export default async function BlogPage() {
  const allBlogs = await getBlogs();

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-6xl mx-auto">
      {/* Back button pill */}
      <div className="mb-8">
        <Link
          href="/"
          className="glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="mb-14">
        <span className="mono-label text-neon-blue">Editorial & Notes</span>
        <h1 className="font-display font-semibold text-3xl sm:text-5xl text-[var(--text-main)] mt-2">
          Thoughts & Engineering Insights
        </h1>
        <p className="mt-3 text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
          Deep-dives into web performance, Next.js architecture, WebGL shader design, and developer workflows.
        </p>
      </div>

      {allBlogs.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto">
          <span className="text-4xl mb-4 block">📝</span>
          <h3 className="font-display font-semibold text-lg text-[var(--text-main)] mb-1">Articles in Progress</h3>
          <p className="text-secondary text-xs mb-6">
            New case studies and engineering notes are being drafted. Check back shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)]"
          >
            ← Explore Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
              <article className="glass-card rounded-3xl overflow-hidden h-full flex flex-col justify-between p-5 group-hover:border-neon-purple/40 transition-all">
                {blog.coverImage && (
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-black/5 dark:bg-white/5">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="mono-label text-[10px] text-secondary">
                      {new Date(blog.createdAt).toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h2 className="font-display font-semibold text-xl text-[var(--text-main)] mt-2 mb-2 group-hover:text-neon-blue transition-colors">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-secondary text-xs line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono text-neon-purple group-hover:text-neon-blue transition-colors">
                    <span>Read Article</span>
                    <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
