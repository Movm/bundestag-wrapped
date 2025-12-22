import { useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ShareModal } from '@/components/ui/ShareModal';
import { formatNumber } from '@/lib/utils';

interface GrandFinaleSlideProps {
  totalSpeeches: number;
  totalWords: number;
  partyCount: number;
  speakerCount: number;
  sitzungen: number;
  correctCount: number;
  totalQuestions: number;
}

function getQuizMessage(percentage: number): { emoji: string; text: string; color: string } {
  if (percentage >= 80) return { emoji: '🏆', text: 'Bundestag-Experte!', color: 'text-yellow-400' };
  if (percentage >= 60) return { emoji: '👍', text: 'Gut informiert!', color: 'text-green-400' };
  if (percentage >= 40) return { emoji: '📚', text: 'Ausbaufähig!', color: 'text-blue-400' };
  return { emoji: '🤔', text: 'Mehr Nachrichten schauen!', color: 'text-purple-400' };
}

export function GrandFinaleSlide({
  totalSpeeches,
  totalWords,
  partyCount,
  speakerCount,
  sitzungen,
  correctCount,
  totalQuestions,
}: GrandFinaleSlideProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const quizPercentage = Math.round((correctCount / totalQuestions) * 100);
  const quizResult = getQuizMessage(quizPercentage);
  const wordsPerDay = Math.round(totalWords / sitzungen);
  const avgWordsPerSpeech = Math.round(totalWords / totalSpeeches);
  const booksEquivalent = Math.round(totalWords / 50000);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 md:w-4 md:h-4 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#22c55e', '#eab308'][
                Math.floor(Math.random() * 5)
              ],
            }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-5xl text-center z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="mb-8"
        >
          <span className="text-7xl md:text-8xl">🏛️</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black gradient-text mb-3"
        >
          Das war 2025
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 text-lg md:text-xl mb-12"
        >
          21. Wahlperiode in Zahlen
        </motion.p>

        {/* Big Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-2xl p-6 md:p-8 border border-purple-500/30"
          >
            <AnimatedCounter
              value={totalSpeeches}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white block"
            />
            <p className="text-purple-300 text-sm md:text-base mt-2">Reden</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 rounded-2xl p-6 md:p-8 border border-pink-500/30"
          >
            <AnimatedCounter
              value={totalWords}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white block"
              format={(n) => {
                if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
                if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
                return formatNumber(Math.round(n));
              }}
            />
            <p className="text-pink-300 text-sm md:text-base mt-2">Wörter</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-2xl p-6 md:p-8 border border-blue-500/30"
          >
            <AnimatedCounter
              value={partyCount}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white block"
            />
            <p className="text-blue-300 text-sm md:text-base mt-2">Parteien</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-green-600/30 to-green-800/30 rounded-2xl p-6 md:p-8 border border-green-500/30"
          >
            <AnimatedCounter
              value={speakerCount}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white block"
            />
            <p className="text-green-300 text-sm md:text-base mt-2">Redner:innen</p>
          </motion.div>
        </div>

        {/* Fun Facts - horizontal on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-10"
        >
          <h3 className="text-white/60 text-sm uppercase tracking-wide mb-6">Fun Facts</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="flex items-center gap-4"
            >
              <span className="text-4xl">📅</span>
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-purple-400">{formatNumber(wordsPerDay)}</p>
                <p className="text-white/60 text-sm">Wörter pro Sitzungstag</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="flex items-center gap-4"
            >
              <span className="text-4xl">🎤</span>
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-pink-400">{formatNumber(avgWordsPerSpeech)}</p>
                <p className="text-white/60 text-sm">Wörter pro Rede</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 }}
              className="flex items-center gap-4"
            >
              <span className="text-4xl">📚</span>
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-blue-400">{booksEquivalent}</p>
                <p className="text-white/60 text-sm">Bücher-Äquivalent</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quiz Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
          className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 mb-8"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <span className="text-5xl md:text-6xl">{quizResult.emoji}</span>
            <div className="text-left">
              <p className="text-3xl md:text-4xl font-black text-white">
                {correctCount}/{totalQuestions}
                <span className="text-white/60 text-xl md:text-2xl ml-2">({quizPercentage}%)</span>
              </p>
              <p className={`text-lg md:text-xl font-bold ${quizResult.color}`}>
                {quizResult.text}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.button
          onClick={() => setShowShareModal(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg mb-10"
        >
          Ergebnis teilen
        </motion.button>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-center"
        >
          <p className="text-white/40 text-sm md:text-base mb-2">
            Daten: Bundestag DIP API via bundestag-mcp
          </p>
          <p className="text-white/60 text-xs md:text-sm">
            Made with 💜 using React, Motion & Tailwind
          </p>
        </motion.div>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
