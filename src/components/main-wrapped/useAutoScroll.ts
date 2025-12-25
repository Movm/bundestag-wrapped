import { useEffect, type RefObject } from 'react';
import type { ScrollContainerRef } from './ScrollContainer';
import { AUTO_SCROLL_SLIDES, AUTO_SCROLL_DELAY, type SlideType } from './constants';

/**
 * Auto-scrolls to the next slide after a delay on intro slides.
 * Timer resets if user navigates away before it fires.
 */
export function useAutoScroll(
  currentSlide: SlideType,
  scrollContainerRef: RefObject<ScrollContainerRef | null>,
  delay: number = AUTO_SCROLL_DELAY
) {
  useEffect(() => {
    if (!AUTO_SCROLL_SLIDES.has(currentSlide)) return;

    const timer = setTimeout(() => {
      scrollContainerRef.current?.scrollToNextSlide(currentSlide);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentSlide, scrollContainerRef, delay]);
}
