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
import type { TopSpeaker } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { useQuizConfig } from '@/shared/hooks/useQuizConfig';
import { FLOAT_ANIMATIONS } from '@/shared/animations/timings';
import {
  SlideContainer,
  SlideIntro,
  SlideQuiz,
  SlideHeader,
  getBouncyStaggerEntering,
  fadeUpEntering,
} from './shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface TopSpeakerByWords {
  name: string;
  party: string;
  totalWords: number;
  speeches: number;
}

interface TopSpeakerByAvgWords {
  name: string;
  party: string;
  avgWords: number;
  totalWords: number;
  speeches: number;
}

type SlidePhase = 'intro' | 'quiz' | 'result';

interface TopSpeakersSlideProps {
  speakers: TopSpeaker[];
  speakersByWords?: TopSpeakerByWords[];
  speakersByAvgWords?: TopSpeakerByAvgWords[];
  phase?: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Speaker Bubble Positions
// ─────────────────────────────────────────────────────────────

const SPEAKER_POSITIONS = [
  { top: 0.2, left: 0.08 },
  { top: 0.18, left: 0.55 },
  { top: 0.52, left: 0.32 },
];

const BUBBLE_SIZE = Math.min(SCREEN_WIDTH * 0.32, 140);

// ─────────────────────────────────────────────────────────────
// Speaker Bubble Component
// ─────────────────────────────────────────────────────────────

interface SpeakerBubbleProps {
  emoji: string;
  title: string;
  name: string;
  party: string;
  value: string;
  index: number;
  position: { top: number; left: number };
}

function SpeakerBubble({
  emoji,
  title,
  name,
  party,
  value,
  index,
  position,
}: SpeakerBubbleProps) {
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

  const partyColor = getPartyColor(party);
  const lastName = name.split(' ').slice(-1)[0];

  return (
    <Animated.View
      entering={getBouncyStaggerEntering(index, 200)}
      style={[
        styles.bubbleContainer,
        {
          top: SCREEN_HEIGHT * position.top,
          left: SCREEN_WIDTH * position.left,
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
              // Front
              <View style={styles.bubbleContent}>
                <Text style={styles.bubbleEmoji}>{emoji}</Text>
                <Text style={styles.bubbleName}>{lastName}</Text>
              </View>
            ) : (
              // Back
              <View style={styles.bubbleContent}>
                <Text style={styles.bubbleTitle}>{title}</Text>
                <Text style={styles.bubbleFullName}>{name}</Text>
                <Text style={styles.bubbleParty}>{party}</Text>
                <Text style={styles.bubbleValue}>{value}</Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// Result View
// ─────────────────────────────────────────────────────────────

interface ResultViewProps {
  speakers: TopSpeaker[];
  speakersByWords: TopSpeakerByWords[];
  speakersByAvgWords: TopSpeakerByAvgWords[];
}

function ResultView({ speakers, speakersByWords, speakersByAvgWords }: ResultViewProps) {
  const medals = useMemo(() => {
    const topBySpeechCount = speakers[0];
    const topByWords = speakersByWords[0];
    const topByAvg = speakersByAvgWords[0];

    return [
      topBySpeechCount && {
        emoji: '🎤',
        title: 'Meiste Reden',
        name: topBySpeechCount.name,
        party: topBySpeechCount.party,
        value: `${topBySpeechCount.speeches} Reden`,
      },
      topByWords && {
        emoji: '📝',
        title: 'Meiste Wörter',
        name: topByWords.name,
        party: topByWords.party,
        value: `${Math.round(topByWords.totalWords / 1000)}k Wörter`,
      },
      topByAvg && {
        emoji: '📊',
        title: 'Längste Reden',
        name: topByAvg.name,
        party: topByAvg.party,
        value: `Ø ${topByAvg.avgWords} Wörter`,
      },
    ].filter(Boolean) as Array<{
      emoji: string;
      title: string;
      name: string;
      party: string;
      value: string;
    }>;
  }, [speakers, speakersByWords, speakersByAvgWords]);

  return (
    <SlideContainer>
      {/* Header */}
      <View style={styles.header}>
        <SlideHeader emoji="🏆" title="Top Speakers" subtitle="Die Rekordhalter des Bundestags" />
      </View>

      {/* Speaker Bubbles */}
      {medals.map((medal, i) => (
        <SpeakerBubble
          key={medal.title}
          emoji={medal.emoji}
          title={medal.title}
          name={medal.name}
          party={medal.party}
          value={medal.value}
          index={i}
          position={SPEAKER_POSITIONS[i]}
        />
      ))}
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function TopSpeakersSlide({
  speakers,
  speakersByWords = [],
  speakersByAvgWords = [],
  phase = 'result',
  onQuizAnswer,
  onComplete,
}: TopSpeakersSlideProps) {
  const quiz = useQuizConfig({
    items: speakers,
    getOption: (s) => s.name,
    question: 'Wer hat die meisten Reden gehalten?',
    getExplanation: (s) => `${s.name} (${s.party}) führt mit ${s.speeches} Reden!`,
  });

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="🏆"
        title="Manche reden mehr als andere."
        subtitle="Wer hat die meisten Reden gehalten?"
      />
    );
  }

  if (phase === 'quiz' && quiz) {
    return (
      <SlideQuiz
        quiz={quiz}
        onAnswer={onQuizAnswer ?? (() => {})}
        onComplete={onComplete ?? (() => {})}
      />
    );
  }

  return (
    <ResultView
      speakers={speakers}
      speakersByWords={speakersByWords}
      speakersByAvgWords={speakersByAvgWords}
    />
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
  bubbleEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  bubbleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bubbleTitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bubbleFullName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  bubbleParty: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  bubbleValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
});
