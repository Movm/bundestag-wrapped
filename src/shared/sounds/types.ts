/**
 * Shared Sound Types
 *
 * Platform-agnostic sound type definitions and constants.
 * Used by both web (browser Audio) and mobile (expo-av).
 */

// Web uses: click, correct, wrong, start, whoosh
// Mobile uses: click, correct, wrong, whoosh (no start button on mobile)
export type SoundType = 'click' | 'correct' | 'wrong' | 'start' | 'whoosh';

export const SOUND_PATHS: Record<SoundType, string> = {
  click: '/sounds/click.wav',
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  start: '/sounds/start.wav',
  whoosh: '/sounds/whoosh.mp3',
};

export const SOUND_VOLUMES: Record<SoundType, number> = {
  click: 0.15,
  correct: 0.25,
  wrong: 0.25,
  start: 0.25,
  whoosh: 0.12,
};
