import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  ZoomIn,
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { GenderAnalysis } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer } from './shared';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface GenderRevealSlideProps {
  genderAnalysis?: GenderAnalysis | null;
}

// ─────────────────────────────────────────────────────────────
// Party Bubble Component
// ─────────────────────────────────────────────────────────────

interface PartyBubbleProps {
  party: string;
  femaleRatio: number;
  delay: number;
  isTop: boolean;
}

function PartyBubble({ party, femaleRatio, delay, isTop }: PartyBubbleProps) {
  const partyColor = getPartyColor(party);
  const size = 100 + (femaleRatio / 100) * 80;
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    const duration = isTop ? 4000 : 5000;
    const offset = isTop ? 8 : 6;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-offset, { duration: duration / 2 }),
        withTiming(0, { duration: duration / 2 })
      ),
      -1
    );
  }, [translateY, isTop]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View entering={ZoomIn.delay(delay).springify()}>
      <Animated.View style={floatStyle}>
        <LinearGradient
          colors={[partyColor + 'cc', partyColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.partyBubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: isTop ? 1 : 0.8,
            },
          ]}
        >
          <Text style={[styles.partyName, !isTop && styles.partyNameSmall]}>
            {party}
          </Text>
          <Text style={[styles.partyPercent, !isTop && styles.partyPercentSmall]}>
            {femaleRatio.toFixed(0)}%
          </Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function GenderRevealSlide({ genderAnalysis }: GenderRevealSlideProps) {
  const { distribution, sortedParties } = useMemo(() => {
    if (!genderAnalysis) {
      return { distribution: null, sortedParties: [] };
    }

    const sorted = [...genderAnalysis.byParty]
      .filter((p) => p.party !== 'fraktionslos')
      .sort((a, b) => b.femaleRatio - a.femaleRatio);

    return {
      distribution: genderAnalysis.distribution,
      sortedParties: sorted,
    };
  }, [genderAnalysis]);

  if (!distribution || sortedParties.length === 0) {
    return (
      <SlideContainer>
        <Text style={styles.noData}>Keine Daten verfügbar</Text>
      </SlideContainer>
    );
  }

  const topParty = sortedParties[0];
  const bottomParty = sortedParties[sortedParties.length - 1];

  return (
    <SlideContainer>
      <View style={styles.content}>
        {/* Header */}
        <Animated.Text entering={FadeIn.delay(0)} style={styles.subtitle}>
          REDEANTEILE IM BUNDESTAG
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
          Geschlechterverteilung
        </Animated.Text>

        {/* Overall Percentage */}
        <Animated.View entering={ZoomIn.delay(300).springify()} style={styles.percentageContainer}>
          <Text style={styles.bigPercent}>{distribution.femalePercent.toFixed(0)}%</Text>
          <Text style={styles.percentLabel}>Frauenanteil</Text>
        </Animated.View>

        {/* Party Comparison */}
        <View style={styles.bubblesContainer}>
          {topParty && (
            <View style={styles.bubbleWrapper}>
              <PartyBubble
                party={topParty.party}
                femaleRatio={topParty.femaleRatio}
                delay={800}
                isTop={true}
              />
              <Animated.Text entering={FadeIn.delay(1100)} style={styles.bubbleLabel}>
                Höchster
              </Animated.Text>
            </View>
          )}
          {bottomParty && (
            <View style={styles.bubbleWrapper}>
              <PartyBubble
                party={bottomParty.party}
                femaleRatio={bottomParty.femaleRatio}
                delay={1000}
                isTop={false}
              />
              <Animated.Text entering={FadeIn.delay(1300)} style={styles.bubbleLabel}>
                Niedrigster
              </Animated.Text>
            </View>
          )}
        </View>
      </View>
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bigPercent: {
    fontSize: 80,
    fontWeight: '900',
    color: '#ec4899', // pink-500
    fontVariant: ['tabular-nums'],
  },
  percentLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  bubblesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 24,
  },
  bubbleWrapper: {
    alignItems: 'center',
  },
  partyBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  partyName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  partyNameSmall: {
    fontSize: 13,
  },
  partyPercent: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
  partyPercentSmall: {
    fontSize: 24,
  },
  bubbleLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
  },
});
