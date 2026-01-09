import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import skillsData from '../data/skills.json';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';

// Dynamic icon component that uses Lucide icons or Simple Icons
function Icon({ iconName, iconType = 'lucide', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // For Lucide icons - Convert to PascalCase (e.g., 'brain' -> 'Brain', 'code-2' -> 'Code2')
  const formatLucideIconName = (name) => {
    if (!name) return 'Package';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  // For Simple Icons - Convert to SiPascalCase (e.g., 'tensorflow' -> 'SiTensorflow')
  const formatSimpleIconName = (name) => {
    if (!name) return 'SiCircle';
    const pascalCase = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return `Si${pascalCase}`;
  };

  if (iconType === 'simple-icons') {
    const iconKey = formatSimpleIconName(iconName);
    const IconComponent = SimpleIcons[iconKey] || SimpleIcons.SiCircle;
    return <IconComponent className={sizeClasses[size]} />;
  }

  // Default to Lucide
  const IconComponent = LucideIcons[formatLucideIconName(iconName)] || LucideIcons.Package;
  return <IconComponent className={sizeClasses[size]} />;
}

function SkillCard({ category, index }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-black/10 dark:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-black/20 dark:hover:border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-black dark:text-white transition-transform duration-300 hover:scale-110">
          <Icon iconName={category.icon} iconType={category.iconType} />
        </div>
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {category.name}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, idx) => {
          // Support both string and object format for skills
          const skillName = typeof skill === 'string' ? skill : skill.name;
          const skillIcon = typeof skill === 'object' ? skill.icon : null;
          const skillIconType = typeof skill === 'object' ? skill.iconType : null;

          return (
            <span
              key={skillName || idx}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded-lg border border-black/5 dark:border-white/5 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 hover:border-black/20 dark:hover:border-white/20"
            >
              {skillIcon && (
                <span className="inline-flex">
                  <Icon iconName={skillIcon} iconType={skillIconType} />
                </span>
              )}
              <span>{skillName}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Skills() {
  const categories = skillsData.categories;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
              Skills & Expertise
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              Technical capabilities across AI/ML and Full-Stack Development
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <SkillCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </PageTransition>
    </div>
  );
}
