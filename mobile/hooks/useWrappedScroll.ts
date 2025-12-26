/**
 * Shared Wrapped Scroll Hook
 *
 * Unified scrolling behavior for both main wrapped and speaker wrapped.
 * Handles: navigation, auto-scroll, progress tracking, scroll locking.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface UseWrappedScrollOptions<T> {
  /** Array of slide/section items */
  items: T[];
  /** Set of items that should auto-scroll (by item value or index) */
  autoScrollItems?: Set<T> | Set<number>;
  /** Auto-scroll delay in ms (default: 4000) */
  autoScrollDelay?: number;
  /** Check if an item is a quiz (blocks scrolling until answered) */
  isQuizItem?: (item: T) => boolean;
  /** Callback when experience completes (reaches last item) */
  onComplete?: () => void;
  /** Delay before calling onComplete (default: 2000) */
  completeDelay?: number;
}

export interface UseWrappedScrollReturn<T> {
  // Refs
  flatListRef: React.RefObject<FlatList | null>;

  // State
  currentIndex: number;
  currentItem: T;
  hasStarted: boolean;
  isQuizAnswered: boolean;
  isScrollLocked: boolean;

  // Derived
  totalItems: number;
  progress: number;

  // Handlers
  handleStart: () => void;
  handleQuizAnswer: (isCorrect: boolean) => void;
  handleItemComplete: () => void;
  handleScroll: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
  handleMomentumScrollEnd: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;

  // Navigation
  goToItem: (index: number, animated?: boolean) => void;
  nextItem: () => void;
  previousItem: () => void;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useWrappedScroll<T>({
  items,
  autoScrollItems,
  autoScrollDelay = 4000,
  isQuizItem,
  onComplete,
  completeDelay = 2000,
}: UseWrappedScrollOptions<T>): UseWrappedScrollReturn<T> {
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigation state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Quiz state
  const [answeredItems, setAnsweredItems] = useState<Set<number>>(new Set());

  // Current item
  const currentItem = items[currentIndex];

  // Quiz detection
  const isCurrentQuiz = isQuizItem ? isQuizItem(currentItem) : false;
  const isQuizAnswered = answeredItems.has(currentIndex);

  // Scroll locking: locked until started, or during unanswered quiz
  const isScrollLocked = !hasStarted || (isCurrentQuiz && !isQuizAnswered);

  // ─────────────────────────────────────────────────────────────
  // Navigation Methods
  // ─────────────────────────────────────────────────────────────

  const goToItem = useCallback(
    (index: number, animated = true) => {
      if (index < 0 || index >= items.length) return;

      flatListRef.current?.scrollToIndex({
        index,
        animated,
        viewPosition: 0,
      });
      setCurrentIndex(index);
    },
    [items.length]
  );

  const nextItem = useCallback(() => {
    if (currentIndex < items.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      goToItem(currentIndex + 1);
    }
  }, [currentIndex, items.length, goToItem]);

  const previousItem = useCallback(() => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      goToItem(currentIndex - 1);
    }
  }, [currentIndex, goToItem]);

  // ─────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setHasStarted(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nextItem();
  }, [nextItem]);

  const handleQuizAnswer = useCallback(
    (isCorrect: boolean) => {
      setAnsweredItems((prev) => new Set(prev).add(currentIndex));
      Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      );
    },
    [currentIndex]
  );

  const handleItemComplete = useCallback(() => {
    nextItem();
  }, [nextItem]);

  // ─────────────────────────────────────────────────────────────
  // Scroll Handlers
  // ─────────────────────────────────────────────────────────────

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / SCREEN_HEIGHT);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, items.length]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / SCREEN_HEIGHT);
      setCurrentIndex(newIndex);

      // Check for completion
      if (newIndex === items.length - 1 && onComplete) {
        completeTimer.current = setTimeout(onComplete, completeDelay);
      }
    },
    [items.length, onComplete, completeDelay]
  );

  // ─────────────────────────────────────────────────────────────
  // Auto-scroll Effect
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    // Clear any existing timer
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }

    if (!autoScrollItems || !hasStarted) return;

    // Check if current item should auto-scroll (by value or index)
    const shouldAutoScroll =
      autoScrollItems.has(currentItem as any) || autoScrollItems.has(currentIndex as any);

    if (shouldAutoScroll) {
      autoScrollTimer.current = setTimeout(() => {
        nextItem();
      }, autoScrollDelay);
    }

    return () => {
      if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current);
      }
    };
  }, [currentItem, currentIndex, hasStarted, autoScrollItems, autoScrollDelay, nextItem]);

  // Cleanup complete timer
  useEffect(() => {
    return () => {
      if (completeTimer.current) {
        clearTimeout(completeTimer.current);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────

  return {
    flatListRef,
    currentIndex,
    currentItem,
    hasStarted,
    isQuizAnswered,
    isScrollLocked,
    totalItems: items.length,
    progress: items.length > 0 ? (currentIndex + 1) / items.length : 0,
    handleStart,
    handleQuizAnswer,
    handleItemComplete,
    handleScroll,
    handleMomentumScrollEnd,
    goToItem,
    nextItem,
    previousItem,
  };
}
