'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AdminNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'About', path: '/admin/about' },
    { name: 'Qualification', path: '/admin/education' },
    { name: 'Certifications', path: '/admin/certifications' },
    { name: 'Research Papers', path: '/admin/research-papers' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Experience', path: '/admin/experience' },
    { name: 'Messages', path: '/admin/messages' },
  ];

  return (
    <nav className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-semibold text-black dark:text-white">
              Admin Panel
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    pathname === item.path
                      ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium'
                      : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              View Site
            </Link>
            <span className="text-black/40 dark:text-white/40">|</span>
            <span className="text-sm text-black/60 dark:text-white/60">{user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
