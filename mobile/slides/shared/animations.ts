/**
 * Native Animation Helpers
 *
 * Bridges shared timing configs to React Native Reanimated
 */

import { Easing } from 'react-native-reanimated';
import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  ZoomIn,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { SPRING, STAGGER, DURATION } from '@/shared/animations/timings';

// ─────────────────────────────────────────────────────────────
// Entrance Animations (using Reanimated's layout animations)
// ─────────────────────────────────────────────────────────────

/**
 * Standard fade-up entrance for items
 * Matches web's itemVariants
 */
export const fadeUpEntering = (delay: number = 0) =>
  FadeInDown.delay(delay)
    .springify()
    .stiffness(SPRING.default.stiffness)
    .damping(SPRING.default.damping);

/**
 * Fade-up entrance for quiz items
 * Matches web's quizItemVariants (softer spring)
 */
export const quizFadeUpEntering = (delay: number = 0) =>
  FadeInDown.delay(delay)
    .springify()
    .stiffness(SPRING.soft.stiffness)
    .damping(SPRING.soft.damping);

/**
 * Pop-in entrance for emojis
 * Matches web's emoji scale-pop effect
 */
export const emojiPopEntering = (delay: number = 0) =>
  ZoomIn.delay(delay)
    .springify()
    .stiffness(SPRING.bouncy.stiffness)
    .damping(SPRING.bouncy.damping);

/**
 * Slide-in from left
 * Matches web's itemSlideInVariants
 */
export const slideInLeftEntering = (delay: number = 0) =>
  SlideInLeft.delay(delay)
    .springify()
    .stiffness(SPRING.default.stiffness)
    .damping(SPRING.default.damping);

/**
 * Simple fade-in
 */
export const fadeInEntering = (delay: number = 0) =>
  FadeIn.delay(delay).duration(DURATION.normal);

// ─────────────────────────────────────────────────────────────
// Stagger Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Calculate delay for staggered children
 * @param index - Child index (0-based)
 * @param config - Stagger config (default, quiz, or fast)
 */
export function getStaggerDelay(
  index: number,
  config: 'default' | 'quiz' | 'fast' = 'default'
): number {
  const { children, delayStart } = STAGGER[config];
  return delayStart + index * children;
}

/**
 * Calculate delay for quiz option buttons
 * @param index - Button index (0-3)
 */
export function getQuizOptionDelay(index: number): number {
  return STAGGER.quizOptions.delayBase + index * STAGGER.quizOptions.perItem;
}

// ─────────────────────────────────────────────────────────────
// Custom Easing
// ─────────────────────────────────────────────────────────────

/**
 * Bounce-out easing curve
 */
export const bounceOutEasing = Easing.bezier(0.34, 1.56, 0.64, 1);

/**
 * Standard ease-out
 */
export const easeOutEasing = Easing.bezier(0, 0, 0.2, 1);

// ─────────────────────────────────────────────────────────────
// Animation Presets for Common Patterns
// ─────────────────────────────────────────────────────────────

/**
 * Intro slide animation sequence
 */
export const introAnimations = {
  emoji: (index: number = 0) => emojiPopEntering(100 + index * 100),
  title: (index: number = 0) => fadeUpEntering(200 + index * 100),
  subtitle: (index: number = 0) => fadeUpEntering(300 + index * 100),
};

/**
 * Info slide animation sequence
 */
export const infoAnimations = {
  emoji: () => emojiPopEntering(100),
  title: () => fadeUpEntering(300),
  body: () => fadeInEntering(500),
};

/**
 * Quiz slide animation sequence
 */
export const quizAnimations = {
  question: () => quizFadeUpEntering(0),
  option: (index: number) =>
    FadeInDown.delay(getQuizOptionDelay(index))
      .springify()
      .stiffness(SPRING.quizOption.stiffness)
      .damping(SPRING.quizOption.damping),
};

// ─────────────────────────────────────────────────────────────
// Enhanced Entrance Animations
// ─────────────────────────────────────────────────────────────

