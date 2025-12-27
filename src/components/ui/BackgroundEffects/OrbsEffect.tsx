/**
 * OrbsEffect - Large slow-moving gradient circles
 *
 * Used for: common-words (familiar, grounded)
 * Creates a dreamy, floating atmosphere with gentle orbs.
 */

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface OrbConfig {
  x: string;
  y: string;
  size: string;
  duration: number;
  delay: number;
}

const ORB_CONFIGS: OrbConfig[] = [
  { x: '15%', y: '20%', size: '40vw', duration: 25, delay: 0 },
  { x: '70%', y: '60%', size: '35vw', duration: 30, delay: 2 },
  { x: '45%', y: '75%', size: '30vw', duration: 22, delay: 4 },
  { x: '80%', y: '15%', size: '25vw', duration: 28, delay: 1 },
  { x: '25%', y: '50%', size: '20vw', duration: 26, delay: 3 },
];

interface OrbsEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const OrbsEffect = memo(function OrbsEffect({
  colors,
  intensity = 1,
}: OrbsEffectProps) {
  const baseOpacity = 0.12 * intensity;

  const orbs = useMemo(() => {
    return ORB_CONFIGS.map((config, index) => ({
      ...config,
      isPrimary: index % 2 === 0,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={`orb-${index}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at center,
              rgba(${orb.isPrimary ? colors.primary : colors.secondary}, ${baseOpacity}) 0%,
              rgba(${orb.isPrimary ? colors.primary : colors.secondary}, ${baseOpacity * 0.5}) 40%,
              transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Central glow accent */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '50vw',
          height: '50vw',
          background: `radial-gradient(circle at center,
            rgba(${colors.glow}, ${baseOpacity * 0.4}) 0%,
            transparent 50%)`,
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
});
