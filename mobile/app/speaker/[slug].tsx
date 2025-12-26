/**
 * Speaker Wrapped Page
 *
 * Uses shared WrappedScrollContainer for unified scrolling behavior.
 */

import { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpeakerData } from '~/hooks/useDataQueries';
import { useWrappedScroll } from '~/hooks/useWrappedScroll';
import { WrappedScrollContainer } from '~/components/WrappedScrollContainer';
import { SpeakerSlideRenderer } from '~/slides/speaker-wrapped';
import { SPEAKER_SECTIONS, type SpeakerSection } from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';

// Auto-scroll sections (intro only)
const AUTO_SCROLL_SECTIONS = new Set<SpeakerSection>(['intro']);
const AUTO_SCROLL_DELAY = 4000;

/**
 * Get available sections based on speaker data
 */
function getAvailableSections(data: SpeakerWrapped): SpeakerSection[] {
  return SPEAKER_SECTIONS.filter((section) => {
    switch (section) {
      case 'topics':
        return data.topics && data.topics.topTopics.length > 0;
      case 'animal':
        return !!data.spiritAnimal;
      case 'quiz':
        return !!data.signatureQuiz;
      default:
        return true;
    }
  });
}

export default function SpeakerWrappedPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  // Fetch speaker data
  const { data, isLoading, error } = useSpeakerData(slug || '');

  // Get available sections based on data
  const sections = useMemo(
    () => (data ? getAvailableSections(data) : [...SPEAKER_SECTIONS]),
    [data]
  );

  // Use shared scroll hook
  const scrollState = useWrappedScroll({
    items: sections,
    autoScrollItems: AUTO_SCROLL_SECTIONS,
    autoScrollDelay: AUTO_SCROLL_DELAY,
    isQuizItem: (section) => section === 'quiz',
    onComplete: () => router.back(),
    completeDelay: 2000,
  });

  // Render section
  const renderItem = useCallback(
    ({ item: section }: { item: SpeakerSection }) => {
      if (!data) return null;

      return (
        <SpeakerSlideRenderer
          section={section}
          data={data}
          onQuizAnswer={scrollState.handleQuizAnswer}
          onQuizNext={scrollState.handleItemComplete}
          onRestart={() => {
            scrollState.goToItem(0, false);
          }}
        />
      );
    },
    [data, scrollState]
  );

  // Key extractor
  const keyExtractor = useCallback((item: SpeakerSection) => item, []);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" hidden />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Lade Daten...</Text>
      </View>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar style="light" />
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Abgeordnete/r nicht gefunden</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'Unbekannter Fehler'}
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="light" hidden />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <WrappedScrollContainer
        scrollState={scrollState}
        items={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        startOnFirstItemPress
        hideStatusBar
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
