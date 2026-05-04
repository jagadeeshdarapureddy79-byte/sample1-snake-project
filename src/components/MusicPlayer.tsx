/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";
import { TRACKS } from "../constants";
import { motion, AnimatePresence } from "motion/react";

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const bars = Array.from({ length: 40 }).map((_, i) => i);

  return (
    <div className="flex flex-col gap-6 p-6 neon-border bg-black/40 backdrop-blur-md rounded-2xl w-full max-w-md" id="music-player">
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      
      {/* Track Info */}
      <div className="flex gap-4 items-center">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 neon-border"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="flex gap-1 items-end h-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    className="w-1 bg-neon-cyan"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="flex-grow min-w-0">
          <h3 className="font-display font-bold text-xl truncate neon-text-cyan">{currentTrack.title}</h3>
          <p className="text-zinc-400 text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Visualizer (Dummy) */}
      <div className="h-12 flex items-center justify-between gap-1 overflow-hidden opacity-50">
        {bars.map((i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.4 + Math.random() * 0.4,
              ease: "easeInOut"
            }}
            className="w-1 bg-gradient-to-t from-neon-purple to-neon-cyan rounded-full"
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} className="p-2 text-zinc-400 hover:text-neon-cyan transition-colors" id="btn-prev">
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-neon-cyan flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:scale-105 transition-transform"
          id="btn-play-pause"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>

        <button onClick={handleNext} className="p-2 text-zinc-400 hover:text-neon-cyan transition-colors" id="btn-next">
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
