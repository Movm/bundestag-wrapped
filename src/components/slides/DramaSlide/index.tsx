import { memo } from 'react';
import type { DramaStats } from '@/data/wrapped';
import { formatNumber } from '@/lib/utils';
import {
  SlideIntro,
  SlideQuiz,
  useQuizConfig,
  type SlidePhase,
} from '../shared';
import { ResultView } from './ResultView';

interface DramaSlideProps {
  drama: DramaStats;
  phase?: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

export const DramaSlide = memo(function DramaSlide({
  drama,
  phase = 'result',
  onQuizAnswer,
  onComplete,
}: DramaSlideProps) {
  const quiz = useQuizConfig({
    items: drama.topZwischenrufer,
    getOption: (z) => z.name,
    question: 'Wer hat am meisten dazwischengerufen?',
    getExplanation: (z) =>
      `${z.name} (${z.party}) ist mit ${formatNumber(z.count)} Zwischenrufen der Spitzenreiter!`,
  });

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="🎭"
        title="Im Bundestag wird dazwischengerufen."
        subtitle="Wer stört am meisten?"
        slideId="intro-drama"
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

  return <ResultView drama={drama} />;
});
