import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSpeakerIndex } from '~/hooks/useDataQueries';
import { PARTY_BG_COLORS } from '@/shared';
import type { SpeakerSummary } from '~/types/wrapped';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Abgeordnete Tab
 *
 * Search interface to find and navigate to speaker wrapped pages.
 * Features debounced search with filtered results.
 */
export default function AbgeordneteTab() {
  const router = useRouter();
  const { data: speakerIndex, isLoading, error } = useSpeakerIndex();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  // Determine if we have an active query (for layout animation)
  const hasQuery = searchQuery.trim().length > 0;

  // Animated style for search container - centers when idle, moves to top when typing
  const searchContainerAnimatedStyle = useAnimatedStyle(() => ({
    flex: withTiming(hasQuery ? 0 : 1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }),
    justifyContent: hasQuery ? 'flex-start' : 'center',
  }));

  // Filter and sort speakers based on search query
  const filteredSpeakers = useMemo((): SpeakerSummary[] => {
    // Return empty when no query (Google-style: no pre-populated listings)
    if (!speakerIndex || !searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return speakerIndex.speakers
      .filter((s) => s.name.toLowerCase().includes(query))
      .sort((a, b) => {
        // Prioritize names starting with query
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name, 'de');
      })
      .slice(0, 50);
  }, [speakerIndex, searchQuery]);

  // Navigate to speaker wrapped
  const handleSpeakerPress = useCallback((slug: string) => {
    router.push(`/speaker/${slug}`);
  }, [router]);

  // Render speaker item
  const renderSpeakerItem = useCallback(({ item, index }: { item: SpeakerSummary; index: number }) => {
    const partyBgColor = PARTY_BG_COLORS[item.party] || PARTY_BG_COLORS.fraktionslos;

    return (
      <AnimatedPressable
        entering={FadeIn.delay(index * 30).duration(300)}
        style={styles.speakerItem}
        onPress={() => handleSpeakerPress(item.slug)}
      >
        <View style={styles.speakerInfo}>
          <Text style={styles.speakerName}>{item.name}</Text>
          <View style={[styles.partyBadge, { backgroundColor: partyBgColor }]}>
            <Text style={styles.partyText}>{item.party}</Text>
          </View>
        </View>
        <Text style={styles.speechCount}>{item.speeches} Reden</Text>
      </AnimatedPressable>
    );
  }, [handleSpeakerPress]);

  // Key extractor
  const keyExtractor = useCallback((item: SpeakerSummary) => item.slug, []);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Lade Abgeordnete...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <StatusBar style="light" />
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Fehler beim Laden</Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Animated Search Container - centers when idle, moves to top when typing */}
      <Animated.View style={[styles.searchSection, searchContainerAnimatedStyle]}>
        {/* Minimal branding - only visible when idle */}
        {!hasQuery && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.branding}>
            <Search color="rgba(255,255,255,0.6)" size={40} />
            <Text style={styles.brandingTitle}>Suche</Text>
          </Animated.View>
        )}

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInputWrapper,
              inputFocused && styles.searchInputFocused,
            ]}
          >
            <Search color="rgba(255,255,255,0.4)" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Abgeordnete suchen..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <X color="rgba(255,255,255,0.4)" size={18} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Hint text - only visible when idle */}
        {!hasQuery && (
          <Animated.Text entering={FadeIn.delay(100)} style={styles.hintText}>
            {speakerIndex?.speakers.length.toLocaleString('de-DE')} Abgeordnete durchsuchen
          </Animated.Text>
        )}
      </Animated.View>

      {/* Results - only shown when there's a query */}
      {hasQuery && (
        <>
          {/* Results Count */}
          <Animated.View entering={FadeIn.duration(200)} style={styles.resultCount}>
            <Text style={styles.resultCountText}>
              {filteredSpeakers.length} Ergebnisse
            </Text>
          </Animated.View>

          {/* Speaker List */}
          <FlatList
            data={filteredSpeakers}
            renderItem={renderSpeakerItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyText}>Kein Abgeordneter gefunden</Text>
                <Text style={styles.emptySubtext}>Versuche einen anderen Namen</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
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
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Google-style centered search section
  searchSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandingTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
    letterSpacing: 2,
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 16,
  },
  searchContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 20,
  },
  searchInputFocused: {
    borderColor: 'rgba(236, 72, 153, 0.5)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#ffffff',
  },
  clearButton: {
    padding: 8,
  },
  resultCount: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultCountText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  speakerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  speakerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flexShrink: 1,
  },
  partyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  partyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  speechCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
