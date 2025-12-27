/**
 * GridEffect - Structured geometric grid with subtle pulsing
 *
 * Used for: gender (balanced, structured)
 * Creates a balanced, analytical feel with geometric patterns.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface GridEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const GridEffect = memo(function GridEffect({
  colors,
  intensity = 1,
}: GridEffectProps) {
  const baseOpacity = 0.12 * intensity;
  const gridSize = 80; // pixels

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern using CSS */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(${colors.primary}, ${baseOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(${colors.primary}, ${baseOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        animate={{
          opacity: [baseOpacity * 3, baseOpacity * 4, baseOpacity * 3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid intersection dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(${colors.glow}, ${baseOpacity * 2}) 2px, transparent 2px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Pulsing highlight cells */}
      {[
        { x: '20%', y: '30%', delay: 0 },
        { x: '60%', y: '20%', delay: 1.5 },
        { x: '40%', y: '60%', delay: 0.8 },
        { x: '75%', y: '70%', delay: 2.2 },
        { x: '30%', y: '80%', delay: 1.2 },
      ].map((cell, index) => (
        <motion.div
          key={`cell-${index}`}
          className="absolute"
          style={{
            left: cell.x,
            top: cell.y,
            width: gridSize,
            height: gridSize,
            background: `radial-gradient(circle at center,
              rgba(${colors.secondary}, ${baseOpacity * 1.5}) 0%,
              transparent 70%)`,
          }}
          animate={{
            opacity: [0, baseOpacity * 3, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            delay: cell.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle diagonal gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg,
            rgba(${colors.primary}, ${baseOpacity * 0.5}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(${colors.secondary}, ${baseOpacity * 0.5}) 100%)`,
        }}
      />
    </div>
  );
});
