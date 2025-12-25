import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { itemVariants } from './animations';

interface SlideHeaderProps {
  /** Large emoji displayed above the title */
  emoji: string;
  /** Main headline text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'default' | 'large';
}

/**
 * Standard slide header with emoji, title, and optional subtitle.
 * Uses itemVariants for staggered animation when inside a container.
 */
export function SlideHeader({
  emoji,
  title,
  subtitle,
  className,
  size = 'default',
}: SlideHeaderProps) {
  const emojiSize = size === 'large' ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl';
  const titleSize = size === 'large' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl';

  return (
    <motion.div
      variants={itemVariants}
      className={cn('text-center mb-8', className)}
    >
      <span className={cn(emojiSize, 'mb-3 block')}>{emoji}</span>
      <h2 className={cn(titleSize, 'font-black text-white')}>{title}</h2>
      {subtitle && (
        <p className="text-white/60 mt-2 text-base md:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
