import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const directionRef = useRef(direction);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (isGameOver) {
          resetGame();
        } else {
          setIsPaused((p) => !p);
        }
        return;
      }

      if (isGameOver || isPaused) return;

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [isGameOver, isPaused]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, score]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full max-h-full max-w-lg justify-start lg:justify-center relative">
      <div className="absolute top-0 right-0 text-right z-10 hidden lg:block -translate-y-8">
         <span className="block text-[10px] font-mono text-orange-500/60 uppercase tracking-widest">Session Score</span>
         <span className="text-4xl font-mono text-orange-500 shadow-[0_0_15px_rgba(255,78,0,0.3)]">{score.toString().padStart(6, '0')}</span>
      </div>

      <div className="text-right z-10 lg:hidden self-end w-full flex justify-between items-center mb-2">
         <span className="block text-[10px] font-mono text-orange-500/60 uppercase tracking-widest">Session Score</span>
         <span className="text-2xl font-mono text-orange-500 shadow-[0_0_15px_rgba(255,78,0,0.3)]">{score.toString().padStart(6, '0')}</span>
      </div>

      <div 
        className="relative bg-[#050505] border-2 border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)] flex-shrink-0"
        style={{ width: '100%', aspectRatio: '1/1' }}
      >
        {/* Grid Visualization */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
           backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
           backgroundSize: '5% 5%'
        }}></div>

        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute rounded-sm"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              background: index === 0 ? '#00f2ff' : `rgba(0, 242, 255, ${Math.max(0.2, 1 - index * 0.1).toFixed(2)})`,
              boxShadow: index === 0 ? '0 0 15px #00f2ff' : 'none',
              zIndex: 10,
            }}
          />
        ))}

        <div
          className="absolute flex items-center justify-center animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            zIndex: 5,
          }}
        >
          <div className="w-[60%] h-[60%] bg-[#ff4e00] rotate-45 shadow-[0_0_20px_#ff4e00]" />
        </div>

        {isGameOver && (
          <div className="absolute inset-0 bg-[#0a0502]/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200 mb-4 tracking-tighter shadow-[0_0_15px_rgba(255,78,0,0.3)]">CRITICAL FAILURE</h3>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-500 font-bold uppercase hover:bg-orange-500 hover:text-[#0a0502] transition-all rounded shadow-[0_0_20px_rgba(255,78,0,0.2)]"
            >
              Reboot System
            </button>
          </div>
        )}

        {!isGameOver && isPaused && (
          <div className="absolute inset-0 bg-[#0a0502]/50 flex items-center justify-center z-20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-4xl font-black italic text-cyan-400 tracking-tighter shadow-[0_0_15px_#00f2ff]">SYSTEM PAUSED</h3>
          </div>
        )}
      </div>

      <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Input: WASD/Arrows | Interrupt: Space</div>
    </div>
  );
}
