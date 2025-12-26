import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FloatingParticles,
  LaunchEffects,
  CHARGE_DURATION,
  FLIGHT_DURATION,
} from '../shared';
import { playSound } from '@/lib/sounds';

const TEXT_HIDE_DURATION = 0.4;

interface IntroSlideProps {
  onStart?: () => void;
}

export const IntroSlide = memo(function IntroSlide({ onStart }: IntroSlideProps) {
  const [launchPhase, setLaunchPhase] = useState<
    'idle' | 'hiding' | 'charging' | 'launching'
  >('idle');

  const handleStart = useCallback(() => {
    playSound('start');
    setLaunchPhase('hiding');

    setTimeout(() => {
      setLaunchPhase('charging');
    }, TEXT_HIDE_DURATION * 1000);

    setTimeout(() => {
      setLaunchPhase('launching');
    }, (TEXT_HIDE_DURATION + CHARGE_DURATION) * 1000);

    setTimeout(() => {
      onStart?.();
    }, (TEXT_HIDE_DURATION + CHARGE_DURATION) * 1000); // Immediate after charge

    setTimeout(() => {
      setLaunchPhase('idle');
    }, (TEXT_HIDE_DURATION + CHARGE_DURATION + FLIGHT_DURATION) * 1000 + 100);
  }, [onStart]);

  const isAnimating = launchPhase !== 'idle';
  const isHiding = launchPhase !== 'idle';
  const isCharging = launchPhase === 'charging' || launchPhase === 'launching';

  const TEXT_FADE_DURATION = TEXT_HIDE_DURATION;
  const TEXT_STAGGER = 0.08;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingParticles count={80} />
      </div>

      <AnimatePresence>
        {isCharging && (
          <LaunchEffects phase={launchPhase as 'charging' | 'launching'} />
        )}
      </AnimatePresence>

      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <motion.img
            src="/logo.png"
            alt=""
            className="w-24 h-24 md:w-36 md:h-36"
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={
              launchPhase === 'charging'
                ? {
                    y: [0, -5, 0, -3, 0, -8, 0],
                    scale: [1, 1.05, 1, 1.08, 1, 1.12, 1.15],
                    rotate: [0, -2, 2, -1, 1, -3, 0],
                  }
                : launchPhase === 'launching'
                  ? {
                      y: '-100vh',
                      scale: [1.15, 1.25, 1.15, 1],
                      rotate: [0, -3, 3, 0],
                      opacity: [1, 1, 0.6, 0],
                    }
                  : {}
            }
            transition={
              launchPhase === 'charging'
                ? {
                    duration: CHARGE_DURATION,
                    ease: 'easeInOut',
                    times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1],
                  }
                : launchPhase === 'launching'
                  ? {
                      duration: FLIGHT_DURATION,
                      ease: [0.15, 0.8, 0.3, 1],
                      y: { duration: FLIGHT_DURATION, ease: [0.15, 0.8, 0.3, 1] },
                      opacity: { times: [0, 0.4, 0.75, 1] },
                    }
                  : {
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.34, 1.56, 0.64, 1],
                    }
            }
          />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHiding ? 0 : 1,
            y: isHiding ? -30 : 0,
          }}
          transition={{
            delay: isHiding ? TEXT_STAGGER * 0 : 0.4,
            duration: isHiding ? TEXT_FADE_DURATION : 0.6,
            ease: isHiding ? [0.4, 0, 1, 1] : 'easeOut',
          }}
        >
          BUNDESTAG
        </motion.h1>

        <motion.h2
          className="text-4xl md:text-6xl font-black text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHiding ? 0 : 1,
            y: isHiding ? -30 : 0,
          }}
          transition={{
            delay: isHiding ? TEXT_STAGGER * 1 : 0.6,
            duration: isHiding ? TEXT_FADE_DURATION : 0.6,
            ease: isHiding ? [0.4, 0, 1, 1] : 'easeOut',
          }}
        >
          WRAPPED
        </motion.h2>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-pink-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHiding ? 0 : 1,
            y: isHiding ? -20 : 0,
          }}
          transition={{
            delay: isHiding ? TEXT_STAGGER * 2 : 0.8,
            duration: isHiding ? TEXT_FADE_DURATION : 0.6,
            ease: isHiding ? [0.4, 0, 1, 1] : 'easeOut',
          }}
        >
          2025
        </motion.p>

        <motion.button
          onClick={handleStart}
          disabled={isAnimating}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-xl hover:from-pink-400 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isAnimating ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isAnimating ? 0 : 1,
            scale: isAnimating ? 0.9 : 1,
            y: 0,
          }}
          transition={{
            delay: isAnimating ? 0 : 1.2,
            duration: isAnimating ? TEXT_HIDE_DURATION * 0.6 : 0.6,
            ease: 'easeOut',
          }}
        >
          Starten
        </motion.button>
      </div>
    </div>
  );
});
