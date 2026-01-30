'use client';

import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
  const cards = [
    {
      title: 'Manage About',
      description: 'Edit the content on your About page',
      link: '/admin/about',
      icon: '📝',
    },
    {
      title: 'Manage Qualification',
      description: 'Add, edit, or remove qualification entries',
      link: '/admin/education',
      icon: '🎓',
    },
    {
      title: 'Manage Certifications',
      description: 'Add, edit, or remove certification entries',
      link: '/admin/certifications',
      icon: '🏆',
    },
    {
      title: 'Manage Research Papers',
      description: 'Add, edit, or remove research paper entries',
      link: '/admin/research-papers',
      icon: '📄',
    },
    {
      title: 'Manage Extra-Curricular Activities',
      description: 'Add, edit, or remove extra-curricular activity entries',
      link: '/admin/extra-curricular',
      icon: '🎯',
    },
    {
      title: 'Manage Skills',
      description: 'Add, edit, or remove skills from your portfolio',
      link: '/admin/skills',
      icon: '⚡',
    },
    {
      title: 'Manage Projects',
      description: 'Showcase your best work and achievements',
      link: '/admin/projects',
      icon: '🚀',
    },
    {
      title: 'Manage Experience',
      description: 'Update your work history and positions',
      link: '/admin/experience',
      icon: '💼',
    },
    {
      title: 'Manage Blogs',
      description: 'Add, edit, or remove blog posts',
      link: '/admin/blogs',
      icon: '📰',
    },
    {
      title: 'Manage Resume',
      description: 'Upload and manage your resume',
      link: '/admin/resume',
      icon: '📄',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Manage your portfolio content from here
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.link}
                href={card.link}
                className="border border-black/10 dark:border-white/10 rounded-xl p-8 hover:border-black/20 dark:hover:border-white/20 transition-colors group"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2 group-hover:text-black/80 dark:group-hover:text-white/80">
                  {card.title}
                </h2>
                <p className="text-black/60 dark:text-white/60">
                  {card.description}
                </p>
                <div className="mt-4 text-sm text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white">
                  Manage →
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
