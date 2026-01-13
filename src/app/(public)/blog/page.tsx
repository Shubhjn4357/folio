import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlogs() {
  return db
    .select()
    .from(blogs)
    .where(eq(blogs.isPublished, true))
    .orderBy(desc(blogs.createdAt));
}

export default async function BlogPage() {
  const allBlogs = await getBlogs();

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary text-sm uppercase tracking-wider mb-2">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Thoughts & Insights
          </h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Articles about web development, design, and technology.
          </p>
        </div>

        {allBlogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📝</p>
            <p className="text-secondary">No blog posts yet. Check back soon!</p>
            <Link href="/" className="text-neon-blue hover:underline mt-4 inline-block">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <article className="bg-tertiary rounded-2xl overflow-hidden border border-white/10 hover:border-neon-purple/30 transition-all group h-full flex flex-col">
                  {blog.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-secondary text-sm mb-2">
                      {new Date(blog.createdAt).toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-secondary text-sm line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="text-neon-purple text-sm mt-4 group-hover:text-neon-blue transition-colors">
                      Read more →
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
