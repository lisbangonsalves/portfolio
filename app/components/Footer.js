'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch('/api/resume');
      const data = await response.json();
      setResume(data.resume);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!resume) return;

    try {
      // Fetch the PDF file as a blob
      const response = await fetch(resume);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lisban_Gonsalves_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download resume:', error);
      // Fallback to direct link
      window.open(resume, '_blank');
    }
  };

  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-8 px-6">
      <div className="max-w-5xl mx-auto text-center text-black/50 dark:text-white/50 text-sm">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <p>
            Wanna play{' '}
            <Link href="/games/tetris" className="text-black dark:text-white hover:underline font-medium">
              Tetris
            </Link>
            ?
          </p>
          {resume && (
            <>
              <span className="text-black/20 dark:text-white/20">•</span>
              <button
                onClick={handleDownload}
                className="text-black dark:text-white hover:underline font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download my resume
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
