/**
 * BarsEffect - Vertical bars rising/falling
 *
 * Used for: speeches (energy, voice, audio visualizer)
 * Creates an audio visualizer effect with dancing bars.
 */

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface BarConfig {
  x: string;
  width: number;
  maxHeight: string;
  duration: number;
  delay: number;
}

const BAR_COUNT = 16;

interface BarsEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const BarsEffect = memo(function BarsEffect({
  colors,
  intensity = 1,
}: BarsEffectProps) {
  const baseOpacity = 0.25 * intensity;

  const bars = useMemo(() => {
    const configs: BarConfig[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      const position = (i / BAR_COUNT) * 100;
      configs.push({
        x: `${5 + position * 0.9}%`,
        width: 3 + Math.random() * 3,
        maxHeight: `${30 + Math.random() * 40}%`,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 2,
      });
    }
    return configs;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base glow layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top,
            rgba(${colors.primary}, ${baseOpacity * 0.3}) 0%,
            transparent 100%)`,
        }}
      />

      {bars.map((bar, index) => (
        <motion.div
          key={`bar-${index}`}
          className="absolute bottom-0 will-change-transform"
          style={{
            left: bar.x,
            width: bar.width,
          }}
        >
          {/* Single bar with box-shadow glow (consolidated from 2 elements - 50% fewer animations) */}
          <motion.div
            style={{
              width: '100%',
              background: `linear-gradient(to top,
                rgba(${colors.primary}, ${baseOpacity}) 0%,
                rgba(${colors.glow}, ${baseOpacity * 1.2}) 50%,
                rgba(${colors.secondary}, ${baseOpacity * 0.5}) 100%)`,
              borderRadius: bar.width / 2,
              // Glow via box-shadow instead of separate animated element
              boxShadow: `0 0 ${bar.width * 4}px rgba(${colors.glow}, ${baseOpacity * 0.5}),
                          0 0 ${bar.width * 8}px rgba(${colors.primary}, ${baseOpacity * 0.2})`,
            }}
            animate={{
              height: ['10%', bar.maxHeight, '15%', bar.maxHeight, '10%'],
            }}
            transition={{
              duration: bar.duration,
              delay: bar.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
});
