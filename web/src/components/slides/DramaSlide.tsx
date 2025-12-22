import { motion } from 'motion/react';
import type { DramaStats } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { formatNumber } from '@/lib/utils';
import { getPartyColor } from '@/lib/party-colors';

interface DramaSlideProps {
  drama: DramaStats;
  onNext: () => void;
}

export function DramaSlide({ drama, onNext }: DramaSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-5xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-10"
        >
          <span className="text-6xl md:text-7xl mb-4 block">🎭</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Drama im Bundestag</h2>
          <p className="text-white/60 mt-2 text-lg">Wer sorgt für Stimmung?</p>
        </motion.div>

        {/* Desktop: 2 column layout */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Top Interrupters */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">📢</span> Top Unterbrecher
            </h3>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              {drama.topInterrupters.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-center justify-between py-3 ${
                    i < 2 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <p className="text-white font-medium text-lg">{item.name}</p>
                      <PartyBadge party={item.party} size="sm" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: getPartyColor(item.party) }}>
                    {formatNumber(item.count)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Most Interrupted */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Meistens unterbrochen
            </h3>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              {drama.mostInterrupted.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center justify-between py-3 ${
                    i < 2 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl text-white/40 w-8">{i + 1}.</span>
                    <div>
                      <p className="text-white font-medium text-lg">{item.name}</p>
                      <PartyBadge party={item.party} size="sm" />
                    </div>
                  </div>
                  <span className="text-xl font-bold text-pink-400">
                    {formatNumber(item.count)}x
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={onNext}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Weiter
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
