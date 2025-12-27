/**
 * RibbonsEffect - Smooth curved undulating paths
 *
 * Used for: tone (emotional, flowing)
 * Creates a flowing, emotional atmosphere with ribbon-like curves.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface RibbonConfig {
  startY: string;
  duration: number;
  delay: number;
  amplitude: number;
  thickness: number;
}

const RIBBON_CONFIGS: RibbonConfig[] = [
  { startY: '25%', duration: 15, delay: 0, amplitude: 80, thickness: 6 },
  { startY: '45%', duration: 18, delay: 2, amplitude: 60, thickness: 4 },
  { startY: '65%', duration: 12, delay: 1, amplitude: 100, thickness: 5 },
  { startY: '80%', duration: 20, delay: 3, amplitude: 50, thickness: 3 },
];

interface RibbonsEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const RibbonsEffect = memo(function RibbonsEffect({
  colors,
  intensity = 1,
}: RibbonsEffectProps) {
  const baseOpacity = 0.2 * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {RIBBON_CONFIGS.map((ribbon, index) => (
        <motion.div
          key={`ribbon-${index}`}
          className="absolute w-[200%] will-change-transform"
          style={{
            top: ribbon.startY,
            left: '-50%',
            height: ribbon.thickness + ribbon.amplitude * 2,
          }}
          animate={{
            x: ['-25%', '0%', '-25%'],
          }}
          transition={{
            duration: ribbon.duration * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* SVG ribbon path */}
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            <defs>
              <linearGradient id={`ribbon-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={`rgb(${colors.primary})`} stopOpacity="0" />
                <stop offset="20%" stopColor={`rgb(${colors.primary})`} stopOpacity={baseOpacity} />
                <stop offset="50%" stopColor={`rgb(${colors.glow})`} stopOpacity={baseOpacity * 1.2} />
                <stop offset="80%" stopColor={`rgb(${colors.secondary})`} stopOpacity={baseOpacity} />
                <stop offset="100%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0" />
              </linearGradient>
              <filter id={`ribbon-blur-${index}`}>
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            <motion.path
              d={`M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`}
              fill="none"
              stroke={`url(#ribbon-gradient-${index})`}
              strokeWidth={ribbon.thickness}
              strokeLinecap="round"
              filter={`url(#ribbon-blur-${index})`}
              animate={{
                d: [
                  `M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                  `M 0,50 Q 125,${50 + ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                  `M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                ],
              }}
              transition={{
                duration: ribbon.duration,
                delay: ribbon.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Glow path */}
            <motion.path
              d={`M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`}
              fill="none"
              stroke={`rgba(${colors.glow}, ${baseOpacity * 0.3})`}
              strokeWidth={ribbon.thickness * 4}
              strokeLinecap="round"
              filter={`url(#ribbon-blur-${index})`}
              animate={{
                d: [
                  `M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                  `M 0,50 Q 125,${50 + ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                  `M 0,50 Q 125,${50 - ribbon.amplitude / 2} 250,50 T 500,50 T 750,50 T 1000,50`,
                ],
              }}
              transition={{
                duration: ribbon.duration,
                delay: ribbon.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(${colors.secondary}, ${baseOpacity * 0.2}) 0%,
            transparent 50%)`,
        }}
      />
    </div>
  );
});
