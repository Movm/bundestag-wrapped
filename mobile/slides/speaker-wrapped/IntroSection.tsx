import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { PARTY_BG_COLORS } from '@/shared';
import { SPEAKER_CONTENT, formatSpeakerName } from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';
import {
  emojiPopEntering,
  fadeUpEntering,
  bouncyScaleEntering,
  fadeInEntering,
} from '../shared';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IntroSectionProps {
  data: SpeakerWrapped;
}

/**
 * IntroSection - Speaker wrapped intro slide
 * Shows speaker name and party badge
 */
export function IntroSection({ data }: IntroSectionProps) {
  const partyBgColor = PARTY_BG_COLORS[data.party] || PARTY_BG_COLORS.fraktionslos;
  const content = SPEAKER_CONTENT.intro;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Emoji */}
        <Animated.Text entering={emojiPopEntering(200)} style={styles.emoji}>
          {content.emoji}
        </Animated.Text>

        {/* Name */}
        <Animated.Text entering={fadeUpEntering(300)} style={styles.name}>
          {formatSpeakerName(data)}
        </Animated.Text>

        {/* Party Badge */}
        <Animated.View
          entering={bouncyScaleEntering(400)}
          style={[styles.partyBadge, { backgroundColor: partyBgColor }]}
        >
          <Text style={styles.partyText}>{data.party}</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text entering={fadeInEntering(500)} style={styles.subtitle}>
          {content.subtitle}
        </Animated.Text>
      </View>
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
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  partyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 32,
  },
  partyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
