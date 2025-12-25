import { motion } from 'motion/react';
import { SlideContainer, SlideHeader, ScrollHint, itemVariants } from '../shared';

const WORD_SIZES = [
  'text-4xl md:text-6xl font-black',
  'text-3xl md:text-5xl font-bold',
  'text-2xl md:text-4xl font-bold',
  'text-xl md:text-3xl font-semibold',
  'text-lg md:text-2xl font-medium',
  'text-base md:text-xl',
];

const WORD_COLORS = [
  'text-pink-400',
  'text-pink-400',
  'text-blue-400',
  'text-green-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
  'text-cyan-400',
];

interface ResultViewProps {
  topics: string[];
}

export function ResultView({ topics }: ResultViewProps) {
  return (
    <SlideContainer innerClassName="max-w-5xl text-center">
      <SlideHeader
        emoji="📊"
        title="Häufigste Wörter"
        subtitle="Die meistgenutzten Wörter im Bundestag"
        size="large"
        className="mb-10"
      />

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-12 py-8 md:py-12 max-w-4xl mx-auto"
      >
        {topics.map((topic, i) => (
          <motion.span
            key={topic}
            initial={{ opacity: 0, scale: 0, rotate: Math.random() * 20 - 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4 + i * 0.08,
              type: 'spring',
              bounce: 0.4,
            }}
            whileHover={{
              scale: 1.15,
              rotate: Math.random() * 10 - 5,
            }}
            className={`${WORD_SIZES[Math.min(i, WORD_SIZES.length - 1)]} ${WORD_COLORS[i % WORD_COLORS.length]} px-2 cursor-default transition-transform`}
          >
            {topic}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8 }}
        className="text-white/40 text-sm md:text-base mb-10"
      >
        Diese Wörter erscheinen bei mehreren Parteien unter den Top 50
      </motion.p>

      <ScrollHint delay={2} />
    </SlideContainer>
  );
}
