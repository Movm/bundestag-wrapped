import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ActivityIndicator, Alert } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { getPartyColor } from '@/shared';
import { SPEAKER_CONTENT } from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// OG Image API base URL - update this for production
const OG_API_URL = process.env.EXPO_PUBLIC_OG_API_URL || 'https://bundestag-wrapped.de';

interface EndSectionProps {
  data: SpeakerWrapped;
  onRestart: () => void;
}

/**
 * EndSection - Final slide with fun facts and navigation buttons
 */
export function EndSection({ data, onRestart }: EndSectionProps) {
  const router = useRouter();
  const partyColor = getPartyColor(data.party);
  const content = SPEAKER_CONTENT.end;
  const funFacts = data.funFacts.slice(0, 4);

  const [isSharing, setIsSharing] = useState(false);

  // Handle share: download OG image from API, then share
  const handleShare = useCallback(async () => {
    if (isSharing) return;

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Teilen nicht verfügbar', 'Teilen wird auf diesem Gerät nicht unterstützt.');
      return;
    }

    setIsSharing(true);

    try {
      // Generate slug from speaker name (matches API expectation)
      const slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[äöü]/g, (m) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[m] || m))
        .replace(/[^a-z0-9-]/g, '');

      const imageUrl = `${OG_API_URL}/api/og/speaker/${slug}`;
      const file = new File(Paths.cache, `bundestag-wrapped-${slug}.png`);

      // Download the image (overwrites if exists)
      const downloaded = await File.downloadFileAsync(imageUrl, file, { idempotent: true });

      // Share the downloaded image
      await Sharing.shareAsync(downloaded.uri, {
        mimeType: 'image/png',
        dialogTitle: 'Teile dein Bundestag Wrapped',
      });
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert(
        'Teilen fehlgeschlagen',
        'Das Bild konnte nicht geteilt werden. Bitte versuche es später erneut.'
      );
    } finally {
      setIsSharing(false);
    }
  }, [data.name, isSharing]);

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.content}>
        {/* Emoji */}
        <Text style={styles.emoji}>{content.emoji}</Text>

        {/* Title */}
        <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
          {content.title}
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(300)} style={styles.subtitle}>
          {content.subtitle}
        </Animated.Text>

        {/* Fun Facts Grid */}
        <Animated.View entering={FadeIn.delay(400)} style={styles.funFactsCard}>
          <View style={styles.funFactsGrid}>
            {funFacts.map((fact, i) => (
              <Animated.View
                key={i}
                entering={FadeInUp.delay(500 + i * 100)}
                style={styles.funFact}
              >
                <Text style={styles.funFactEmoji}>{fact.emoji}</Text>
                <Text style={styles.funFactValue}>{fact.value}</Text>
                <Text style={styles.funFactLabel}>{fact.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Share Button */}
          <AnimatedPressable
            entering={FadeInUp.delay(800)}
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.shareButtonText}>{content.shareButton}</Text>
            )}
          </AnimatedPressable>

          {/* Restart Button */}
          <AnimatedPressable
            entering={FadeInUp.delay(900)}
            onPress={onRestart}
            style={[styles.restartButton, { backgroundColor: partyColor }]}
          >
            <Text style={styles.restartButtonText}>{content.restartButton}</Text>
          </AnimatedPressable>

          {/* Other Speakers */}
          <AnimatedPressable
            entering={FadeInUp.delay(1000)}
            onPress={() => router.push('/')}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>{content.otherSpeakersButton}</Text>
          </AnimatedPressable>

          {/* Home */}
          <AnimatedPressable
            entering={FadeIn.delay(1100)}
            onPress={() => router.push('/')}
            style={styles.tertiaryButton}
          >
            <Text style={styles.tertiaryButtonText}>{content.homeButton}</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
  funFactsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  funFactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  funFact: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  funFactEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  funFactValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  funFactLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  shareButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ec4899',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  restartButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  tertiaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
});
