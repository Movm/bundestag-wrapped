import { memo } from 'react';
import type { TopicAnalysis } from '@/data/wrapped';
import { SlideIntro, type SlidePhase } from '../shared';
import { ResultView } from './ResultView';

interface TopicsSlidezProps {
  topicAnalysis: TopicAnalysis;
  phase?: SlidePhase;
}

export const TopicsSlide = memo(function TopicsSlide({
  topicAnalysis,
  phase = 'result',
}: TopicsSlidezProps) {
  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="📊"
        title="Worüber spricht der Bundestag?"
        subtitle="12 Themen im Fokus"
      />
    );
  }

  return <ResultView topicAnalysis={topicAnalysis} />;
});

export { TOPICS, TOPIC_BY_ID } from './constants';
