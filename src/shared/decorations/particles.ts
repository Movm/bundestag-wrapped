/**
 * Abstract Particle Configurations
 *
 * CSS-animated abstract particles for immersive intro slides.
 * Each theme has unique particle shapes and animation patterns.
 *
 * Performance-focused:
 * - Uses CSS keyframes for continuous animations (no JS overhead)
 * - GPU-accelerated transforms only (translate3d, scale, rotate)
 * - Max 8-12 particles per slide
 * - will-change: transform for compositor optimization
 */

import type { BackgroundTheme } from '@/shared/theme-backgrounds/types';

export type ParticleShape = 'circle' | 'diamond' | 'square' | 'dot' | 'ring' | 'droplet';

export interface ParticleConfig {
  /** Shape of the particle */
  shape: ParticleShape;
  /** Size in pixels (width/height) */
  size: number;
  /** Initial X position as percentage of viewport (0-100) */
  x: number;
  /** Initial Y position as percentage of viewport (0-100) */
  y: number;
  /** Animation type */
  animation: 'rise' | 'fall' | 'float' | 'pulse' | 'drift' | 'ripple';
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds */
  delay: number;
  /** Opacity (0-1) */
  opacity: number;
}

export interface ThemeParticles {
  /** Particle definitions */
  particles: ParticleConfig[];
  /** Whether to show particles (false for serious topics) */
  enabled: boolean;
}

/**
 * Particle configurations for each theme.
 * Abstract shapes only - no text or words.
 */
