import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideContainerProps {
  children: React.ReactNode;
  /** Whether to use SafeAreaView (default: true) */
  useSafeArea?: boolean;
  /** Custom background color */
  backgroundColor?: string;
  /** Additional style */
  style?: object;
}

/**
 * SlideContainer - Foundation component for all native slides
 *
 * Provides:
 * - Full-height layout with centered content
 * - Safe area handling for notches/home indicators
 * - Dark background by default
 *
 * Note: Entrance animations are handled by SlideAnimationWrapper
 */
export function SlideContainer({
  children,
  useSafeArea = true,
  backgroundColor = '#0a0a0a',
  style,
}: SlideContainerProps) {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <View style={styles.wrapper}>
      <Container style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.content}>{children}</View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  container: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
