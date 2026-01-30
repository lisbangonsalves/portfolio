'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'About', path: '/admin/about', icon: '📝' },
    { name: 'Qualification', path: '/admin/education', icon: '🎓' },
    { name: 'Certifications', path: '/admin/certifications', icon: '🏆' },
    { name: 'Research Papers', path: '/admin/research-papers', icon: '📄' },
    { name: 'Extra-Curricular', path: '/admin/extra-curricular', icon: '🎯' },
    { name: 'Projects', path: '/admin/projects', icon: '🚀' },
    { name: 'Experience', path: '/admin/experience', icon: '💼' },
    { name: 'Blogs', path: '/admin/blogs', icon: '📰' },
    { name: 'Resume', path: '/admin/resume', icon: '📄' },
    { name: 'Messages', path: '/admin/messages', icon: '✉️' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-[#0d0d0d] border border-black/10 dark:border-white/10 rounded-lg shadow-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-black dark:text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {mobileMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#0d0d0d] border-r border-black/10 dark:border-white/10 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white font-medium'
                        : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-black/10 dark:border-white/10 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </Link>
            <div className="px-4 py-2 text-xs text-black/50 dark:text-white/50">
              {user?.email}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
