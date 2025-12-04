'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import AdminNav from '../../components/AdminNav';
import Link from 'next/link';

export default function SkillsInfo() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        <AdminNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Skills Management
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Skills are now managed via a static JSON file
            </p>
          </div>

          <div className="border border-black/10 dark:border-white/10 rounded-xl p-8 bg-blue-50/50 dark:bg-blue-900/10">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              How to Update Skills
            </h2>
            <div className="space-y-4 text-black/70 dark:text-white/70">
              <p>
                Skills are now stored in a static JSON file for easier version control and direct editing.
              </p>

              <div className="bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-4 mt-4">
                <p className="text-sm font-mono text-black/80 dark:text-white/80 mb-2">
                  File location:
                </p>
                <code className="text-sm bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded block text-black dark:text-white font-mono">
                  app/data/skills.json
                </code>
              </div>

              <div className="mt-6">
                <p className="font-medium text-black dark:text-white mb-2">
                  JSON Structure:
                </p>
                <pre className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 overflow-x-auto text-xs">
{`{
  "categories": [
    {
      "id": "category-id",
      "name": "Display Name",
      "icon": "icon-name",
      "iconType": "lucide",
      "skills": [...]
    }
  ]
}`}
                </pre>
                <p className="text-xs text-black/60 dark:text-white/60 mt-2">
                  <strong>iconType</strong> can be either <code className="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">"lucide"</code> or <code className="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">"simple-icons"</code>
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Lucide Icons */}
                <div className="space-y-3">
                  <p className="font-medium text-black dark:text-white">
                    📦 Lucide Icons (Generic UI Icons):
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {['brain', 'code-2', 'server', 'cloud', 'wrench', 'database', 'terminal', 'cpu', 'smartphone', 'layout', 'palette', 'shield', 'zap', 'globe', 'box', 'package'].map(icon => (
                      <span key={icon} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-md font-mono text-black/70 dark:text-white/70">
                        {icon}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black/60 dark:text-white/60 mt-2">
                    Browse all 1000+ icons at:{' '}
                    <a
                      href="https://lucide.dev/icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      lucide.dev/icons
                    </a>
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                    <strong>iconType:</strong> "lucide" | Use kebab-case (e.g., "code-2", "brain")
                  </p>
                </div>

                {/* Simple Icons */}
                <div className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
                  <p className="font-medium text-black dark:text-white">
                    🎨 Simple Icons (Brand/Technology Logos):
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {['tensorflow', 'pytorch', 'react', 'nextdotjs', 'nodedotjs', 'python', 'docker', 'amazonwebservices', 'tailwindcss', 'typescript', 'javascript', 'mongodb', 'postgresql', 'git', 'github', 'figma'].map(icon => (
                      <span key={icon} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-md font-mono text-black/70 dark:text-white/70">
                        {icon}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black/60 dark:text-white/60 mt-2">
                    Browse all 2500+ brand icons at:{' '}
                    <a
                      href="https://simpleicons.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      simpleicons.org
                    </a>
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                    <strong>iconType:</strong> "simple-icons" | Use slug name (e.g., "tensorflow", "nodedotjs", "amazonwebservices")
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> After editing the JSON file, you'll need to restart the development server
                  or rebuild the application for changes to take effect.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/skills"
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
              >
                View Skills Page
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
