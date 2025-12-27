/**
 * LightningEffect - Sharp diagonal lines with flashes
 *
 * Used for: drama (intensity, interruptions)
 * Creates an intense, electric atmosphere with sharp lines.
 */

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface BoltConfig {
  x: string;
  angle: number;
  length: string;
  duration: number;
  delay: number;
  thickness: number;
}

interface LightningEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const LightningEffect = memo(function LightningEffect({
  colors,
  intensity = 1,
}: LightningEffectProps) {
  const baseOpacity = 0.3 * intensity;

  const bolts = useMemo(() => {
    const configs: BoltConfig[] = [];
    const boltCount = 12;
    for (let i = 0; i < boltCount; i++) {
      configs.push({
        x: `${5 + (i / boltCount) * 90}%`,
        angle: 30 + Math.random() * 30,
        length: `${40 + Math.random() * 30}%`,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 6,
        thickness: 2 + Math.random() * 2,
      });
    }
    return configs;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ambient red glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%,
            rgba(${colors.primary}, ${baseOpacity * 0.15}) 0%,
            transparent 50%)`,
        }}
      />

      {/* Lightning bolts */}
      {bolts.map((bolt, index) => (
        <motion.div
          key={`bolt-${index}`}
          className="absolute top-0 will-change-transform"
          style={{
            left: bolt.x,
            height: bolt.length,
            width: bolt.thickness + 20,
            transform: `rotate(${bolt.angle}deg)`,
            transformOrigin: 'top center',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0, baseOpacity, baseOpacity * 1.5, 0, 0],
          }}
          transition={{
            duration: bolt.duration,
            delay: bolt.delay,
            repeat: Infinity,
            times: [0, 0.4, 0.45, 0.5, 0.55, 1],
            ease: 'easeInOut',
          }}
        >
          {/* Bolt glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                rgba(${colors.glow}, ${baseOpacity * 0.6}) 0%,
                rgba(${colors.primary}, ${baseOpacity * 0.4}) 50%,
                transparent 100%)`,
              filter: 'blur(6px)',
              width: bolt.thickness * 4,
              marginLeft: -bolt.thickness,
            }}
          />

          {/* Bolt core */}
          <div
            className="absolute"
            style={{
              left: '50%',
              marginLeft: -bolt.thickness / 2,
              width: bolt.thickness,
              height: '100%',
              background: `linear-gradient(180deg,
                rgba(${colors.accent}, ${baseOpacity * 1.5}) 0%,
                rgba(${colors.glow}, ${baseOpacity}) 30%,
                rgba(${colors.primary}, ${baseOpacity * 0.5}) 70%,
                transparent 100%)`,
              borderRadius: bolt.thickness / 2,
            }}
          />
        </motion.div>
      ))}

      {/* Flash effects */}
      {[
        { x: '30%', y: '20%', delay: 1 },
        { x: '70%', y: '40%', delay: 3.5 },
        { x: '50%', y: '60%', delay: 5 },
      ].map((flash, index) => (
        <motion.div
          key={`flash-${index}`}
          className="absolute"
          style={{
            left: flash.x,
            top: flash.y,
            width: '40vw',
            height: '40vw',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle,
              rgba(${colors.accent}, ${baseOpacity * 0.5}) 0%,
              rgba(${colors.glow}, ${baseOpacity * 0.2}) 30%,
              transparent 60%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0, 0, 1, 0, 0],
            scale: [0.5, 0.5, 1.2, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            delay: flash.delay,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 0.55, 1],
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
});
