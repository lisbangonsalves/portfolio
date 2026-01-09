'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setExperiences(data.experience || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-black dark:text-white">
            Experience
          </h1>

          {loading ? (
            <div className="text-center text-black/60 dark:text-white/60">Loading...</div>
          ) : experiences.length === 0 ? (
            <div className="text-center text-black/40 dark:text-white/40 py-12">
              No experience added yet
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-black/20 dark:bg-white/20"></div>

              <div className="space-y-12">
                {experiences.map((experience) => (
                  <div key={experience.id} className="relative pl-12 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-black dark:bg-white border-4 border-white dark:border-[#0d0d0d] transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg"></div>

                    <div className="p-6 rounded-lg transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-black/10 dark:hover:border-white/10">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-black dark:text-white transition-all duration-300 group-hover:scale-105">
                            {experience.title}
                          </h2>
                          <div className="flex items-center gap-3 mt-2">
                            {experience.logo && (
                              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <Image
                                  src={experience.logo}
                                  alt={experience.company}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <p className="text-lg text-black/60 dark:text-white/60 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
                              {experience.company}
                            </p>
                          </div>
                        </div>
                        <span className="text-black/50 dark:text-white/50 mt-2 md:mt-0 transition-colors duration-300 group-hover:text-black/70 dark:group-hover:text-white/70">
                          {experience.period}
                        </span>
                      </div>
                      <ul className="space-y-2 text-black/60 dark:text-white/60">
                        {experience.responsibilities.map((responsibility, index) => (
                          <li key={index} className="transition-all duration-200 hover:translate-x-2 hover:text-black dark:hover:text-white">
                            • {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      </PageTransition>
    </div>
  );
}
