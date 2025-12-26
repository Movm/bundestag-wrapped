/**
 * SlideAnimationWrapper - Animates slides when they become current
 *
 * Wraps slide content and triggers entrance animation when
 * the slide becomes the current visible slide.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useSlideAnimationContext } from '../contexts/SlideAnimationContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideAnimationWrapperProps {
  index: number;
  children: React.ReactNode;
}

export function SlideAnimationWrapper({ index, children }: SlideAnimationWrapperProps) {
  const { currentIndex } = useSlideAnimationContext();
  const isCurrent = index === currentIndex;

  // Animation values
  const opacity = useSharedValue(index === 0 ? 1 : 0);
  const translateY = useSharedValue(index === 0 ? 0 : 20);

  // Trigger animation when slide becomes current
  useEffect(() => {
    if (isCurrent) {
      // Small delay to ensure layout is ready
      opacity.value = withDelay(50, withTiming(1, { duration: 300 }));
      translateY.value = withDelay(50, withTiming(0, { duration: 350 }));
    } else {
      // Reset for next time (but don't animate out)
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [isCurrent]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
