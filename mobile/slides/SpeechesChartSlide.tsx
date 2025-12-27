import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { PartyStats } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { FLOAT_ANIMATIONS, BUBBLE_POSITIONS } from '@/shared/animations/timings';
import {
  SlideContainer,
  bubbleAnimations,
  emojiPopEntering,
  fadeUpEntering,
  fadeInEntering,
  bouncyStaggerEntering,
} from './shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface SpeechesChartSlideProps {
  parties: PartyStats[];
}

// ─────────────────────────────────────────────────────────────
// Speech Bubble Component
// ─────────────────────────────────────────────────────────────

interface SpeechBubbleProps {
  party: PartyStats;
  index: number;
  position: { top: number; left: number };
  bubbleSize: number;
}

const SpeechBubble = React.memo(function SpeechBubble({ party, index, position, bubbleSize }: SpeechBubbleProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const floatConfig = FLOAT_ANIMATIONS[index] || FLOAT_ANIMATIONS[0];

  // Float animation - shared values are stable refs
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Memoize gradient colors
  const gradientColors = React.useMemo(
    () => [getPartyColor(party.party) + 'cc', getPartyColor(party.party)] as const,
    [party.party]
  );

  React.useEffect(() => {
    const duration = floatConfig.duration;
    translateX.value = withRepeat(
      withSequence(
        withTiming(floatConfig.x[1], { duration: duration / 4 }),
        withTiming(floatConfig.x[2], { duration: duration / 4 }),
        withTiming(floatConfig.x[3], { duration: duration / 2 })
      ),
      -1,
      true
    );
    translateY.value = withRepeat(
      withSequence(
        withTiming(floatConfig.y[1], { duration: duration / 4 }),
        withTiming(floatConfig.y[2], { duration: duration / 4 }),
        withTiming(floatConfig.y[3], { duration: duration / 2 })
      ),
      -1,
      true
    );
  }, [floatConfig]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFlipped((prev) => !prev);
  };

  return (
    <Animated.View
      entering={bouncyStaggerEntering(index, 200)}
      style={[
        styles.bubbleContainer,
        {
          top: SCREEN_HEIGHT * (position.top / 100),
          left: SCREEN_WIDTH * (position.left / 100),
          width: bubbleSize,
          height: bubbleSize,
        },
      ]}
    >
      <Animated.View style={floatStyle}>
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, { width: bubbleSize, height: bubbleSize, borderRadius: bubbleSize / 2 }]}
          >
            {!isFlipped ? (
              // Front - speech count
              <View style={styles.bubbleContent}>
                <Text style={styles.speechCount}>
                  {party.speeches.toLocaleString('de-DE')}
                </Text>
                <Text style={styles.speechLabel}>Reden</Text>
              </View>
            ) : (
              // Back - party name + wortbeitraege
              <View style={styles.bubbleBackContent}>
                <Text style={styles.partyTitle}>{party.party}</Text>
                <Text style={styles.wortCount}>
                  {party.wortbeitraege.toLocaleString('de-DE')}
                </Text>
                <Text style={styles.wortLabel}>Wortbeiträge</Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function SpeechesChartSlide({ parties }: SpeechesChartSlideProps) {
  // Filter out fraktionslos and get top 5
  const top5 = useMemo(
    () => parties.filter((p) => p.party !== 'fraktionslos').slice(0, 5),
    [parties]
  );

  // Calculate bubble sizes based on speech counts
  const { bubbleSizes, totalReden } = useMemo(() => {
    const speeches = top5.map((p) => p.speeches);
    const minSpeeches = Math.min(...speeches);
    const speechRange = Math.max(...speeches) - minSpeeches || 1;

    const minSize = SCREEN_WIDTH * 0.22;
    const maxSize = SCREEN_WIDTH * 0.36;

    const sizes = top5.map((p) => {
      const sizePercent = (p.speeches - minSpeeches) / speechRange;
      return minSize + sizePercent * (maxSize - minSize);
    });

    return {
      bubbleSizes: sizes,
      totalReden: top5.reduce((sum, p) => sum + p.speeches, 0),
    };
  }, [top5]);

  return (
    <SlideContainer>
      {/* Header */}
      <View style={styles.header}>
        <Animated.Text entering={emojiPopEntering(0)} style={styles.emoji}>
          🎤
        </Animated.Text>
        <Animated.Text entering={fadeUpEntering(150)} style={styles.subtitle}>
          DIE REDEN
        </Animated.Text>
        <Animated.Text entering={fadeUpEntering(250)} style={styles.title}>
          {totalReden.toLocaleString('de-DE')} formelle Reden
        </Animated.Text>
        <Animated.Text entering={fadeInEntering(500)} style={styles.note}>
          Wir unterscheiden zwischen richtigen Reden{'\n'}und weiteren Wortbeiträgen
        </Animated.Text>
      </View>

      {/* Speech Bubbles */}
      {top5.map((party, i) => (
        <SpeechBubble
          key={party.party}
          party={party}
          index={i}
          position={BUBBLE_POSITIONS.fiveItems[i]}
          bubbleSize={bubbleSizes[i]}
        />
      ))}

      {/* Hint */}
      <Animated.Text entering={bubbleAnimations.hint()} style={styles.hint}>
        Tippe auf eine Blase für Details
      </Animated.Text>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  note: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  bubbleContainer: {
    position: 'absolute',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bubbleContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  speechCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  speechLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  bubbleBackContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  partyTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  wortCount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wortLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
