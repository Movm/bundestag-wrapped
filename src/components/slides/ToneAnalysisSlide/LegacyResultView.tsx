import { motion } from 'motion/react';
import type { ToneAnalysis } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import {
  TONE_CATEGORIES,
  LEGACY_BUBBLE_POSITIONS,
  LEGACY_FLOAT_ANIMATIONS,
} from './constants';

interface LegacyResultViewProps {
  toneAnalysis: ToneAnalysis;
}

export function LegacyResultView({ toneAnalysis }: LegacyResultViewProps) {
  const { rankings } = toneAnalysis;

  return (
    <div className="min-h-screen relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20"
      >
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
          Wrapped 2025
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          Die Emojis der Parteien
        </h2>
      </motion.div>

      <div className="absolute inset-0 z-10">
        {TONE_CATEGORIES.map((cat, i) => {
          const winner = rankings[cat.key]?.[0];
          if (!winner) return null;

          const position = LEGACY_BUBBLE_POSITIONS[i];
          const floatAnimation = LEGACY_FLOAT_ANIMATIONS[i];
          const partyColor = getPartyColor(winner.party);

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.12,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
              }}
            >
              <motion.div
                animate={{ x: floatAnimation.x, y: floatAnimation.y }}
                transition={{
                  repeat: Infinity,
                  duration: floatAnimation.duration,
                  ease: 'easeInOut',
                }}
                className="flex flex-col items-center cursor-default group"
              >
                <motion.span
                  className="text-6xl lg:text-7xl mb-2 drop-shadow-lg"
                  whileHover={{
                    rotate: [0, -15, 15, -10, 10, 0],
                    transition: { duration: 0.6, ease: 'easeInOut' },
                  }}
                >
                  {cat.emoji}
                </motion.span>
                <p
                  className="text-base lg:text-lg font-bold whitespace-nowrap"
                  style={{ color: partyColor }}
                >
                  {winner.party}
                </p>
                <p className="text-xs text-white/50">{cat.label}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.06) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
