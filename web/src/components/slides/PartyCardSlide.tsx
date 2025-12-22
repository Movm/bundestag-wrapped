import { motion } from 'motion/react';
import type { PartyStats } from '@/data/wrapped';
import { getPartyColor, getPartyGradient } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';

interface PartyCardSlideProps {
  parties: PartyStats[];
  onNext: () => void;
}

function PartyCard({ party, index }: { party: PartyStats; index: number }) {
  const maxCount = Math.max(...party.topWords.map((w) => w.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      {/* Party Header */}
      <div
        className={`rounded-t-2xl p-4 lg:p-6 bg-gradient-to-br ${getPartyGradient(party.party)}`}
      >
        <h2 className="text-xl lg:text-2xl font-black text-white mb-1">{party.party}</h2>
        <div className="flex gap-3 text-white/80 text-xs lg:text-sm">
          <span>{formatNumber(party.speeches)} Reden</span>
          <span>|</span>
          <span>{formatNumber(party.totalWords)} Wörter</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-b-2xl p-4 lg:p-6 border border-white/10 border-t-0 flex-1">
        {/* Top Words */}
        <div className="mb-4">
          <h3 className="text-white/60 text-xs uppercase tracking-wide mb-2">
            Top Wörter
          </h3>
          <div className="space-y-1.5">
            {party.topWords.slice(0, 5).map((word, i) => (
              <motion.div
                key={word.word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="text-white text-sm w-24 lg:w-28 truncate">{word.word}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getPartyColor(party.party) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(word.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1 + i * 0.05, duration: 0.5 }}
                  />
                </div>
                <span className="text-white/60 text-xs w-12 text-right">
                  {formatNumber(word.count)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Signature Words */}
        <div className="mb-4">
          <h3 className="text-white/60 text-xs uppercase tracking-wide mb-2">
            Signature Words
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {party.signatureWords.slice(0, 3).map((sw, i) => (
              <motion.div
                key={sw.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 + i * 0.05 }}
                className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
              >
                <span className="text-white">{sw.word}</span>
                <span
                  className="ml-1.5 font-bold"
                  style={{ color: getPartyColor(party.party) }}
                >
                  {sw.ratio.toFixed(1)}x
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Style Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/40 text-xs">Ø Redelänge</p>
            <p className="text-lg font-bold text-white">{party.avgSpeechLength}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/40 text-xs">Beschreibend</p>
            <p className="text-lg font-bold text-white">{party.descriptiveness.toFixed(1)}%</p>
          </div>
        </div>

        {/* Top Speaker */}
        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
            🎤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{party.topSpeaker.name}</p>
            <p className="text-white/60 text-xs">{party.topSpeaker.speeches} Reden</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PartyCardSlide({ parties, onNext }: PartyCardSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 lg:mb-10"
      >
        <span className="text-4xl lg:text-5xl mb-3 block">📊</span>
        <h2 className="text-2xl lg:text-4xl font-black text-white">Die Parteien</h2>
        <p className="text-white/60 mt-2">So haben sie gesprochen</p>
      </motion.div>

      {/* Desktop Grid / Mobile Scroll */}
      <div className="w-full max-w-7xl">
        {/* Desktop: 3x2 grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {parties.map((party, i) => (
            <PartyCard key={party.party} party={party} index={i} />
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4" style={{ width: `${parties.length * 300}px` }}>
            {parties.map((party, i) => (
              <div key={party.party} className="w-72 flex-shrink-0">
                <PartyCard party={party} index={i} />
              </div>
            ))}
          </div>
        </div>
        <p className="lg:hidden text-center text-white/40 text-sm mt-2">← Wischen zum Scrollen →</p>
      </div>

      <motion.button
        onClick={onNext}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Weiter
      </motion.button>
    </div>
  );
}
