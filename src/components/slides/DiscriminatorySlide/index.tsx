import { memo } from 'react';
import type { ToneAnalysis } from '@/data/wrapped';
import { SlideIntro, type SlidePhase } from '../shared';
import { ResultView } from './ResultView';

interface DiscriminatorySlideProps {
  toneAnalysis?: ToneAnalysis | null;
  phase?: SlidePhase;
}

export const DiscriminatorySlide = memo(function DiscriminatorySlide({
  toneAnalysis,
  phase = 'result',
}: DiscriminatorySlideProps) {
  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="⚠️"
        title="Manche Begriffe sind nicht neutral."
        subtitle="Welche Fraktion fällt auf?"
      />
    );
  }

  return <ResultView toneAnalysis={toneAnalysis} />;
});
