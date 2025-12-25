import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { GenderAnalysis } from '@/data/wrapped';
import { getPartyGradient } from '@/lib/party-colors';
import { ScrollHint, containerVariants, itemVariants } from '../shared';

interface ResultViewProps {
  genderAnalysis: GenderAnalysis;
}

export function ResultView({ genderAnalysis }: ResultViewProps) {
  const { distribution, byParty } = genderAnalysis;

  const sortedParties = useMemo(
    () =>
      [...byParty]
        .filter((p) => p.party !== 'fraktionslos')
        .sort((a, b) => b.femaleRatio - a.femaleRatio),
    [byParty]
  );

  const topParty = sortedParties[0];
  const bottomParty = sortedParties[sortedParties.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 lg:py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-5xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
            Redeanteile im Bundestag
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Geschlechterverteilung
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16"
        >
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          >
            <motion.span className="text-7xl lg:text-8xl xl:text-9xl font-black tabular-nums text-pink-500 block">
              {distribution.femalePercent.toFixed(0)}%
            </motion.span>
            <motion.p
              className="text-white/60 text-base lg:text-lg mt-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Frauenanteil
            </motion.p>
          </motion.div>

          <div className="flex flex-row items-end gap-6 lg:gap-10">
            {topParty && (() => {
              const size = 100 + (topParty.femaleRatio / 100) * 120;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 150, damping: 15 }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    style={{ width: size, height: size }}
                    className={`
                      rounded-full
                      bg-gradient-to-br ${getPartyGradient(topParty.party)}
                      shadow-2xl shadow-black/30
                      flex flex-col items-center justify-center
                      text-center
                    `}
                  >
                    <span className="text-white font-black text-base lg:text-lg drop-shadow-md">
                      {topParty.party}
                    </span>
                    <span className="font-mono text-3xl lg:text-4xl text-white font-black tabular-nums mt-1">
                      {topParty.femaleRatio.toFixed(0)}%
                    </span>
                  </motion.div>
                </motion.div>
              );
            })()}

            {bottomParty && (() => {
              const size = 100 + (bottomParty.femaleRatio / 100) * 120;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0, type: 'spring', stiffness: 150, damping: 15 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                    style={{ width: size, height: size }}
                    className={`
                      rounded-full
                      bg-gradient-to-br ${getPartyGradient(bottomParty.party)}
                      shadow-2xl shadow-black/30
                      flex flex-col items-center justify-center
                      text-center
                      opacity-80
                    `}
                  >
                    <span className="text-white font-black text-sm lg:text-base drop-shadow-md">
                      {bottomParty.party}
                    </span>
                    <span className="font-mono text-2xl lg:text-3xl text-white font-black tabular-nums mt-1">
                      {bottomParty.femaleRatio.toFixed(0)}%
                    </span>
                  </motion.div>
                </motion.div>
              );
            })()}
          </div>
        </motion.div>

        <ScrollHint delay={2.2} className="mt-10" />
      </motion.div>
    </div>
  );
}
