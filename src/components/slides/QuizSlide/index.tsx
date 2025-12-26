import { memo, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import type { QuizQuestion } from '@/data/wrapped';
import { getPartyBgColor, PARTY_COLORS } from '@/lib/party-colors';
import { playSound } from '@/lib/sounds';
import {
  Confetti,
  ScrollHint,
  quizContainerVariants,
  quizItemVariants,
  optionButtonVariants,
  featuredWordVariants,
} from '../shared';

interface QuizSlideProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  isAnswered: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onEnterView: () => void;
  onComplete: () => void;
}

const FALLBACK_COLORS = ['#2d2d3a', '#363647', '#3f3f52', '#4a4a5e'];

const EMOJI_CHAOS_POSITIONS = [
  { top: '0%', left: '5%', size: 'text-6xl md:text-7xl', rotate: -8 },
  { top: '0%', right: '5%', size: 'text-7xl md:text-8xl', rotate: 6 },
  { bottom: '0%', left: '8%', size: 'text-5xl md:text-6xl', rotate: -4 },
  { bottom: '0%', right: '2%', size: 'text-6xl md:text-7xl', rotate: 10 },
];

const EMOJI_FLOAT_ANIMATIONS = [
  { y: [0, -12, 0], rotate: [0, -3, 0], duration: 3.5 },
  { y: [0, -10, 0], rotate: [0, 4, 0], duration: 4.0 },
  { y: [0, -14, 0], rotate: [0, -2, 0], duration: 3.8 },
  { y: [0, -8, 0], rotate: [0, 3, 0], duration: 4.2 },
];

function SuccessOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    playSound('correct');
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
      <Confetti count={30} />
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
            rotate: [0, -5, 5, 0],
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

function WrongOverlay({
  explanation,
  onComplete,
}: {
  explanation: string;
  onComplete: () => void;
}) {
  useEffect(() => {
    playSound('wrong');
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

function LockIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 18,
      }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-pink-600/90 backdrop-blur-sm px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg"
    >
      Beantworte die Frage um weiterzuscrollen
    </motion.div>
  );
}

