/**
 * Theme Music Manager for Bundestag Wrapped (Mobile/Expo)
 *
 * Mobile-specific implementation using expo-av.
 * Uses shared types from @/shared/theme-music.
 *
 * Features:
 * - Crossfade between themes using expo-av
 * - Continuous looping within sections
 * - Respects mute state from AsyncStorage
 * - Preloads tracks for smooth playback
 */

import React from 'react';
import { Audio } from 'expo-av';
import {
  type ThemeType,
  THEME_TRACK_INFO,
  THEME_VOLUME,
  CROSSFADE_DURATION,
  getThemeForSlide,
} from '@/shared/theme-music';
import { isMutedSync } from '~/lib/sounds';

// Re-export shared types and functions
export { type ThemeType, THEME_TRACK_INFO, getThemeForSlide } from '@/shared/theme-music';

// Sound file requires - must use require() for Metro bundling
const THEME_FILES: Partial<Record<ThemeType, ReturnType<typeof require>>> = {
  night: require('../../public/sounds/Broke For Free - Night Owl.mp3'),
  mutant: require('../../public/sounds/HoliznaCC0 - Mutant Club.mp3'),
  starling: require('../../public/sounds/Podington Bear - Starling.mp3'),
  industrial: require('../../public/sounds/IKILLYA - Godsize.mp3'),
  spacey: require('../../public/sounds/Chromix - I Know You\'re Out There.mp3'),
  playful: require('../../public/sounds/Kidkanevil & DZA - Nuff Stickers.mp3'),
  chiptune: require('../../public/sounds/Kevin MacLeod - Hyperfun.mp3'),
  loveice: require('../../public/sounds/Lopkerjo - Love Others ICE.mp3'),
  popular: require('../../public/sounds/sarah rasines - canción popular.mp3'),
  reverse: require('../../public/sounds/Broke For Free - Living In Reverse.mp3'),
  reflections: require('../../public/sounds/jonas the plugexpert - APC - reflections - gobot rmx.mp3'),
  hustle: require('../../public/sounds/Kevin MacLeod - Hustle.mp3'),
  rhodes: require('../../public/sounds/Kevin MacLeod - Dirt Rhodes.mp3'),
};

const FADE_STEPS = 20;
const STEP_DURATION = CROSSFADE_DURATION / FADE_STEPS;

/**
 * Theme Music Manager class for mobile
 */
class ThemeMusicManager {
  private currentTheme: ThemeType | null = null;
  private soundObjects: Map<ThemeType, Audio.Sound> = new Map();
  private isInitialized = false;
  private isTransitioning = false;
  private fadeTimeouts: ReturnType<typeof setTimeout>[] = [];

  /**
   * Initialize and preload theme tracks
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Preload all theme sounds
      await Promise.all(
        (Object.keys(THEME_FILES) as ThemeType[]).map(async (theme) => {
          const file = THEME_FILES[theme];
          if (!file) return;

          try {
            const { sound } = await Audio.Sound.createAsync(file, {
              shouldPlay: false,
              isLooping: true,
              volume: 0,
            });
            this.soundObjects.set(theme, sound);
          } catch (error) {
            console.warn(`Failed to load theme ${theme}:`, error);
          }
        })
      );

      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize theme music:', error);
    }
  }

  /**
   * Play a theme (crossfade from current if different)
   */
  async playTheme(theme: ThemeType): Promise<void> {
    if (isMutedSync()) return;

    // Initialize on first play if needed
    if (!this.isInitialized) {
      await this.init();
    }

    // Skip if already playing this theme
    if (theme === this.currentTheme) return;

    // If already transitioning, force stop everything first
    if (this.isTransitioning) {
      await this.forceStopAll();
    }

    this.isTransitioning = true;
    await this.crossfadeTo(theme);
  }

  /**
   * Force stop all audio immediately
   */
  private async forceStopAll(): Promise<void> {
    // Clear all pending fade timeouts
    this.fadeTimeouts.forEach(clearTimeout);
    this.fadeTimeouts = [];

    // Stop all sounds
    await Promise.all(
      Array.from(this.soundObjects.values()).map(async (sound) => {
        try {
          await sound.stopAsync();
          await sound.setVolumeAsync(0);
          await sound.setPositionAsync(0);
        } catch {
          // Ignore errors
        }
      })
    );
  }

