import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScrollHintProps {
  /** Text to display next to the arrow */
  text?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use whileInView (scroll-triggered) or animate (immediate) */
  trigger?: 'inView' | 'immediate';
}

/**
 * Animated scroll hint with bouncing arrow.
 * Shows users they can scroll to continue.
 */
export function ScrollHint({
  text = 'Scroll weiter',
  delay = 1.2,
  className,
  trigger = 'inView',
}: ScrollHintProps) {
  const animationProps =
    trigger === 'inView'
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };

  return (
    <motion.div
      {...animationProps}
      transition={{ delay }}
      className={cn(
        'text-center text-white/40 text-sm flex items-center justify-center gap-2',
        className
      )}
    >
      <motion.span
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        ↓
      </motion.span>
      {text}
    </motion.div>
  );
}
