import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { ZoomIn, FadeInDown, FadeIn } from 'react-native-reanimated';
import type { ToneAnalysis } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import {
  SlideContainer,
  emojiPopEntering,
  fadeUpEntering,
  fadeInEntering,
  getAlternatingSlideEntering,
  bouncyScaleEntering,
} from './shared';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface DiscriminatoryRevealSlideProps {
  toneAnalysis?: ToneAnalysis | null;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function DiscriminatoryRevealSlide({ toneAnalysis }: DiscriminatoryRevealSlideProps) {
  const rankings = useMemo(() => {
    const counts = toneAnalysis?.rankings?.discriminatoryCounts;
    if (counts && counts.length > 0) {
      return counts.filter((r) => r.party !== 'fraktionslos').slice(0, 5);
    }
    return [];
  }, [toneAnalysis]);

  const leader = rankings[0];

  if (!leader) {
    return (
      <SlideContainer>
        <Text style={styles.noData}>Keine Daten verfügbar</Text>
      </SlideContainer>
    );
  }

  return (
    <SlideContainer>
      <View style={styles.content}>
        {/* Emoji */}
        <Animated.Text entering={emojiPopEntering(0)} style={styles.emoji}>
          ⚠️
        </Animated.Text>

        {/* Title */}
        <Animated.Text entering={fadeUpEntering(200)} style={styles.title}>
          Diskriminierende Sprache
        </Animated.Text>

        {/* Rankings */}
        <View style={styles.rankings}>
          {rankings.map((ranking, index) => {
            const isLeader = index === 0;
            const partyColor = getPartyColor(ranking.party);

            return (
              <Animated.View
                key={ranking.party}
                entering={
                  isLeader
                    ? bouncyScaleEntering(350)
                    : getAlternatingSlideEntering(index, 400)
                }
                style={[styles.rankingRow, isLeader && styles.rankingRowLeader]}
              >
                <Text
                  style={[
                    styles.rankNumber,
                    isLeader ? styles.rankNumberLeader : styles.rankNumberOther,
                  ]}
                >
                  {index + 1}.
                </Text>
                <View
                  style={[
                    styles.partyBadge,
                    { backgroundColor: partyColor },
                    isLeader && styles.partyBadgeLeader,
                  ]}
                >
                  <Text style={[styles.partyBadgeText, isLeader && styles.partyBadgeTextLeader]}>
                    {ranking.party}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.count,
                    isLeader && { color: partyColor },
                    !isLeader && styles.countOther,
                  ]}
                >
                  {ranking.count}×
                </Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Note */}
        <Animated.Text entering={fadeInEntering(1000)} style={styles.note}>
          Begriffe wie "Remigration",{'\n'}"Genderideologie" oder "Überfremdung"
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
  noData: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  rankings: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.7,
  },
  rankingRowLeader: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  rankNumber: {
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  rankNumberLeader: {
    fontSize: 28,
    color: '#ffffff',
  },
  rankNumberOther: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  partyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  partyBadgeLeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  partyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  partyBadgeTextLeader: {
    fontSize: 14,
  },
  count: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    fontSize: 22,
    color: '#ffffff',
  },
  countOther: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  note: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
});
