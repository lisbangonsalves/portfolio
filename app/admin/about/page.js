'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function AboutManager() {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setAboutContent(data.about?.content || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch about content:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'about',
          data: {
            content: aboutContent.trim()
          }
        })
      });

      if (response.ok) {
        setMessage('About section updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update about section');
      }
    } catch (error) {
      setMessage('Error updating about section');
    }

    setSaving(false);
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
          <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Manage About Section
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Edit the content displayed on your About page
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 border rounded-lg ${
              message.includes('successfully')
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* About Content Editor */}
          <div className="mb-8 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                About Content
              </label>
              <p className="text-xs text-black/50 dark:text-white/50 mb-4">
                Each paragraph should be separated by a blank line. The content will be displayed as separate paragraphs on the About page.
              </p>
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                rows={15}
                placeholder="Enter your about content here. Separate paragraphs with blank lines."
                className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 resize-none font-mono text-sm leading-relaxed"
              />
            </div>

            {/* Preview */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Preview
              </label>
              <div className="border border-black/10 dark:border-white/10 rounded-lg p-6 bg-black/5 dark:bg-white/5">
                <div className="space-y-6 text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {aboutContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                  {aboutContent.trim() === '' && (
                    <p className="text-black/40 dark:text-white/40 italic">No content to preview</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
