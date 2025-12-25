import type { Variants } from 'motion/react';

/**
 * Standard staggered container animation variants.
 * Use with `variants={containerVariants}` on the parent element.
 */
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/**
 * Standard item fade-up animation variants.
 * Use with `variants={itemVariants}` on child elements.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.3 },
  },
};

/**
 * Item variant with horizontal slide-in animation.
 */
export const itemSlideInVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.3 },
  },
};

/**
 * Scale-in animation for cards and featured elements.
 */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', bounce: 0.4 },
  },
};

/**
 * Standard viewport settings for whileInView animations.
 */
export const defaultViewport = { once: true, amount: 0.3 } as const;

// ─────────────────────────────────────────────────────────────
// Quiz-Specific Variants (more fluid entrance animations)
// ─────────────────────────────────────────────────────────────

/**
 * Slower, more flowing container for quiz slides.
 * Uses slightly slower stagger for readable reveal sequence.
 */
export const quizContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/**
 * Softer spring physics for quiz items.
 * Lower stiffness/damping creates flowing motion instead of snappy pops.
 * Note: No scale transform to avoid layout shift at end of animation.
 */
export const quizItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 14,
      mass: 0.9,
    },
  },
};

/**
 * Custom stagger for 2x2 option grid.
 * Uses `custom` prop to pass index for tighter 60ms stagger.
 * Note: No scale transform to avoid layout shift at end of animation.
 */
export const optionButtonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.05 + i * 0.06,
    },
  }),
};

/**
 * Special treatment for the featured word box.
 * Softest spring for the hero element.
 * Note: No scale transform to avoid layout shift at end of animation.
 */
export const featuredWordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 12,
    },
  },
};
