/**
 * Sound System for Bundestag Wrapped (Web)
 *
 * Provides audio feedback for quiz interactions:
 * - click: Button tap feedback
 * - correct: Success fanfare for right answers
 * - wrong: Error sound for wrong answers
 * - whoosh: Slide transition sound
 *
 * Features:
 * - Preloads sounds on first user interaction
 * - Background music with loop support
 * - Mute preference persisted to localStorage
 * - Graceful fallback if audio fails
 */

import {
  type SoundType,
  SOUND_PATHS,
  SOUND_VOLUMES,
  createSlideTransitionSoundHook,
} from '@/shared/sounds';

export type { SoundType };

const BACKGROUND_MUSIC_PATH = '/sounds/background.mp3';
const BACKGROUND_VOLUME = 0.08;

const STORAGE_KEY = 'bundestag-wrapped-sound-muted';

// Background music instance
let backgroundMusic: HTMLAudioElement | null = null;
let isMusicPlaying = false;

// Audio cache for preloaded sounds
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let isInitialized = false;

// Track user interaction to unlock audio and preload sounds
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    // Initialize sounds on first interaction
    if (!isInitialized) {
      initSounds();
    }
    // Remove listeners after first interaction
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
}

/**
 * Initialize and preload all sounds.
 * Call this on first user interaction to comply with autoplay policies.
 */
export function initSounds(): void {
  if (isInitialized) return;

  Object.entries(SOUND_PATHS).forEach(([type, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.load();
    audioCache[type as SoundType] = audio;
  });

  isInitialized = true;
}

/**
 * Check if sounds are muted
 */
export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Set mute state
 */
export function setMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(muted));
}

/**
 * Toggle mute state and return new state
 */
export function toggleMuted(): boolean {
  const newState = !isMuted();
  setMuted(newState);
  return newState;
}

/**
 * Play a sound effect
 * @param type - The type of sound to play
 */
export function playSound(type: SoundType): void {
  if (isMuted()) return;
  if (typeof window === 'undefined') return;

  // Initialize on first play if not already done
  if (!isInitialized) {
    initSounds();
  }

  // Create a fresh audio element each time for reliability
  const audio = new Audio(SOUND_PATHS[type]);
  audio.volume = SOUND_VOLUMES[type];

  // Play with promise handling
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      // Log for debugging but don't break the app
      console.debug('Sound playback failed:', error.message);
    });
  }
}

/**
 * Initialize background music (lazy, called on first play)
 */
function initBackgroundMusic(): HTMLAudioElement {
  if (!backgroundMusic) {
    backgroundMusic = new Audio(BACKGROUND_MUSIC_PATH);
    backgroundMusic.loop = true;
    backgroundMusic.volume = BACKGROUND_VOLUME;
    backgroundMusic.preload = 'auto';
  }
  return backgroundMusic;
}

/**
 * Start playing background music
 */
export function playBackgroundMusic(): void {
  if (isMuted()) return;
  if (typeof window === 'undefined') return;

  const music = initBackgroundMusic();
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isMusicPlaying = true;
      })
      .catch((error) => {
        console.debug('Background music failed:', error.message);
      });
  }
}

/**
 * Pause background music
 */
export function pauseBackgroundMusic(): void {
  if (backgroundMusic) {
    backgroundMusic.pause();
    isMusicPlaying = false;
  }
}

/**
 * Toggle background music on/off
 */
export function toggleBackgroundMusic(): boolean {
  if (isMusicPlaying) {
    pauseBackgroundMusic();
    return false;
  } else {
    playBackgroundMusic();
    return true;
  }
}

/**
 * Check if background music is currently playing
 */
export function isBackgroundMusicPlaying(): boolean {
  return isMusicPlaying;
}

/**
 * Hook for playing whoosh sound on slide transitions
 */
export const useSlideTransitionSound = createSlideTransitionSoundHook(playSound);
