import { memo, useMemo } from 'react';
import type { PartyStats } from '@/data/wrapped';
import {
  SlideIntro,
  SlideQuiz,
  useQuizConfig,
  type SlidePhase,
} from '../shared';
import { ResultView } from './ResultView';

interface VocabularySlideProps {
  parties: PartyStats[];
  phase: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

export const VocabularySlide = memo(function VocabularySlide({
  parties,
  phase,
  onQuizAnswer,
  onComplete,
}: VocabularySlideProps) {
  // Use AfD specifically for this quiz
  const quizParty = useMemo(
    () => parties.find((p) => p.party === 'AfD' && p.signatureWords.length >= 4),
    [parties]
  );

  const quiz = useQuizConfig({
    items: quizParty?.signatureWords ?? [],
    getOption: (s) => s.word,
    question: quizParty
      ? `Welches Wort nutzt ${quizParty.party} am meisten im Vergleich zu anderen?`
      : '',
    getExplanation: (s) =>
      `"${s.word}" ist ${quizParty?.party ?? 'AfD'}s Lieblingswort (${s.ratio.toFixed(1)}x häufiger)!`,
  });

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="📚"
        title="Jede Fraktion hat ihre Lieblingswörter."
        subtitle="Erkennst du, welches Wort die Partei Die Linke am meisten Verwendet (im Vergleich zu anderen?"
      />
    );
  }

  if (phase === 'quiz' && quiz) {
    return (
      <SlideQuiz
        quiz={quiz}
        onAnswer={onQuizAnswer ?? (() => {})}
        onComplete={onComplete ?? (() => {})}
      />
    );
  }

  return <ResultView parties={parties} />;
});
