import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { ZoomIn, FadeInDown, FadeIn } from 'react-native-reanimated';
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
// Count Up Hook
// ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function DramaRevealSlide({ drama }: DramaRevealSlideProps) {
  const leader = drama.topZwischenrufer[0];
  const count = useCountUp(leader.count, 2000);
  const partyColor = getPartyColor(leader.party);

  return (
    <SlideContainer>
      <View style={styles.content}>
        {/* Emoji */}
        <Animated.Text entering={ZoomIn.delay(0).springify()} style={styles.emoji}>
          🎭
        </Animated.Text>

        {/* Name */}
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.name}>
          {leader.name}
        </Animated.Text>

        {/* Party Badge */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          style={[styles.partyBadge, { backgroundColor: partyColor }]}
        >
          <Text style={styles.partyBadgeText}>{leader.party}</Text>
        </Animated.View>

        {/* Count */}
        <Animated.Text
          entering={FadeIn.delay(400)}
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

        {/* Label */}
        <Animated.Text entering={FadeInDown.delay(500)} style={styles.label}>
          Zwischenrufe
        </Animated.Text>

        {/* Note */}
        <Animated.Text entering={FadeIn.delay(800)} style={styles.note}>
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
