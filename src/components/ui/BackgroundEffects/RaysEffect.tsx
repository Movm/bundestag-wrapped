/**
 * RaysEffect - Radiating lines from center
 *
 * Used for: finale (warmth, celebration)
 * Creates a celebratory sunburst effect with golden rays.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface RaysEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

const RAY_COUNT = 16;

export const RaysEffect = memo(function RaysEffect({
  colors,
  intensity = 1,
}: RaysEffectProps) {
  const baseOpacity = 0.2 * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Central glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '30vw',
          height: '30vw',
          background: `radial-gradient(circle,
            rgba(${colors.glow}, ${baseOpacity * 0.6}) 0%,
            rgba(${colors.primary}, ${baseOpacity * 0.3}) 40%,
            transparent 70%)`,
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [baseOpacity * 2, baseOpacity * 3, baseOpacity * 2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Radiating rays */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax]">
        {Array.from({ length: RAY_COUNT }).map((_, index) => {
          const angle = (index / RAY_COUNT) * 360;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={`ray-${index}`}
              className="absolute left-1/2 top-1/2 origin-center will-change-transform"
              style={{
                width: 4,
                height: '50%',
                marginLeft: -2,
                marginTop: '-50%',
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(to top,
                  rgba(${isEven ? colors.primary : colors.secondary}, ${baseOpacity}) 0%,
                  rgba(${colors.glow}, ${baseOpacity * 0.5}) 50%,
                  transparent 100%)`,
              }}
              animate={{
                opacity: [baseOpacity, baseOpacity * 1.5, baseOpacity],
                scaleY: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3 + (index % 4) * 0.5,
                delay: (index % 8) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Secondary rays (thinner, between main rays) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax]">
        {Array.from({ length: RAY_COUNT }).map((_, index) => {
          const angle = (index / RAY_COUNT) * 360 + (360 / RAY_COUNT / 2);

          return (
            <motion.div
              key={`ray-secondary-${index}`}
              className="absolute left-1/2 top-1/2 origin-center will-change-transform"
              style={{
                width: 2,
                height: '40%',
                marginLeft: -1,
                marginTop: '-40%',
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(to top,
                  rgba(${colors.secondary}, ${baseOpacity * 0.5}) 0%,
                  rgba(${colors.glow}, ${baseOpacity * 0.3}) 60%,
                  transparent 100%)`,
              }}
              animate={{
                opacity: [baseOpacity * 0.5, baseOpacity, baseOpacity * 0.5],
              }}
              transition={{
                duration: 2 + (index % 3) * 0.5,
                delay: (index % 6) * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Outer ring glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{
          width: '80vmin',
          height: '80vmin',
          borderColor: `rgba(${colors.glow}, ${baseOpacity * 0.3})`,
          boxShadow: `0 0 40px rgba(${colors.glow}, ${baseOpacity * 0.2})`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [baseOpacity, baseOpacity * 1.3, baseOpacity],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
});
