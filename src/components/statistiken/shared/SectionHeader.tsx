import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  sectionNumber: string;
  emoji: string;
  title: string;
  subtitle: string;
  explanation?: string;
  accentColor?: string;
  size?: 'default' | 'large';
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const numberVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.6 },
  },
};

const emojiVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, bounce: 0.4, duration: 0.7 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.6 },
  },
};

export function SectionHeader({
  sectionNumber,
  emoji,
  title,
  subtitle,
  explanation,
  accentColor = '#db2777',
  size = 'default',
  className,
}: SectionHeaderProps) {
  const isLarge = size === 'large';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn('text-center mb-16', className)}
    >
      {/* Section Number */}
      <motion.div
        variants={numberVariants}
        className="mb-6"
      >
        <span
          className="font-mono text-sm md:text-base tracking-[0.3em] font-bold"
          style={{ color: accentColor }}
        >
          {sectionNumber}
        </span>
        <div
          className="w-12 h-0.5 mx-auto mt-3 rounded-full"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
        />
      </motion.div>

      {/* Emoji */}
      <motion.span
        variants={emojiVariants}
        className={cn(
          'block mb-6',
          isLarge ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'
        )}
      >
        {emoji}
      </motion.span>

      {/* Title */}
      <motion.h2
        variants={textVariants}
        className={cn(
          'font-black text-white mb-4',
          isLarge ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'
        )}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={textVariants}
        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium"
      >
        {subtitle}
      </motion.p>

      {/* Explanation */}
      {explanation && (
        <motion.p
          variants={textVariants}
          className="text-white/50 text-sm md:text-base max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          {explanation}
        </motion.p>
      )}
    </motion.div>
  );
}
