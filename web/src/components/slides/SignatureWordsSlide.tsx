import { motion } from 'motion/react';
import type { PartyStats } from '@/data/wrapped';
import { getPartyColor, getPartyGradient } from '@/lib/party-colors';

interface SignatureWordsSlideProps {
  parties: PartyStats[];
  onNext: () => void;
}

function PartySignatureCard({ party, index }: { party: PartyStats; index: number }) {
  const partyColor = getPartyColor(party.party);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.1, type: 'spring', bounce: 0.3 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Party Header */}
      <div
        className={`p-4 bg-gradient-to-r ${getPartyGradient(party.party)}`}
      >
        <h3 className="text-lg font-bold text-white">{party.party}</h3>
      </div>

      {/* Signature Words */}
      <div className="p-4 space-y-3">
        {party.signatureWords.slice(0, 3).map((sw, i) => (
          <motion.div
            key={sw.word}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 + i * 0.08 }}
            className="flex items-center justify-between"
          >
            <span className="text-white font-medium text-sm truncate flex-1 mr-2">
              {sw.word}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
              style={{
                backgroundColor: `${partyColor}20`,
                color: partyColor,
              }}
            >
              {sw.ratio.toFixed(1)}x
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function SignatureWordsSlide({ parties, onNext }: SignatureWordsSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl lg:text-6xl mb-4 block">🎯</span>
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-2">
          Signature Words
        </h2>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Jede Partei hat ihre eigenen Lieblingswörter
        </p>
      </motion.div>

      {/* Grid of party cards */}
      <div className="w-full max-w-5xl">
        {/* Desktop: 3x2 grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          {parties.slice(0, 6).map((party, i) => (
            <PartySignatureCard key={party.party} party={party} index={i} />
          ))}
        </div>

        {/* Mobile: 2-column grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          {parties.slice(0, 6).map((party, i) => (
            <PartySignatureCard key={party.party} party={party} index={i} />
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/40 text-sm mt-6 text-center max-w-md"
      >
        Diese Wörter verwendet die Partei X-mal häufiger als der Durchschnitt
      </motion.p>

      <motion.button
        onClick={onNext}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Weiter
      </motion.button>
    </div>
  );
}
