/**
 * MobileWrappedPage - A simplified version of MainWrappedPage for mobile
 *
 * This component is designed to be used with expo-dom. It:
 * - Receives data as a prop (bundled offline) instead of fetching
 * - Has no Header/Footer (native app handles navigation)
 * - Has no SEO/meta tags
 * - Has no BackgroundSystem (simplified for performance)
 * - Has no ShareFAB (skipping sharepics for mobile)
 */

import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import type { WrappedData } from '@/data/wrapped';
import {
  ScrollContainer,
  SlideSection,
  useScrollWrapped,
  useAutoScroll,
  useSlideTransitionSound,
  SlideRenderer,
  SLIDES,
  type ScrollContainerRef,
  type SlideType,
} from '@/components/main-wrapped';

// Stable no-op function
const noop = () => {};

interface MobileWrappedPageProps {
  /** DOM prop required by Expo's 'use dom' directive */
  dom?: unknown;
  /** Bundled wrapped data passed from native context */
  data: WrappedData;
  /** Called when the experience is completed */
  onComplete?: () => void;
}

export function MobileWrappedPage({ data, onComplete }: MobileWrappedPageProps) {
  const scrollContainerRef = useRef<ScrollContainerRef>(null);

  const {
    correctCount,
    quizNumber,
    currentSection,
    initialSection,
    handleQuizAnswer,
    setCurrentSection,
    isQuizAnswered,
    quizAnsweredMap,
  } = useScrollWrapped();

  // Auto-scroll on intro slides
  useAutoScroll(currentSection, scrollContainerRef);

  // Play subtle whoosh sound on slide transitions
  useSlideTransitionSound(currentSection);

  // Track intro state
  const [introStarted, setIntroStarted] = useState(
    () => initialSection !== null && initialSection !== 'intro'
  );

  // Restore scroll position
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (initialSection && !hasRestoredRef.current && data) {
      hasRestoredRef.current = true;
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollToSlide(initialSection);
      });
    }
  }, [initialSection, data]);

  const handleQuizComplete = useCallback((slideId: string) => {
    if (slideId === 'intro') {
      setIntroStarted(true);
    }
    if (slideId === 'finale' && onComplete) {
      onComplete();
    }
    setTimeout(() => {
      scrollContainerRef.current?.scrollToNextSlide(slideId);
    }, 100);
  }, [onComplete]);

  const handleSectionChange = useCallback((id: string) => {
    setCurrentSection(id as SlideType);
  }, [setCurrentSection]);

  // Pre-compute callbacks
  const slideCallbacks = useMemo(() => {
    return Object.fromEntries(
      SLIDES.map((slideId) => [
        slideId,
        {
          onQuizAnswer: (isCorrect: boolean) => handleQuizAnswer(slideId, isCorrect),
          onQuizComplete: () => handleQuizComplete(slideId),
        },
      ])
    ) as Record<SlideType, { onQuizAnswer: (isCorrect: boolean) => void; onQuizComplete: () => void }>;
  }, [handleQuizAnswer, handleQuizComplete]);

  // Scroll lock logic
  const [scrollLocked, setScrollLocked] = useState(true);
  const shouldLock =
    (currentSection === 'intro' && !introStarted) ||
    (currentSection.startsWith('quiz-') && !isQuizAnswered(currentSection));

  useEffect(() => {
    if (shouldLock) {
      const timer = setTimeout(() => setScrollLocked(true), 200);
      return () => clearTimeout(timer);
    } else {
      setScrollLocked(false);
    }
  }, [shouldLock]);

  // Data is passed as prop, so no loading state needed
  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white/50">Keine Daten</div>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-950 min-h-screen h-full">
      <ScrollContainer
        ref={scrollContainerRef}
        onSectionChange={handleSectionChange}
        locked={scrollLocked}
      >
        {SLIDES.map((slideId) => (
          <SlideSection key={slideId} id={slideId}>
            <SlideRenderer
              slide={slideId}
              data={data}
              quizNumber={quizNumber}
              correctCount={correctCount}
              isQuizAnswered={quizAnsweredMap[slideId] ?? false}
              onQuizAnswer={slideCallbacks[slideId].onQuizAnswer}
              onQuizEnter={noop}
              onQuizComplete={slideCallbacks[slideId].onQuizComplete}
            />
          </SlideSection>
        ))}
      </ScrollContainer>
    </div>
  );
}
