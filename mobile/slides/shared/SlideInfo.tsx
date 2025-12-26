import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
 * Note: Entrance animations are handled by SlideAnimationWrapper
 */
export function SlideInfo({ emoji, title, body }: SlideInfoProps) {
  return (
    <SlideContainer>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
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
