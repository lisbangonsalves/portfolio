'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-black/5 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-black dark:text-white hover:opacity-80 transition-opacity">
              Lisban Gonsalves
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors z-50"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-white dark:bg-[#0d0d0d] flex flex-col justify-center"
          style={{
            animation: 'slideDown 0.4s ease-out forwards'
          }}
        >
          <div className="max-w-5xl mx-auto w-full px-6">
            <div className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-3xl md:text-4xl font-medium transition-all duration-300 hover:translate-x-4 ${
                    pathname === item.path
                      ? 'text-black dark:text-white'
                      : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeSlideIn 0.4s ease-out ${index * 0.08}s forwards`
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes slideDown {
              from {
                clip-path: inset(0 0 100% 0);
              }
              to {
                clip-path: inset(0 0 0 0);
              }
            }
            @keyframes fadeSlideIn {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
