'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './components/Navigation';
import PageTransition from './components/PageTransition';
import Footer from './components/Footer';

function AnimatedGradient() {
  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const cols = 30;
  const rows = 25;
  const totalCells = cols * rows;
  
  const animate = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setTime(elapsed);
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Wave direction changes over time (slowly rotating/shifting)
  const waveAngle1 = time * 0.2;
  const waveAngle2 = time * 0.15 + Math.PI / 3;
  const waveAngle3 = time * 0.1 + Math.PI * 2 / 3;

  return (
    <div 
      className="w-full h-full overflow-hidden rounded-xl"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      suppressHydrationWarning
    >
      {Array.from({ length: totalCells }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        // Normalized positions (0 to 1)
        const normCol = col / (cols - 1);
        const normRow = row / (rows - 1);
        
        // Waves flowing in different directions that change over time
        const wave1 = Math.sin(
          time * 0.5 + 
          normCol * 4 * Math.cos(waveAngle1) + 
          normRow * 4 * Math.sin(waveAngle1)
        );
        const wave2 = Math.sin(
          time * 0.4 + 
          normCol * 3 * Math.cos(waveAngle2) + 
          normRow * 3 * Math.sin(waveAngle2)
        );
        const wave3 = Math.sin(
          time * 0.3 + 
          normCol * 5 * Math.cos(waveAngle3) + 
          normRow * 5 * Math.sin(waveAngle3)
        );
        
        // Combine waves smoothly
        const combinedWave = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25);
        
        // Smooth base gradient: cyan (top-left) to blue (center) to purple (bottom-right)
        const baseHue = 190 + normCol * 50 + normRow * 40;
        const hueShift = combinedWave * 15;
        const finalHue = baseHue + hueShift;
        
        // Consistent saturation
        const saturation = 75;
        
        // Smooth lightness gradient with wave animation
        const baseLightness = 55 - normRow * 12 - normCol * 8;
        const lightnessShift = combinedWave * 10;
        const finalLightness = Math.max(35, Math.min(60, baseLightness + lightnessShift));

        return (
          <div
            key={i}
            style={{
              backgroundColor: `hsl(${finalHue}, ${saturation}%, ${finalLightness}%)`,
            }}
            suppressHydrationWarning
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Animated Gradient - Shows on top for mobile, right side for desktop */}
          <div className="h-[250px] sm:h-[300px] lg:h-[500px] w-full rounded-xl overflow-hidden order-1 lg:order-2">
            <AnimatedGradient />
          </div>

          {/* Text - Shows below gradient on mobile, left side on desktop */}
          <div className="text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Lisban Gonsalves
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-black/60 dark:text-white/60 mb-4">
              AI/ML Full-Stack Developer
            </p>
            <p className="text-base sm:text-lg text-black/50 dark:text-white/50 mb-8 lg:mb-12 max-w-xl leading-relaxed">
              Building intelligent systems and scalable applications powered by AI/ML.
              Transforming complex problems into elegant, user-centric solutions.
            </p>
            <div className="flex flex-col gap-3 w-fit">
              <div className="flex gap-3">
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-[#0d0d0d] border border-white text-white rounded-lg font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#0d0d0d]/90 hover:shadow-lg hover:shadow-white/20 hover:border-white/80"
                >
                  View my work
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-[#0d0d0d] border border-white text-white rounded-lg font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#0d0d0d]/90 hover:shadow-lg hover:shadow-white/20 hover:border-white/80"
                >
                  Get in touch
                </Link>
              </div>
              <a
                href="https://lisbangonsalves.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-black/20 bg-white text-black rounded-lg font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-black/10 hover:text-white hover:border-white hover:shadow-md w-full text-center inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                Read my Blogs
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </PageTransition>
    </div>
  );
}
