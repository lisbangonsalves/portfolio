import Link from 'next/link';
import Navigation from './components/Navigation';
import PageTransition from './components/PageTransition';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black dark:text-white tracking-tight">
            Lisban Gonsalves
          </h1>
          <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 mb-4">
            AI/ML Full-Stack Developer
          </p>
          <p className="text-lg text-black/50 dark:text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            Building intelligent systems and scalable applications powered by AI/ML.<br />
            Transforming complex problems into elegant, user-centric solutions.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/projects"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
            >
              View my work
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      </PageTransition>
    </div>
  );
}
