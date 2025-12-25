import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';
import { getPartyColor } from './party-colors';
import { SpeakerShareModal } from '@/components/ui/SpeakerShareModal';

interface EndSectionProps {
  data: SpeakerWrapped;
  onRestart: () => void;
}

export function EndSection({ data, onRestart }: EndSectionProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const partyColor = getPartyColor(data.party);

  const shareData = {
    name: data.name,
    party: data.party,
    spiritAnimal: data.spiritAnimal ? {
      emoji: data.spiritAnimal.emoji,
      name: data.spiritAnimal.name,
      title: data.spiritAnimal.title,
      reason: data.spiritAnimal.reason,
    } : null,
    signatureWord: data.words.signatureWords[0] ? {
      word: data.words.signatureWords[0].word,
      ratioParty: data.words.signatureWords[0].ratioParty,
      ratioBundestag: data.words.signatureWords[0].ratioBundestag,
    } : null,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Das war's!
        </h2>
        <p className="text-white/60 mb-8">
          Dein Bundestag Wrapped 2025
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {data.funFacts.slice(0, 4).map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl mb-1">{fact.emoji}</div>
                <div className="text-white font-semibold">{fact.value}</div>
                <div className="text-white/50 text-xs">{fact.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => setShowShareModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl text-white font-bold"
          >
            Ergebnis teilen
          </motion.button>
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 text-white font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: partyColor }}
          >
            🔄 Nochmal ansehen
          </motion.button>
          <Link
            to="/abgeordnete"
            className="block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl transition-colors"
          >
            Andere Abgeordnete ansehen
          </Link>
          <Link
            to="/"
            className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 text-center rounded-xl transition-colors"
          >
            Zum Haupt-Wrapped
          </Link>
        </div>
      </motion.div>

      <SpeakerShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={shareData}
      />
    </div>
  );
}
