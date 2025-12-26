import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType } from './constants';
import {
  getWrappedProgress,
  setWrappedProgress,
  clearWrappedProgress,
} from '@/lib/wrapped-storage';

// Pre-compute quiz slides at module level
const QUIZ_SLIDES = SLIDES.filter((s) => s.startsWith('quiz-'));

export interface ScrollWrappedState {
  // Quiz tracking
  quizAnswers: Record<string, boolean>;
  correctCount: number;
  quizNumber: number;

  // Current slide
  currentSection: SlideType;

  // Restored section (for scroll restoration on mount)
  initialSection: SlideType | null;

  // Actions
  handleQuizAnswer: (quizId: string, isCorrect: boolean) => void;
  setCurrentSection: (section: SlideType) => void;

  // Helpers
  isQuizAnswered: (quizId: string) => boolean;
  quizAnsweredMap: Record<string, boolean>;
}

// Load initial state from localStorage
function getInitialState() {
  const saved = getWrappedProgress();
  if (saved && SLIDES.includes(saved.currentSection as SlideType)) {
    return {
      quizAnswers: saved.quizAnswers,
      currentSection: saved.currentSection as SlideType,
    };
  }
  return { quizAnswers: {}, currentSection: 'intro' as SlideType };
}

export function useScrollWrapped(): ScrollWrappedState {
  const initialState = useMemo(() => getInitialState(), []);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>(
    initialState.quizAnswers
  );
  const [currentSection, setCurrentSection] = useState<SlideType>(
    initialState.currentSection
  );

  // Track initial section for scroll restoration (null after first render)
  const initialSectionRef = useRef<SlideType | null>(
    initialState.currentSection !== 'intro' ? initialState.currentSection : null
  );

  // Persist progress to localStorage on changes
  useEffect(() => {
    // Don't persist if on intro with no answers (fresh state)
    if (currentSection === 'intro' && Object.keys(quizAnswers).length === 0) {
      return;
    }

    // Clear progress when user completes the experience
    if (currentSection === 'finale') {
      clearWrappedProgress();
      return;
    }

    setWrappedProgress({ quizAnswers, currentSection });
  }, [quizAnswers, currentSection]);

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
    initialSection: initialSectionRef.current,
    handleQuizAnswer,
    setCurrentSection,
    isQuizAnswered,
    quizAnsweredMap,
  };
}

export { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType };
