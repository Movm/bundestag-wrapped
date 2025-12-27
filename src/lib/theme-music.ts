/**
 * Theme Music Manager for Bundestag Wrapped (Web)
 *
 * Web-specific implementation using browser Audio API.
 * Uses shared types from @/shared/theme-music.
 *
 * Sound Files Inventory (public/sounds/):
 * USED:
 * - Broke For Free - Night Owl.mp3 (intro)
 * - Chromix - I Know You're Out There.mp3 (discriminatory)
 * - HoliznaCC0 - Mutant Club.mp3 (topics)
 * - IKILLYA - Godsize.mp3 (drama)
 * - jonas the plugexpert - APC - reflections - gobot rmx.mp3 (vocabulary, signature)
 * - Kevin MacLeod - Hyperfun.mp3 (swiftie)
 * - Kevin MacLeod - Hustle.mp3 (speeches, speakers, share)
 * - Kevin MacLeod - Dirt Rhodes.mp3 (common-words)
 * - Kidkanevil & DZA - Nuff Stickers.mp3 (gender)
 * - Lopkerjo - Love Others ICE.mp3 (tone)
 * - Podington Bear - Starling.mp3 (finale)
 * - sarah rasines - canción popular.mp3 (moin)
 *
 * UNUSED (kept for future use):
 * - Broke For Free - Living In Reverse.mp3
 * - Kevin MacLeod - The Cannery.mp3
 * - Kevin MacLeod - On the Ground.mp3
 * - Kevin MacLeod - Wagon Wheel Electronic.mp3
 * - OpVious - Wake Up.mp3
 * - The Professional Savage - White Youth Worker.mp3
 * - Tours - Enthusiast.mp3
 */

import type { SlideType } from '@/components/main-wrapped/constants';
import { isMuted } from '@/lib/sounds';
import {
  type ThemeType,
  THEME_PATHS,
  THEME_VOLUME,
  CROSSFADE_DURATION,
  getThemeForSlide as getThemeForSlideShared,
} from '@/shared/theme-music';

// Re-export shared types and constants for backwards compatibility
export { type ThemeType, THEME_TRACK_INFO } from '@/shared/theme-music';

const FADE_STEPS = 20; // Smooth fade with 20 steps

/**
 * Get the theme type for a given slide
 */
export function getThemeForSlide(slideId: SlideType): ThemeType {
  return getThemeForSlideShared(slideId);
}

/**
 * Theme Music Manager class
 * Singleton that handles crossfading between section themes
 */
class ThemeMusicManager {
  private currentTheme: ThemeType | null = null;
  private audioElements: Map<ThemeType, HTMLAudioElement> = new Map();
  private isInitialized = false;
  private fadeIntervals: Map<ThemeType, number> = new Map();
  private isTransitioning = false;

  /**
   * Initialize and preload all theme tracks
   * Call on first user interaction to comply with autoplay policies
   */
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    Object.entries(THEME_PATHS).forEach(([theme, path]) => {
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = 0; // Start silent
      audio.preload = 'auto';
      audio.load();
      this.audioElements.set(theme as ThemeType, audio);
    });

