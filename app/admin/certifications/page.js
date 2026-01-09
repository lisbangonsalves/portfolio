'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    certificateName: '',
    provider: '',
    certificateLink: '',
    logo: ''
  });
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setCertifications(data.certifications || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCertification = {
      id: editingId || Date.now(),
      certificateName: formData.certificateName.trim(),
      provider: formData.provider.trim(),
      certificateLink: formData.certificateLink.trim(),
      logo: formData.logo
    };

    if (editingId) {
      setCertifications(prev => prev.map(cert => cert.id === editingId ? newCertification : cert));
      setEditingId(null);
    } else {
      // Add new certification at the beginning (newest first)
      setCertifications(prev => [newCertification, ...prev]);
    }

    setFormData({
      certificateName: '',
      provider: '',
      certificateLink: '',
      logo: ''
    });
    setLogoPreview(null);
  };

  const handleEdit = (certification) => {
    setEditingId(certification.id);
    setFormData({
      certificateName: certification.certificateName,
      provider: certification.provider,
      certificateLink: certification.certificateLink || '',
      logo: certification.logo || ''
    });
    setLogoPreview(certification.logo || null);
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
    if (confirm('Are you sure you want to delete this certification entry?')) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'certifications', data: certifications })
      });

      if (response.ok) {
        setMessage('Certifications updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update certifications');
      }
    } catch (error) {
      setMessage('Error updating certifications');
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
              Manage Certifications
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Add, edit, or remove certification entries from your About page
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

          {/* Add/Edit Certification Form */}
          <div className="mb-8 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              {editingId ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Certificate Name
                </label>
                <input
                  type="text"
                  value={formData.certificateName}
                  onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Provider
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Certificate Link <span className="text-black/40 dark:text-white/40 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.certificateLink}
                  onChange={(e) => setFormData({ ...formData, certificateLink: e.target.value })}
                  placeholder="https://example.com/certificate"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Provider Logo (Optional)
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
                    placeholder="e.g., /company_logo/provider.svg or https://..."
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                >
                  {editingId ? 'Update Certification' : 'Add Certification'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ certificateName: '', provider: '', certificateLink: '', logo: '' });
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

          {/* Certifications List */}
          <div className="space-y-6 mb-8">
            {certifications.map((certification) => (
              <div key={certification.id} className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {certification.logo && (
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black rounded-lg border border-black/10 dark:border-white/10 flex-shrink-0">
                        <img
                          src={certification.logo}
                          alt={certification.provider}
                          className="max-w-full max-h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">{certification.certificateName}</h3>
                      <p className="text-lg text-black/60 dark:text-white/60">{certification.provider}</p>
                      {certification.certificateLink && (
                        <a
                          href={certification.certificateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                        >
                          View Certificate →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(certification)}
                      className="px-3 py-1 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:border-black/40 dark:hover:border-white/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(certification.id)}
                      className="px-3 py-1 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:border-red-500/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <p className="text-center text-black/40 dark:text-white/40 py-8">No certification entries added yet</p>
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
