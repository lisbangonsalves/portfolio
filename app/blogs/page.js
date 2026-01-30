'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function GradientPlaceholder({ seed }) {
  const baseHue = (seed * 137.5) % 360;
  const cols = 20;
  const rows = 12;
  
  return (
    <div 
      className="w-full h-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const normCol = col / (cols - 1);
        const normRow = row / (rows - 1);
        const hue = baseHue + normCol * 25 + normRow * 5;
        const saturation = 75 + normCol * 10;
        const lightness = 55 - normRow * 20 + normCol * 10;
        const delay = -((row * 0.3 + col * 0.3) % 10);
        return (
          <div
            key={i}
            className="color-wave"
            style={{
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
              '--base-hue': hue,
              '--saturation': `${saturation}%`,
              '--lightness': `${lightness}%`,
              animationDelay: `${delay}s`,
              outline: '1px solid',
              outlineColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes colorWave {
          0%, 100% {
            background-color: hsl(var(--base-hue), var(--saturation), var(--lightness));
            outline-color: hsl(var(--base-hue), var(--saturation), var(--lightness));
          }
          50% {
            background-color: hsl(calc(var(--base-hue) + 15), var(--saturation), var(--lightness));
            outline-color: hsl(calc(var(--base-hue) + 15), var(--saturation), var(--lightness));
          }
        }
        .color-wave {
          animation: colorWave 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        const list = data.blogs || [];
        setBlogs(list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col">
      <Navigation />
      <PageTransition>

      <section className="px-6 py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-black dark:text-white">
            Blogs
          </h1>

          {loading ? (
            <p className="text-black/60 dark:text-white/60">Loading...</p>
          ) : blogs.length === 0 ? (
            <p className="text-black/50 dark:text-white/50">No posts yet.</p>
          ) : (
            <>
              {/* Latest blog - full width */}
              {blogs.length > 0 && (
                <Link
                  href={`/blogs/${blogs[0].slug || blogs[0].id}`}
                  className="block group mb-12"
                >
                  <article className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="latest-blog-image overflow-hidden">
                      {blogs[0].image ? (
                        <img
                          src={blogs[0].image}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <GradientPlaceholder seed={blogs[0].id} />
                      )}
                    </div>
                    <div className="py-4">
                      <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
                        <span className="animated-underline">{blogs[0].title}</span>
                      </h2>
                      <time className="mt-2 block text-sm text-black/50 dark:text-white/50">
                        {formatDate(blogs[0].publishedAt)}
                      </time>
                    </div>
                  </article>
                </Link>
              )}

              {/* Rest of blogs - 3 in a row */}
              {blogs.length > 1 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.slice(1).map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blogs/${post.slug || post.id}`}
                        className="block group"
                      >
                        <article className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                          <div className="aspect-[4/3] overflow-hidden">
                            {post.image ? (
                              <img
                                src={post.image}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <GradientPlaceholder seed={post.id} />
                            )}
                          </div>
                          <div className="py-4">
                            <h2 className="text-lg font-semibold text-black dark:text-white line-clamp-2">
                              <span className="animated-underline">{post.title}</span>
                            </h2>
                            <time className="mt-1 block text-sm text-black/50 dark:text-white/50">
                              {formatDate(post.publishedAt)}
                            </time>
                          </div>
                        </article>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      </PageTransition>

      <style jsx global>{`
        .animated-underline {
          position: relative;
          display: inline;
        }
        .animated-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        .group:hover .animated-underline::after {
          width: 100%;
        }
        .latest-blog-image {
          aspect-ratio: 4 / 3;
        }
        @media (min-width: 640px) {
          .latest-blog-image {
            aspect-ratio: 21 / 9;
          }
        }
      `}</style>
    </div>
  );
}
