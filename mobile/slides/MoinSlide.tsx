import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  ZoomIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer, SlideQuiz, type QuizConfig } from './shared';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface MoinSpeaker {
  name: string;
  party: string;
  count: number;
}

type SlidePhase = 'intro' | 'quiz' | 'result';

interface MoinSlideProps {
  moinSpeakers: MoinSpeaker[];
  phase: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onQuizComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─────────────────────────────────────────────────────────────
// Waving Emoji Component
// ─────────────────────────────────────────────────────────────

function WavingEmoji() {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 150 }),
        withTiming(-10, { duration: 150 }),
        withTiming(15, { duration: 150 }),
        withTiming(0, { duration: 150 }),
        withTiming(0, { duration: 3000 }) // pause
      ),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.Text style={[styles.emoji, animatedStyle]}>
      👋
    </Animated.Text>
  );
}

// ─────────────────────────────────────────────────────────────
// Speaker Card Component
// ─────────────────────────────────────────────────────────────

interface SpeakerCardProps {
  speaker: MoinSpeaker;
  rank: number;
  delay: number;
  isChampion: boolean;
}

function SpeakerCard({ speaker, rank, delay, isChampion }: SpeakerCardProps) {
  const partyColor = getPartyColor(speaker.party);
  const lastName = speaker.name.split(' ').slice(-1)[0];

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).springify()}
      style={[styles.card, isChampion && styles.cardChampion]}
    >
      <LinearGradient
        colors={[partyColor + 'cc', partyColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardGradient, isChampion && styles.cardGradientChampion]}
      >
        {/* Rank badge */}
        <View style={[styles.rankBadge, isChampion && styles.rankBadgeChampion]}>
          <Text style={[styles.rankText, isChampion && styles.rankTextChampion]}>
            {rank}
          </Text>
        </View>

        {/* Name */}
        <Text style={[styles.speakerName, isChampion && styles.speakerNameChampion]}>
          {isChampion ? speaker.name : lastName}
        </Text>

        {/* Party */}
        <Text style={[styles.speakerParty, isChampion && styles.speakerPartyChampion]}>
          {speaker.party}
        </Text>

        {/* Count */}
        <Text style={[styles.moinCount, isChampion && styles.moinCountChampion]}>
          {speaker.count}× Moin
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// Result View
// ─────────────────────────────────────────────────────────────

function ResultView({ speakers }: { speakers: MoinSpeaker[] }) {
  const topSpeakers = useMemo(() => speakers.slice(0, 4), [speakers]);

  return (
    <SlideContainer>
      <View style={styles.resultContent}>
        {/* Header */}
        <View style={styles.resultHeader}>
          <WavingEmoji />
          <Animated.Text entering={FadeInDown.delay(100)} style={styles.resultTitle}>
            Die Moin-Champions
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(200)} style={styles.resultSubtitle}>
            Norddeutsche Grüße im Bundestag
          </Animated.Text>
        </View>

        {/* Champion */}
        {topSpeakers[0] && (
          <SpeakerCard
            speaker={topSpeakers[0]}
            rank={1}
            delay={300}
            isChampion={true}
          />
        )}

        {/* 2nd and 3rd place */}
        {topSpeakers.length > 1 && (
          <View style={styles.runnersUp}>
            {topSpeakers.slice(1, 3).map((speaker, index) => (
              <SpeakerCard
                key={speaker.name}
                speaker={speaker}
                rank={index + 2}
                delay={500 + index * 100}
                isChampion={false}
              />
            ))}
          </View>
        )}

        {/* 4th place */}
        {topSpeakers[3] && (
          <SpeakerCard
            speaker={topSpeakers[3]}
            rank={4}
            delay={750}
            isChampion={false}
          />
        )}
      </View>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function MoinSlide({
  moinSpeakers,
  phase,
  onQuizAnswer,
  onQuizComplete,
}: MoinSlideProps) {
  // Custom quiz logic with decoys
  const quiz = useMemo<QuizConfig | null>(() => {
    if (moinSpeakers.length < 2) return null;

    const topSpeaker = moinSpeakers[0];
    const realOptions = moinSpeakers
      .slice(0, 4)
      .map((s) => `${s.name} (${s.party})`);

    const decoys = [
      'Johann Saathoff (SPD)',
      'Denise Loop (GRÜNE)',
      'Dr. Ingeborg Gräßle (CDU/CSU)',
    ];

    const options = [...realOptions];
    for (const decoy of decoys) {
      if (options.length >= 4) break;
      if (!options.includes(decoy)) {
        options.push(decoy);
      }
    }

    return {
      question: 'Welche Person sagt am häufigsten "Moin"?',
      options: shuffle(options.slice(0, 4)),
      correctAnswer: `${topSpeaker.name} (${topSpeaker.party})`,
      explanation: `${topSpeaker.name} grüßt mit ${topSpeaker.count}× "Moin"!`,
    };
  }, [moinSpeakers]);

  if (phase === 'quiz' && quiz) {
    return (
      <SlideQuiz
        quiz={quiz}
        onAnswer={onQuizAnswer ?? (() => {})}
        onComplete={onQuizComplete ?? (() => {})}
        emoji="👋"
        title="Moin!"
      />
    );
  }

  return <ResultView speakers={moinSpeakers} />;
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
    width: SCREEN_WIDTH * 0.4,
  },
  cardChampion: {
    width: SCREEN_WIDTH * 0.7,
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradientChampion: {
    padding: 20,
    borderRadius: 20,
  },
  rankBadge: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadgeChampion: {
    width: 36,
    height: 36,
    borderRadius: 18,
    top: -14,
    left: -14,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },
  rankTextChampion: {
    fontSize: 18,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  speakerNameChampion: {
    fontSize: 20,
    marginBottom: 4,
  },
  speakerParty: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  speakerPartyChampion: {
    fontSize: 14,
    marginBottom: 8,
  },
  moinCount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
  moinCountChampion: {
    fontSize: 18,
  },
  runnersUp: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
