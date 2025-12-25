import { memo } from 'react';
import type { TopSpeaker } from '@/data/wrapped';
import {
  SlideIntro,
  SlideQuiz,
  useQuizConfig,
  type SlidePhase,
} from '../shared';
import { ResultView } from './ResultView';

interface TopSpeakerByWords {
  name: string;
  party: string;
  totalWords: number;
  speeches: number;
}

interface TopSpeakerByAvgWords {
  name: string;
  party: string;
  avgWords: number;
  totalWords: number;
  speeches: number;
}

interface TopSpeakersSlideProps {
  speakers: TopSpeaker[];
  speakersByWords?: TopSpeakerByWords[];
  speakersByAvgWords?: TopSpeakerByAvgWords[];
  phase?: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

export const TopSpeakersSlide = memo(function TopSpeakersSlide({
  speakers,
  speakersByWords = [],
  speakersByAvgWords = [],
  phase = 'result',
  onQuizAnswer,
  onComplete,
}: TopSpeakersSlideProps) {
  const quiz = useQuizConfig({
    items: speakers,
    getOption: (s) => s.name,
    question: 'Wer hat die meisten Reden gehalten?',
    getExplanation: (s) =>
      `${s.name} (${s.party}) führt mit ${s.speeches} Reden!`,
  });

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="🏆"
        title="Manche reden mehr als andere."
        subtitle="Wer hat die meisten Reden gehalten?"
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

  return (
    <ResultView
      speakers={speakers}
      speakersByWords={speakersByWords}
      speakersByAvgWords={speakersByAvgWords}
    />
  );
});
