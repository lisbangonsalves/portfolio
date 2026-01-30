'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setBlogs(data.blogs || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setLoading(false);
    }
  };

  const saveBlogs = async (updatedList) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blogs', data: updatedList })
      });
      if (response.ok) {
        setMessage('Saved.');
        setTimeout(() => setMessage(''), 3000);
        return true;
      }
      setMessage('Failed to save');
      return false;
    } catch (error) {
      setMessage('Error saving');
      return false;
    }
  };

  const handleEdit = (post) => {
    router.push(`/admin/blogs/edit/${post.id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    const updated = blogs.filter((p) => p.id !== id);
    setBlogs(updated);
    const ok = await saveBlogs(updated);
    setDeleting(false);
    if (!ok) setBlogs(blogs);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex">
          <AdminSidebar />
          <div className="flex-1 lg:ml-64 pt-16 lg:pt-0 flex items-center justify-center">
            <div className="text-black/60 dark:text-white/60">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Manage Blogs</h1>
                <p className="text-black/60 dark:text-white/60">Edit or delete posts below.</p>
              </div>
              <Link
                href="/admin/blogs/new"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors shrink-0 inline-block text-center"
              >
                Post new blog
              </Link>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes('Saved')
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-3 mb-8">
              {blogs.length === 0 ? (
                <p className="text-black/50 dark:text-white/50 py-6">No posts yet.</p>
              ) : (
                blogs.map((post) => (
                  <div
                    key={post.id}
                    className="border border-black/10 dark:border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt=""
                          className="h-14 w-20 object-cover rounded border border-black/10 dark:border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-20 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-black dark:text-white truncate">{post.title}</div>
                        <div className="text-sm text-black/50 dark:text-white/50">
                          /blogs/{post.slug || post.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="px-3 py-1.5 text-sm border border-black/20 dark:border-white/20 rounded-lg text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting}
                        className="px-3 py-1.5 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