export const THEME_PARTICLES: Record<BackgroundTheme, ThemeParticles> = {
  // Welcome celebration - gentle floating circles
  intro: {
    enabled: true,
    particles: [
      { shape: 'circle', size: 8, x: 15, y: 20, animation: 'float', duration: 4, delay: 0, opacity: 0.4 },
      { shape: 'circle', size: 6, x: 80, y: 30, animation: 'float', duration: 5, delay: 0.5, opacity: 0.3 },
      { shape: 'dot', size: 4, x: 25, y: 70, animation: 'rise', duration: 6, delay: 1, opacity: 0.5 },
      { shape: 'circle', size: 10, x: 85, y: 65, animation: 'float', duration: 4.5, delay: 0.3, opacity: 0.35 },
      { shape: 'dot', size: 5, x: 10, y: 50, animation: 'rise', duration: 5.5, delay: 0.8, opacity: 0.4 },
      { shape: 'circle', size: 7, x: 90, y: 80, animation: 'float', duration: 5, delay: 1.2, opacity: 0.3 },
    ],
  },

  // Data visualization - small circles rising (data points)
  topics: {
    enabled: true,
    particles: [
      { shape: 'circle', size: 6, x: 12, y: 85, animation: 'rise', duration: 5, delay: 0, opacity: 0.5 },
      { shape: 'dot', size: 4, x: 20, y: 90, animation: 'rise', duration: 6, delay: 0.5, opacity: 0.4 },
      { shape: 'circle', size: 5, x: 85, y: 88, animation: 'rise', duration: 5.5, delay: 0.3, opacity: 0.45 },
      { shape: 'dot', size: 3, x: 78, y: 92, animation: 'rise', duration: 6.5, delay: 0.8, opacity: 0.35 },
      { shape: 'circle', size: 4, x: 92, y: 80, animation: 'rise', duration: 5, delay: 1, opacity: 0.5 },
      { shape: 'dot', size: 5, x: 8, y: 75, animation: 'rise', duration: 5.5, delay: 1.2, opacity: 0.4 },
      { shape: 'circle', size: 3, x: 15, y: 60, animation: 'rise', duration: 6, delay: 1.5, opacity: 0.35 },
      { shape: 'dot', size: 4, x: 88, y: 70, animation: 'rise', duration: 5, delay: 1.8, opacity: 0.45 },
    ],
  },

  // Sound waves - wave ripple dots
  vocabulary: {
    enabled: true,
    particles: [
      { shape: 'ring', size: 12, x: 50, y: 50, animation: 'ripple', duration: 3, delay: 0, opacity: 0.3 },
      { shape: 'ring', size: 20, x: 50, y: 50, animation: 'ripple', duration: 3, delay: 0.5, opacity: 0.25 },
      { shape: 'ring', size: 28, x: 50, y: 50, animation: 'ripple', duration: 3, delay: 1, opacity: 0.2 },
      { shape: 'dot', size: 4, x: 15, y: 35, animation: 'float', duration: 4, delay: 0.3, opacity: 0.4 },
      { shape: 'dot', size: 3, x: 85, y: 40, animation: 'float', duration: 4.5, delay: 0.6, opacity: 0.35 },
      { shape: 'dot', size: 5, x: 20, y: 65, animation: 'float', duration: 4, delay: 0.9, opacity: 0.4 },
      { shape: 'dot', size: 4, x: 80, y: 60, animation: 'float', duration: 4.5, delay: 1.2, opacity: 0.35 },
    ],
  },

  // Audio visualizer - concentric ripples from center
  speeches: {
    enabled: true,
    particles: [
      { shape: 'ring', size: 16, x: 50, y: 50, animation: 'ripple', duration: 2.5, delay: 0, opacity: 0.35 },
      { shape: 'ring', size: 24, x: 50, y: 50, animation: 'ripple', duration: 2.5, delay: 0.4, opacity: 0.3 },
      { shape: 'ring', size: 32, x: 50, y: 50, animation: 'ripple', duration: 2.5, delay: 0.8, opacity: 0.25 },
      { shape: 'ring', size: 40, x: 50, y: 50, animation: 'ripple', duration: 2.5, delay: 1.2, opacity: 0.2 },
      { shape: 'circle', size: 5, x: 25, y: 30, animation: 'pulse', duration: 2, delay: 0.2, opacity: 0.4 },
      { shape: 'circle', size: 4, x: 75, y: 35, animation: 'pulse', duration: 2, delay: 0.5, opacity: 0.35 },
      { shape: 'circle', size: 6, x: 20, y: 70, animation: 'pulse', duration: 2, delay: 0.8, opacity: 0.4 },
      { shape: 'circle', size: 5, x: 80, y: 65, animation: 'pulse', duration: 2, delay: 1.1, opacity: 0.35 },
    ],
  },

  // Intensity - electric spark dots
  drama: {
    enabled: true,
    particles: [
      { shape: 'diamond', size: 6, x: 15, y: 25, animation: 'pulse', duration: 0.8, delay: 0, opacity: 0.6 },
      { shape: 'diamond', size: 4, x: 85, y: 30, animation: 'pulse', duration: 0.6, delay: 0.2, opacity: 0.5 },
      { shape: 'diamond', size: 5, x: 20, y: 70, animation: 'pulse', duration: 0.7, delay: 0.4, opacity: 0.55 },
      { shape: 'diamond', size: 7, x: 80, y: 65, animation: 'pulse', duration: 0.9, delay: 0.6, opacity: 0.6 },
      { shape: 'dot', size: 3, x: 25, y: 45, animation: 'pulse', duration: 0.5, delay: 0.1, opacity: 0.7 },
      { shape: 'dot', size: 4, x: 75, y: 50, animation: 'pulse', duration: 0.6, delay: 0.3, opacity: 0.65 },
      { shape: 'diamond', size: 5, x: 10, y: 55, animation: 'pulse', duration: 0.7, delay: 0.5, opacity: 0.5 },
      { shape: 'diamond', size: 4, x: 90, y: 45, animation: 'pulse', duration: 0.8, delay: 0.7, opacity: 0.55 },
    ],
  },

  // Serious topic - NO particles (respect the tone)
  discriminatory: {
    enabled: false,
    particles: [],
  },

  // Grounded - tiny circles rising slowly
  'common-words': {
    enabled: true,
    particles: [
      { shape: 'circle', size: 5, x: 12, y: 80, animation: 'rise', duration: 7, delay: 0, opacity: 0.4 },
      { shape: 'circle', size: 4, x: 88, y: 85, animation: 'rise', duration: 8, delay: 0.5, opacity: 0.35 },
      { shape: 'dot', size: 3, x: 18, y: 90, animation: 'rise', duration: 7.5, delay: 1, opacity: 0.45 },
      { shape: 'dot', size: 4, x: 82, y: 75, animation: 'rise', duration: 6.5, delay: 1.5, opacity: 0.4 },
      { shape: 'circle', size: 3, x: 25, y: 70, animation: 'rise', duration: 8, delay: 2, opacity: 0.35 },
      { shape: 'circle', size: 5, x: 75, y: 88, animation: 'rise', duration: 7, delay: 2.5, opacity: 0.4 },
    ],
  },

  // Coastal - small droplets
  moin: {
    enabled: true,
    particles: [
      { shape: 'droplet', size: 6, x: 10, y: 20, animation: 'fall', duration: 4, delay: 0, opacity: 0.45 },
      { shape: 'droplet', size: 5, x: 90, y: 15, animation: 'fall', duration: 4.5, delay: 0.5, opacity: 0.4 },
      { shape: 'droplet', size: 4, x: 15, y: 10, animation: 'fall', duration: 5, delay: 1, opacity: 0.5 },
      { shape: 'droplet', size: 6, x: 85, y: 25, animation: 'fall', duration: 4, delay: 1.5, opacity: 0.45 },
      { shape: 'circle', size: 3, x: 20, y: 80, animation: 'float', duration: 5, delay: 0.3, opacity: 0.35 },
      { shape: 'circle', size: 4, x: 80, y: 75, animation: 'float', duration: 5.5, delay: 0.8, opacity: 0.3 },
    ],
  },

  // Pop energy - diamond shapes raining
  swiftie: {
    enabled: true,
    particles: [
      { shape: 'diamond', size: 8, x: 15, y: 10, animation: 'fall', duration: 3, delay: 0, opacity: 0.5 },
      { shape: 'diamond', size: 6, x: 85, y: 5, animation: 'fall', duration: 3.5, delay: 0.3, opacity: 0.45 },
      { shape: 'diamond', size: 7, x: 25, y: 15, animation: 'fall', duration: 4, delay: 0.6, opacity: 0.5 },
      { shape: 'diamond', size: 5, x: 75, y: 8, animation: 'fall', duration: 3, delay: 0.9, opacity: 0.45 },
      { shape: 'diamond', size: 9, x: 10, y: 20, animation: 'fall', duration: 3.5, delay: 1.2, opacity: 0.55 },
      { shape: 'diamond', size: 6, x: 90, y: 12, animation: 'fall', duration: 4, delay: 1.5, opacity: 0.5 },
      { shape: 'dot', size: 4, x: 30, y: 5, animation: 'fall', duration: 3, delay: 1.8, opacity: 0.4 },
      { shape: 'dot', size: 3, x: 70, y: 10, animation: 'fall', duration: 3.5, delay: 2.1, opacity: 0.35 },
    ],
  },

  // Flowing - curved line segments (small circles drifting)
  tone: {
    enabled: true,
    particles: [
      { shape: 'circle', size: 6, x: 10, y: 30, animation: 'drift', duration: 6, delay: 0, opacity: 0.4 },
      { shape: 'circle', size: 5, x: 90, y: 40, animation: 'drift', duration: 7, delay: 0.5, opacity: 0.35 },
      { shape: 'circle', size: 7, x: 15, y: 60, animation: 'drift', duration: 5.5, delay: 1, opacity: 0.45 },
      { shape: 'circle', size: 4, x: 85, y: 70, animation: 'drift', duration: 6.5, delay: 1.5, opacity: 0.4 },
      { shape: 'dot', size: 3, x: 20, y: 45, animation: 'drift', duration: 5, delay: 0.3, opacity: 0.35 },
      { shape: 'dot', size: 4, x: 80, y: 55, animation: 'drift', duration: 6, delay: 0.8, opacity: 0.4 },
    ],
  },

  // Structured - small squares
  gender: {
    enabled: true,
    particles: [
      { shape: 'square', size: 6, x: 12, y: 25, animation: 'float', duration: 5, delay: 0, opacity: 0.4 },
      { shape: 'square', size: 5, x: 88, y: 30, animation: 'float', duration: 5.5, delay: 0.4, opacity: 0.35 },
      { shape: 'square', size: 4, x: 15, y: 70, animation: 'float', duration: 6, delay: 0.8, opacity: 0.45 },
      { shape: 'square', size: 6, x: 85, y: 65, animation: 'float', duration: 5, delay: 1.2, opacity: 0.4 },
      { shape: 'dot', size: 3, x: 20, y: 45, animation: 'float', duration: 5.5, delay: 0.2, opacity: 0.35 },
      { shape: 'dot', size: 4, x: 80, y: 50, animation: 'float', duration: 5, delay: 0.6, opacity: 0.4 },
    ],
  },

  // Celebration - floating circles with pulse
  finale: {
    enabled: true,
    particles: [
      { shape: 'circle', size: 10, x: 15, y: 25, animation: 'pulse', duration: 2, delay: 0, opacity: 0.5 },
      { shape: 'circle', size: 8, x: 85, y: 30, animation: 'pulse', duration: 2.5, delay: 0.3, opacity: 0.45 },
      { shape: 'diamond', size: 7, x: 20, y: 65, animation: 'pulse', duration: 2, delay: 0.6, opacity: 0.5 },
      { shape: 'diamond', size: 9, x: 80, y: 70, animation: 'pulse', duration: 2.5, delay: 0.9, opacity: 0.45 },
      { shape: 'circle', size: 6, x: 10, y: 50, animation: 'float', duration: 4, delay: 0.2, opacity: 0.4 },
      { shape: 'circle', size: 7, x: 90, y: 45, animation: 'float', duration: 4.5, delay: 0.5, opacity: 0.35 },
      { shape: 'dot', size: 4, x: 25, y: 35, animation: 'rise', duration: 5, delay: 1, opacity: 0.4 },
      { shape: 'dot', size: 5, x: 75, y: 80, animation: 'rise', duration: 5.5, delay: 1.3, opacity: 0.35 },
    ],
  },
};

/**
 * Get particle configuration for a theme.
 */
export function getThemeParticles(theme: BackgroundTheme): ThemeParticles {
  return THEME_PARTICLES[theme];
}
