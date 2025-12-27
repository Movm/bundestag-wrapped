import React, { useMemo } from 'react';
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
import type { TopicAnalysis } from '@/data/wrapped';
import { getPartyBgColor } from '@/lib/party-colors';
import { FLOAT_ANIMATIONS, BUBBLE_POSITIONS } from '@/shared/animations/timings';
import { TOPIC_BY_ID, type TopicMeta } from '@/shared/constants/topics';
import { SlideContainer, SlideHeader, tiltInStaggerEntering, fadeInEntering } from './shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface PartyRanking {
  party: string;
  score: number;
}

interface TopicsRevealSlideProps {
  topicAnalysis: TopicAnalysis;
}

// ─────────────────────────────────────────────────────────────
// Topic Bubble Component
// ─────────────────────────────────────────────────────────────

interface TopicBubbleProps {
  topic: TopicMeta;
  rank: number;
  index: number;
  position: { top: number; left: number };
  partyRankings: PartyRanking[];
}

const BUBBLE_SIZE = Math.min(SCREEN_WIDTH * 0.33, 150);

const TopicBubble = React.memo(function TopicBubble({ topic, rank, index, position, partyRankings }: TopicBubbleProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const floatConfig = FLOAT_ANIMATIONS[index] || FLOAT_ANIMATIONS[0];

  // Float animation - shared values are stable refs
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Memoize gradient colors
  const gradientColors = React.useMemo(
    () => [topic.color, topic.color + 'dd'] as const,
    [topic.color]
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
      entering={tiltInStaggerEntering(index, 200)}
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
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bubble}
          >
            {!isFlipped ? (
              // Front - rank and topic name
              <View style={styles.bubbleContent}>
                <Text style={styles.bubbleRank}>{rank}</Text>
                <Text style={styles.bubbleName}>{topic.name}</Text>
              </View>
            ) : (
              // Back - party rankings
              <View style={styles.bubbleBackContent}>
                {partyRankings.slice(0, 5).map((pr, i) => (
                  <View key={pr.party} style={styles.partyRow}>
                    <Text style={styles.partyRankNum}>{i + 1}.</Text>
                    <View
                      style={[styles.partyDot, { backgroundColor: getPartyBgColor(pr.party) }]}
                    />
                    <Text style={styles.partyName} numberOfLines={1}>
                      {pr.party}
                    </Text>
                  </View>
                ))}
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

export function TopicsRevealSlide({ topicAnalysis }: TopicsRevealSlideProps) {
  const { topTopics, byParty } = topicAnalysis;

  // Get top 5 topics for bubble layout
  const displayTopics = useMemo(() => topTopics.slice(0, 5), [topTopics]);

  // Pre-compute party rankings for all displayed topics at once
  // This avoids recalculating rankings for each bubble on every render
  const allPartyRankings = useMemo(() => {
    const result: Record<string, PartyRanking[]> = {};
    for (const topicScore of displayTopics) {
      const rankings: PartyRanking[] = [];
      for (const [party, topics] of Object.entries(byParty)) {
        if (party === 'fraktionslos') continue;
        const score = topics[topicScore.topic] || 0;
        rankings.push({ party, score });
      }
      result[topicScore.topic] = rankings.sort((a, b) => b.score - a.score);
    }
    return result;
  }, [displayTopics, byParty]);

  return (
    <SlideContainer>
      {/* Header */}
      <View style={styles.header}>
        <SlideHeader
          emoji="📊"
          title="Die Themen des Bundestags"
          subtitle="Worüber wurde am meisten gesprochen?"
        />
      </View>

      {/* Topic Bubbles */}
      {displayTopics.map((topicScore, i) => {
        const topic = TOPIC_BY_ID[topicScore.topic];
        if (!topic) return null;
        return (
          <TopicBubble
            key={topicScore.topic}
            topic={topic}
            rank={topicScore.rank}
            index={i}
            position={BUBBLE_POSITIONS.fiveItems[i]}
            partyRankings={allPartyRankings[topicScore.topic]}
          />
        );
      })}

      {/* Hint */}
      <Animated.Text
        entering={fadeInEntering(2200)}
        style={styles.hint}
      >
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
    padding: 8,
  },
  bubbleRank: {
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bubbleName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 2,
  },
  bubbleBackContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  partyRankNum: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    width: 14,
  },
  partyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  partyName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    maxWidth: 70,
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
