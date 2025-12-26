import { memo } from 'react';
import type { SpeakerSection } from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';
import { IntroSection } from './IntroSection';
import { WordsSection } from './WordsSection';
import { TopicsSection } from './TopicsSection';
import { AnimalSection } from './AnimalSection';
import { QuizSection } from './QuizSection';
import { EndSection } from './EndSection';

interface SpeakerSlideRendererProps {
  section: SpeakerSection;
  data: SpeakerWrapped;
  onQuizAnswer: (isCorrect: boolean) => void;
  onQuizNext: () => void;
  onRestart: () => void;
}

/**
 * SpeakerSlideRenderer - Renders the appropriate section component
 * based on the current section type
 */
export const SpeakerSlideRenderer = memo(function SpeakerSlideRenderer({
  section,
  data,
  onQuizAnswer,
  onQuizNext,
  onRestart,
}: SpeakerSlideRendererProps) {
  switch (section) {
    case 'intro':
      return <IntroSection data={data} />;

    case 'words':
      return <WordsSection data={data} />;

    case 'topics':
      return <TopicsSection data={data} />;

    case 'animal':
      return <AnimalSection data={data} />;

    case 'quiz':
      return <QuizSection data={data} onAnswer={onQuizAnswer} onNext={onQuizNext} />;

    case 'end':
      return <EndSection data={data} onRestart={onRestart} />;

    default:
      return null;
  }
});
