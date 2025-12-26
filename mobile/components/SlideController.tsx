import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MobileWrappedPage from './dom/Slides';
import type { WrappedData } from '../types/wrapped';

// Import bundled wrapped.json data for offline access
import wrappedDataJson from '../assets/data/wrapped.json';

// Cast JSON to typed data
const wrappedData = wrappedDataJson as unknown as WrappedData;

/**
 * SlideController - Thin wrapper for the DOM-based MobileWrappedPage
 *
 * All slide navigation and quiz state is managed inside the DOM component,
 * which reuses the existing useScrollWrapped hook from the web app.
 * This gives us:
 * - Full animation support (Motion/framer-motion)
 * - Progress persistence (localStorage in WebView)
 * - Scroll-snap navigation
 * - All existing slide logic
 *
 * Data is bundled offline in assets/data/wrapped.json and passed
 * to the DOM component as a prop.
 */
export function SlideController() {
  const router = useRouter();

  // Called when user completes the finale slide
  const handleComplete = useCallback(() => {
    // Navigate back to home or show completion state
    router.push('/');
  }, [router]);

  return (
    <View style={styles.container}>
      <MobileWrappedPage
        dom={{
          style: {
            flex: 1,
            width: '100%',
            height: '100%',
          },
        }}
        data={wrappedData}
        onComplete={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