  /**
   * Crossfade from current theme to new theme
   */
  private async crossfadeTo(newTheme: ThemeType): Promise<void> {
    const oldTheme = this.currentTheme;
    const newSound = this.soundObjects.get(newTheme);

    if (!newSound) {
      this.isTransitioning = false;
      return;
    }

    // Set current theme first to prevent race conditions
    this.currentTheme = newTheme;

    // Stop all sounds except old and new
    await Promise.all(
      Array.from(this.soundObjects.entries()).map(async ([theme, sound]) => {
        if (theme !== newTheme && theme !== oldTheme) {
          try {
            await sound.stopAsync();
            await sound.setVolumeAsync(0);
          } catch {
            // Ignore errors
          }
        }
      })
    );

    // Fade out old theme
    if (oldTheme && oldTheme !== newTheme) {
      this.fadeOut(oldTheme);
    }

    // Start new theme and fade in
    try {
      await newSound.setVolumeAsync(0);
      await newSound.setPositionAsync(0);
      await newSound.playAsync();
      this.fadeIn(newTheme);
    } catch (error) {
      console.debug('Theme music failed to start:', error);
      this.isTransitioning = false;
    }
  }

  /**
   * Fade in a theme to target volume
   */
  private fadeIn(theme: ThemeType): void {
    const sound = this.soundObjects.get(theme);
    if (!sound) return;

    let currentStep = 0;
    const volumeStep = THEME_VOLUME / FADE_STEPS;

    const fade = () => {
      currentStep++;
      const newVolume = Math.min(volumeStep * currentStep, THEME_VOLUME);

      sound.setVolumeAsync(newVolume).catch(() => {});

      if (currentStep >= FADE_STEPS) {
        // Fade complete - ensure only this theme is playing
        this.stopAllExcept(theme);
        this.isTransitioning = false;
      } else {
        const timeout = setTimeout(fade, STEP_DURATION);
        this.fadeTimeouts.push(timeout);
      }
    };

    const timeout = setTimeout(fade, STEP_DURATION);
    this.fadeTimeouts.push(timeout);
  }

  /**
   * Fade out a theme to silence
   */
  private fadeOut(theme: ThemeType): void {
    const sound = this.soundObjects.get(theme);
    if (!sound) return;

    let currentStep = 0;
    const startVolume = THEME_VOLUME;
    const volumeStep = startVolume / FADE_STEPS;

    const fade = () => {
      currentStep++;
      const newVolume = Math.max(startVolume - volumeStep * currentStep, 0);

      sound.setVolumeAsync(newVolume).catch(() => {});

      if (currentStep >= FADE_STEPS) {
        sound.stopAsync().catch(() => {});
        sound.setPositionAsync(0).catch(() => {});
      } else {
        const timeout = setTimeout(fade, STEP_DURATION);
        this.fadeTimeouts.push(timeout);
      }
    };

    const timeout = setTimeout(fade, STEP_DURATION);
    this.fadeTimeouts.push(timeout);
  }

  /**
   * Stop all tracks except the specified one
   */
  private async stopAllExcept(theme: ThemeType): Promise<void> {
    await Promise.all(
      Array.from(this.soundObjects.entries()).map(async ([t, sound]) => {
        if (t !== theme) {
          try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
              await sound.stopAsync();
              await sound.setVolumeAsync(0);
            }
          } catch {
            // Ignore errors
          }
        }
      })
    );
  }

  /**
   * Pause current theme
   */
  async pause(): Promise<void> {
    if (this.currentTheme) {
      const sound = this.soundObjects.get(this.currentTheme);
      if (sound) {
        try {
          await sound.pauseAsync();
        } catch {
          // Ignore errors
        }
      }
    }
  }

  /**
   * Resume current theme
   */
  async resume(): Promise<void> {
    if (isMutedSync()) return;

    if (this.currentTheme) {
      const sound = this.soundObjects.get(this.currentTheme);
      if (sound) {
        try {
          await sound.setVolumeAsync(THEME_VOLUME);
          await sound.playAsync();
        } catch {
          // Ignore errors
        }
      }
    }
  }

  /**
   * Stop all themes
   */
  async stop(): Promise<void> {
    this.fadeTimeouts.forEach(clearTimeout);
    this.fadeTimeouts = [];

    await Promise.all(
      Array.from(this.soundObjects.values()).map(async (sound) => {
        try {
          await sound.stopAsync();
          await sound.setVolumeAsync(0);
          await sound.setPositionAsync(0);
        } catch {
          // Ignore errors
        }
      })
    );

    this.currentTheme = null;
  }

  /**
   * Get current playing theme
   */
  getCurrentTheme(): ThemeType | null {
    return this.currentTheme;
  }

  /**
   * Cleanup sounds
   */
  async unload(): Promise<void> {
    await this.stop();

    await Promise.all(
      Array.from(this.soundObjects.values()).map(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch {
          // Ignore errors
        }
      })
    );

    this.soundObjects.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const themeMusic = new ThemeMusicManager();

/**
 * Hook for using theme music with slide changes
 *
 * Uses useEffect to trigger music on slide transitions.
 * Handles cleanup when component unmounts.
 */
export function useThemeMusic(currentSlide: string | null): void {
  React.useEffect(() => {
    if (!currentSlide) return;

    const theme = getThemeForSlide(currentSlide);
    themeMusic.playTheme(theme);
  }, [currentSlide]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      themeMusic.stop();
    };
  }, []);
}
