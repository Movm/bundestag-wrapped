/**
 * Shared utilities for slide components
 */

/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without mutating the original
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Slide phase for intro → quiz → result flow
 */
export type SlidePhase = 'intro' | 'quiz' | 'result';

/**
 * Common bubble positions for 5-item layouts
 */
export const BUBBLE_POSITIONS: Array<{ top: string; left: string }> = [
  { top: '8%', left: '12%' },
  { top: '5%', left: '58%' },
  { top: '38%', left: '35%' },
  { top: '65%', left: '8%' },
  { top: '62%', left: '55%' },
];

/**
 * Float animation configurations for bubbles
 */
export const FLOAT_ANIMATIONS: Array<{
  x: number[];
  y: number[];
  duration: number;
}> = [
  { x: [0, 15, -10, 0], y: [0, -20, 10, 0], duration: 8 },
  { x: [0, -20, 15, 0], y: [0, 15, -15, 0], duration: 9 },
  { x: [0, 10, -15, 0], y: [0, -10, 20, 0], duration: 7 },
  { x: [0, -15, 20, 0], y: [0, 20, -10, 0], duration: 10 },
  { x: [0, 20, -10, 0], y: [0, -15, 15, 0], duration: 8.5 },
];
