import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { getPartyBgColor, PARTY_COLORS } from '@/lib/party-colors';
import { playSound } from '@/lib/sounds';
import { Confetti } from './Confetti';

export interface QuizConfig {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizOptionWithCorrect {
  text: string;
  isCorrect: boolean;
}

export interface QuizConfigAlt {
  question: string;
  options: QuizOptionWithCorrect[];
  explanation: string | string[];
}

interface NormalizedQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string[];
}

function normalizeQuizConfig(config: QuizConfig | QuizConfigAlt): NormalizedQuiz {
  if ('correctAnswer' in config) {
    return {
      question: config.question,
      options: config.options,
      correctAnswer: config.correctAnswer,
      explanation: [config.explanation],
    };
  }
  const correctOption = config.options.find((o) => o.isCorrect);
  return {
    question: config.question,
    options: config.options.map((o) => o.text),
    correctAnswer: correctOption?.text ?? '',
    explanation: Array.isArray(config.explanation)
      ? config.explanation
      : [config.explanation],
  };
}

interface SlideQuizProps {
  quiz: QuizConfig | QuizConfigAlt;
  onAnswer: (isCorrect: boolean) => void;
  onComplete: () => void;
  title?: string;
  emoji?: string;
  badge?: string;
  partyColor?: string;
}

const FALLBACK_COLORS = ['#2d2d3a', '#363647', '#3f3f52', '#4a4a5e'];

function SuccessOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    playSound('correct');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onComplete, 1500)}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <Confetti count={20} />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center"
      >
        <div className="text-8xl mb-4">🎉</div>
        <p className="text-3xl font-black text-green-400">Richtig!</p>
      </motion.div>
    </motion.div>
  );
}

function WrongOverlay({
  explanation,
  onComplete,
}: {
  explanation: string[];
  onComplete: () => void;
}) {
  useEffect(() => {
    playSound('wrong');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onComplete, 2000)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center px-8"
      >
        <div className="text-7xl mb-4">😅</div>
        <p className="text-2xl font-bold text-red-400 mb-3">Nicht ganz...</p>
        <div className="text-white/70 text-base max-w-sm mx-auto space-y-1">
          {explanation.map((line, i) => (
            <p key={i}>{explanation.length > 1 ? `• ${line}` : line}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SlideQuiz({
  quiz: rawQuiz,
  onAnswer,
  onComplete,
  title,
  emoji,
  badge,
  partyColor: _partyColor,
}: SlideQuizProps) {
  const quiz = useMemo(() => normalizeQuizConfig(rawQuiz), [rawQuiz]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  const optionColors = useMemo(
    () =>
      quiz.options.map((option, i) => {
        const partyMatch = option.match(/\(([^)]+)\)$/);
        const partyName = partyMatch ? partyMatch[1] : option;
        const isParty = partyName in PARTY_COLORS;
        return isParty ? getPartyBgColor(partyName) : FALLBACK_COLORS[i];
      }),
    [quiz.options]
  );

  const handleSelect = (answer: string) => {
    if (showResult) return;

    playSound('click');
    const correct = answer === quiz.correctAnswer;
    setSelectedAnswer(answer);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleOverlayComplete = () => {
    setShowResult(false);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <AnimatePresence>
        {showResult && isCorrect && (
          <SuccessOverlay onComplete={handleOverlayComplete} />
        )}
        {showResult && !isCorrect && (
          <WrongOverlay
            explanation={quiz.explanation}
            onComplete={handleOverlayComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {(emoji || title || badge) && (
          <div className="text-center mb-6">
            {emoji && <div className="text-5xl mb-3">{emoji}</div>}
            {title && (
              <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
            )}
            {badge && <p className="text-white/40 text-sm">{badge}</p>}
          </div>
        )}

        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {quiz.question}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {quiz.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = option === quiz.correctAnswer;
            const baseColor = optionColors[i];

            let style: React.CSSProperties = {
              background: `linear-gradient(135deg, ${baseColor}cc, ${baseColor}ee)`,
            };
            let ringClass = '';

            if (showResult) {
              if (isAnswer) {
                style = {
                  background: 'linear-gradient(135deg, #22c55ecc, #16a34aee)',
                };
                ringClass = 'ring-2 ring-green-300';
              } else if (isSelected) {
                style = {
                  background: 'linear-gradient(135deg, #6b7280aa, #4b5563cc)',
                };
                ringClass = 'ring-2 ring-red-400';
              } else {
                style = {
                  background: 'linear-gradient(135deg, #6b728066, #4b556388)',
                };
              }
            }

            const isEmoji = /^\p{Emoji}/u.test(option);

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(option)}
                style={style}
                className={`aspect-[4/3] p-4 rounded-2xl flex items-center justify-center text-center transition-all hover:brightness-110 ${ringClass} ${
                  showResult ? 'cursor-default opacity-50' : 'cursor-pointer'
                } ${showResult && (isAnswer || isSelected) ? '!opacity-100' : ''}`}
                whileHover={showResult ? {} : { scale: 1.04 }}
                whileTap={showResult ? {} : { scale: 0.96 }}
                disabled={showResult}
              >
                {isEmoji ? (
                  <span className="text-5xl">{option}</span>
                ) : (
                  <span className="font-bold text-white text-base leading-tight drop-shadow-sm">
                    {option}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
