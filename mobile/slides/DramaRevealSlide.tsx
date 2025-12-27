import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  ZoomIn,
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { DramaStats } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer } from './shared';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface DramaRevealSlideProps {
  drama: DramaStats;
}

// ─────────────────────────────────────────────────────────────
// Timing Constants (in milliseconds)
// ─────────────────────────────────────────────────────────────

const COUNT_DURATION = 2000; // Count animation duration
const LABEL_DELAY = COUNT_DURATION + 300;
const NAME_DELAY = LABEL_DELAY + 200;
const PARTY_DELAY = NAME_DELAY + 200;
const EMOJI_DELAY = PARTY_DELAY + 300;
const NOTE_DELAY = EMOJI_DELAY + 300;

// ─────────────────────────────────────────────────────────────
// Count Up Hook - Runs on native thread via Reanimated
// ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number = COUNT_DURATION) {
  const [count, setCount] = useState(0);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    // Reset and animate to target - runs on native UI thread
    animatedValue.value = 0;
    animatedValue.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [target, duration, animatedValue]);

  // Bridge native animation to React state - throttled to reduce JS bridge crossings
  // Instead of updating on every integer (4000+ updates), update every 10 (~400 updates)
  useAnimatedReaction(
    () => Math.floor(animatedValue.value / 10) * 10,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(setCount)(currentValue);
      }
    }
  );

  // Final value sync - ensure we display exact target when animation completes
  useAnimatedReaction(
    () => animatedValue.value >= target - 1,
    (isComplete, wasComplete) => {
      if (isComplete && !wasComplete) {
        runOnJS(setCount)(target);
      }
    }
  );

  return count;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function DramaRevealSlide({ drama }: DramaRevealSlideProps) {
  const leader = drama.topZwischenrufer[0];
  const count = useCountUp(leader.count, COUNT_DURATION);
  const partyColor = getPartyColor(leader.party);

  return (
    <SlideContainer>
      <View style={styles.content}>
        {/* Phase 2: Emoji (appears after context starts building) */}
        <Animated.Text entering={ZoomIn.delay(EMOJI_DELAY).springify()} style={styles.emoji}>
          🎭
        </Animated.Text>

        {/* Phase 2: Name (wraps above the count) */}
        <Animated.Text entering={FadeInDown.delay(NAME_DELAY)} style={styles.name}>
          {leader.name}
        </Animated.Text>

        {/* Phase 2: Party Badge */}
        <Animated.View
          entering={FadeInDown.delay(PARTY_DELAY).springify()}
          style={[styles.partyBadge, { backgroundColor: partyColor }]}
        >
          <Text style={styles.partyBadgeText}>{leader.party}</Text>
        </Animated.View>

        {/* Phase 1: The big count - appears FIRST */}
        <Animated.Text
          entering={FadeIn.delay(0).duration(300)}
          style={[
            styles.count,
            {
              color: partyColor,
              textShadowColor: partyColor + '50',
            },
          ]}
        >
          {count.toLocaleString('de-DE')}
        </Animated.Text>

        {/* Phase 1: Label appears right after count finishes */}
        <Animated.Text entering={FadeInDown.delay(LABEL_DELAY)} style={styles.label}>
          Zwischenrufe
        </Animated.Text>

        {/* Phase 2: Note at the end */}
        <Animated.Text entering={FadeIn.delay(NOTE_DELAY)} style={styles.note}>
          Mit über 4.000 (!) Zwischenrufen stört{'\n'}die AfD mit Abstand am meisten.
        </Animated.Text>
      </View>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  partyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  partyBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  count: {
    fontSize: 80,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 8,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  label: {
    fontSize: 22,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 32,
  },
  note: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
