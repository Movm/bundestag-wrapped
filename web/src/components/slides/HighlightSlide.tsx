import { motion } from 'motion/react';
import { getPartyColor } from '@/lib/party-colors';

interface HighlightSlideProps {
  emoji: string;
  headline: string;
  mainValue: string;
  subtext?: string;
  party?: string;
  color?: string;
  onNext: () => void;
}

export function HighlightSlide({
  emoji,
  headline,
  mainValue,
  subtext,
  party,
  color,
  onNext,
}: HighlightSlideProps) {
  const accentColor = party ? getPartyColor(party) : color || '#8b5cf6';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-2xl"
      >
        {/* Emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          className="text-7xl md:text-9xl mb-8"
        >
          {emoji}
        </motion.div>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg md:text-xl mb-4 uppercase tracking-wide"
        >
          {headline}
        </motion.p>

        {/* Main Value */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
          style={{ color: accentColor }}
        >
          {mainValue}
        </motion.h1>

        {/* Subtext */}
        {subtext && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/70 text-xl md:text-2xl max-w-lg mx-auto"
          >
            {subtext}
          </motion.p>
        )}

        {/* Party badge if provided */}
        {party && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <span
              className="inline-block px-6 py-2 rounded-full text-lg font-bold"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `2px solid ${accentColor}40`,
              }}
            >
              {party}
            </span>
          </motion.div>
        )}

        {/* Continue button */}
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium text-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Weiter
        </motion.button>
      </motion.div>
    </div>
  );
}
