import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SlideContainer } from './SlideContainer';

interface SlideIntroProps {
  emoji: string;
  title?: string;
  subtitle?: string;
}

/**
 * SlideIntro - Native intro phase for a slide
 *
 * Shows emoji with one sentence. Title optional.
 * Animations: emoji pops in, title slides up, subtitle fades in later.
 */
export function SlideIntro({ emoji, title, subtitle }: SlideIntroProps) {
  return (
    <SlideContainer>
      <View style={styles.content}>
        {/* Emoji with zoom pop effect */}
        <Animated.Text
          entering={ZoomIn.delay(100).springify()}
          style={styles.emoji}
        >
          {emoji}
        </Animated.Text>

        {/* Title with slide-up animation */}
        {title && (
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
            style={styles.title}
          >
            {title}
          </Animated.Text>
        )}

        {/* Subtitle with delayed fade-in */}
        {subtitle && (
          <Animated.Text
            entering={FadeIn.delay(800).duration(400)}
            style={styles.subtitle}
          >
            {subtitle}
          </Animated.Text>
        )}
      </View>
    </SlideContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
