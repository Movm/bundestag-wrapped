import { motion } from 'motion/react';

interface HotTopicsSlideProps {
  topics: string[];
  onNext: () => void;
}

export function HotTopicsSlide({ topics, onNext }: HotTopicsSlideProps) {
  const sizes = [
    'text-4xl md:text-6xl font-black',
    'text-3xl md:text-5xl font-bold',
    'text-2xl md:text-4xl font-bold',
    'text-xl md:text-3xl font-semibold',
    'text-lg md:text-2xl font-medium',
    'text-base md:text-xl',
  ];

  const colors = [
    'text-purple-400',
    'text-pink-400',
    'text-blue-400',
    'text-green-400',
    'text-yellow-400',
    'text-orange-400',
    'text-red-400',
    'text-cyan-400',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10"
        >
          <span className="text-5xl md:text-7xl mb-4 block">🔥</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Hot Topics</h2>
          <p className="text-white/60 mt-2 text-lg">Worüber alle Parteien reden</p>
        </motion.div>

        {/* Word Cloud - larger on desktop */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-12 py-8 md:py-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {topics.map((topic, i) => {
            const sizeClass = sizes[Math.min(i, sizes.length - 1)];
            const colorClass = colors[i % colors.length];

            return (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0, rotate: Math.random() * 20 - 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.4 + i * 0.08,
                  type: 'spring',
                  bounce: 0.4,
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: Math.random() * 10 - 5,
                }}
                className={`${sizeClass} ${colorClass} px-2 cursor-default transition-transform`}
              >
                {topic}
              </motion.span>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-white/40 text-sm md:text-base mb-10"
        >
          Diese Wörter wurden von mindestens 3 Parteien unter den Top 50 verwendet
        </motion.p>

        <motion.button
          onClick={onNext}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Weiter
        </motion.button>
      </motion.div>
    </div>
  );
}
