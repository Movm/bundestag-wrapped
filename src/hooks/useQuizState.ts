import { useState, useCallback } from 'react';

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export function useQuizState(totalQuestions: number) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const submitAnswer = useCallback((questionIndex: number, selectedAnswer: string, correctAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer;
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionIndex !== questionIndex),
      { questionIndex, selectedAnswer, isCorrect },
    ]);
    return isCorrect;
  }, []);

  const getAnswer = useCallback((questionIndex: number) => {
    return answers.find((a) => a.questionIndex === questionIndex);
  }, [answers]);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const answeredCount = answers.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const reset = useCallback(() => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
  }, []);

  return {
    answers,
    submitAnswer,
    getAnswer,
    correctCount,
    answeredCount,
    score,
    totalQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    reset,
  };
}
