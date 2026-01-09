'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function EducationManager() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    year: '',
    logo: ''
  });
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setEducations(data.education || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch education:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEducation = {
      id: editingId || Date.now(),
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      year: formData.year.trim(),
      logo: formData.logo
    };

    if (editingId) {
      setEducations(prev => prev.map(edu => edu.id === editingId ? newEducation : edu));
      setEditingId(null);
    } else {
      // Add new education at the beginning (newest first)
      setEducations(prev => [newEducation, ...prev]);
    }

    setFormData({
      institution: '',
      degree: '',
      year: '',
      logo: ''
    });
    setLogoPreview(null);
  };

  const handleEdit = (education) => {
    setEditingId(education.id);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      year: education.year,
      logo: education.logo || ''
    });
    setLogoPreview(education.logo || null);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(svg\+xml|png|jpe?g)$/)) {
      alert('Please upload only SVG, PNG, or JPG files');
      return;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'company_logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, logo: data.path }));
        setLogoPreview(data.path);
        setMessage('Logo uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo');
    }

    setUploading(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this qualification entry?')) {
      setEducations(prev => prev.filter(edu => edu.id !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'education', data: educations })
      });

      if (response.ok) {
        setMessage('Qualification updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update qualification');
      }
    } catch (error) {
      setMessage('Error updating qualification');
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
              Manage Qualification
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Add, edit, or remove qualification entries from your About page
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

          {/* Add/Edit Education Form */}
          <div className="mb-8 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              {editingId ? 'Edit Qualification' : 'Add New Qualification'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  College/University
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., University of Technology"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Degree Name
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2020 - 2024"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  College/University Logo (Optional)
                </label>

                {/* Upload Button */}
                <div className="mb-3">
                  <input
                    type="file"
                    id="logo-upload"
                    accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg cursor-pointer hover:border-black/40 dark:hover:border-white/40 transition-colors ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-black dark:text-white">
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </span>
                  </label>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                    SVG, PNG, or JPG (max 2MB)
                  </p>
                </div>

                {/* Logo Preview */}
                {logoPreview && (
                  <div className="mb-3 p-4 border border-black/10 dark:border-white/10 rounded-lg bg-black/5 dark:bg-white/5">
                    <p className="text-xs text-black/60 dark:text-white/60 mb-2">Preview:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black rounded-lg border border-black/10 dark:border-white/10">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain p-1"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"%3E%3C/path%3E%3Cline x1="12" y1="9" x2="12" y2="13"%3E%3C/line%3E%3Cline x1="12" y1="17" x2="12.01" y2="17"%3E%3C/line%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black dark:text-white font-mono truncate">
                          {formData.logo}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, logo: '' });
                          setLogoPreview(null);
                        }}
                        className="px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual URL Input */}
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50 mb-2">Or enter URL manually:</p>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => {
                      setFormData({ ...formData, logo: e.target.value });
                      setLogoPreview(e.target.value || null);
                    }}
                    placeholder="e.g., /company_logo/university.svg or https://..."
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                >
                  {editingId ? 'Update Qualification' : 'Add Qualification'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ institution: '', degree: '', year: '', logo: '' });
                      setLogoPreview(null);
                    }}
                    className="px-6 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Education List */}
          <div className="space-y-6 mb-8">
            {educations.map((education) => (
              <div key={education.id} className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {education.logo && (
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black rounded-lg border border-black/10 dark:border-white/10 flex-shrink-0">
                        <img
                          src={education.logo}
                          alt={education.institution}
                          className="max-w-full max-h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">{education.degree}</h3>
                      <p className="text-lg text-black/60 dark:text-white/60">{education.institution}</p>
                      <p className="text-black/50 dark:text-white/50 text-sm mt-1">{education.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(education)}
                      className="px-3 py-1 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:border-black/40 dark:hover:border-white/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(education.id)}
                      className="px-3 py-1 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:border-red-500/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {educations.length === 0 && (
              <p className="text-center text-black/40 dark:text-white/40 py-8">No qualification entries added yet</p>
            )}
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
