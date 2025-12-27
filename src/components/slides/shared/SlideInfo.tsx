import { motion } from 'motion/react';

interface SlideInfoProps {
  emoji: string;
  title: string;
  body: string;
}

/**
 * Educational info slide - appears between quiz and reveal.
 * Shows emoji, title, and 1-2 sentences explaining the topic.
 */
export function SlideInfo({ emoji, title, body }: SlideInfoProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Emoji with scale-pop effect */}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            type: 'spring',
            bounce: 0.5,
            duration: 0.6,
          }}
          className="text-5xl md:text-6xl mb-4 block"
        >
          {emoji}
        </motion.span>

        {/* Title with slide-up spring animation */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}
          className="text-xl md:text-2xl font-bold text-white mb-4"
        >
          {title}
        </motion.h2>

        {/* Body text with fade-in */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-white/70 text-base md:text-lg leading-relaxed"
        >
          {body}
        </motion.p>
      </div>
    </div>
  );
}
