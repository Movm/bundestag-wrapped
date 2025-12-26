import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { SPEAKER_CONTENT, buildQuizConfig } from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuizSectionProps {
  data: SpeakerWrapped;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

/**
 * QuizSection - Interactive quiz with 2x2 answer grid
 */
export function QuizSection({ data, onAnswer, onNext }: QuizSectionProps) {
  const content = SPEAKER_CONTENT.quiz;
  const quizConfig = buildQuizConfig(data.signatureQuiz);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // If no quiz, show fallback
  if (!quizConfig) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{content.fallbackEmoji}</Text>
          <Text style={styles.title}>{content.fallbackTitle}</Text>
          <Text style={styles.subtitle}>{content.fallbackSubtitle}</Text>
        </View>
      </View>
    );
  }

  const isCorrect = selectedAnswer === quizConfig.correctAnswer;

  const handleSelect = (answer: string) => {
    if (showResult) return;

    const correct = answer === quizConfig.correctAnswer;
    setSelectedAnswer(answer);
    setShowResult(true);
    onAnswer(correct);

    // Auto-advance after delay
    setTimeout(() => {
      onNext();
    }, correct ? 1500 : 2500);
  };

  return (
    <View style={styles.container}>
      {/* Result Overlay */}
      {showResult && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[
            styles.overlay,
            { backgroundColor: isCorrect ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.7)' },
          ]}
        >
          <Animated.View entering={ZoomIn.springify()} style={styles.resultContent}>
            <Text style={styles.resultEmoji}>
              {isCorrect ? content.successEmoji : content.wrongEmoji}
            </Text>
            <Text
              style={[
                styles.resultText,
                { color: isCorrect ? '#4ade80' : '#f87171' },
              ]}
            >
              {isCorrect ? content.successText : content.wrongText}
            </Text>
            {!isCorrect && quizConfig.explanation.length > 0 && (
              <View style={styles.explanationContainer}>
                {quizConfig.explanation.map((line, i) => (
                  <Text key={i} style={styles.explanationText}>
                    {quizConfig.explanation.length > 1 ? `• ${line}` : line}
                  </Text>
                ))}
              </View>
            )}
          </Animated.View>
        </Animated.View>
      )}

      <View style={styles.content}>
        {/* Header */}
        <Animated.Text entering={ZoomIn.delay(100)} style={styles.emoji}>
          {content.emoji}
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(200)} style={styles.headerTitle}>
          {content.title}
        </Animated.Text>

        {/* Question */}
        <Animated.Text entering={FadeInUp.delay(300)} style={styles.question}>
          {quizConfig.question}
        </Animated.Text>

        {/* Options Grid */}
        <View style={styles.optionsGrid}>
          {quizConfig.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = option === quizConfig.correctAnswer;

            let backgroundColor = 'rgba(255, 255, 255, 0.1)';
            let borderColor = 'rgba(255, 255, 255, 0.2)';

            if (showResult) {
              if (isAnswer) {
                backgroundColor = '#22c55e';
                borderColor = '#4ade80';
              } else if (isSelected) {
                backgroundColor = '#6b7280';
                borderColor = '#f87171';
              } else {
                backgroundColor = 'rgba(255, 255, 255, 0.05)';
                borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }

            return (
              <AnimatedPressable
                key={i}
                entering={FadeInUp.delay(400 + i * 100).springify()}
                onPress={() => handleSelect(option)}
                disabled={showResult}
                style={[
                  styles.optionButton,
                  { backgroundColor, borderColor },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    showResult && !isAnswer && !isSelected && { opacity: 0.5 },
                  ]}
                >
                  {option}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  optionButton: {
    width: '47%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    alignItems: 'center',
    padding: 32,
  },
  resultEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 28,
    fontWeight: '900',
  },
  explanationContainer: {
    marginTop: 16,
    maxWidth: 280,
  },
  explanationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
});