/**
 * Scale-in entrance for cards and featured elements
 * Matches web's scaleInVariants (scale: 0.8 -> 1)
 */
export const scaleInEntering = (delay: number = 0) =>
  ZoomIn.delay(delay)
    .springify()
    .stiffness(SPRING.default.stiffness)
    .damping(SPRING.default.damping);

/**
 * Slide-in from right
 * For alternating list animations
 */
export const slideInRightEntering = (delay: number = 0) =>
  SlideInRight.delay(delay)
    .springify()
    .stiffness(SPRING.default.stiffness)
    .damping(SPRING.default.damping);

/**
 * Featured element entrance (softer, more dramatic)
 * Matches web's featuredWordVariants
 */
export const featuredEntering = (delay: number = 0) =>
  FadeInDown.delay(delay)
    .springify()
    .stiffness(SPRING.featured.stiffness)
    .damping(SPRING.featured.damping);

/**
 * Fade-in from left (for rankings, lists)
 */
export const fadeInLeftEntering = (delay: number = 0) =>
  FadeInLeft.delay(delay)
    .springify()
    .stiffness(SPRING.default.stiffness)
    .damping(SPRING.default.damping);

/**
 * Bouncy scale entrance for medals, badges, highlights
 */
export const bouncyScaleEntering = (delay: number = 0) =>
  ZoomIn.delay(delay)
    .springify()
    .stiffness(SPRING.bouncy.stiffness)
    .damping(SPRING.bouncy.damping);

/**
 * Snappy entrance for interactive elements
 */
export const snappyEntering = (delay: number = 0) =>
  FadeInDown.delay(delay)
    .springify()
    .stiffness(SPRING.snappy.stiffness)
    .damping(SPRING.snappy.damping);

// ─────────────────────────────────────────────────────────────
// Advanced Stagger Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Calculate alternating slide direction for list items
 * Odd items slide from left, even from right
 */
export function getAlternatingSlideEntering(index: number, baseDelay: number = 0) {
  const delay = baseDelay + index * STAGGER.fast.children;
  return index % 2 === 0
    ? slideInLeftEntering(delay)
    : slideInRightEntering(delay);
}

/**
 * Get staggered entrance with scale effect for bubble/card layouts
 */
export function getScaledStaggerEntering(index: number, baseDelay: number = 0) {
  const delay = baseDelay + index * 120;
  return scaleInEntering(delay);
}

/**
 * Get staggered entrance with bouncy effect for medals/badges
 */
export function getBouncyStaggerEntering(index: number, baseDelay: number = 0) {
  const delay = baseDelay + index * 150;
  return bouncyScaleEntering(delay);
}

// ─────────────────────────────────────────────────────────────
// Animation Presets for Slide Types
// ─────────────────────────────────────────────────────────────

/**
 * Reveal slide animation sequence (for answer reveals)
 */
export const revealAnimations = {
  emoji: () => emojiPopEntering(0),
  name: () => fadeUpEntering(200),
  badge: () => fadeInEntering(300),
  count: () => featuredEntering(400),
  label: () => fadeInEntering(500),
  note: () => fadeInEntering(800),
};

/**
 * Rankings list animation sequence
 */
export const rankingsAnimations = {
  title: () => fadeUpEntering(200),
  item: (index: number) => fadeInLeftEntering(400 + index * 100),
  leader: () => bouncyScaleEntering(300),
};

/**
 * Bubble layout animation sequence
 */
export const bubbleAnimations = {
  header: () => fadeUpEntering(100),
  bubble: (index: number) => scaleInEntering(200 + index * 120),
  hint: () => fadeInEntering(1000),
};

/**
 * Chart/stats animation sequence
 */
export const chartAnimations = {
  header: () => fadeUpEntering(100),
  bar: (index: number) => fadeInLeftEntering(300 + index * 80),
  value: (index: number) => fadeInEntering(400 + index * 80),
};
