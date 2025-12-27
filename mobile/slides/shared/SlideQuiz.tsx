import React, { useState, useMemo, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PARTY_COLORS, getPartyBgColor } from '@/lib/party-colors';
import { playSound } from '@/lib/sounds';
import { SlideContainer } from './SlideContainer';
import { Confetti } from './Confetti';
import { quizAnimations, getQuizOptionDelay } from './animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_GAP = 12;
const BUTTON_SIZE = (SCREEN_WIDTH - 48 - BUTTON_GAP) / 2;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface QuizConfig {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizOptionWithCorrect {
  text: string;
  isCorrect: boolean;
}

export interface QuizConfigAlt {
  question: string;
  options: QuizOptionWithCorrect[];
  explanation: string | string[];
}

interface NormalizedQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string[];
}

interface SlideQuizProps {
  quiz: QuizConfig | QuizConfigAlt;
  onAnswer: (isCorrect: boolean) => void;
  onComplete: () => void;
  title?: string;
  emoji?: string;
  badge?: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function normalizeQuizConfig(config: QuizConfig | QuizConfigAlt): NormalizedQuiz {
  if ('correctAnswer' in config) {
    return {
      question: config.question,
      options: config.options,
      correctAnswer: config.correctAnswer,
      explanation: [config.explanation],
    };
  }
  const correctOption = config.options.find((o) => o.isCorrect);
  return {
    question: config.question,
    options: config.options.map((o) => o.text),
    correctAnswer: correctOption?.text ?? '',
    explanation: Array.isArray(config.explanation)
      ? config.explanation
      : [config.explanation],
  };
}

const FALLBACK_COLORS = ['#2d2d3a', '#363647', '#3f3f52', '#4a4a5e'];

function getOptionColor(option: string, index: number): string {
  const partyMatch = option.match(/\(([^)]+)\)$/);
  const partyName = partyMatch ? partyMatch[1] : option;
  const isParty = partyName in PARTY_COLORS;
  return isParty ? getPartyBgColor(partyName) : FALLBACK_COLORS[index];
}

function isEmojiOption(option: string): boolean {
  return /^\p{Emoji}/u.test(option);
}

// ─────────────────────────────────────────────────────────────
// Overlay Components
// ─────────────────────────────────────────────────────────────

function SuccessOverlay({ onComplete }: { onComplete: () => void }) {
  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSound('correct');
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Modal transparent animationType="none">
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut} style={styles.overlay}>
        {/* Confetti celebration effect - full screen */}
        <Confetti count={40} />

        <Animated.View
          entering={ZoomIn.duration(300)}
          style={styles.overlayContent}
        >
          <Text style={styles.overlayEmoji}>🎉</Text>
          <Text style={styles.successText}>Richtig!</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function WrongOverlay({
  explanation,
  onComplete,
}: {
  explanation: string[];
  onComplete: () => void;
}) {
  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSound('wrong');
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Modal transparent animationType="none">
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut} style={styles.wrongOverlay}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.overlayContent}>
          <Text style={styles.overlayEmoji}>😅</Text>
          <Text style={styles.wrongText}>Nicht ganz...</Text>
          <View style={styles.explanationContainer}>
            {explanation.map((line, i) => (
              <Text key={i} style={styles.explanationText}>
                {explanation.length > 1 ? `• ${line}` : line}
              </Text>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Quiz Button
// ─────────────────────────────────────────────────────────────

interface QuizButtonProps {
  option: string;
  index: number;
  baseColor: string;
  isSelected: boolean;
  isAnswer: boolean;
  showResult: boolean;
  onPress: () => void;
}

const QuizButton = React.memo(function QuizButton({
  option,
  index,
  baseColor,
  isSelected,
  isAnswer,
  showResult,
  onPress,
}: QuizButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!showResult) {
      scale.value = withSpring(0.95);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSound('click');
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Determine background color based on state
  let backgroundColor = baseColor;
  let borderColor = 'transparent';
  let opacity = 1;

  if (showResult) {
    if (isAnswer) {
      backgroundColor = '#22c55e';
      borderColor = '#86efac';
    } else if (isSelected) {
      backgroundColor = '#6b7280';
      borderColor = '#f87171';
    } else {
      opacity = 0.5;
    }
  }

  const isEmoji = isEmojiOption(option);

  return (
    <Animated.View entering={FadeInDown.delay(getQuizOptionDelay(index)).springify()}>
      <Animated.View style={[animatedStyle, { opacity }]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={showResult}
          style={[
            styles.optionButton,
            {
              backgroundColor,
              borderColor,
              borderWidth: showResult && (isAnswer || isSelected) ? 2 : 0,
            },
          ]}
        >
          {isEmoji ? (
            <Text style={styles.emojiOption}>{option}</Text>
          ) : (
            <Text style={styles.optionText}>{option}</Text>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function SlideQuiz({
  quiz: rawQuiz,
  onAnswer,
  onComplete,
  title,
  emoji,
  badge,
}: SlideQuizProps) {
  const quiz = useMemo(() => normalizeQuizConfig(rawQuiz), [rawQuiz]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  const optionColors = useMemo(
    () => quiz.options.map((option, i) => getOptionColor(option, i)),
    [quiz.options]
  );

  const handleSelect = useCallback(
    (answer: string) => {
      if (showResult) return;

      const correct = answer === quiz.correctAnswer;
      setSelectedAnswer(answer);
      setShowResult(true);
      onAnswer(correct);

      // Minimal delay so user sees the green/red button feedback first
      setTimeout(() => {
        setShowOverlay(true);
      }, 50);
    },
    [showResult, quiz.correctAnswer, onAnswer]
  );

  const handleOverlayComplete = useCallback(() => {
    setShowResult(false);
    setShowOverlay(false);
    onComplete();
  }, [onComplete]);

  return (
    <SlideContainer>
      {/* Result overlays - delayed to show button feedback first */}
      {showOverlay && isCorrect && <SuccessOverlay onComplete={handleOverlayComplete} />}
      {showOverlay && !isCorrect && (
        <WrongOverlay explanation={quiz.explanation} onComplete={handleOverlayComplete} />
      )}

      <View style={styles.content}>
        {/* Header (optional) */}
        {(emoji || title || badge) && (
          <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
            {emoji && <Text style={styles.headerEmoji}>{emoji}</Text>}
            {title && <Text style={styles.headerTitle}>{title}</Text>}
            {badge && <Text style={styles.headerBadge}>{badge}</Text>}
          </Animated.View>
        )}

        {/* Question */}
        <Animated.Text entering={quizAnimations.question()} style={styles.question}>
          {quiz.question}
        </Animated.Text>

        {/* Options Grid */}
        <View style={styles.optionsGrid}>
          {quiz.options.map((option, i) => (
            <QuizButton
              key={i}
              option={option}
              index={i}
              baseColor={optionColors[i]}
              isSelected={selectedAnswer === option}
              isAnswer={option === quiz.correctAnswer}
              showResult={showResult}
              onPress={() => handleSelect(option)}
            />
          ))}
        </View>
      </View>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerBadge: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: BUTTON_GAP,
    width: '100%',
  },
  optionButton: {
    width: BUTTON_SIZE,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
  emojiOption: {
    fontSize: 40,
  },
  // Overlays
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    alignItems: 'center',
    padding: 32,
  },
  overlayEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  successText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4ade80',
  },
  wrongText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f87171',
    marginBottom: 16,
  },
  explanationContainer: {
    maxWidth: 300,
    alignItems: 'center',
  },
  explanationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
});
