import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { PartyStats } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { FLOAT_ANIMATIONS, BUBBLE_POSITIONS } from '@/shared/animations/timings';
import {
  SlideContainer,
  SlideHeader,
  bubbleAnimations,
} from './shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface VocabularyRevealSlideProps {
  parties: PartyStats[];
}

// ─────────────────────────────────────────────────────────────
// Party Bubble Component
// ─────────────────────────────────────────────────────────────

interface PartyBubbleProps {
  party: PartyStats;
  index: number;
  position: { top: number; left: number };
}

const BUBBLE_SIZE = Math.min(SCREEN_WIDTH * 0.35, 160);

function PartyBubble({ party, index, position }: PartyBubbleProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const floatConfig = FLOAT_ANIMATIONS[index] || FLOAT_ANIMATIONS[0];

  // Float animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
  }, [floatConfig, translateX, translateY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFlipped((prev) => !prev);
  };

  const partyColor = getPartyColor(party.party);
  const signatureWord = party.signatureWords[0];
  const backWords = party.signatureWords.slice(0, 5);

  return (
    <Animated.View
      entering={bubbleAnimations.bubble(index)}
      style={[
        styles.bubbleContainer,
        {
          top: SCREEN_HEIGHT * (position.top / 100),
          left: SCREEN_WIDTH * (position.left / 100),
        },
      ]}
    >
      <Animated.View style={floatStyle}>
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={[partyColor + 'cc', partyColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bubble}
          >
            {!isFlipped ? (
              // Front - signature word
              <View style={styles.bubbleContent}>
                <Text style={styles.signatureWord}>{signatureWord?.word ?? '–'}</Text>
              </View>
            ) : (
              // Back - party name + top words
              <View style={styles.bubbleBackContent}>
                <Text style={styles.partyTitle}>{party.party}</Text>
                <View style={styles.wordList}>
                  {backWords.map((w, i) => (
                    <Text
                      key={w.word}
                      style={[styles.wordItem, i === 0 && styles.wordItemFirst]}
                      numberOfLines={1}
                    >
                      {w.word}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function VocabularyRevealSlide({ parties }: VocabularyRevealSlideProps) {
  // Filter out fraktionslos and get top 5
  const topParties = React.useMemo(
    () => parties.filter((p) => p.party !== 'fraktionslos').slice(0, 5),
    [parties]
  );

  return (
    <SlideContainer>
      {/* Header */}
      <View style={styles.header}>
        <SlideHeader
          emoji="📚"
          title="Partei-Vokabular"
          subtitle="Diese Wörter zeichnen die Parteien aus."
        />
      </View>

      {/* Party Bubbles */}
      {topParties.map((party, i) => (
        <PartyBubble
          key={party.party}
          party={party}
          index={i}
          position={BUBBLE_POSITIONS.fiveItems[i]}
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
  },
  bubbleContainer: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
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
  signatureWord: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  wordList: {
    alignItems: 'center',
  },
  wordItem: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 14,
  },
  wordItemFirst: {
    fontSize: 12,
    fontWeight: '700',
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
