import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

async function getBlog(slug: string) {
  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.slug, slug));
  
  return blog;
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

  // Simple markdown-like rendering (for now)
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, i) => {
        // Headers
        if (paragraph.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-4">{paragraph.slice(4)}</h3>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{paragraph.slice(3)}</h2>;
        }
        if (paragraph.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-bold text-white mt-12 mb-6">{paragraph.slice(2)}</h1>;
        }
        // Code blocks
        if (paragraph.startsWith('```')) {
          const code = paragraph.slice(paragraph.indexOf('\n') + 1, paragraph.lastIndexOf('```'));
          return (
            <pre key={i} className="bg-black-200 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm text-white font-mono">{code}</code>
            </pre>
          );
        }
        // Regular paragraphs
        return (
          <p key={i} className="text-secondary leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      {/* Hero */}
      {blog.coverImage && (
        <div className="relative h-[40vh] mb-8">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-neon-blue hover:underline text-sm mb-6 inline-block">
          ← Back to Blog
        </Link>

        <header className="mb-10">
          <p className="text-secondary text-sm mb-4">
            {new Date(blog.createdAt).toLocaleDateString('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {blog.title}
          </h1>
        </header>

        <div className="prose prose-invert max-w-none">
          {renderContent(blog.content)}
        </div>

        <hr className="border-white/10 my-12" />

        <div className="text-center">
          <p className="text-secondary mb-4">Enjoyed this article?</p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors"
          >
            Read More Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
