import { db, isDbConfigured } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa6';

export const revalidate = 60;

async function getBlog(slug: string) {
  if (!isDbConfigured) return null;
  try {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug));
    
    return blog || null;
  } catch (error) {
    console.warn("Could not query database for blog:", error);
    return null;
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.isPublished) {
    notFound();
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, i) => {
        if (paragraph.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-display font-semibold text-[var(--text-main)] mt-8 mb-3">{paragraph.slice(4)}</h3>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-display font-semibold text-[var(--text-main)] mt-10 mb-4">{paragraph.slice(3)}</h2>;
        }
        if (paragraph.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-display font-bold text-[var(--text-main)] mt-12 mb-6">{paragraph.slice(2)}</h1>;
        }
        if (paragraph.startsWith('```')) {
          const code = paragraph.slice(paragraph.indexOf('\n') + 1, paragraph.lastIndexOf('```'));
          return (
            <pre key={i} className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-2xl overflow-x-auto my-5">
              <code className="text-xs font-mono text-[var(--text-main)]">{code}</code>
            </pre>
          );
        }
        return (
          <p key={i} className="text-secondary text-base leading-relaxed mb-5">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 max-w-4xl mx-auto">
      {/* Back button pill */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="glass-pill px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--text-main)] transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {blog.coverImage && (
        <div className="relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden glass-card mb-10">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      <article className="glass-card p-8 sm:p-12 rounded-3xl">
        <header className="mb-10 pb-8 border-b border-black/5 dark:border-white/5">
          <span className="mono-label text-neon-blue">
            {new Date(blog.createdAt).toLocaleDateString('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[var(--text-main)] mt-3 leading-tight">
            {blog.title}
          </h1>
        </header>

        <div className="prose max-w-none">
          {renderContent(blog.content)}
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
          <span className="mono-label text-secondary text-[11px]">Published by Shubham Jain</span>
          <Link
            href="/blog"
            className="glass-pill px-4 py-2 rounded-full text-xs font-mono text-secondary hover:text-[var(--text-main)]"
          >
            ← More Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
