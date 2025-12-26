import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
 * Note: Entrance animations are handled by SlideAnimationWrapper
 */
export function SlideIntro({ emoji, title, subtitle }: SlideIntroProps) {
  return (
    <SlideContainer>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
