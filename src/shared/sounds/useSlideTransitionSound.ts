/**
 * Slide Transition Sound Hook Factory
 *
 * Creates a hook that plays a whoosh sound on slide transitions.
 * Platform-agnostic - accepts any playSound function.
 */

import { useEffect, useRef } from 'react';

type PlaySoundFn = (type: 'whoosh') => void | Promise<void>;

/**
 * Creates a useSlideTransitionSound hook bound to a specific playSound implementation.
 *
 * @param playSound - Platform-specific function to play sounds
 * @returns A hook that plays whoosh on slide changes
 */
export function createSlideTransitionSoundHook(playSound: PlaySoundFn) {
  return function useSlideTransitionSound(currentSlide: string) {
    const prevSlideRef = useRef<string | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
      // Skip first render (initial page load)
      if (isFirstRender.current) {
        isFirstRender.current = false;
        prevSlideRef.current = currentSlide;
        return;
      }

      // Only play sound if slide actually changed
      if (prevSlideRef.current !== currentSlide) {
        playSound('whoosh');
        prevSlideRef.current = currentSlide;
      }
    }, [currentSlide]);
  };
}
