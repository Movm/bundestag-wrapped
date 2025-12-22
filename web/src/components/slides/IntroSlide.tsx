import { motion } from 'motion/react';

interface IntroSlideProps {
  onStart: () => void;
}

export function IntroSlide({ onStart }: IntroSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-6xl md:text-8xl">🏛️</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          BUNDESTAG
        </motion.h1>

        <motion.h2
          className="text-4xl md:text-6xl font-black text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          WRAPPED
        </motion.h2>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-purple-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          2025
        </motion.p>

        <motion.p
          className="text-white/60 text-lg md:text-xl mb-12 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          21. Wahlperiode - Erste 50 Sitzungen
        </motion.p>

        {/* Big CTA Button with pulsing glow */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          {/* Pulsing glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl"
            animate={{
              scale: [1.1, 1.4, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />

          <motion.button
            onClick={onStart}
            className="relative px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] rounded-full text-white font-black text-2xl md:text-3xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            <span className="flex items-center gap-3">
              Los geht's
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
