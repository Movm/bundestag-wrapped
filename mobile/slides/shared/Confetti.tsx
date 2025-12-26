/**
 * Confetti Component for React Native
 *
 * Celebration effect with German flag colors.
 * Uses React Native Reanimated for performant animations.
 */

import { memo, useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// German flag colors
const CONFETTI_COLORS = ['#000000', '#DD0000', '#FFCC00'];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface ParticleConfig {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
  color: string;
  duration: number;
  size: number;
}

interface ConfettiParticleProps extends ParticleConfig {}

interface ConfettiProps {
  count?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Single Particle
// ─────────────────────────────────────────────────────────────

const ConfettiParticle = memo(function ConfettiParticle({
  startX,
  startY,
  endX,
  endY,
  rotation,
  delay,
  color,
  duration,
  size,
}: ConfettiParticleProps) {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Horizontal movement - gentle drift
    translateX.value = withDelay(
      delay,
      withTiming(endX, { duration, easing: Easing.inOut(Easing.sin) })
    );

    // Vertical movement - fall with gentle acceleration
    translateY.value = withDelay(
      delay,
      withTiming(endY, {
        duration,
        easing: Easing.in(Easing.quad),
      })
    );

    // Rotation - continuous spin
    rotate.value = withDelay(
      delay,
      withTiming(rotation, { duration, easing: Easing.linear })
    );

    // Scale - pop in then shrink
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: duration * 0.15 }),
        withTiming(0.6, { duration: duration * 0.85 })
      )
    );

    // Opacity - fade out at end
    opacity.value = withDelay(
      delay + duration * 0.6,
      withTiming(0, { duration: duration * 0.4 })
    );
  }, [delay, duration, endX, endY, opacity, rotate, rotation, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size * 0.2,
        },
        animatedStyle,
      ]}
    />
  );
});

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export const Confetti = memo(function Confetti({
  count = 25,
  origin,
  onComplete,
}: ConfettiProps) {
  // Pre-compute particle configurations for performance
  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Spawn across the full width of the screen at the top
      const startX = Math.random() * SCREEN_WIDTH;
      const startY = -20 + Math.random() * 40; // Near top of screen

      // Fall downward with slight horizontal drift
      const horizontalDrift = (Math.random() - 0.5) * 100;
      const fallDistance = SCREEN_HEIGHT * (0.7 + Math.random() * 0.4);

      return {
        id: i,
        startX: origin?.x ?? startX,
        startY: origin?.y ?? startY,
        endX: (origin?.x ?? startX) + horizontalDrift,
        endY: (origin?.y ?? startY) + fallDistance,
        rotation: (Math.random() * 720) - 360, // -360 to 360
        delay: Math.random() * 300,
        color: CONFETTI_COLORS[i % 3],
        duration: 1200 + Math.random() * 600,
        size: 8 + Math.random() * 8, // 8-16px
      };
    });
  }, [count, origin?.x, origin?.y]);

  // Trigger completion callback
  useEffect(() => {
    if (onComplete) {
      const maxDuration = Math.max(...particles.map((p) => p.delay + p.duration));
      const timer = setTimeout(onComplete, maxDuration + 100);
      return () => clearTimeout(timer);
    }
  }, [onComplete, particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} {...p} />
      ))}
    </View>
  );
});

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});
