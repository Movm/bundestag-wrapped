/**
 * Shared SVG Path Definitions for Decorative Elements
 *
 * These path definitions are shared between web (Motion) and mobile (Reanimated).
 * Each decoration type has its geometry defined here, with animations handled
 * by the platform-specific components.
 */

import type { ThemeColors } from '../theme-backgrounds/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DecorationProps {
  colors: ThemeColors;
  delay?: number;
  animate?: boolean;
  side: 'left' | 'right';
  /** Scale multiplier for larger decorations (default: 1) */
  scale?: number;
}

export interface CircleConfig {
  cx: number;
  cy: number;
  r: number;
}

export interface BarConfig {
  x: number;
  height: number;
  width?: number;
}

export interface SparkleConfig {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Viewbox Dimensions
// ─────────────────────────────────────────────────────────────────────────────

export const DECORATION_VIEWBOX = {
  ribbon: { width: 120, height: 220 },
  wave: { width: 140, height: 160 },
  bars: { width: 100, height: 160 },
  lightning: { width: 100, height: 180 },
  pulse: { width: 160, height: 160 },
  orbs: { width: 120, height: 160 },
  sparkle: { width: 120, height: 160 },
  gradient: { width: 100, height: 160 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Path Definitions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ribbon: Flowing S-curve for tone section
 * Creates a smooth, ribbon-like decorative element
 */
export const RIBBON_PATH = `
  M90,210
  C 70,180 30,160 45,130
  C 60,100 95,90 85,60
  C 75,30 35,25 55,10
  C 75,-5 100,20 90,50
  C 80,80 45,85 55,115
  C 65,145 100,155 90,180
  C 80,200 60,215 45,220
`;

/**
 * Wave: Horizontal flowing sine waves for vocabulary/moin sections
 * Multiple paths stacked vertically
 */
export const WAVE_PATHS = [
  'M0,40 Q35,15 70,40 T140,40',
  'M0,80 Q35,55 70,80 T140,80',
  'M0,120 Q35,95 70,120 T140,120',
];

/**
 * Bars: Vertical equalizer bars for speeches section
 */
export const BAR_CONFIGS: BarConfig[] = [
  { x: 10, height: 100, width: 16 },
  { x: 32, height: 140, width: 16 },
  { x: 54, height: 70, width: 16 },
  { x: 76, height: 110, width: 16 },
];

/**
 * Lightning: Angular zigzag path for drama section
 * Sharp angles representing intensity and conflict
 */
export const LIGHTNING_PATH = `
  M55,10
  L40,55
  L65,60
  L30,110
  L55,115
  L15,170
`;

/**
 * Pulse: Concentric circle radii for topics section
 */
export const PULSE_CIRCLES: CircleConfig[] = [
  { cx: 80, cy: 80, r: 30 },
  { cx: 80, cy: 80, r: 50 },
  { cx: 80, cy: 80, r: 70 },
];

/**
 * Orbs: Overlapping circles for common-words section
 * Soft, bubble-like shapes
 */
export const ORB_CIRCLES: CircleConfig[] = [
  { cx: 50, cy: 40, r: 28 },
  { cx: 80, cy: 75, r: 24 },
  { cx: 45, cy: 110, r: 20 },
];

/**
 * Sparkle: Four-point star path for swiftie section
 * Diamond-like star shape
 */
export const SPARKLE_PATH = `
  M12,0
  L15,9
  L24,12
  L15,15
  L12,24
  L9,15
  L0,12
  L9,9
  Z
`;

/**
 * Sparkle positions within the viewbox
 */
export const SPARKLE_POSITIONS: SparkleConfig[] = [
  { x: 20, y: 25, scale: 1.2, rotation: 10 },
  { x: 70, y: 50, scale: 0.8, rotation: -15 },
  { x: 35, y: 90, scale: 1.0, rotation: 5 },
  { x: 85, y: 120, scale: 0.6, rotation: 20 },
];

/**
 * Gradient lines: Subtle horizontal lines for discriminatory section
 * Minimal, muted decoration
 */
export const GRADIENT_LINES = [
  { y: 50, width: 80, opacity: 0.4 },
  { y: 80, width: 60, opacity: 0.3 },
  { y: 110, width: 70, opacity: 0.25 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Animation Timing Constants
// ─────────────────────────────────────────────────────────────────────────────

export const DECORATION_TIMINGS = {
  /** Standard path draw duration */
  drawDuration: 1.2,
  /** Stagger delay between elements */
  staggerDelay: 0.12,
  /** Fade-in duration */
  fadeInDuration: 0.3,
  /** Easing for path animations */
  drawEasing: [0.65, 0, 0.35, 1] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Convert RGB string to hex for SVG gradients
// ─────────────────────────────────────────────────────────────────────────────

export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim(), 10));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Create gradient stops from theme colors
 */
export function createGradientStops(colors: ThemeColors): { offset: string; color: string }[] {
  return [
    { offset: '0%', color: rgbToHex(colors.glow) },
    { offset: '50%', color: rgbToHex(colors.primary) },
    { offset: '100%', color: rgbToHex(colors.secondary) },
  ];
}
