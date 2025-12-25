import { useState, useCallback, useMemo } from 'react';
import { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType } from './constants';

export interface WrappedState {
  currentSlide: SlideType;
  quizAnswers: boolean[];
  progress: number;
  quizNumber: number;
  correctCount: number;
  goToNextSlide: () => void;
  handleQuizAnswer: (isCorrect: boolean) => void;
}

export function useWrappedState(): WrappedState {
  const [currentSlide, setCurrentSlide] = useState<SlideType>('intro');
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);

  const slideIndex = SLIDES.indexOf(currentSlide);
  const progress = ((slideIndex + 1) / SLIDES.length) * 100;

  const quizNumber = useMemo(() => {
    const quizSlides = SLIDES.filter((s) => s.startsWith('quiz-'));
    const currentQuizIndex = quizSlides.indexOf(currentSlide as (typeof quizSlides)[number]);
    return currentQuizIndex + 1;
  }, [currentSlide]);

  const correctCount = useMemo(
    () => quizAnswers.filter(Boolean).length,
    [quizAnswers]
  );

  const goToNextSlide = useCallback(() => {
    const currentIndex = SLIDES.indexOf(currentSlide);
    if (currentIndex < SLIDES.length - 1) {
      setCurrentSlide(SLIDES[currentIndex + 1]);
    }
  }, [currentSlide]);

  const handleQuizAnswer = useCallback((isCorrect: boolean) => {
    setQuizAnswers((prev) => [...prev, isCorrect]);
  }, []);

  return {
    currentSlide,
    quizAnswers,
    progress,
    quizNumber,
    correctCount,
    goToNextSlide,
    handleQuizAnswer,
  };
}

export { SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType };
