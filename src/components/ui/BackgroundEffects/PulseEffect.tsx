/**
 * PulseEffect - Concentric circles pulsing outward
 *
 * Used for: topics (information, data-viz)
 * Creates a data-visualization feel with expanding rings.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface PulseEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

const RING_COUNT = 5;

export const PulseEffect = memo(function PulseEffect({
  colors,
  intensity = 1,
}: PulseEffectProps) {
  const baseOpacity = 0.2 * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Center point glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '10vw',
          height: '10vw',
          background: `radial-gradient(circle,
            rgba(${colors.accent}, ${baseOpacity * 0.5}) 0%,
            rgba(${colors.primary}, ${baseOpacity * 0.3}) 50%,
            transparent 100%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Expanding rings - using scale transform (GPU composited) instead of width/height (layout thrashing) */}
      {Array.from({ length: RING_COUNT }).map((_, index) => (
        <motion.div
          key={`ring-${index}`}
          className="absolute left-1/2 top-1/2 rounded-full border will-change-transform"
          style={{
            // Fixed size, animated via scale
            width: '120vw',
            height: '120vw',
            borderColor: `rgba(${colors.primary}, ${baseOpacity})`,
            borderWidth: 2,
            // Center the ring
            marginLeft: '-60vw',
            marginTop: '-60vw',
          }}
          initial={{
            scale: 5 / 120, // Start at 5vw equivalent
            opacity: baseOpacity,
          }}
          animate={{
            scale: [5 / 120, 1], // Expand from 5vw to 120vw
            opacity: [baseOpacity, baseOpacity * 0.8, 0],
            borderColor: [
              `rgba(${colors.primary}, ${baseOpacity})`,
              `rgba(${colors.secondary}, ${baseOpacity * 0.6})`,
              `rgba(${colors.secondary}, 0)`,
            ],
          }}
          transition={{
            duration: 8,
            delay: index * 1.6,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Secondary pulse offset */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: '30%',
          top: '70%',
          width: '30vw',
          height: '30vw',
          background: `radial-gradient(circle,
            rgba(${colors.secondary}, ${baseOpacity * 0.3}) 0%,
            transparent 60%)`,
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [baseOpacity * 0.5, baseOpacity * 0.8, baseOpacity * 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
});
