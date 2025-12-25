import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

// Animation timing constants (in seconds) - exported for IntroSlide
export const CHARGE_DURATION = 0.4; // Faster charging
export const FLIGHT_DURATION = 0.6; // Faster flight

interface LaunchEffectsProps {
  phase: 'idle' | 'charging' | 'launching';
}

/**
 * Launch effects overlay - just the charging particles.
 */
export const LaunchEffects = memo(function LaunchEffects({
  phase,
}: LaunchEffectsProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (phase === 'idle' || prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Charging particles only */}
      {phase === 'charging' && <ChargingParticles />}
    </motion.div>
  );
});

/**
 * Particles that float up and fade out like the text.
 */
const ChargingParticles = memo(function ChargingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200, // Spread horizontally
        size: 3 + Math.random() * 5,
        delay: Math.random() * 0.15, // Staggered like text
      })),
    []
  );

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '35%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: 'linear-gradient(135deg, rgb(255 255 255), rgb(244 114 182))',
            boxShadow: '0 0 8px rgb(244 114 182 / 0.6)',
          }}
          initial={{
            x: p.x,
            y: 20,
            opacity: 0,
          }}
          animate={{
            x: p.x,
            y: -40, // Float upward like text
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: CHARGE_DURATION,
            delay: p.delay,
            ease: [0.4, 0, 1, 1], // Same ease as text
          }}
        />
      ))}
    </div>
  );
});
