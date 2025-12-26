import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { emojiPopEntering, fadeUpEntering } from './animations';

interface SlideHeaderProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  /** Size variant */
  size?: 'default' | 'large';
}

/**
 * SlideHeader - Reusable header component for slides
 *
 * Shows emoji, title, and optional subtitle with staggered animations.
 * Used in result views and feature slides.
 */
export function SlideHeader({ emoji, title, subtitle, size = 'default' }: SlideHeaderProps) {
  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      {emoji && (
        <Animated.Text
          entering={emojiPopEntering(0)}
          style={[styles.emoji, isLarge && styles.emojiLarge]}
        >
          {emoji}
        </Animated.Text>
      )}

      <Animated.Text
        entering={fadeUpEntering(100)}
        style={[styles.title, isLarge && styles.titleLarge]}
      >
        {title}
      </Animated.Text>

      {subtitle && (
        <Animated.Text entering={fadeUpEntering(200)} style={styles.subtitle}>
          {subtitle}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emojiLarge: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleLarge: {
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
