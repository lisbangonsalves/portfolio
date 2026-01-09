'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';
import LogoPicker from '../../components/LogoPicker';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    technologies: '',
    demoUrl: '',
    githubUrl: '',
    paperUrl: '',
    logo: null
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setProjects(data.projects);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      id: editingId || Date.now(),
      title: formData.title,
      description: formData.description,
      detailedDescription: formData.detailedDescription,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      demoUrl: formData.demoUrl,
      githubUrl: formData.githubUrl,
      paperUrl: formData.paperUrl,
      logo: formData.logo
    };

    if (editingId) {
      setProjects(prev => prev.map(p => p.id === editingId ? newProject : p));
      setEditingId(null);
    } else {
      setProjects(prev => [...prev, newProject]);
    }

    setFormData({
      title: '',
      description: '',
      detailedDescription: '',
      technologies: '',
      demoUrl: '',
      githubUrl: '',
      paperUrl: '',
      logo: null
    });
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      detailedDescription: project.detailedDescription || '',
      technologies: project.technologies.join(', '),
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      paperUrl: project.paperUrl || '',
      logo: project.logo || null
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'projects', data: projects })
      });

      if (response.ok) {
        setMessage('Projects updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update projects');
      }
    } catch (error) {
      setMessage('Error updating projects');
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
              Manage Projects
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Add, edit, or remove projects from your portfolio
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
              {message}
            </div>
          )}

          {/* Add/Edit Project Form */}
          <div className="mb-8 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description shown on the projects list"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  rows={5}
                  placeholder="Detailed explanation shown in the modal dialog"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Project Logo
                </label>
                <LogoPicker
                  value={formData.logo}
                  onChange={(logo) => setFormData({ ...formData, logo })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Demo URL <span className="text-black/40 dark:text-white/40 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    GitHub URL <span className="text-black/40 dark:text-white/40 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Research Paper URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.paperUrl}
                  onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })}
                  placeholder="https://arxiv.org/abs/..."
                  className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                >
                  {editingId ? 'Update Project' : 'Add Project'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', description: '', detailedDescription: '', technologies: '', demoUrl: '', githubUrl: '', paperUrl: '', logo: null });
                    }}
                    className="px-6 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List */}
          <div className="space-y-6 mb-8">
            {projects.map((project) => (
              <div key={project.id} className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-black dark:text-white">{project.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:border-black/40 dark:hover:border-white/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:border-red-500/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-black/60 dark:text-white/60 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-center text-black/40 dark:text-white/40 py-8">No projects added yet</p>
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
