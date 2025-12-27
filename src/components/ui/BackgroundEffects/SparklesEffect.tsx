/**
 * SparklesEffect - Dense sparkle particles with bursts
 *
 * Used for: swiftie (pop culture, playful)
 * Creates a magical, celebratory atmosphere with sparkles.
 *
 * Performance: Reduced to 36 elements (20 sparkles + 16 rays).
 * Uses IntersectionObserver to pause animations when off-screen.
 */

import { memo, useMemo, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface SparkleConfig {
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
}

const SPARKLE_COUNT = 20; // Reduced from 40 for better performance

interface SparklesEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const SparklesEffect = memo(function SparklesEffect({
  colors,
  intensity = 1,
}: SparklesEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Only animate when visible - pauses 72+ infinite animations when off-screen
  const isInView = useInView(containerRef, { amount: 0.1 });

  const baseOpacity = 0.4 * intensity;

  const sparkles = useMemo(() => {
    const configs: SparkleConfig[] = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      configs.push({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 4,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
      });
    }
    return configs;
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(${colors.primary}, ${baseOpacity * 0.15}) 0%,
            transparent 60%)`,
        }}
      />

      {/* Individual sparkles - only animate when in view */}
      {sparkles.map((sparkle, index) => (
        <motion.div
          key={`sparkle-${index}`}
          className="absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: `rgba(${index % 3 === 0 ? colors.accent : index % 3 === 1 ? colors.glow : colors.primary}, ${baseOpacity})`,
            boxShadow: `0 0 ${sparkle.size * 2}px rgba(${colors.glow}, ${baseOpacity * 0.8})`,
          }}
          animate={isInView ? {
            opacity: [0, baseOpacity, baseOpacity, 0],
            scale: [0, 1, 1.5, 0],
          } : { opacity: 0, scale: 0 }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: isInView ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Burst effects - reduced from 4 to 2 for performance (saves 16 animated rays) */}
      {[
        { x: '25%', y: '35%', delay: 0 },
        { x: '75%', y: '65%', delay: 2 },
      ].map((burst, index) => (
        <motion.div
          key={`burst-${index}`}
          className="absolute"
          style={{
            left: burst.x,
            top: burst.y,
            width: 100,
            height: 100,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Burst rays */}
          {Array.from({ length: 8 }).map((_, rayIndex) => (
            <motion.div
              key={`ray-${rayIndex}`}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                width: 2,
                height: 30,
                background: `linear-gradient(to top, rgba(${colors.glow}, ${baseOpacity}), transparent)`,
                transform: `rotate(${rayIndex * 45}deg) translateY(-50%)`,
              }}
              animate={isInView ? {
                scaleY: [0, 1, 0],
                opacity: [0, baseOpacity, 0],
              } : { scaleY: 0, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: burst.delay + rayIndex * 0.05,
                repeat: isInView ? Infinity : 0,
                repeatDelay: 4,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
});
