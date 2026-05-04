/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { Github, Music, Gamepad2, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 bg-[#050505] selection:bg-neon-cyan selection:text-black">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan flex items-center justify-center rounded-lg shadow-[0_0_15px_#00f3ff]">
            <Zap size={24} className="text-black" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl uppercase tracking-tighter neon-text-cyan underline decoration-neon-cyan/30 underline-offset-4">NEON BEATS</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">v1.2 // PROTOCOL ACTIVE</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-zinc-500 hover:text-neon-cyan transition-colors uppercase font-mono text-xs tracking-widest flex items-center gap-2">
            <Gamepad2 size={16} /> Games
          </a>
          <a href="#" className="text-zinc-500 hover:text-neon-cyan transition-colors uppercase font-mono text-xs tracking-widest flex items-center gap-2">
            <Music size={16} /> Audio
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 pt-4">
        {/* Left Side: Info / Branding (Hidden on mobile) */}
        <div className="hidden xl:flex flex-col gap-8 w-64 pt-20">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-zinc-400 border-l-2 border-neon-cyan pl-4">System Status</h2>
            <div className="space-y-2 font-mono text-[10px] text-zinc-600 uppercase">
              <div className="flex justify-between"><span>Core Frequency</span><span className="text-neon-cyan">60Hz</span></div>
              <div className="flex justify-between"><span>Latency</span><span className="text-neon-green">2ms</span></div>
              <div className="flex justify-between"><span>Neural Sync</span><span className="text-neon-cyan">98%</span></div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
            <p className="text-xs text-zinc-500 leading-relaxed italic">
              "Escape the digital simulation by consuming neural clusters. The faster the frequency, the higher the risk."
            </p>
          </div>
        </div>

        {/* Center: Snake Game */}
        <div className="flex-grow flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Side / Bottom: Music Player */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:block">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MusicPlayer />
          </motion.div>
          
          <div className="mt-8 hidden lg:block">
            <div className="flex flex-col gap-4 p-6 neon-border border-zinc-800 bg-black/40 backdrop-blur-md rounded-2xl w-full max-w-md">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-zinc-300">Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest">Movement</span>
                  <span className="text-xs text-neon-cyan font-bold">ARROW KEYS</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest">Speed Boost</span>
                  <span className="text-xs text-neon-pink font-bold">AUTO-SYNC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center py-8 mt-12 border-t border-zinc-900 gap-4">
        <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
          &copy; 2024 NEON BEATS LABS // ALL RIGHTS RESERVED
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-zinc-700 hover:text-neon-cyan transition-colors"><Github size={16} /></a>
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">V.8.4.1</span>
        </div>
      </footer>
    </div>
  );
}
