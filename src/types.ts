/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isStarted: boolean;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type ItemType = "FOOD" | "SPEED_DOWN" | "MULTIPLIER";

export interface Item extends Point {
  type: ItemType;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

export interface Point {
  x: number;
  y: number;
}
