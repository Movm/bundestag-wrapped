import { motion } from 'motion/react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';
import { getPartyColor, PARTY_BG_CLASSES } from './party-colors';

interface IntroSectionProps {
  data: SpeakerWrapped;
  onNext: () => void;
}

export function IntroSection({ data, onNext }: IntroSectionProps) {
  const partyColor = getPartyColor(data.party);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-6xl mb-6">🏛️</div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
          {data.academicTitle ? `${data.academicTitle} ` : ''}{data.name}
        </h1>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white mb-8 ${
            PARTY_BG_CLASSES[data.party] || 'bg-gray-500'
          }`}
        >
          {data.party}
        </span>
        <p className="text-white/60 text-lg mb-8">Dein Bundestag Wrapped 2025</p>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        className="px-8 py-4 text-lg font-semibold rounded-2xl transition-all"
        style={{ backgroundColor: partyColor, color: 'white' }}
      >
        Los geht's
      </motion.button>
    </div>
  );
}
