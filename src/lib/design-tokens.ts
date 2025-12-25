/**
 * Design Tokens - Centralized UI patterns and effects
 *
 * Use these constants for consistent styling across components.
 * Colors are defined in index.css @theme, these are Tailwind class compositions.
 */

export const GRADIENTS = {
  /** Main brand gradient (purple to pink) */
  brand: 'from-brand-primary via-brand-secondary to-brand-primary',

  /** Standard page/slide background */
  background: 'from-bg-primary to-bg-secondary',

  /** CTA button gradient */
  cta: 'from-brand-primary via-brand-secondary to-brand-primary',

  /** Subtle hover state */
  hover: 'from-brand-primary/20 to-brand-secondary/20',
} as const;

export const EFFECTS = {
  /** Glassmorphism panel */
  glass: 'backdrop-blur-lg bg-white/5 border border-white/10',

  /** Card with elevated background */
  card: 'bg-bg-card rounded-2xl border border-white/10',

  /** Glow shadow using brand color */
  glow: 'shadow-lg shadow-brand-primary/20',

  /** Pulsing glow animation base */
  pulseGlow: 'animate-pulse shadow-xl shadow-brand-primary/30',
} as const;

export const TEXT = {
  /** Primary heading text */
  heading: 'text-text-primary font-bold',

  /** Secondary/supporting text */
  secondary: 'text-text-secondary',

  /** Muted/subtle text */
  muted: 'text-text-muted',
} as const;

/**
 * Hex values for canvas/non-CSS contexts
 * Keep in sync with index.css @theme
 */
export const BRAND_COLORS = {
  primary: '#db2777',
  secondary: '#ec4899',
  light: '#f472b6',
  gradientStart: '#be185d',
  gradientMid: '#db2777',
  gradientEnd: '#f472b6',
} as const;

/**
 * Schwarz-Rot-Gold (German Flag colors)
 */
export const FLAG_COLORS = {
  schwarz: '#000000',
  rot: '#DD0000',
  gold: '#FFCC00',
} as const;

export const BG_COLORS = {
  primary: '#0a0a0f',
  secondary: '#12121a',
  card: '#1a1a24',
  elevated: '#242430',
} as const;
