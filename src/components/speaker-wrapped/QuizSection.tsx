import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';
import { getPartyColor } from './party-colors';
import { SlideQuiz, type QuizConfigAlt } from '@/components/slides/shared/SlideQuiz';

interface QuizSectionProps {
  data: SpeakerWrapped;
  onNext: () => void;
}

export function QuizSection({ data, onNext }: QuizSectionProps) {
  const partyColor = getPartyColor(data.party);
  const nounQuiz = data.signatureQuiz;

  const quizConfig = useMemo((): QuizConfigAlt | null => {
    if (!nounQuiz) return null;
    const explanationParty = nounQuiz.explanationParty ?? (nounQuiz as any).explanation ?? '';
    const explanationBundestag = nounQuiz.explanationBundestag ?? '';
    return {
      question: nounQuiz.question,
      options: nounQuiz.options,
      explanation: explanationBundestag
        ? [explanationParty, explanationBundestag]
        : explanationParty,
    };
  }, [nounQuiz]);

  if (!quizConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Bereit für die Statistiken?
          </h2>
          <p className="text-white/60 mb-8">
            Lass uns sehen, wie du im Bundestag performt hast.
          </p>
          <button
            onClick={onNext}
            className="px-8 py-4 text-lg font-semibold rounded-2xl text-white"
            style={{ backgroundColor: partyColor }}
          >
            Weiter
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <SlideQuiz
      quiz={quizConfig}
      onAnswer={() => {}}
      onComplete={onNext}
      emoji="🎯"
      title="Wort-Quiz"
      partyColor={partyColor}
    />
  );
}
