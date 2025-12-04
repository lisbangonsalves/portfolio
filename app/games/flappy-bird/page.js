'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from '../../components/Navigation';
import PageTransition from '../../components/PageTransition';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);
  const pipeTimerRef = useRef(null);
  const velocityRef = useRef(0);

  const jump = useCallback(() => {
    if (!gameOver && gameStarted) {
      velocityRef.current = JUMP_STRENGTH;
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameOver, gameStarted]);

  const startGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    velocityRef.current = 0;
    setPipes([createPipe()]); // Start with one pipe immediately
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const checkCollision = useCallback((birdY, pipes) => {
    // Check ground and ceiling
    if (birdY < 0 || birdY + BIRD_SIZE > GAME_HEIGHT) {
      return true;
    }

    // Check pipe collision
    const birdX = 100;
    for (let pipe of pipes) {
      if (
        birdX + BIRD_SIZE > pipe.x &&
        birdX < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.topHeight + PIPE_GAP)
      ) {
        return true;
      }
    }

    return false;
  }, []);

  const createPipe = useCallback(() => {
    const minHeight = 50;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - 50;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    return {
      x: GAME_WIDTH,
      topHeight,
      passed: false
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (pipeTimerRef.current) {
        clearInterval(pipeTimerRef.current);
      }
      return;
    }

    const gameLoop = () => {
      // Update velocity
      velocityRef.current = velocityRef.current + GRAVITY;
      setBirdVelocity(velocityRef.current);

      // Update bird position
      setBirdY(y => y + velocityRef.current);

      setPipes(prevPipes => {
        const newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED
        })).filter(pipe => pipe.x + PIPE_WIDTH > 0);

        // Check if bird passed pipe
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
            pipe.passed = true;
            setScore(s => s + 1);
          }
        });

        return newPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Generate pipes
    pipeTimerRef.current = setInterval(() => {
      setPipes(prev => [...prev, createPipe()]);
    }, 2000);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (pipeTimerRef.current) {
        clearInterval(pipeTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, createPipe]);

  // Check collision
  useEffect(() => {
    if (gameStarted && !gameOver) {
      if (checkCollision(birdY, pipes)) {
        setGameOver(true);
      }
    }
  }, [birdY, pipes, gameStarted, gameOver, checkCollision]);

  // Keyboard and click controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
                Flappy Bird
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60">
                Tap or press Space to fly
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* Game Canvas */}
              <div className="relative">
                <div
                  onClick={jump}
                  className="relative border-2 border-black/20 dark:border-white/20 rounded-xl overflow-hidden cursor-pointer bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-950/20 dark:to-sky-900/30"
                  style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                >
                  {/* Bird */}
                  {gameStarted && (
                    <div
                      className="absolute w-8 h-8 bg-yellow-400 dark:bg-yellow-500 rounded-full transition-transform"
                      style={{
                        left: 100 - BIRD_SIZE / 2,
                        top: birdY,
                        transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`,
                        zIndex: 20
                      }}
                    >
                      {/* Bird eye */}
                      <div className="absolute top-2 left-5 w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                  )}

                  {/* Pipes */}
                  {pipes.map((pipe, index) => (
                    <div key={index} className="absolute inset-0 pointer-events-none">
                      {/* Top pipe */}
                      <div
                        className="absolute bg-green-700 dark:bg-green-600 border-4 border-green-800 dark:border-green-700 shadow-lg"
                        style={{
                          left: pipe.x,
                          top: 0,
                          width: PIPE_WIDTH,
                          height: pipe.topHeight,
                          zIndex: 10
                        }}
                      />
                      {/* Bottom pipe */}
                      <div
                        className="absolute bg-green-700 dark:bg-green-600 border-4 border-green-800 dark:border-green-700 shadow-lg"
                        style={{
                          left: pipe.x,
                          top: pipe.topHeight + PIPE_GAP,
                          width: PIPE_WIDTH,
                          height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
                          zIndex: 10
                        }}
                      />
                    </div>
                  ))}

                  {/* Score Display */}
                  {gameStarted && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2">
                      <p className="text-5xl font-bold text-black/20 dark:text-white/20">{score}</p>
                    </div>
                  )}

                  {/* Game Over Overlay */}
                  {gameOver && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
                        <p className="text-2xl text-white/80 mb-6">Score: {score}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startGame();
                          }}
                          className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Start Screen */}
                  {!gameStarted && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to Play?</h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startGame();
                          }}
                          className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                        >
                          Start Game
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-6 w-full md:w-64">
                <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">High Score</h3>
                  <p className="text-3xl font-bold text-black dark:text-white">{score}</p>
                </div>

                <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">How to Play</h3>
                  <div className="space-y-3 text-sm text-black/70 dark:text-white/70">
                    <p>Tap anywhere or press <span className="font-medium text-black dark:text-white">Space</span> to make the bird fly</p>
                    <p>Avoid hitting the pipes or the ground</p>
                    <p>Each pipe you pass earns you 1 point</p>
                  </div>
                </div>

                <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Controls</h3>
                  <div className="space-y-2 text-sm text-black/70 dark:text-white/70">
                    <p><span className="font-medium text-black dark:text-white">Click</span> Flap</p>
                    <p><span className="font-medium text-black dark:text-white">Space</span> Flap</p>
                    <p><span className="font-medium text-black dark:text-white">↑</span> Flap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
