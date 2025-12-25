import { motion } from 'motion/react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';

interface WordsSectionProps {
  data: SpeakerWrapped;
  onNext: () => void;
}

export function WordsSection({ data, onNext }: WordsSectionProps) {
  const topWords = data.words.topWords.slice(0, 6);
  const signatureWords = data.words.signatureWords || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col lg:flex-row lg:items-start lg:gap-12"
      >
        {/* Left: Lieblingswörter */}
        <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Deine Lieblingswörter</h2>
          <p className="text-white/60 mb-6">Die häufigsten Begriffe in deinen Reden</p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {topWords.map((word, i) => (
              <motion.div
                key={word.word}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full"
              >
                <span className="text-white font-medium">{word.word}</span>
                <span className="text-white/40 ml-2 text-sm">{word.count}×</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Signature Words */}
        {signatureWords.length > 0 && (
          <div className="flex-1 text-center lg:text-left">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-white mb-2">Deine Signature Words</h2>
            <p className="text-white/60 mb-6">
              Wörter die du häufiger nutzt als andere
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {signatureWords.map((word, i) => (
                <motion.div
                  key={word.word}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-full"
                >
                  <span className="text-white font-medium">{word.word}</span>
                  <span className="text-white/40 ml-2 text-sm">
                    {word.ratioBundestag ?? word.ratioParty ?? (word as any).ratio ?? 0}×
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onNext}
        className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
      >
        Weiter
      </motion.button>
    </div>
  );
}
