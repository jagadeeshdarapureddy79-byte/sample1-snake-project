/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Point, Direction, GameState, Item, Particle } from "../types";
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, Play, Zap, Gauge } from "lucide-react";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [items, setItems] = useState<Item[]>([{ x: 5, y: 5, type: "FOOD" }]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [multiplier, setMultiplier] = useState(1);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("snakeHighScore") || "0"),
    isGameOver: false,
    isStarted: false,
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const particleLoopRef = useRef<number | null>(null);
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const itemsRef = useRef<Item[]>([{ x: 5, y: 5, type: "FOOD" }]);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);

  // Sync refs with state for the game loop
  useEffect(() => { nextDirectionRef.current = nextDirection; }, [nextDirection]);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = Array.from({ length: 8 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      life: 1,
      color,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const generateItem = useCallback((type: "FOOD" | "SPEED_DOWN" | "MULTIPLIER" = "FOOD"): Item => {
    let newItem;
    while (true) {
      newItem = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type,
      };
      const onSnake = snakeRef.current.some((seg) => seg.x === newItem?.x && seg.y === newItem?.y);
      const onItem = itemsRef.current.some((item) => item.x === newItem?.x && item.y === newItem?.y);
      if (!onSnake && !onItem) break;
    }
    return newItem;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setItems([{ x: 5, y: 5, type: "FOOD" }]);
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setSpeed(INITIAL_SPEED);
    setMultiplier(1);
    setParticles([]);
    setGameState((prev) => ({ ...prev, score: 0, isGameOver: false, isStarted: false }));
  };

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isStarted: true }));
  };

  const moveSnake = useCallback(() => {
    const head = { ...snakeRef.current[0] };
    const currentNextDir = nextDirectionRef.current;

    setDirection(currentNextDir);
    
    switch (currentNextDir) {
      case "UP": head.y -= 1; break;
      case "DOWN": head.y += 1; break;
      case "LEFT": head.x -= 1; break;
      case "RIGHT": head.x += 1; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameState((prev) => ({ ...prev, isGameOver: true }));
      return;
    }

    if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
      setGameState((prev) => ({ ...prev, isGameOver: true }));
      return;
    }

    const newSnake = [head, ...snakeRef.current];
    const hitItemIndex = itemsRef.current.findIndex((item) => item.x === head.x && item.y === head.y);

    if (hitItemIndex !== -1) {
      const item = itemsRef.current[hitItemIndex];
      
      // Effects
      if (item.type === "FOOD") {
        createParticles(head.x, head.y, "#00f3ff");
        setGameState((prev) => {
          const addedScore = 10 * multiplier;
          const newScore = prev.score + addedScore;
          return { ...prev, score: newScore, highScore: Math.max(newScore, prev.highScore) };
        });
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else if (item.type === "SPEED_DOWN") {
        createParticles(head.x, head.y, "#39ff14");
        setSpeed((prev) => Math.min(INITIAL_SPEED, prev + 20));
      } else if (item.type === "MULTIPLIER") {
        createParticles(head.x, head.y, "#ff007f");
        setMultiplier((prev) => prev + 1);
        setTimeout(() => setMultiplier(1), 5000);
      }

      // Cleanup and Spawn
      const nextItems = [...itemsRef.current];
      nextItems.splice(hitItemIndex, 1);
      
      // Always ensure at least one food
      if (nextItems.filter(i => i.type === "FOOD").length === 0) {
        nextItems.push(generateItem("FOOD"));
      }

      // Rare chance for powerups
      if (Math.random() < 0.1 && nextItems.length < 3) {
        nextItems.push(generateItem(Math.random() > 0.5 ? "SPEED_DOWN" : "MULTIPLIER"));
      }

      setItems(nextItems);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [generateItem, multiplier]);

  // Particle animation loop
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
      particleLoopRef.current = requestAnimationFrame(animateParticles);
    };

    particleLoopRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (particleLoopRef.current) cancelAnimationFrame(particleLoopRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") setNextDirection("UP"); break;
        case "ArrowDown": if (direction !== "UP") setNextDirection("DOWN"); break;
        case "ArrowLeft": if (direction !== "RIGHT") setNextDirection("LEFT"); break;
        case "ArrowRight": if (direction !== "LEFT") setNextDirection("RIGHT"); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState.isStarted && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isStarted, gameState.isGameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6" id="snake-game-container">
      {/* Score Header */}
      <div className="flex justify-between w-full max-w-[400px] font-mono">
        <div className="flex flex-col items-start">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold neon-text-pink">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">High Score</span>
          <span className="text-2xl font-bold neon-text-green flex items-center gap-2">
            <Trophy size={18} />
            {gameState.highScore}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative neon-border bg-zinc-950/80 backdrop-blur-sm rounded-xl overflow-hidden scanline"
        style={{ 
          width: "400px", 
          height: "400px",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
        id="snake-board"
      >
        {/* Grid Dots */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-zinc-900/30" />
        ))}

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: p.color,
              left: `${(p.x * 100) / GRID_SIZE}%`,
              top: `${(p.y * 100) / GRID_SIZE}%`,
              opacity: p.life,
              boxShadow: `0 0 5px ${p.color}`,
            }}
          />
        ))}

        {/* Items */}
        {items.map((item, i) => (
          <motion.div
            key={`${item.x}-${item.y}-${i}`}
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.7, 1, 0.7],
              rotate: item.type === "FOOD" ? 0 : [0, 90, 180, 270, 360]
            }}
            transition={{ repeat: Infinity, duration: item.type === "FOOD" ? 1.5 : 1 }}
            className={`absolute z-10 flex items-center justify-center ${
              item.type === "FOOD" ? "bg-neon-cyan shadow-[0_0_10px_#00f3ff] rounded-full" : 
              item.type === "SPEED_DOWN" ? "bg-neon-green shadow-[0_0_10px_#39ff14] rounded-sm" :
              "bg-neon-pink shadow-[0_0_10px_#ff007f] rounded-lg"
            }`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(item.x * 100) / GRID_SIZE}%`,
              top: `${(item.y * 100) / GRID_SIZE}%`,
            }}
          >
            {item.type === "SPEED_DOWN" && <Gauge size={10} className="text-black" />}
            {item.type === "MULTIPLIER" && <Zap size={10} className="text-black" />}
          </motion.div>
        ))}

        {/* Snake */}
        {snake.map((segment, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: index === 0 ? 1.1 : 1,
            }}
            className={`absolute ${index === 0 ? "bg-neon-pink z-20 shadow-[0_0_15px_#ff007f]" : "bg-neon-pink/40 z-10"} rounded-sm`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
              opacity: 1 - (index / snake.length) * 0.5,
            }}
          />
        ))}

        {/* Glitch Overlay on Game Over */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0.05, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="absolute inset-0 bg-neon-pink z-40 pointer-events-none mix-blend-overlay"
            />
          )}
        </AnimatePresence>

        {/* Multiplier Badge */}
        {multiplier > 1 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-2 left-2 z-[60] px-2 py-0.5 bg-neon-pink text-black text-[10px] font-black uppercase rounded shadow-[0_0_10px_#ff007f]"
          >
            x{multiplier} MULTIPLIER
          </motion.div>
        )}

        {/* Game Over / Start Overlay */}
        <AnimatePresence>
          {(!gameState.isStarted || gameState.isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
            >
              {gameState.isGameOver ? (
                <div className="text-center flex flex-col items-center gap-4">
                  <motion.h2 
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="text-4xl font-display font-black text-neon-pink uppercase"
                  >
                    System Failure
                  </motion.h2>
                  <p className="text-zinc-400 font-mono tracking-tighter">DATA PURGED: {gameState.score}</p>
                  <button 
                    onClick={resetGame}
                    className="mt-4 flex items-center gap-2 px-8 py-3 bg-neon-pink text-black font-bold uppercase rounded-full shadow-[0_0_20px_#ff007f] hover:scale-105 transition-transform"
                    id="btn-restart"
                  >
                    <RotateCcw size={20} />
                    Reboot Protocol
                  </button>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center gap-6">
                  <div className="flex flex-col gap-1 items-center">
                    <h2 className="text-4xl font-display font-black text-neon-cyan uppercase">Snake</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Neural Link Protocol</p>
                  </div>
                  <button 
                    onClick={startGame}
                    className="flex items-center gap-2 px-10 py-4 bg-neon-cyan text-black font-bold uppercase rounded-full shadow-[0_0_20px_#00f3ff] hover:scale-105 transition-transform"
                    id="btn-start"
                  >
                    <Play size={24} fill="currentColor" />
                    Connect Link
                  </button>
                  <div className="mt-8 grid grid-cols-3 gap-6 text-zinc-500 font-mono text-[8px] uppercase tracking-tighter">
                    <div className="flex flex-col items-center gap-1 opacity-50">
                      <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                      Data
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-neon-green" />
                      Sync
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-lg bg-neon-pink" />
                      Burst
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
