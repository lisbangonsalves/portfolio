import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-black dark:text-white">
            About
          </h1>
          <div className="space-y-6 text-lg text-black/70 dark:text-white/70 leading-relaxed">
            <p>
              I'm an AI/ML Full-Stack Developer specializing in building intelligent systems that bridge the gap
              between artificial intelligence and scalable web applications. I combine deep learning expertise with
              full-stack development to create innovative solutions that solve complex real-world problems.
            </p>
            <p>
              My technical expertise spans across machine learning frameworks (TensorFlow, PyTorch), modern
              web technologies (React, Next.js, Node.js), and cloud platforms. I architect end-to-end solutions
              that seamlessly integrate AI models into production-ready applications, ensuring scalability,
              performance, and exceptional user experiences.
            </p>
            <p>
              From designing neural networks and training custom models to building robust APIs and intuitive
              frontends, I handle the complete development lifecycle. I'm passionate about leveraging AI/ML
              to create transformative products that make a meaningful impact.
            </p>
            <p>
              When I'm not developing AI-powered applications, you'll find me researching the latest advancements
              in machine learning, experimenting with new frameworks, and contributing to the AI/ML community.
            </p>
          </div>
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
    </div>
  );
}