export const QuizSlide = memo(function QuizSlide({
  question,
  questionNumber,
  totalQuestions,
  isAnswered,
  onAnswer,
  onEnterView,
  onComplete,
}: QuizSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasTriggeredEnter, setHasTriggeredEnter] = useState(false);
  const [showLockHint, setShowLockHint] = useState(false);

  const isCorrect = selectedAnswer === question.correctAnswer;

  useEffect(() => {
    if (isInView && !isAnswered && !hasTriggeredEnter) {
      setHasTriggeredEnter(true);
      setShowLockHint(true);
      onEnterView();
    }
  }, [isInView, isAnswered, hasTriggeredEnter, onEnterView]);

  useEffect(() => {
    if (showLockHint) {
      const timer = setTimeout(() => setShowLockHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLockHint]);

  const handleSelect = (answer: string) => {
    if (showResult || isAnswered) return;
    playSound('click');
    setSelectedAnswer(answer);
    setShowResult(true);
    onAnswer(answer === question.correctAnswer);
  };

  const handleOverlayComplete = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    onComplete();
  };

  const optionColors = useMemo(
    () =>
      question.options.map((option, i) => {
        const partyMatch = option.match(/\(([^)]+)\)$/);
        const partyName = partyMatch ? partyMatch[1] : option;
        const isParty = partyName in PARTY_COLORS;
        return isParty ? getPartyBgColor(partyName) : FALLBACK_COLORS[i];
      }),
    [question.options]
  );

  return (
    <div
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative"
    >
      <AnimatePresence>
        {showLockHint && !showResult && <LockIndicator />}
      </AnimatePresence>

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
        variants={quizContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-md md:max-w-2xl mx-auto"
      >
        <motion.div variants={quizItemVariants} className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm mb-4">
            Quiz {questionNumber}/{totalQuestions}
          </span>

          {question.type === 'guess-party' && question.word && (
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">Welche Partei sagt</p>
              <motion.div
                variants={featuredWordVariants}
                className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-br from-pink-600/30 to-pink-600/30 border border-pink-500/30"
              >
                <span className="text-4xl font-black text-white">
                  "{question.word}"
                </span>
              </motion.div>
              <p className="text-white/60 text-sm mt-2">am häufigsten?</p>
            </div>
          )}

          {question.type === 'prediction' && (
            <motion.h2
              variants={quizItemVariants}
              className="text-2xl font-bold text-white mb-6"
            >
              {question.question}
            </motion.h2>
          )}

          {question.type === 'emoji-quiz' && question.party && (
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">Welches Emoji passt zu</p>
              <motion.div
                variants={featuredWordVariants}
                className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-600/30 border border-purple-500/30"
              >
                <span className="text-4xl font-black text-white">
                  {question.party}
                </span>
              </motion.div>
              <p className="text-white/60 text-sm mt-2">am besten?</p>
            </div>
          )}
        </motion.div>

        {question.type === 'emoji-quiz' ? (
          <div className="grid grid-cols-2 gap-6 md:gap-12 w-full max-w-lg md:max-w-2xl mx-auto">
            {question.options.map((option, i) => {
              const pos = EMOJI_CHAOS_POSITIONS[i];
              const anim = EMOJI_FLOAT_ANIMATIONS[i];
              const isSelected = selectedAnswer === option;
              const isAnswer = option === question.correctAnswer;
              const isDisabled = showResult || isAnswered;

              let glowClass = '';
              let opacityClass = '';

              if (showResult || isAnswered) {
                if (isAnswer) {
                  glowClass = 'drop-shadow-[0_0_30px_rgba(34,197,94,0.9)]';
                } else if (isSelected && !isAnswer) {
                  opacityClass = 'opacity-40';
                } else {
                  opacityClass = 'opacity-30';
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(option)}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    rotate: pos.rotate - 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: pos.rotate,
                    y: isDisabled ? 0 : anim.y,
                    ...(isDisabled ? {} : { rotate: anim.rotate.map(r => r + pos.rotate) }),
                  }}
                  transition={isDisabled ? {
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  } : {
                    opacity: { duration: 0.4, delay: i * 0.1 },
                    scale: { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.1 },
                    rotate: { duration: anim.duration, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: anim.duration, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={isDisabled ? {} : { scale: 1.25 }}
                  whileTap={isDisabled ? {} : { scale: 0.85 }}
                  disabled={isDisabled}
                  className={`${pos.size} cursor-pointer select-none transition-all duration-300 flex items-center justify-center aspect-square ${glowClass} ${opacityClass} ${
                    isDisabled ? 'cursor-default' : 'hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                  }`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm md:max-w-lg mx-auto">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isAnswer = option === question.correctAnswer;
              const baseColor = optionColors[i];

              let style: React.CSSProperties = {
                background: `linear-gradient(135deg, ${baseColor}cc, ${baseColor}ee)`,
              };
              let ringClass = '';

              if (showResult || isAnswered) {
                if (isAnswer) {
                  style = {
                    background: 'linear-gradient(135deg, #22c55ecc, #16a34aee)',
                  };
                  ringClass = 'ring-2 ring-green-300';
                } else if (isSelected && !isAnswer) {
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

              const isDisabled = showResult || isAnswered;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(option)}
                  variants={optionButtonVariants}
                  custom={i}
                  style={style}
                  className={`aspect-[4/3] md:aspect-[3/2] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:brightness-110 ${ringClass} ${
                    isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer'
                  } ${(showResult || isAnswered) && (isAnswer || isSelected) ? '!opacity-100' : ''}`}
                  whileHover={isDisabled ? {} : { scale: 1.04 }}
                  whileTap={isDisabled ? {} : { scale: 0.96 }}
                  disabled={isDisabled}
                >
                  <span className="font-bold text-white text-base leading-tight drop-shadow-sm">
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {isAnswered && !showResult && (
        <ScrollHint
          delay={0.5}
          trigger="immediate"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  );
});
