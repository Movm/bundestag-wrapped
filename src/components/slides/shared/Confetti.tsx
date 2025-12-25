import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

const COLORS = ['#000000', '#DD0000', '#FFCC00']; // German flag colors

interface ConfettiProps {
  count?: number;
}

/**
 * Memoized confetti animation component.
 * Pre-computes random values to prevent recalculation on re-renders.
 */
export const Confetti = memo(function Confetti({ count = 20 }: ConfettiProps) {
  // Pre-compute random values ONCE when count changes
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        yEnd: Math.random() * 100 - 50,
        xEnd: Math.random() * 200 - 100,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.3,
        color: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            willChange: 'transform',
          }}
          initial={{ y: '50vh', opacity: 1, scale: 0 }}
          animate={{
            y: `${p.yEnd}vh`,
            x: `${p.xEnd}px`,
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            rotate: p.rotate,
          }}
          transition={{ duration: 1.5, delay: p.delay }}
        />
      ))}
    </>
  );
});
