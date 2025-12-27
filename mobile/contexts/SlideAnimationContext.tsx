/**
 * SlideAnimationContext - Provides current slide index for animation triggers
 *
 * Slides use this context to know when they become visible and should animate.
 */

import React, { createContext, useContext, useMemo } from 'react';

interface SlideAnimationContextValue {
  currentIndex: number;
}

const SlideAnimationContext = createContext<SlideAnimationContextValue>({
  currentIndex: 0,
});

export function SlideAnimationProvider({
  currentIndex,
  children,
}: {
  currentIndex: number;
  children: React.ReactNode;
}) {
  // Memoize context value to prevent re-renders when object identity changes
  // Without this, every slide wrapper re-renders on every scroll
  const value = useMemo(() => ({ currentIndex }), [currentIndex]);

  return (
    <SlideAnimationContext.Provider value={value}>
      {children}
    </SlideAnimationContext.Provider>
  );
}

export function useSlideAnimationContext() {
  return useContext(SlideAnimationContext);
}
