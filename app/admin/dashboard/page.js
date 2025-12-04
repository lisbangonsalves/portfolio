'use client';

import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminNav from '../../components/AdminNav';

export default function AdminDashboard() {
  const cards = [
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
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        <AdminNav />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Manage your portfolio content from here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
    </ProtectedRoute>
  );
}
