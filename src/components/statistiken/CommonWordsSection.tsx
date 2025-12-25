import { motion } from 'motion/react';
import { SectionHeader, SectionWrapper, SECTION_CONFIG } from './shared';

interface CommonWordsSectionProps {
  commonWords: string[];
}

const config = SECTION_CONFIG.topics;

export function CommonWordsSection({ commonWords }: CommonWordsSectionProps) {
  if (!commonWords || commonWords.length === 0) return null;

  const topWord = commonWords[0];

  return (
    <SectionWrapper sectionId="topics" noPadding>
      {/* HERO ZONE */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-16">
        <SectionHeader
          sectionNumber={config.number}
          emoji={config.emoji}
          title={config.title}
          subtitle={config.subtitle}
          accentColor={config.accent}
          className="mb-8"
        />

        {/* Giant Top Word Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.span
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            „{topWord}"
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-white/70 mt-6"
        >
          Meistgenutztes Wort aller Parteien
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-base mt-2"
        >
          Erscheint bei allen Fraktionen unter den Top-50
        </motion.p>
      </div>

      {/* DETAIL ZONE */}
      <div className="py-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/50 text-base max-w-2xl mx-auto mb-12"
        >
          {config.explanation}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {commonWords.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`
                px-4 py-2 rounded-full font-medium
                transition-all cursor-default
                ${i === 0
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg'
                  : i < 3
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : i < 6
                      ? 'bg-white/10 text-white/80 border border-white/20'
                      : 'bg-white/5 text-white/60 border border-white/10 text-sm'
                }
              `}
            >
              {i === 0 && <span className="mr-1">🏆</span>}
              {topic}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm mt-8"
        >
          Wörter die bei mehreren Parteien unter den Top-50 erscheinen
        </motion.p>
      </div>
    </SectionWrapper>
  );
}
