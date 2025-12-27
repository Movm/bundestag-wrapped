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
import type { ToneAnalysis, PartyProfile, ExtendedToneScores } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { FLOAT_ANIMATIONS, BUBBLE_POSITIONS } from '@/shared/animations/timings';
import { SlideContainer, SlideHeader, directionalStaggerEntering } from './shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const PARTY_ORDER = ['DIE LINKE', 'BSW', 'SPD', 'GRÜNE', 'CDU/CSU', 'AfD'];

const PARTY_SUMMARIES: Record<string, string> = {
  'CDU/CSU': 'Setzt auf positive Rhetorik und sucht Konsens statt Konfrontation.',
  'SPD': 'Fokussiert auf praktische Lösungen und parteiübergreifende Zusammenarbeit.',
  'GRÜNE': 'Balanciert Idealismus mit pragmatischen Ansätzen im Parlament.',
  'AfD': 'Greift scharf an, etikettiert Gegner und setzt auf Konfrontation.',
  'DIE LINKE': 'Stellt kämpferisch soziale Forderungen und hinterfragt die Regierung.',
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface ToneRevealSlideProps {
  toneAnalysis?: ToneAnalysis | null;
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function sortParties(profiles: Record<string, PartyProfile>): PartyProfile[] {
  const entries = Object.values(profiles);
  return entries.sort((a, b) => {
    const indexA = PARTY_ORDER.indexOf(a.party);
    const indexB = PARTY_ORDER.indexOf(b.party);
    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;
    return orderA - orderB;
  });
}

function getHolisticSummary(scores: ExtendedToneScores): string {
  const {
    aggression,
    collaboration,
    solution_focus,
    demand_intensity,
    affirmative,
    labeling,
    discriminatory,
    inclusivity,
  } = scores;

  const isConstructive = solution_focus > 50 && collaboration > 40;
  const isAggressive = aggression > 5 || discriminatory > 3;
  const isDemanding = demand_intensity > 10;
  const isPositive = affirmative > 15 && aggression < 3;
  const isLabeling = labeling > 10;
  const isInclusive = inclusivity > 5 && discriminatory < 2;

  if (isAggressive && isLabeling) return 'Konfrontativ';
  if (isAggressive && isDemanding) return 'Kämpferisch';
  if (isConstructive && isPositive) return 'Lösungsorientiert';
  if (isConstructive && isInclusive) return 'Kooperativ';
  if (isDemanding && !isAggressive) return 'Fordernd';
  if (isPositive && collaboration > 50) return 'Verbindend';
  if (isLabeling && !isAggressive) return 'Analytisch';
  if (solution_focus > 60) return 'Pragmatisch';
  if (affirmative > 20) return 'Optimistisch';
  if (collaboration > 55) return 'Teamorientiert';

  return 'Sachlich';
}

// ─────────────────────────────────────────────────────────────
// Tone Bubble Component
// ─────────────────────────────────────────────────────────────

interface ToneBubbleProps {
  profile: PartyProfile;
  index: number;
  position: { top: number; left: number };
}

const BUBBLE_SIZE = Math.min(SCREEN_WIDTH * 0.35, 160);

const ToneBubble = React.memo(function ToneBubble({ profile, index, position }: ToneBubbleProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const floatConfig = FLOAT_ANIMATIONS[index] || FLOAT_ANIMATIONS[0];

  // Float animation - shared values are stable refs
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Memoize gradient colors and computed values
  const partyColor = getPartyColor(profile.party);
  const gradientColors = React.useMemo(
    () => [partyColor + 'cc', partyColor] as const,
    [partyColor]
  );
  const holisticSummary = React.useMemo(
    () => getHolisticSummary(profile.scores),
    [profile.scores]
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
      entering={directionalStaggerEntering(index, 200)}
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
              // Front - emoji and summary word
              <View style={styles.bubbleContent}>
                <Text style={styles.bubbleEmoji}>{profile.emoji}</Text>
                <Text style={styles.bubbleSummary}>{holisticSummary}</Text>
              </View>
            ) : (
              // Back - party name and description
              <View style={styles.bubbleBackContent}>
                <Text style={[styles.partyTitle, { color: partyColor }]}>
                  {profile.party}
                </Text>
                <Text style={styles.partyDescription}>
                  {PARTY_SUMMARIES[profile.party] || 'Keine Beschreibung verfügbar.'}
                </Text>
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

export function ToneRevealSlide({ toneAnalysis }: ToneRevealSlideProps) {
  const sortedProfiles = useMemo(() => {
    if (!toneAnalysis?.partyProfiles) return [];
    return sortParties(toneAnalysis.partyProfiles).filter(
      (p) => p.party !== 'fraktionslos'
    );
  }, [toneAnalysis?.partyProfiles]);

  const topParties = sortedProfiles.slice(0, 5);

  if (topParties.length === 0) {
    return (
      <SlideContainer>
        <Text style={styles.noData}>Keine Daten verfügbar</Text>
      </SlideContainer>
    );
  }

  return (
    <SlideContainer>
      {/* Header */}
      <View style={styles.header}>
        <SlideHeader
          emoji="🎭"
          title="Fraktions-Persönlichkeiten"
          subtitle="Tippe zum Umdrehen"
        />
      </View>

      {/* Tone Bubbles */}
      {topParties.map((profile, i) => (
        <ToneBubble
          key={profile.party}
          profile={profile}
          index={i}
          position={BUBBLE_POSITIONS.fiveItems[i]}
        />
      ))}
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  noData: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
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
  bubbleEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  bubbleSummary: {
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  partyDescription: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 4,
  },
});
