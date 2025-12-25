import { motion, type Variants } from 'motion/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { containerVariants } from './animations';
import { FloatingParticles } from './FloatingParticles';

/** Configuration for the sparkles effect */
export type SparklesConfig = {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
};

interface SlideContainerProps {
  children: ReactNode;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Additional CSS classes for the inner motion container */
  innerClassName?: string;
  /** Custom animation variants (defaults to containerVariants) */
  variants?: Variants;
  /** Viewport trigger amount (0-1) */
  viewportAmount?: number;
  /** Enable floating sparkles effect. Pass true for defaults or config object. */
  sparkles?: boolean | SparklesConfig;
}

/**
 * Standard slide container with centered layout and staggered animations.
 * Wraps content in a full-height flex container with motion animations.
 */
export function SlideContainer({
  children,
  className,
  innerClassName,
  variants = containerVariants,
  viewportAmount = 0.3,
  sparkles,
}: SlideContainerProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center px-6 py-12 relative',
        className
      )}
    >
      {sparkles && (
        <FloatingParticles
          {...(typeof sparkles === 'object' ? sparkles : {})}
        />
      )}
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: viewportAmount }}
        className={cn('w-full', innerClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
