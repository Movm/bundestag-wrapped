/**
 * Sound System for Bundestag Wrapped (Mobile/Expo)
 *
 * Provides audio feedback for quiz interactions:
 * - click: Button tap feedback
 * - correct: Success fanfare for right answers
 * - wrong: Error sound for wrong answers
 * - whoosh: Slide transition sound
 *
 * Features:
 * - Preloads sounds on app start
 * - Mute preference persisted to AsyncStorage
 * - Uses expo-av for native audio playback
 * - Shares types with web via @/shared/sounds
 */

import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type SoundType,
  SOUND_VOLUMES,
  createSlideTransitionSoundHook,
} from '@/shared/sounds';

export type { SoundType };

const STORAGE_KEY = 'bundestag-wrapped-sound-muted';

// Sound file requires - must use require() for bundling
// Uses public/sounds/ via Metro's watchFolders configuration
const SOUND_FILES: Partial<Record<SoundType, ReturnType<typeof require>>> = {
  click: require('../../public/sounds/click.wav'),
  correct: require('../../public/sounds/correct.wav'),
  wrong: require('../../public/sounds/wrong.wav'),
  whoosh: require('../../public/sounds/whoosh.mp3'),
  // Note: 'start' is not used on mobile (no start button)
};

// Preloaded sound objects
const soundObjects: Partial<Record<SoundType, Audio.Sound>> = {};
let isInitialized = false;
let cachedMuteState: boolean | null = null;

/**
 * Initialize and preload all sounds.
 * Call this early in app startup.
 */
export async function initSounds(): Promise<void> {
  if (isInitialized) return;

  try {
    // Configure audio mode for mixing with other audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Preload all sounds
    await Promise.all(
      (Object.keys(SOUND_FILES) as SoundType[]).map(async (type) => {
        const file = SOUND_FILES[type];
        if (!file) return;

        const { sound } = await Audio.Sound.createAsync(file, {
          shouldPlay: false,
          volume: SOUND_VOLUMES[type],
        });
        soundObjects[type] = sound;
      })
    );

    // Load mute state
    cachedMuteState = await isMuted();
    isInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize sounds:', error);
  }
}

/**
 * Check if sounds are muted
 */
export async function isMuted(): Promise<boolean> {
  if (cachedMuteState !== null) return cachedMuteState;

  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    cachedMuteState = value === 'true';
    return cachedMuteState;
  } catch {
    return false;
  }
}

/**
 * Check mute state synchronously (uses cached value)
 */
export function isMutedSync(): boolean {
  return cachedMuteState ?? false;
}

/**
 * Set mute state
 */
export async function setMuted(muted: boolean): Promise<void> {
  cachedMuteState = muted;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, String(muted));
  } catch (error) {
    console.warn('Failed to save mute state:', error);
  }
}

/**
 * Toggle mute state and return new state
 */
export async function toggleMuted(): Promise<boolean> {
  const current = await isMuted();
  const newState = !current;
  await setMuted(newState);
  return newState;
}

/**
 * Play a sound effect
 * @param type - The type of sound to play
 */
export async function playSound(type: SoundType): Promise<void> {
  if (isMutedSync()) return;

  // Initialize on first play if not already done
  if (!isInitialized) {
    await initSounds();
  }

  const sound = soundObjects[type];
  if (!sound) return;

  try {
    // Rewind to start and play
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (error) {
    // Silently fail - audio might not be available
  }
}

/**
 * Cleanup sounds when app closes
 */
export async function unloadSounds(): Promise<void> {
  await Promise.all(
    Object.values(soundObjects).map(async (sound) => {
      if (sound) {
        await sound.unloadAsync();
      }
    })
  );
}

/**
 * Hook for playing whoosh sound on slide transitions
 */
export const useSlideTransitionSound = createSlideTransitionSoundHook(playSound);
