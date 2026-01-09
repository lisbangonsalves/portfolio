'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function ResumeManager() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch('/api/resume');
      const data = await response.json();
      setResume(data.resume);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResume(data.url);
        setMessage('Resume uploaded successfully! The previous resume has been automatically deleted.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload resume');
    }

    setUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the resume?')) {
      return;
    }

    try {
      const response = await fetch('/api/resume', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setResume(null);
        setMessage('Resume deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Failed to delete resume');
    }
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
                Manage Resume
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60">
                Upload your resume. When a new resume is uploaded, the previous one will be automatically deleted.
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

            <div className="border border-black/10 dark:border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-4">
                    Upload Resume (PDF only, max 10MB)
                  </label>
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg cursor-pointer hover:border-black/40 dark:hover:border-white/40 transition-colors ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-black dark:text-white font-medium">
                      {uploading ? 'Uploading...' : 'Choose PDF File'}
                    </span>
                  </label>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">
                    Only PDF files are accepted. Maximum file size: 10MB
                  </p>
                </div>

                {/* Current Resume Section */}
                {resume && (
                  <div className="border-t border-black/10 dark:border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">Current Resume</p>
                          <a
                            href={resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Resume →
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {!resume && (
                  <div className="text-center py-8 text-black/40 dark:text-white/40">
                    <p>No resume uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
