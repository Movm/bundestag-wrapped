import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/data/wrapped';
import { getPartyColor, PARTY_COLORS } from '@/lib/party-colors';

interface QuizSlideProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

function SuccessOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      {/* Confetti particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#22c55e', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][
              Math.floor(Math.random() * 5)
            ],
          }}
          initial={{
            y: '50vh',
            opacity: 1,
            scale: 0,
            rotate: 0
          }}
          animate={{
            y: [null, `${Math.random() * 100 - 50}vh`],
            x: [null, `${Math.random() * 200 - 100}px`],
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Central success message */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="text-9xl mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🎉
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-green-400"
        >
          Richtig!
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function WrongOverlay({ explanation, onComplete }: { explanation: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="text-center px-8"
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ x: [-10, 10, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          😅
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-red-400 mb-4"
        >
          Nicht ganz...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-lg max-w-md mx-auto"
        >
          {explanation}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export function QuizSlide({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext
}: QuizSlideProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    onAnswer(answer === question.correctAnswer);
  };

  const handleOverlayComplete = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative">
      {/* Result Overlays */}
      <AnimatePresence>
        {showResult && isCorrect && (
          <SuccessOverlay onComplete={handleOverlayComplete} />
        )}
        {showResult && !isCorrect && (
          <WrongOverlay
            explanation={question.explanation}
            onComplete={handleOverlayComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm mb-4">
            Quiz {questionNumber}/{totalQuestions}
          </span>

          {question.type === 'guess-party' && question.word && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="mb-6"
            >
              <p className="text-white/60 text-sm mb-2">Welche Partei sagt</p>
              <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30">
                <span className="text-4xl font-black text-white">
                  "{question.word}"
                </span>
              </div>
              <p className="text-white/60 text-sm mt-2">am häufigsten?</p>
            </motion.div>
          )}

          {question.type === 'prediction' && (
            <h2 className="text-2xl font-bold text-white mb-6">
              {question.question}
            </h2>
          )}
        </div>

        {/* Options - 2x2 grid with party colors */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = option === question.correctAnswer;

            const fallbackColors = ['#f97316', '#0ea5e9', '#10b981', '#f59e0b'];

            // Check if option is a party or contains a party in parentheses like "Name (AfD)"
            const partyMatch = option.match(/\(([^)]+)\)$/);
            const partyName = partyMatch ? partyMatch[1] : option;
            const isParty = partyName in PARTY_COLORS;
            const baseColor = isParty ? getPartyColor(partyName) : fallbackColors[i];

            let style: React.CSSProperties = {
              background: `linear-gradient(135deg, ${baseColor}cc, ${baseColor}ee)`,
            };
            let ringClass = '';

            if (showResult) {
              if (isAnswer) {
                style = { background: 'linear-gradient(135deg, #22c55ecc, #16a34aee)' };
                ringClass = 'ring-2 ring-green-300';
              } else if (isSelected && !isAnswer) {
                style = { background: 'linear-gradient(135deg, #6b7280aa, #4b5563cc)' };
                ringClass = 'ring-2 ring-red-400';
              } else {
                style = { background: 'linear-gradient(135deg, #6b728066, #4b556388)' };
              }
            }

            return (
              <motion.button
                key={option}
                onClick={() => handleSelect(option)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
                style={style}
                className={`aspect-[4/3] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:brightness-110 ${ringClass} ${
                  showResult ? 'cursor-default opacity-50' : 'cursor-pointer'
                } ${showResult && (isAnswer || isSelected) ? '!opacity-100' : ''}`}
                whileHover={showResult ? {} : { scale: 1.04 }}
                whileTap={showResult ? {} : { scale: 0.96 }}
                disabled={showResult}
              >
                <span className="font-bold text-white text-base leading-tight drop-shadow-sm">
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
