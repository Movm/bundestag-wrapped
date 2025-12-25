import { memo } from 'react';
import {
  SlideIntro,
  SlideQuiz,
  useQuizConfig,
  type SlidePhase,
} from '../shared';
import { ResultView } from './ResultView';

interface CommonWordsSlideProps {
  topics: string[];
  phase?: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

export const CommonWordsSlide = memo(function CommonWordsSlide({
  topics,
  phase = 'result',
  onQuizAnswer,
  onComplete,
}: CommonWordsSlideProps) {
  const quiz = useQuizConfig({
    items: topics,
    getOption: (topic) => topic,
    question: 'Was war das meistgenutzte Wort?',
    getExplanation: (topic) =>
      `"${topic}" wurde von allen Fraktionen am häufigsten verwendet!`,
  });

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="📊"
        title="Diese Wörter nutzen alle Parteien."
        subtitle="Was war das meistgenutzte Wort?"
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

  return <ResultView topics={topics} />;
});
