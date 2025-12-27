import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SlideContainer } from './SlideContainer';

interface SlideInfoProps {
  emoji: string;
  title: string;
  body: string;
}

/**
 * SlideInfo - Native educational info slide
 *
 * Appears between quiz and reveal slides.
 * Shows emoji, title, and 1-2 sentences explaining the topic.
 * Animations: emoji pops in, title slides up, body fades in later.
 */
export function SlideInfo({ emoji, title, body }: SlideInfoProps) {
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
        <Animated.Text
          entering={FadeInDown.delay(300).springify()}
          style={styles.title}
        >
          {title}
        </Animated.Text>

        {/* Body with delayed fade-in */}
        <Animated.Text
          entering={FadeIn.delay(800).duration(400)}
          style={styles.body}
        >
          {body}
        </Animated.Text>
      </View>
    </SlideContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  body: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});
