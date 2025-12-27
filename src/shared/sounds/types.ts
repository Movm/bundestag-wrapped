/**
 * Shared Sound Types
 *
 * Platform-agnostic sound type definitions and constants.
 * Used by both web (browser Audio) and mobile (expo-av).
 */

// Web uses: click, correct, wrong, start, whoosh, hover
// Mobile uses: click, correct, wrong, whoosh (no hover on mobile - touch only)
export type SoundType = 'click' | 'correct' | 'wrong' | 'start' | 'whoosh' | 'hover';

export const SOUND_PATHS: Record<SoundType, string> = {
  click: '/sounds/click.wav',
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  start: '/sounds/start.wav',
  whoosh: '/sounds/whoosh.mp3',
  hover: '/sounds/click.wav', // Reuses click at lower volume
};

export const SOUND_VOLUMES: Record<SoundType, number> = {
  click: 0.7,
  correct: 0.85,
  wrong: 0.85,
  start: 0.9,
  whoosh: 0.5,
  hover: 0.25, // Subtle hover feedback
};
