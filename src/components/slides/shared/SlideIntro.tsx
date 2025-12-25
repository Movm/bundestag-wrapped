import { motion } from 'motion/react';

interface SlideIntroProps {
  emoji: string;
  title?: string;
  subtitle?: string;
}

/**
 * Intro phase for a slide - Spotify Wrapped style.
 * Shows emoji with one sentence. Title optional.
 * Animations: emoji pops in with scale bounce, title slides up, subtitle fades in.
 */
export function SlideIntro({ emoji, title, subtitle }: SlideIntroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center">
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
          className="text-6xl md:text-7xl mb-4 block"
        >
          {emoji}
        </motion.span>

        {/* Title with slide-up spring animation */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}
            className="text-2xl md:text-4xl font-black text-white mb-2"
          >
            {title}
          </motion.h2>
        )}

        {/* Subtitle with subtle fade-in */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/60 text-xl md:text-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
