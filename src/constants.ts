/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from "./types";

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Neon Horizon",
    artist: "AI Synthwave",
    duration: "3:45",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Cyber Pulse",
    artist: "Neural Beats",
    duration: "4:12",
    coverUrl: "https://images.unsplash.com/photo-1633545505052-25f1ac8a67ee?q=80&w=300&h=300&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Digital Rain",
    artist: "Binary Echo",
    duration: "3:28",
    coverUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;
