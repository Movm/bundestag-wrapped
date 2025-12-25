import { useState, useCallback, useMemo, useRef } from 'react';
import { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType } from './constants';

// Pre-compute quiz slides at module level
const QUIZ_SLIDES = SLIDES.filter((s) => s.startsWith('quiz-'));

export interface ScrollWrappedState {
  // Quiz tracking
  quizAnswers: Record<string, boolean>;
  correctCount: number;
  quizNumber: number;

  // Current slide
  currentSection: SlideType;

  // Actions
  handleQuizAnswer: (quizId: string, isCorrect: boolean) => void;
  setCurrentSection: (section: SlideType) => void;

  // Helpers
  isQuizAnswered: (quizId: string) => boolean;
  quizAnsweredMap: Record<string, boolean>;
}

export function useScrollWrapped(): ScrollWrappedState {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  const [currentSection, setCurrentSection] = useState<SlideType>('intro');

  // Calculate correct count from answers
  const correctCount = useMemo(
    () => Object.values(quizAnswers).filter(Boolean).length,
    [quizAnswers]
  );

  // Calculate current quiz number based on section (uses module-level QUIZ_SLIDES)
  const quizNumber = useMemo(() => {
    const currentQuizIndex = QUIZ_SLIDES.indexOf(
      currentSection as (typeof QUIZ_SLIDES)[number]
    );
    return currentQuizIndex >= 0 ? currentQuizIndex + 1 : 0;
  }, [currentSection]);

  // Record a quiz answer
  const handleQuizAnswer = useCallback((quizId: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: isCorrect }));
  }, []);

  // Pre-compute answered state for all slides (avoids function calls in render)
  const quizAnsweredMap = useMemo(() => {
    return Object.fromEntries(SLIDES.map((id) => [id, id in quizAnswers])) as Record<string, boolean>;
  }, [quizAnswers]);

  // Ref-based stable isQuizAnswered for cases where callback is needed
  const quizAnswersRef = useRef(quizAnswers);
  quizAnswersRef.current = quizAnswers;

  const isQuizAnswered = useCallback(
    (quizId: string) => quizId in quizAnswersRef.current,
    []
  );

  return {
    quizAnswers,
    correctCount,
    quizNumber,
    currentSection,
    handleQuizAnswer,
    setCurrentSection,
    isQuizAnswered,
    quizAnsweredMap,
  };
}

export { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType };
