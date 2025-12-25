import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface UseQuizGateOptions {
  quizId: string;
  isAnswered: boolean;
  onEnterView?: () => void;
}

interface UseQuizGateResult {
  ref: React.RefObject<HTMLDivElement>;
  isLocked: boolean;
  isInView: boolean;
}

export function useQuizGate({
  quizId: _quizId,
  isAnswered,
  onEnterView,
}: UseQuizGateOptions): UseQuizGateResult {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  // Notify parent when quiz enters view and is not answered
  useEffect(() => {
    if (isInView && !isAnswered) {
      onEnterView?.();
    }
  }, [isInView, isAnswered, onEnterView]);

  const isLocked = isInView && !isAnswered;

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isLocked,
    isInView,
  };
}
