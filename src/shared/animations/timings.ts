/**
 * Shared Animation Timings
 *
 * Platform-agnostic animation configuration values.
 * - Web: Consumed by Motion (Framer Motion)
 * - Mobile: Consumed by React Native Reanimated
 *
 * All timing values are in milliseconds for consistency.
 * Spring configs use standard physics properties (stiffness, damping, mass).
 */

// ─────────────────────────────────────────────────────────────
// Duration Constants (in milliseconds)
// ─────────────────────────────────────────────────────────────

export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  float: 8000, // For continuous floating animations
} as const;

// ─────────────────────────────────────────────────────────────
// Spring Configurations
// ─────────────────────────────────────────────────────────────

export const SPRING = {
  /** Default spring - balanced feel */
  default: {
    stiffness: 100,
    damping: 15,
    mass: 1,
  },

  /** Bouncy spring - playful entrance */
  bouncy: {
    stiffness: 100,
    damping: 10,
    mass: 1,
    bounce: 0.4,
  },

  /** Soft spring - gentle, flowing motion */
  soft: {
    stiffness: 80,
    damping: 14,
    mass: 0.9,
  },

  /** Snappy spring - quick, responsive */
  snappy: {
    stiffness: 150,
    damping: 20,
    mass: 1,
  },

  /** Quiz option button spring */
  quizOption: {
    stiffness: 100,
    damping: 15,
  },

  /** Featured element spring - softest */
  featured: {
    stiffness: 70,
    damping: 12,
  },

  /** Emoji pop-in spring */
  emojiPop: {
    bounce: 0.5,
    duration: 600, // ms
  },

  /** Title slide-up spring */
  titleSlide: {
    bounce: 0.3,
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Stagger Configurations
// ─────────────────────────────────────────────────────────────

export const STAGGER = {
  /** Default container stagger */
  default: {
    children: 100, // ms between children
    delayStart: 200, // ms before first child
  },

  /** Quiz container - slightly slower */
  quiz: {
    children: 120,
    delayStart: 100,
  },

  /** Quiz option buttons - tight timing */
  quizOptions: {
    delayBase: 50, // ms
    perItem: 60, // ms per item
  },

  /** Fast stagger for lists */
  fast: {
    children: 60,
    delayStart: 100,
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Easing Curves (cubic-bezier values)
// ─────────────────────────────────────────────────────────────

export const EASING = {
  /** Standard ease-out */
  easeOut: [0, 0, 0.2, 1] as const,

  /** Bounce effect at end */
  bounceOut: [0.34, 1.56, 0.64, 1] as const,

  /** Smooth entrance */
  easeInOut: [0.4, 0, 0.2, 1] as const,

  /** Linear (for continuous animations) */
  linear: [0, 0, 1, 1] as const,
} as const;

// ─────────────────────────────────────────────────────────────
// Transform Values
// ─────────────────────────────────────────────────────────────

export const TRANSFORM = {
  /** Fade-up entrance */
  fadeUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
  },

  /** Fade-up for quiz items (larger offset) */
  quizFadeUp: {
    from: { opacity: 0, translateY: 35 },
    to: { opacity: 1, translateY: 0 },
  },

  /** Scale-in entrance */
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  },

  /** Pop-in for emojis */
  popIn: {
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
  },

  /** Slide-in from left */
  slideInLeft: {
    from: { opacity: 0, translateX: -30 },
    to: { opacity: 1, translateX: 0 },
  },

  /** Quiz option button entrance */
  optionFadeUp: {
    from: { opacity: 0, translateY: 25 },
    to: { opacity: 1, translateY: 0 },
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Float Animation Configurations (for bubbles)
// ─────────────────────────────────────────────────────────────

export const FLOAT_ANIMATIONS = [
  { x: [0, 15, -10, 0], y: [0, -20, 10, 0], duration: 8000 },
  { x: [0, -20, 15, 0], y: [0, 15, -15, 0], duration: 9000 },
  { x: [0, 10, -15, 0], y: [0, -10, 20, 0], duration: 7000 },
  { x: [0, -15, 20, 0], y: [0, 20, -10, 0], duration: 10000 },
  { x: [0, 20, -10, 0], y: [0, -15, 15, 0], duration: 8500 },
] as const;

// ─────────────────────────────────────────────────────────────
// Layout Positions (for bubble layouts)
// ─────────────────────────────────────────────────────────────

export const BUBBLE_POSITIONS = {
  /** 5-item scattered layout (percentages) - constrained below header, centered */
  fiveItems: [
    { top: 18, left: 15 },  // Upper-left
    { top: 20, left: 50 },  // Upper-right
    { top: 38, left: 32 },  // Center
    { top: 56, left: 12 },  // Lower-left
    { top: 58, left: 48 },  // Lower-right
  ],

  /** 3-item medal layout for speakers */
  threeItems: [
    { top: 15, left: 50 }, // Gold - center top
    { top: 45, left: 20 }, // Silver - left middle
    { top: 45, left: 80 }, // Bronze - right middle
  ],
} as const;

// ─────────────────────────────────────────────────────────────
// Delay Presets
// ─────────────────────────────────────────────────────────────

export const DELAY = {
  /** Info slide sequence */
  infoSlide: {
    emoji: 100,
    title: 300,
    body: 500,
  },

  /** Intro slide sequence */
  introSlide: {
    emoji: 100,
    title: 200,
    subtitle: 300,
  },

  /** Auto-scroll delay (ms) */
  autoScroll: 4000,
} as const;

// ─────────────────────────────────────────────────────────────
// Viewport Settings
// ─────────────────────────────────────────────────────────────

export const VIEWPORT = {
  /** Default viewport trigger settings */
  default: {
    once: true,
    amount: 0.3, // 30% visible triggers animation
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Re-export type for convenience
// ─────────────────────────────────────────────────────────────

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
};

export type TransformConfig = {
  from: { opacity: number; translateY?: number; translateX?: number; scale?: number };
  to: { opacity: number; translateY?: number; translateX?: number; scale?: number };
};
