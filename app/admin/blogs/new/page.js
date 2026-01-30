'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminSidebar from '../../../components/AdminSidebar';

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

const inputClass = 'w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20';
const labelClass = 'block text-sm font-medium text-black dark:text-white mb-2';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const blockFileRefs = useRef({});
  const blockEditableRefs = useRef({});

  const initEditableContent = (blockId, content) => {
    const el = blockEditableRefs.current[blockId];
    if (!el) return;
    if (el.dataset.inited === '1') return;
    el.innerHTML = content || '';
    el.dataset.inited = '1';
  };

  const applyFormat = (blockId, command, value = null) => {
    const el = blockEditableRefs.current[blockId];
    if (!el) return;
    el.focus();
    document.execCommand(command, false, value);
  };

  const handleLink = (blockId) => {
    const url = prompt('Enter URL:');
    if (url) applyFormat(blockId, 'createLink', url);
  };

  const addBlock = (type) => {
    const id = Date.now() + Math.random();
    setBlocks((prev) => [...prev, { id, type, content: type === 'text' ? '' : null }]);
  };

  const updateBlock = (id, content) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    const next = index + direction;
    if (next < 0 || next >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'blog');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.path) setCoverImage(data.path);
      else setMessage(data.error || 'Upload failed');
    } catch (err) {
      setMessage('Upload failed');
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const handleBlockImageUpload = async (blockId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'blog');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.path) updateBlock(blockId, data.path);
      else setMessage(data.error || 'Upload failed');
    } catch (err) {
      setMessage('Upload failed');
    }
    e.target.value = '';
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setMessage('Enter a title');
      return;
    }
    setPublishing(true);
    setMessage('');
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      const existingBlogs = data.blogs || [];
      const postSlug = slugify(title) || String(Date.now());
      const newPost = {
        id: Date.now(),
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        image: coverImage || null,
        publishedAt: new Date().toISOString(),
        blocks: blocks.map((b) => ({ type: b.type, content: b.content ?? '' }))
      };
      const updated = [...existingBlogs, newPost];
      const saveRes = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blogs', data: updated })
      });
      if (saveRes.ok) {
        router.push('/admin/blogs');
      } else {
        setMessage('Failed to save post');
      }
    } catch (err) {
      setMessage('Failed to save');
    }
    setPublishing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="mb-6 flex items-center gap-4">
              <Link
                href="/admin/blogs"
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              >
                ← Back to blogs
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-black dark:text-white mb-6">New blog post</h1>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {message}
              </div>
            )}

            {/* Post meta */}
            <div className="space-y-4 mb-8 p-6 border border-black/10 dark:border-white/10 rounded-xl">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className={labelClass}>Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Short summary"
                />
              </div>
              <div>
                <label className={labelClass}>Cover image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  ref={(el) => { fileInputRef.current = el; }}
                />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 border border-black/20 dark:border-white/20 rounded-lg text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 text-sm"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                  {coverImage && (
                    <>
                      <img src={coverImage} alt="" className="h-20 w-28 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="text-sm text-red-500 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Add layer toolbar - Colab style */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-black/60 dark:text-white/60 mr-2">Add layer:</span>
              <button
                type="button"
                onClick={() => addBlock('text')}
                className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium"
              >
                + Text
              </button>
              <button
                type="button"
                onClick={() => addBlock('image')}
                className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium"
              >
                + Image
              </button>
            </div>

            {/* Layers (cells) */}
            <div className="space-y-4 mb-8">
              {blocks.length === 0 && (
                <p className="text-black/40 dark:text-white/40 text-sm py-4">Add a text or image layer above.</p>
              )}
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10">
                    <span className="text-xs font-medium text-black/70 dark:text-white/70 uppercase">
                      {block.type} layer
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === blocks.length - 1}
                        className="p-1.5 rounded text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="p-1.5 rounded text-red-500 dark:text-red-400 hover:bg-red-500/10"
                        aria-label="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {block.type === 'text' && (
                      <div>
                        <div className="flex items-center gap-1 mb-2 border border-black/10 dark:border-white/10 rounded-lg p-1 w-fit">
                          <button
                            type="button"
                            onClick={() => applyFormat(block.id, 'bold')}
                            className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-bold text-sm"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormat(block.id, 'italic')}
                            className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white italic text-sm"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLink(block.id)}
                            className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white text-sm"
                            title="Insert link"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                        </div>
                        <div
                          ref={(el) => { blockEditableRefs.current[block.id] = el; initEditableContent(block.id, block.content ?? ''); }}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => updateBlock(block.id, e.currentTarget.innerHTML)}
                          className="blog-editor min-h-[120px] px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                          data-placeholder="Write your text..."
                          style={{ outline: 'none' }}
                        />
                      </div>
                    )}
                    {block.type === 'image' && (
                      <div className="flex flex-col gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => { blockFileRefs.current[block.id] = el; }}
                          onChange={(e) => handleBlockImageUpload(block.id, e)}
                        />
                        {block.content ? (
                          <div className="flex items-start gap-3">
                            <img
                              src={block.content}
                              alt=""
                              className="max-h-48 rounded-lg border border-black/10 dark:border-white/10 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => blockFileRefs.current[block.id]?.click()}
                              className="text-sm text-black/60 dark:text-white/60 hover:underline"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBlock(block.id, null)}
                              className="text-sm text-red-500 dark:text-red-400 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => blockFileRefs.current[block.id]?.click()}
                            className="w-full py-8 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg text-black/50 dark:text-white/50 hover:border-black/40 dark:hover:border-white/40 hover:text-black/70 dark:hover:text-white/70 text-sm"
                          >
                            Click to upload image
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blog-editor a {
          color: #3b82f6;
          text-decoration: none;
        }
        .blog-editor a:hover {
          color: #2563eb;
        }
      `}</style>
    </ProtectedRoute>
  );
}
