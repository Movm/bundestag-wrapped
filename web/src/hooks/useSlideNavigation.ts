import { useState, useCallback } from 'react';

export function useSlideNavigation(totalSlides: number) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === totalSlides - 1;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    isFirst,
    isLast,
    progress,
    totalSlides,
  };
}
