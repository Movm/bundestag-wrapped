import { useMemo } from 'react';
import { shuffle } from '../utils';
import type { QuizConfig } from '../SlideQuiz';

export interface QuizConfigOptions<T> {
  /** Array of items to build quiz from */
  items: T[];
  /** Extract the display string from an item (used as option text) */
  getOption: (item: T) => string;
  /** The quiz question text */
  question: string;
  /** Generate explanation text from the correct item */
  getExplanation: (winner: T) => string;
  /** Optional: Select which item is correct (defaults to first item) */
  getCorrectItem?: (items: T[]) => T | undefined;
  /** Number of options to show (defaults to 4) */
  optionCount?: number;
}

/**
 * Hook to build a memoized quiz configuration
 * Eliminates duplicate quiz-building logic across slides
 *
 * @example
 * const quiz = useQuizConfig({
 *   items: party.signatureWords,
 *   getOption: (w) => w.word,
 *   question: 'Welches Wort nutzt die Partei am meisten?',
 *   getExplanation: (w) => `"${w.word}" ist das Lieblingswort!`,
 * });
 */
export function useQuizConfig<T>(options: QuizConfigOptions<T>): QuizConfig | null {
  const {
    items,
    getOption,
    question,
    getExplanation,
    getCorrectItem = (arr) => arr[0],
    optionCount = 4,
  } = options;

  return useMemo(() => {
    if (!items || items.length < optionCount) return null;

    const correctItem = getCorrectItem(items);
    if (!correctItem) return null;

    const correctAnswer = getOption(correctItem);
    const optionItems = items.slice(0, optionCount);
    const shuffledOptions = shuffle(optionItems.map(getOption));

    return {
      question,
      options: shuffledOptions,
      correctAnswer,
      explanation: getExplanation(correctItem),
    };
  }, [items, getOption, question, getExplanation, getCorrectItem, optionCount]);
}
