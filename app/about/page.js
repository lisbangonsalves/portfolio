'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import { GraduationCap, Award, FileText, Users } from 'lucide-react';

export default function About() {
  const [aboutContent, setAboutContent] = useState('');
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [extraCurricularActivities, setExtraCurricularActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setAboutContent(data.about?.content || '');
      setEducation(data.education || []);
      setCertifications(data.certifications || []);
      setResearchPapers(data.researchPapers || []);
      setExtraCurricularActivities(data.extraCurricularActivities || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch about content:', error);
      setLoading(false);
    }
  };

  // Default content if no data is available
  const defaultContent = `I'm an AI/ML Full-Stack Developer specializing in building intelligent systems that bridge the gap between artificial intelligence and scalable web applications. I combine deep learning expertise with full-stack development to create innovative solutions that solve complex real-world problems.

My technical expertise spans across machine learning frameworks (TensorFlow, PyTorch), modern web technologies (React, Next.js, Node.js), and cloud platforms. I architect end-to-end solutions that seamlessly integrate AI models into production-ready applications, ensuring scalability, performance, and exceptional user experiences.

From designing neural networks and training custom models to building robust APIs and intuitive frontends, I handle the complete development lifecycle. I'm passionate about leveraging AI/ML to create transformative products that make a meaningful impact.

When I'm not developing AI-powered applications, you'll find me researching the latest advancements in machine learning, experimenting with new frameworks, and contributing to the AI/ML community.`;

  const content = aboutContent || defaultContent;
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-black dark:text-white">
            About
          </h1>
          {loading ? (
            <div className="text-black/60 dark:text-white/60">Loading...</div>
          ) : (
            <>
              <div className="space-y-6 text-lg text-black/70 dark:text-white/70 leading-relaxed mb-16">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>

              {/* Qualification Section */}
              {education && education.length > 0 && (
                <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
                    Qualification
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-6 rounded-lg transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:shadow-lg border border-transparent hover:border-black/10 dark:hover:border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          {edu.logo && (
                            <div className="transition-transform duration-300 hover:scale-110 flex-shrink-0">
                              <img
                                src={edu.logo}
                                alt={edu.institution}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                              {edu.degree}
                            </h3>
                            <p className="text-lg text-black/60 dark:text-white/60 mb-1">
                              {edu.institution}
                            </p>
                            <p className="text-black/50 dark:text-white/50 text-sm">
                              {edu.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {certifications && certifications.length > 0 && (
                <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                    <Award className="w-8 h-8 md:w-10 md:h-10" />
                    Certifications
                  </h2>
                  <div className="space-y-6">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-6 rounded-lg transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:shadow-lg border border-transparent hover:border-black/10 dark:hover:border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          {cert.logo && (
                            <div className="transition-transform duration-300 hover:scale-110 flex-shrink-0">
                              <img
                                src={cert.logo}
                                alt={cert.provider}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                              {cert.certificateName}
                            </h3>
                            <p className="text-lg text-black/60 dark:text-white/60 mb-1">
                              {cert.provider}
                            </p>
                            {cert.certificateLink && (
                              <a
                                href={cert.certificateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-block mt-1"
                              >
                                View Certificate →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Papers Section */}
              {researchPapers && researchPapers.length > 0 && (
                <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 md:w-10 md:h-10" />
                    Research Papers
                  </h2>
                  <div className="space-y-6">
                    {researchPapers.map((paper) => (
                      <div
                        key={paper.id}
                        className="p-6 rounded-lg transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:shadow-lg border border-transparent hover:border-black/10 dark:hover:border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          {paper.logo && (
                            <div className="transition-transform duration-300 hover:scale-110 flex-shrink-0">
                              <img
                                src={paper.logo}
                                alt={paper.publisher}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                              {paper.paperName}
                            </h3>
                            <p className="text-lg text-black/60 dark:text-white/60 mb-1">
                              {paper.publisher}
                            </p>
                            <p className="text-black/50 dark:text-white/50 text-sm mb-1">
                              {paper.year}
                            </p>
                            {paper.link && (
                              <a
                                href={paper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-block mt-1"
                              >
                                View Paper →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra-Curricular Activities Section */}
              {extraCurricularActivities && extraCurricularActivities.length > 0 && (
                <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 md:w-10 md:h-10" />
                    Extra-Curricular Activities
                  </h2>
                  <div className="space-y-6">
                    {extraCurricularActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-6 rounded-lg transition-all duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:shadow-lg border border-transparent hover:border-black/10 dark:hover:border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          {activity.logo && (
                            <div className="transition-transform duration-300 hover:scale-110 flex-shrink-0">
                              <img
                                src={activity.logo}
                                alt={activity.community}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                              {activity.task}
                            </h3>
                            <p className="text-lg text-black/60 dark:text-white/60 mb-1">
                              {activity.community}
                            </p>
                            <p className="text-black/50 dark:text-white/50 text-sm">
                              {activity.year}
            </p>
          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      </PageTransition>
    </div>
  );
}
