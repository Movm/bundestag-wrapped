import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { DecorativeAccents, AbstractParticles } from './DecorativeAccents';

interface SlideIntroProps {
  emoji: string;
  title?: string;
  subtitle?: string;
  /** Show decorative accent elements (default: true) */
  showAccents?: boolean;
  /** Slide ID for themed decorations */
  slideId?: string;
}

/**
 * Intro phase for a slide - Spotify Wrapped style.
 * Shows emoji with one sentence. Title optional.
 * Animations: emoji pops in with scale bounce, title slides up, subtitle fades in.
 * Includes decorative ribbon/loop accents on sides and floating abstract particles.
 */
export function SlideIntro({ emoji, title, subtitle, showAccents = true, slideId }: SlideIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <div ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Layer 1: Abstract floating particles - themed by slideId */}
      {showAccents && <AbstractParticles slideId={slideId} isInView={isInView} />}

      {/* Layer 2: Decorative accents - themed by slideId */}
      {showAccents && <DecorativeAccents slideId={slideId} />}
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
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-white/60 text-xl md:text-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
