import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { WrappedExperience } from './WrappedExperience';
import type { WrappedData } from '@/data/wrapped';

// Import bundled wrapped.json data for offline access
import wrappedDataJson from '../assets/data/wrapped.json';

// Cast JSON to typed data
const wrappedData = wrappedDataJson as unknown as WrappedData;

/**
 * NativeSlideController - Native implementation of the wrapped experience
 *
 * Unlike SlideController (DOM-based), this uses fully native components:
 * - React Native Reanimated for animations
 * - FlatList with snap pagination
 * - Native haptic feedback
 * - StyleSheet instead of TailwindCSS
 *
 * Benefits:
 * - Better performance (no WebView overhead)
 * - True native feel with haptics
 * - Smaller bundle size
 */
export function NativeSlideController() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // Navigate back to home after completing
    router.push('/');
  }, [router]);

  return (
    <View style={styles.container}>
      <WrappedExperience data={wrappedData} onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
