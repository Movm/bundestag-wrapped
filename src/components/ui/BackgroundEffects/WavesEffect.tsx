/**
 * WavesEffect - Horizontal flowing wave lines
 *
 * Used for: vocabulary (language, sound waves)
 * Creates a sound-wave visualization with flowing horizontal lines.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface WaveConfig {
  y: string;
  amplitude: number;
  frequency: number;
  duration: number;
  delay: number;
  thickness: number;
}

const WAVE_CONFIGS: WaveConfig[] = [
  { y: '20%', amplitude: 30, frequency: 1, duration: 8, delay: 0, thickness: 3 },
  { y: '35%', amplitude: 25, frequency: 1.5, duration: 10, delay: 0.5, thickness: 2 },
  { y: '50%', amplitude: 35, frequency: 0.8, duration: 12, delay: 1, thickness: 4 },
  { y: '65%', amplitude: 20, frequency: 1.2, duration: 9, delay: 0.3, thickness: 2 },
  { y: '80%', amplitude: 28, frequency: 1.1, duration: 11, delay: 0.8, thickness: 3 },
];

interface WavesEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const WavesEffect = memo(function WavesEffect({
  colors,
  intensity = 1,
}: WavesEffectProps) {
  const baseOpacity = 0.25 * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {WAVE_CONFIGS.map((wave, index) => (
        <motion.div
          key={`wave-${index}`}
          className="absolute left-0 right-0 will-change-transform"
          style={{
            top: wave.y,
            height: wave.thickness + 20,
          }}
        >
          {/* Single wave element with box-shadow glow (consolidated from 2 elements) */}
          <motion.div
            className="absolute w-[200%] h-full"
            style={{
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(${index % 2 === 0 ? colors.primary : colors.secondary}, ${baseOpacity}) 25%,
                rgba(${colors.glow}, ${baseOpacity * 1.2}) 50%,
                rgba(${index % 2 === 0 ? colors.secondary : colors.primary}, ${baseOpacity}) 75%,
                transparent 100%)`,
              height: wave.thickness,
              filter: 'blur(2px)',
              borderRadius: wave.thickness,
              // Glow via box-shadow instead of separate animated element (50% fewer animations)
              boxShadow: `0 0 ${wave.thickness * 6}px rgba(${colors.primary}, ${baseOpacity * 0.4}),
                          0 0 ${wave.thickness * 12}px rgba(${colors.secondary}, ${baseOpacity * 0.2})`,
            }}
            animate={{
              x: ['-50%', '0%'],
              y: [
                0,
                wave.amplitude,
                0,
                -wave.amplitude,
                0,
              ],
            }}
            transition={{
              x: {
                duration: wave.duration * 2,
                repeat: Infinity,
                ease: 'linear',
              },
              y: {
                duration: wave.duration,
                delay: wave.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        </motion.div>
      ))}
    </div>
  );
});
