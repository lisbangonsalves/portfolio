'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from '../../components/Navigation';
import PageTransition from '../../components/PageTransition';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

// Tetromino shapes
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const COLORS = {
  I: 'bg-cyan-500',
  O: 'bg-yellow-500',
  T: 'bg-purple-500',
  S: 'bg-green-500',
  Z: 'bg-red-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500'
};

function createEmptyBoard() {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));
}

function getRandomShape() {
  const shapes = Object.keys(SHAPES);
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: SHAPES[randomShape],
    type: randomShape,
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0
  };
}

export default function Tetris() {
  const [mounted, setMounted] = useState(false);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setCurrentPiece(getRandomShape());
  }, []);

  const checkCollision = useCallback((piece, board, offsetX = 0, offsetY = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }

          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback((piece, board) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      });
    });
    return newBoard;
  }, []);

  const clearLines = useCallback((board) => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== EMPTY_CELL)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }

    return { newBoard, linesCleared };
  }, []);

  const rotatePiece = useCallback((piece) => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const movePiece = useCallback((direction) => {
    if (gameOver || isPaused || !gameStarted) return;

    setCurrentPiece(prev => {
      let newPiece = { ...prev };

      if (direction === 'left') {
        newPiece.x -= 1;
      } else if (direction === 'right') {
        newPiece.x += 1;
      } else if (direction === 'down') {
        newPiece.y += 1;
      } else if (direction === 'rotate') {
        newPiece = rotatePiece(prev);
      }

      if (checkCollision(newPiece, board)) {
        return prev;
      }

      return newPiece;
    });
  }, [board, checkCollision, gameOver, isPaused, gameStarted, rotatePiece]);

  const dropPiece = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setCurrentPiece(prev => {
      const newPiece = { ...prev, y: prev.y + 1 };

      if (checkCollision(newPiece, board)) {
        const mergedBoard = mergePiece(prev, board);
        const { newBoard, linesCleared } = clearLines(mergedBoard);

        setBoard(newBoard);
        setScore(s => s + linesCleared * 100);

        const nextPiece = getRandomShape();
        if (checkCollision(nextPiece, newBoard)) {
          setGameOver(true);
          return prev;
        }

        return nextPiece;
      }

      return newPiece;
    });
  }, [board, checkCollision, clearLines, gameOver, isPaused, gameStarted, mergePiece]);

  const hardDrop = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setCurrentPiece(prev => {
      let newPiece = { ...prev };
      while (!checkCollision({ ...newPiece, y: newPiece.y + 1 }, board)) {
        newPiece.y += 1;
      }
      return newPiece;
    });
    setTimeout(dropPiece, 0);
  }, [board, checkCollision, dropPiece, gameOver, isPaused, gameStarted]);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomShape());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  };

  const togglePause = () => {
    if (gameStarted && !gameOver) {
      setIsPaused(p => !p);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') movePiece('left');
      if (e.key === 'ArrowRight') movePiece('right');
      if (e.key === 'ArrowDown') movePiece('down');
      if (e.key === 'ArrowUp') movePiece('rotate');
      if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
      }
      if (e.key === 'p' || e.key === 'P') togglePause();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, hardDrop]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      dropPiece();
    }, 500);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [dropPiece, gameOver, isPaused, gameStarted]);

  const renderBoard = () => {
    if (!mounted) {
      return createEmptyBoard();
    }

    const displayBoard = board.map(row => [...row]);

    if (currentPiece && !gameOver) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Navigation />
      <PageTransition>
        <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-4 md:mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-black dark:text-white">
                Tetris
              </h1>
              <p className="text-sm md:text-lg text-black/60 dark:text-white/60">
                Classic block-stacking puzzle game
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start justify-center">
              {/* Game Board */}
              <div className="border-2 border-black/20 dark:border-white/20 rounded-xl p-2 md:p-4 bg-white dark:bg-[#0d0d0d] mx-auto">
                <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}>
                  {displayBoard.map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${y}-${x}`}
                        className={`w-4 h-4 md:w-6 md:h-6 border border-black/10 dark:border-white/10 ${
                          cell ? COLORS[cell] : 'bg-black/5 dark:bg-white/5'
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Controls & Info */}
              <div className="space-y-6 w-full md:w-64">
                <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Score</h3>
                  <p className="text-3xl font-bold text-black dark:text-white">{score}</p>
                </div>

                {/* Mobile Controls - Right Below Score */}
                {gameStarted && (
                  <div className="md:hidden border border-black/10 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-[#0d0d0d]">
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-3 text-center">Touch Controls</h3>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <button
                        onTouchStart={(e) => {
                          e.preventDefault();
                          movePiece('rotate');
                        }}
                        onClick={() => movePiece('rotate')}
                        className="col-span-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-base active:scale-95 transition-all touch-none select-none hover:bg-black/80 dark:hover:bg-white/90"
                      >
                        ↻
                      </button>
                      <button
                        onTouchStart={(e) => {
                          e.preventDefault();
                          hardDrop();
                        }}
                        onClick={() => hardDrop()}
                        className="col-span-3 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-medium text-sm active:scale-95 transition-all touch-none select-none hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        ⬇ Drop
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onTouchStart={(e) => {
                          e.preventDefault();
                          movePiece('left');
                        }}
                        onClick={() => movePiece('left')}
                        className="py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-bold text-xl active:scale-95 transition-all touch-none select-none hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        ←
                      </button>
                      <button
                        onTouchStart={(e) => {
                          e.preventDefault();
                          movePiece('down');
                        }}
                        onClick={() => movePiece('down')}
                        className="py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-xl active:scale-95 transition-all touch-none select-none hover:bg-black/80 dark:hover:bg-white/90"
                      >
                        ↓
                      </button>
                      <button
                        onTouchStart={(e) => {
                          e.preventDefault();
                          movePiece('right');
                        }}
                        onClick={() => movePiece('right')}
                        className="py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-bold text-xl active:scale-95 transition-all touch-none select-none hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}

                <div className="border border-black/10 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Controls</h3>
                  <div className="space-y-2 text-sm text-black/70 dark:text-white/70">
                    <p><span className="font-medium text-black dark:text-white">←→</span> Move</p>
                    <p><span className="font-medium text-black dark:text-white">↑</span> Rotate</p>
                    <p><span className="font-medium text-black dark:text-white">↓</span> Soft Drop</p>
                    <p><span className="font-medium text-black dark:text-white">Space</span> Hard Drop</p>
                    <p><span className="font-medium text-black dark:text-white">P</span> Pause</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {!gameStarted ? (
                    <button
                      onClick={startGame}
                      className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                    >
                      Start Game
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={togglePause}
                        className="w-full px-6 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
                      >
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={startGame}
                        className="w-full px-6 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
                      >
                        Restart
                      </button>
                    </>
                  )}
                </div>

                {gameOver && (
                  <div className="border border-red-500/20 bg-red-50 dark:bg-red-900/10 rounded-xl p-4 text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">Game Over!</p>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Final Score: {score}</p>
                  </div>
                )}

                {isPaused && (
                  <div className="border border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 text-center">
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold">Paused</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
