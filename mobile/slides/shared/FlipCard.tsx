import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { playSound } from '~/lib/sounds';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  /** Size (width and height) */
  size?: number;
  /** Whether the card can be flipped (default: true) */
  flipEnabled?: boolean;
}

/**
 * FlipCard - Native 2D flip card component
 *
 * Uses scale animation instead of 3D rotation for React Native compatibility.
 * - Scale X from 1 → 0 → 1 with content swap
 * - Haptic feedback on flip
 */
export function FlipCard({ front, back, size = 120, flipEnabled = true }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);

  const handlePress = () => {
    if (!flipEnabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound('click');
    setIsFlipped((prev) => !prev);
    flipProgress.value = withTiming(isFlipped ? 0 : 1, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Front card animation - visible when flipProgress is 0-0.5
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0]);
    const opacity = interpolate(flipProgress.value, [0, 0.4, 0.5], [1, 1, 0]);

    return {
      transform: [{ scaleX }],
      opacity,
    };
  });

  // Back card animation - visible when flipProgress is 0.5-1
  const backAnimatedStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1]);
    const opacity = interpolate(flipProgress.value, [0.5, 0.6, 1], [0, 1, 1]);

    return {
      transform: [{ scaleX }],
      opacity,
    };
  });

  return (
    <Pressable onPress={handlePress} disabled={!flipEnabled}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Front */}
        <Animated.View style={[styles.card, frontAnimatedStyle]}>{front}</Animated.View>

        {/* Back */}
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          {back}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backCard: {
    // Back card is behind front by default
  },
});
