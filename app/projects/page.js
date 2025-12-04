'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';

// Icon library for rendering library icons
const ICON_LIBRARY = {
  shopping: '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
  chat: '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>',
  clipboard: '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>',
  chart: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  code: '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>',
  mobile: '<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>',
  database: '<path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14c0 .55-2.69 2-6 2s-6-1.45-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-4.55c-1.3.95-3.58 1.55-6 1.55s-4.7-.6-6-1.55V9.64c1.47.83 3.61 1.36 6 1.36s4.53-.53 6-1.36v2.81zM12 9C8.69 9 6 7.55 6 7s2.69-2 6-2 6 1.45 6 2-2.69 2-6 2z"/>',
  cloud: '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
  rocket: '<path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.47 2.47.85-.42c.38-.19 1.32-.66 2.43-1.17 1.11-.51 2.03-.94 2.49-1.17.46-.23 1.28-.55 1.64-.55.83 0 1.24.27 1.24.27s.5.26 1.29.77c.79.51 1.79 1.12 2.87 1.63 1.08.51 2.08.89 2.46 1.07l.85.42L23 13.12l-3.62-.88c-.13-.31-1.53-3.6-3.57-5.89-1.05-1.18-2.97-3.23-3.81-3.23s-2.76 2.05-3.81 3.23zm2.44 4.27c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/><path d="M5 16c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3.59L12 19.59V16H5z"/>',
  design: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle cx="12" cy="12" r="5"/>',
  ai: '<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V9.99h7V2.95c3.72 1.15 6.47 4.82 7 8.94v1.1h-7z"/>',
  security: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V9.99h7V2.95c3.72 1.15 6.47 4.82 7 8.94v1.1h-7z"/>'
};

function ProjectLogo({ logo }) {
  if (!logo) {
    // Default gradient with no icon
    return (
      <div className="relative h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 flex items-center justify-center" />
    );
  }

  if (logo.type === 'library') {
    return (
      <div className={`relative h-full w-full bg-gradient-to-br ${logo.color} flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
        <svg className="w-16 h-16 text-black/10 dark:text-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" fill="currentColor" viewBox="0 0 24 24">
          <g dangerouslySetInnerHTML={{ __html: ICON_LIBRARY[logo.data] || logo.svg }} />
        </svg>
      </div>
    );
  }

  if (logo.type === 'custom') {
    return (
      <div className={`relative h-full w-full bg-gradient-to-br ${logo.color} flex items-center justify-center overflow-hidden`}>
        <img
          src={logo.data}
          alt="Project logo"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
      </div>
    );
  }

  if (logo.type === 'image') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black/5 dark:bg-white/5">
        <img
          src={logo.data}
          alt="Project banner"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20"><span class="text-black/40 dark:text-white/40 text-sm">Failed to load image</span></div>';
          }}
        />
      </div>
    );
  }

  return null;
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setProjects(data.projects || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-black dark:text-white">
            Projects
          </h1>

          {loading ? (
            <div className="text-center text-black/60 dark:text-white/60">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-black/40 dark:text-white/40 py-12">
              No projects added yet
            </div>
          ) : (
            <div className="space-y-8">
              {projects.map((project, index) => {
                return (
                  <div
                    key={project.id}
                    className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 group hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5">
                      {/* Image Section */}
                      <div className="md:col-span-2 h-64 md:h-[350px]">
                        <ProjectLogo logo={project.logo} />
                      </div>

                      {/* Content Section */}
                      <div className="md:col-span-3 p-8 transition-colors duration-300 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.03] flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
                            {project.title}
                          </h2>
                          <p className="text-black/60 dark:text-white/60 mb-4 leading-relaxed transition-colors duration-300 group-hover:text-black/80 dark:group-hover:text-white/80">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2.5 py-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded text-xs transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 hover:-translate-y-0.5 flex items-center gap-1.5">
                                <img
                                  src={`https://cdn.simpleicons.org/${tech.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, '')}`}
                                  alt={tech}
                                  className="w-3.5 h-3.5 inline-block"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-2">
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 py-2 border-2 border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 hover:border-black/40 dark:hover:border-white/40 transition-all duration-200 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-black/10 dark:border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-black/50 dark:text-white/50 text-sm">
          <p>
            Wanna play{' '}
            <Link href="/games/tetris" className="text-black dark:text-white hover:underline font-medium">
              Tetris
            </Link>
            {' '}or{' '}
            <Link href="/games/flappy-bird" className="text-black dark:text-white hover:underline font-medium">
              Flappy Bird
            </Link>
            !
          </p>
        </div>
      </footer>
      </PageTransition>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] p-4 animate-fadeIn"
          onClick={() => setSelectedProject(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Overlaid */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/20 dark:bg-white/20 backdrop-blur-sm hover:bg-black/30 dark:hover:bg-white/30 transition-all hover:scale-110 flex items-center justify-center text-white shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Project Image/Logo */}
            {selectedProject.logo && (
              <div className="relative">
                <ProjectLogo logo={selectedProject.logo} />
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                {selectedProject.title}
              </h2>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded text-xs transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 flex items-center gap-1.5"
                    >
                      <img
                        src={`https://cdn.simpleicons.org/${tech.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, '')}`}
                        alt={tech}
                        className="w-3 h-3 inline-block"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                  </a>
                )}
                {selectedProject.paperUrl && (
                  <a
                    href={selectedProject.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Research Paper
                  </a>
                )}
              </div>

              {/* Detailed Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">About</h3>
                <p className="text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                  {selectedProject.detailedDescription || selectedProject.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