    this.isInitialized = true;
  }

  /**
   * Play a theme (crossfade from current if different)
   */
  playTheme(theme: ThemeType): void {
    if (typeof window === 'undefined') return;
    if (isMuted()) return;

    // Initialize on first play if needed
    if (!this.isInitialized) {
      this.init();
    }

    // Skip if already playing this theme
    if (theme === this.currentTheme) return;

    // If already transitioning (rapid scroll), force stop everything first
    if (this.isTransitioning) {
      this.forceStopAll();
    }

    this.isTransitioning = true;
    this.crossfadeTo(theme);
  }

  /**
   * Force stop all audio immediately (for rapid scrolling)
   */
  private forceStopAll(): void {
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    });
  }

  /**
   * Crossfade from current theme to new theme
   */
  private crossfadeTo(newTheme: ThemeType): void {
    const oldTheme = this.currentTheme;
    const newAudio = this.audioElements.get(newTheme);

    if (!newAudio) return;

    // FIRST: Set currentTheme to prevent race conditions
    this.currentTheme = newTheme;

    // Stop ALL tracks except the new one and the one we're fading out
    this.audioElements.forEach((audio, theme) => {
      if (theme !== newTheme && theme !== oldTheme) {
        const fade = this.fadeIntervals.get(theme);
        if (fade) clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    });

    // Clear any existing fade for the new theme
    const existingFade = this.fadeIntervals.get(newTheme);
    if (existingFade) {
      clearInterval(existingFade);
    }

    // Fade out old theme if playing
    if (oldTheme && oldTheme !== newTheme) {
      this.fadeOut(oldTheme);
    }

    // Start new theme at 0 volume and fade in
    newAudio.volume = 0;
    newAudio.currentTime = 0;

    const playPromise = newAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.fadeIn(newTheme);
        })
        .catch((error) => {
          console.debug('Theme music failed to start:', error.message);
        });
    }
  }

  /**
   * Fade in a theme to target volume
   */
  private fadeIn(theme: ThemeType): void {
    const audio = this.audioElements.get(theme);
    if (!audio) return;

    const stepDuration = CROSSFADE_DURATION / FADE_STEPS;
    const volumeStep = THEME_VOLUME / FADE_STEPS;
    let currentStep = 0;

    const interval = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, THEME_VOLUME);

      if (currentStep >= FADE_STEPS) {
        clearInterval(interval);
        this.fadeIntervals.delete(theme);

        // SAFETY: After fade completes, ensure no other tracks are playing
        this.stopAllExcept(theme);

        // Clear transitioning flag
        this.isTransitioning = false;
      }
    }, stepDuration);

    this.fadeIntervals.set(theme, interval);
  }

  /**
   * Stop all tracks except the specified one (safety mechanism)
   */
  private stopAllExcept(theme: ThemeType): void {
    this.audioElements.forEach((audio, t) => {
      if (t !== theme && !audio.paused) {
        const fade = this.fadeIntervals.get(t);
        if (fade) clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    });
  }

  /**
   * Fade out a theme to silence and pause
   */
  private fadeOut(theme: ThemeType): void {
    const audio = this.audioElements.get(theme);
    if (!audio) return;

    // Clear any existing fade for this theme
    const existingFade = this.fadeIntervals.get(theme);
    if (existingFade) {
      clearInterval(existingFade);
    }

    const stepDuration = CROSSFADE_DURATION / FADE_STEPS;
    const startVolume = audio.volume;
    const volumeStep = startVolume / FADE_STEPS;
    let currentStep = 0;

    const interval = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

      if (currentStep >= FADE_STEPS) {
        clearInterval(interval);
        this.fadeIntervals.delete(theme);
        audio.pause();
        audio.currentTime = 0;
      }
    }, stepDuration);

    this.fadeIntervals.set(theme, interval);
  }

  /**
   * Pause current theme (preserves position)
   */
  pause(): void {
    if (this.currentTheme) {
      const audio = this.audioElements.get(this.currentTheme);
      if (audio) {
        audio.pause();
      }
    }
  }

  /**
   * Resume current theme
   */
  resume(): void {
    if (isMuted()) return;

    if (this.currentTheme) {
      const audio = this.audioElements.get(this.currentTheme);
      if (audio) {
        audio.volume = THEME_VOLUME;
        audio.play().catch((error) => {
          console.debug('Theme resume failed:', error.message);
        });
      }
    }
  }

  /**
   * Stop all themes (for finale or mute)
   */
  stop(): void {
    this.audioElements.forEach((audio, theme) => {
      const fade = this.fadeIntervals.get(theme);
      if (fade) clearInterval(fade);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    });
    this.fadeIntervals.clear();
    this.currentTheme = null;
  }

  /**
   * Get current playing theme
   */
  getCurrentTheme(): ThemeType | null {
    return this.currentTheme;
  }

  /**
   * Check if a theme is currently playing
   */
  isPlaying(): boolean {
    if (!this.currentTheme) return false;
    const audio = this.audioElements.get(this.currentTheme);
    return audio ? !audio.paused : false;
  }
}

// Export singleton instance
export const themeMusic = new ThemeMusicManager();

/**
 * React hook for using theme music with slide changes
 */
export function useThemeMusic(currentSlide: SlideType | null): void {
  if (typeof window === 'undefined') return;

  // Only run on slide changes
  if (!currentSlide) return;

  const theme = getThemeForSlide(currentSlide);
  themeMusic.playTheme(theme);
}
