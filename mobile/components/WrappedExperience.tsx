/**
 * WrappedExperience - Main wrapped slide navigation
 *
 * Uses shared WrappedScrollContainer for unified scrolling behavior.
 */

import React, { useCallback, useMemo } from 'react';
import type { WrappedData } from '@/data/wrapped';
import { SlideRenderer, SLIDES, AUTO_SCROLL_SLIDES, AUTO_SCROLL_DELAY, type SlideType } from './SlideRenderer';
import { WrappedScrollContainer } from './WrappedScrollContainer';
import { useWrappedScroll } from '../hooks/useWrappedScroll';
import { SlideAnimationWrapper } from './SlideAnimationWrapper';
import { useSlideTransitionSound } from '~/lib/sounds';

interface WrappedExperienceProps {
  data: WrappedData;
  onComplete?: () => void;
}

/**
 * WrappedExperience - Main slide navigation component
 *
 * Uses shared scroll container for smooth vertical scrolling.
 * Features:
 * - Full-screen slides with snap-to-slide behavior
 * - Progress indicator
 * - Auto-scroll for intro/info slides
 * - Quiz state management
 */
export function WrappedExperience({ data, onComplete }: WrappedExperienceProps) {
  // Convert SLIDES to mutable array
  const slides = useMemo(() => [...SLIDES] as SlideType[], []);

  // Use shared scroll hook
  const scrollState = useWrappedScroll({
    items: slides,
    autoScrollItems: AUTO_SCROLL_SLIDES as Set<SlideType>,
    autoScrollDelay: AUTO_SCROLL_DELAY,
    isQuizItem: (slide) => slide.startsWith('quiz-'),
    onComplete,
    completeDelay: 2000,
  });

  // Quiz state (track across all quizzes)
  const [quizNumber, setQuizNumber] = React.useState(1);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [answeredQuizzes, setAnsweredQuizzes] = React.useState<Set<SlideType>>(new Set());

  const currentSlide = scrollState.currentItem;
  const isQuizAnswered = answeredQuizzes.has(currentSlide);

  // Play whoosh sound on slide transitions
  useSlideTransitionSound(currentSlide);

  // Quiz handlers
  const handleQuizAnswer = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
      setAnsweredQuizzes((prev) => new Set(prev).add(currentSlide));
      scrollState.handleQuizAnswer(isCorrect);
    },
    [currentSlide, scrollState]
  );

  const handleQuizComplete = useCallback(() => {
    if (currentSlide.startsWith('quiz-') && !answeredQuizzes.has(currentSlide)) {
      setQuizNumber((prev) => prev + 1);
    }
    scrollState.handleItemComplete();
  }, [currentSlide, answeredQuizzes, scrollState]);

  // Render slide
  const renderItem = useCallback(
    ({ item: slide, index }: { item: SlideType; index: number }) => (
      <SlideAnimationWrapper index={index}>
        <SlideRenderer
          slide={slide}
          data={data}
          quizNumber={quizNumber}
          correctCount={correctCount}
          isQuizAnswered={isQuizAnswered}
          onQuizAnswer={handleQuizAnswer}
          onQuizEnter={() => {}}
          onQuizComplete={handleQuizComplete}
          onStart={scrollState.handleStart}
        />
      </SlideAnimationWrapper>
    ),
    [data, quizNumber, correctCount, isQuizAnswered, handleQuizAnswer, handleQuizComplete, scrollState.handleStart]
  );

  // Key extractor
  const keyExtractor = useCallback((item: SlideType) => item, []);

  return (
    <WrappedScrollContainer
      scrollState={scrollState}
      items={slides}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      startOnFirstItemPress
    />
  );
}
