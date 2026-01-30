'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

// T-Rex Dino Game Component
function DinoGame() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef({
    dino: { x: 50, y: 150, vy: 0, width: 40, height: 45, jumping: false },
    obstacles: [],
    ground: 150,
    gravity: 0.8,
    jumpForce: -14,
    speed: 6,
    frameCount: 0,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      dino: { x: 50, y: 150, vy: 0, width: 40, height: 45, jumping: false },
      obstacles: [],
      ground: 150,
      gravity: 0.8,
      jumpForce: -14,
      speed: 6,
      frameCount: 0,
    };
    setScore(0);
    setGameOver(false);
  }, []);

  const jump = useCallback(() => {
    const game = gameRef.current;
    if (!game.dino.jumping && game.dino.y >= game.ground) {
      game.dino.vy = game.jumpForce;
      game.dino.jumping = true;
      setScore(s => s + 1);
    }
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameStarted(true);
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else if (gameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    const handleClick = () => {
      if (!gameStarted) {
        startGame();
      } else if (gameOver) {
        startGame();
      } else {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleClick);

    const drawDino = (x, y) => {
      ctx.fillStyle = '#fff';
      
      // Body
      ctx.fillRect(x + 10, y, 25, 30);
      // Head
      ctx.fillRect(x + 20, y - 15, 20, 20);
      // Eye
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(x + 32, y - 10, 4, 4);
      // Legs
      ctx.fillStyle = '#fff';
      const legOffset = gameRef.current.frameCount % 10 < 5 ? 0 : 5;
      ctx.fillRect(x + 12, y + 30, 6, 15 - legOffset);
      ctx.fillRect(x + 26, y + 30, 6, 10 + legOffset);
      // Tail
      ctx.fillRect(x, y + 5, 12, 8);
      // Arms
      ctx.fillRect(x + 30, y + 10, 8, 4);
    };

    const drawCactus = (x, height) => {
      ctx.fillStyle = '#fff';
      const y = 195 - height;
      ctx.fillRect(x, y, 15, height);
      ctx.fillRect(x - 8, y + 15, 10, 6);
      ctx.fillRect(x + 13, y + 25, 10, 6);
    };

    const gameLoop = () => {
      const game = gameRef.current;
      
      // Clear canvas - same black as main page (#0d0d0d)
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground - always white
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 195);
      ctx.lineTo(canvas.width, 195);
      ctx.stroke();

      const isMobile = window.innerWidth < 640;

      if (!gameStarted) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isMobile ? 'Tap to Start' : 'Press SPACE or Click to Start', canvas.width / 2, 100);
        drawDino(game.dino.x, game.dino.y);
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 80);
        ctx.font = '14px monospace';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 105);
        ctx.fillText(isMobile ? 'Tap to Restart' : 'Press SPACE or Click to Restart', canvas.width / 2, 130);
        drawDino(game.dino.x, game.dino.y);
        game.obstacles.forEach(obs => drawCactus(obs.x, obs.height));
        return;
      }

      game.frameCount++;

      // Update dino
      game.dino.vy += game.gravity;
      game.dino.y += game.dino.vy;
      if (game.dino.y >= game.ground) {
        game.dino.y = game.ground;
        game.dino.vy = 0;
        game.dino.jumping = false;
      }

      // Spawn obstacles
      if (game.frameCount % Math.max(60, 100 - Math.floor(score / 5)) === 0) {
        game.obstacles.push({
          x: canvas.width,
          height: 30 + Math.random() * 25,
          width: 15,
        });
      }

      // Update obstacles
      game.obstacles = game.obstacles.filter(obs => {
        obs.x -= game.speed + score * 0.05;
        return obs.x > -20;
      });

      // Check collision
      for (const obs of game.obstacles) {
        const dinoBox = {
          x: game.dino.x + 5,
          y: game.dino.y - 10,
          width: game.dino.width - 10,
          height: game.dino.height + 10,
        };
        const obsBox = {
          x: obs.x,
          y: 195 - obs.height,
          width: obs.width,
          height: obs.height,
        };
        if (
          dinoBox.x < obsBox.x + obsBox.width &&
          dinoBox.x + dinoBox.width > obsBox.x &&
          dinoBox.y < obsBox.y + obsBox.height &&
          dinoBox.y + dinoBox.height > obsBox.y
        ) {
          setGameOver(true);
          return;
        }
      }

      // Draw
      drawDino(game.dino.x, game.dino.y);
      game.obstacles.forEach(obs => drawCactus(obs.x, obs.height));

      // Score display
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Score: ${score}`, canvas.width - 10, 25);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted, gameOver, score, jump, startGame]);

  return (
    <div className="mt-16 flex flex-col items-center">
      <p className="text-sm text-black/40 dark:text-white/40 mb-3">While you're here, want to play?</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="rounded-lg cursor-pointer max-w-full"
        style={{ imageRendering: 'pixelated' }}
      />
      <p className="text-xs text-black/30 dark:text-white/30 mt-2">
        <span className="hidden sm:inline">Press SPACE or Click to jump</span>
        <span className="sm:hidden">Tap to jump</span>
      </p>
    </div>
  );
}

export default function Contact() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotification({
          show: true,
          message: 'Message sent successfully! I\'ll get back to you soon.',
          type: 'success'
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setShowModal(false);
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      } else {
        setNotification({
          show: true,
          message: data.error || 'Failed to send message. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
      setNotification({
        show: true,
        message: 'Failed to send message. Please try again.',
        type: 'error'
      });
    }

    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>

      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white">
            Get in touch
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, feel free to reach out.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <a
              href="mailto:lisbanrobertgonsalves@gmail.com"
              className="w-14 h-14 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-110 group"
              title="Email"
            >
              <svg className="w-6 h-6 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>

            <a
              href="https://github.com/lisbangonsalves"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-110 group"
              title="GitHub"
            >
              <svg className="w-6 h-6 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/lisbangonsalves/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-110 group"
              title="LinkedIn"
            >
              <svg className="w-6 h-6 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="keyboard-btn inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send me a message
          </button>

          {/* T-Rex Dino Game */}
          <DinoGame />

          <style jsx>{`
            .keyboard-btn {
              position: relative;
              transform: translateY(-4px);
              box-shadow: 
                0 4px 0 0 #333,
                0 6px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.1s ease;
            }
            :global(.dark) .keyboard-btn {
              box-shadow: 
                0 4px 0 0 #ccc,
                0 6px 4px rgba(0, 0, 0, 0.3);
            }
            .keyboard-btn:hover {
              transform: translateY(-6px);
              box-shadow: 
                0 6px 0 0 #333,
                0 8px 6px rgba(0, 0, 0, 0.3);
            }
            :global(.dark) .keyboard-btn:hover {
              box-shadow: 
                0 6px 0 0 #ccc,
                0 8px 6px rgba(0, 0, 0, 0.3);
            }
            .keyboard-btn:active {
              transform: translateY(0px);
              box-shadow: 
                0 0px 0 0 #333,
                0 1px 2px rgba(0, 0, 0, 0.3);
            }
            :global(.dark) .keyboard-btn:active {
              box-shadow: 
                0 0px 0 0 #ccc,
                0 1px 2px rgba(0, 0, 0, 0.3);
            }
          `}</style>
        </div>
      </section>

      <Footer />
      </PageTransition>

      {/* Message Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all hover:scale-110 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                Send a Message
              </h2>
              <p className="text-black/60 dark:text-white/60 mb-6">
                Fill out the form below and I'll get back to you soon.
              </p>

              {/* Notification */}
              {notification.show && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  notification.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}>
                  {notification.message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Phone Number <span className="text-black/40 dark:text-white/40 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (123) 456-7890"
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0d0d0d] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
