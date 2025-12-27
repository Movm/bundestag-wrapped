import { memo } from 'react';
import type { ToneAnalysis } from '@/data/wrapped';
import { SlideIntro, type SlidePhase } from '../shared';
import { ResultView } from './ResultView';

interface ToneAnalysisSlideProps {
  toneAnalysis: ToneAnalysis;
  phase?: SlidePhase;
}

export const ToneAnalysisSlide = memo(function ToneAnalysisSlide({
  toneAnalysis,
  phase = 'result',
}: ToneAnalysisSlideProps) {
  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="🎭"
        title="Jede Fraktion hat ihren eigenen Ton."
        subtitle="Welches Emoji passt zur SPD?"
        slideId="intro-tone"
      />
    );
  }

  return <ResultView toneAnalysis={toneAnalysis} />;
});
