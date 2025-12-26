/**
 * SlideAnimationContext - Provides current slide index for animation triggers
 *
 * Slides use this context to know when they become visible and should animate.
 */

import React, { createContext, useContext } from 'react';

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
  return (
    <SlideAnimationContext.Provider value={{ currentIndex }}>
      {children}
    </SlideAnimationContext.Provider>
  );
}

export function useSlideAnimationContext() {
  return useContext(SlideAnimationContext);
}
