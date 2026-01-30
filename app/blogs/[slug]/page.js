'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import PageTransition from '../../components/PageTransition';
import Footer from '../../components/Footer';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function GradientPlaceholder({ seed }) {
  const baseHue = (seed * 137.5) % 360;
  return (
    <div className="w-full h-full grid grid-cols-10 grid-rows-8 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const hue = baseHue + col * 3 - row * 2;
        const saturation = 85 + (col % 3) * 5;
        const lightness = 45 + col * 2 - row * 1.5;
        const delay = (row * 0.1 + col * 0.05).toFixed(2);
        return (
          <div
            key={i}
            className="animate-flow"
            style={{
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
              animationDelay: `${delay}s`
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes flow {
          0%, 100% {
            filter: brightness(1);
            transform: scale(1);
          }
          50% {
            filter: brightness(1.2);
            transform: scale(1.05);
          }
        }
        .animate-flow {
          animation: flow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        const blogs = data.blogs || [];
        const slug = params.slug;
        const found = blogs.find((b) => b.slug === slug || String(b.id) === slug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col">
        <Navigation />
        <div className="max-w-3xl mx-auto px-6 py-20 flex-1">
          <p className="text-black/60 dark:text-white/60">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col">
        <Navigation />
        <div className="max-w-3xl mx-auto px-6 py-20 flex-1">
          <p className="text-black/60 dark:text-white/60 mb-4">Post not found.</p>
          <Link href="/blogs" className="text-black dark:text-white font-medium hover:underline">
            ← Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col">
      <Navigation />
      <PageTransition>

      <article className="px-6 py-20 flex-1">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blogs"
            className="inline-block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white mb-8"
          >
            ← Back to Blogs
          </Link>

          {post.image && (
            <div className="aspect-[16/10] overflow-hidden mb-8">
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <time className="text-sm text-black/50 dark:text-white/50">
              {formatDate(post.publishedAt)}
            </time>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-black dark:text-white">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            {post.blocks && post.blocks.length > 0 ? (
              post.blocks.map((block, i) =>
                block.type === 'text' ? (
                  <div
                    key={i}
                    className="blog-content text-black/80 dark:text-white/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.content || '' }}
                  />
                ) : block.type === 'image' && block.content ? (
                  <figure key={i} className="my-6">
                    <img
                      src={block.content}
                      alt=""
                      className="w-full rounded-xl border border-black/10 dark:border-white/10"
                    />
                  </figure>
                ) : null
              )
            ) : (
              <div className="text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            )}
          </div>
        </div>
      </article>

      <Footer />
      </PageTransition>

      <style jsx global>{`
        .blog-content a {
          color: #3b82f6;
          text-decoration: none;
        }
        .blog-content a:hover {
          color: #2563eb;
        }
        .blog-content b, .blog-content strong {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
