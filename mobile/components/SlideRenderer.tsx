import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { WrappedData } from '@/data/wrapped';
import { QUIZZES } from '@/data/quizzes';
import { INFO_SLIDES } from '@/data/info-slides';
import {
  SlideIntro,
  SlideInfo,
  SlideQuiz,
  SlideContainer,
} from '../slides/shared';
import { TopicsRevealSlide } from '../slides/TopicsRevealSlide';
import { VocabularyRevealSlide } from '../slides/VocabularyRevealSlide';
import { SpeechesChartSlide } from '../slides/SpeechesChartSlide';
import { DramaRevealSlide } from '../slides/DramaRevealSlide';
import { DiscriminatoryRevealSlide } from '../slides/DiscriminatoryRevealSlide';
import { CommonWordsRevealSlide } from '../slides/CommonWordsRevealSlide';
import { MoinSlide } from '../slides/MoinSlide';
import { SwiftieSlide } from '../slides/SwiftieSlide';
import { ToneRevealSlide } from '../slides/ToneRevealSlide';
import { GenderRevealSlide } from '../slides/GenderRevealSlide';
import { ShareSlide } from '../slides/ShareSlide';

// ─────────────────────────────────────────────────────────────
// Slide Constants (shared with web)
// ─────────────────────────────────────────────────────────────

export const SLIDES = [
  'intro-topics',
  'quiz-topics',
  'info-topics',
  'reveal-topics',
  'intro-vocabulary',
  'quiz-signature',
  'info-signature',
  'reveal-signature',
  'intro-speeches',
  'quiz-speeches',
  'info-speeches',
  'chart-speeches',
  'intro-drama',
  'quiz-drama',
  'info-drama',
  'reveal-drama',
  'intro-discriminatory',
  'quiz-discriminatory',
  'info-discriminatory',
  'reveal-discriminatory',
  'intro-common-words',
  'quiz-common-words',
  'reveal-common-words',
  'intro-moin',
  'quiz-moin',
  'info-moin',
  'reveal-moin',
  'intro-swiftie',
  'quiz-swiftie',
  'reveal-swiftie',
  'intro-tone',
  'quiz-tone',
  'info-tone',
  'reveal-tone',
  'quiz-gender',
  'info-gender',
  'reveal-gender',
  'share',
  'finale',
] as const;

export type SlideType = (typeof SLIDES)[number];

export const TOTAL_QUIZ_QUESTIONS = 10;

export const AUTO_SCROLL_SLIDES = new Set<SlideType>([
  'intro-topics',
  'info-topics',
  'intro-vocabulary',
  'intro-speeches',
  'intro-drama',
  'intro-discriminatory',
  'intro-common-words',
  'intro-moin',
  'intro-swiftie',
  'intro-tone',
  'info-signature',
  'info-speeches',
  'info-drama',
  'info-discriminatory',
  'info-moin',
  'info-tone',
  'info-gender',
]);

export const AUTO_SCROLL_DELAY = 4000;

// ─────────────────────────────────────────────────────────────
// Placeholder Component (for slides not yet built)
// ─────────────────────────────────────────────────────────────

function PlaceholderSlide({ slideType }: { slideType: string }) {
  return (
    <SlideContainer>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>🚧</Text>
        <Text style={styles.placeholderTitle}>Coming Soon</Text>
        <Text style={styles.placeholderSubtitle}>{slideType}</Text>
      </View>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Share Slide - imported from ../slides/ShareSlide
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// End Slide
// ─────────────────────────────────────────────────────────────

function EndSlide({ onRestart }: { onRestart?: () => void }) {
  const router = useRouter();

  return (
    <SlideContainer>
      <View style={styles.endContent}>
        <Text style={styles.endEmoji}>🎉</Text>
        <Text style={styles.endTitle}>Das war's!</Text>
        <Text style={styles.endSubtitle}>Bundestag Wrapped 2025</Text>

        <View style={styles.endButtons}>
          <Pressable style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.restartButtonText}>Nochmal starten</Text>
          </Pressable>
          <Pressable
            style={styles.speakerButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.speakerButtonText}>Abgeordnete ansehen</Text>
          </Pressable>
        </View>

        <Text style={styles.endCredits}>
          Daten: Offene Parlamentsdaten{'\n'}
          Made with ❤️ in Berlin
        </Text>
      </View>
    </SlideContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Renderer
// ─────────────────────────────────────────────────────────────

interface SlideRendererProps {
  slide: SlideType;
  data: WrappedData;
  quizNumber: number;
  correctCount: number;
  isQuizAnswered: boolean;
  onQuizAnswer: (isCorrect: boolean) => void;
  onQuizEnter: () => void;
  onQuizComplete: () => void;
  onStart: () => void;
  onRestart?: () => void;
}

export const SlideRenderer = memo(function SlideRenderer({
  slide,
  data,
  quizNumber,
  correctCount,
  isQuizAnswered,
  onQuizAnswer,
  onQuizEnter,
  onQuizComplete,
  onStart,
  onRestart,
}: SlideRendererProps) {
  switch (slide) {
    // ─────────────────────────────────────────────────────────
    // Topics Section
    // ─────────────────────────────────────────────────────────
    case 'intro-topics':
      return (
        <SlideIntro
          emoji="💬"
          title="Worüber redet der Bundestag?"
          subtitle="Die Top-Themen 2024"
        />
      );

    case 'reveal-topics':
      if (!data.topicAnalysis) return <PlaceholderSlide slideType="reveal-topics" />;
      return <TopicsRevealSlide topicAnalysis={data.topicAnalysis} />;

    // ─────────────────────────────────────────────────────────
    // Vocabulary Section (placeholder for now)
    // ─────────────────────────────────────────────────────────
    case 'intro-vocabulary':
      return (
        <SlideIntro
          emoji="📚"
          title="Jede Partei hat ihre Lieblingswörter."
          subtitle="Welche sind es?"
        />
      );

    case 'reveal-signature':
      return <VocabularyRevealSlide parties={data.parties} />;

    // ─────────────────────────────────────────────────────────
    // Speeches Section
    // ─────────────────────────────────────────────────────────
    case 'intro-speeches':
      return (
        <SlideIntro
          emoji="🎤"
          title="Manche reden mehr als andere."
          subtitle="Wer hat die meisten Reden gehalten?"
        />
      );

    case 'chart-speeches':
      return <SpeechesChartSlide parties={data.parties} />;

    // ─────────────────────────────────────────────────────────
    // Drama Section
    // ─────────────────────────────────────────────────────────
    case 'intro-drama':
      return (
        <SlideIntro
          emoji="🎭"
          title="Es wird laut im Bundestag."
          subtitle="Wer ruft am meisten dazwischen?"
        />
      );

    case 'reveal-drama':
      return <DramaRevealSlide drama={data.drama} />;

    // ─────────────────────────────────────────────────────────
    // Discriminatory Section (placeholder)
    // ─────────────────────────────────────────────────────────
    case 'intro-discriminatory':
      return (
        <SlideIntro
          emoji="⚠️"
          title="Nicht alle Worte sind gleich."
          subtitle="Diskriminierende Sprache im Bundestag"
        />
      );

    case 'reveal-discriminatory':
      return <DiscriminatoryRevealSlide toneAnalysis={data.toneAnalysis} />;

    // ─────────────────────────────────────────────────────────
    // Common Words Section (placeholder)
    // ─────────────────────────────────────────────────────────
    case 'intro-common-words':
      return (
        <SlideIntro
          emoji="🔤"
          title="Manche Wörter fallen öfter."
          subtitle="Was sind die häufigsten?"
        />
      );

    case 'reveal-common-words':
      return <CommonWordsRevealSlide hotTopics={data.hotTopics} />;

    // ─────────────────────────────────────────────────────────
    // Moin Section
    // ─────────────────────────────────────────────────────────
    case 'intro-moin':
      return (
        <SlideIntro
          emoji="👋"
          title="Moin Moin!"
          subtitle="Wer grüßt am norddeutschsten?"
        />
      );

    case 'quiz-moin':
      if (!data.moinSpeakers || data.moinSpeakers.length < 2) {
        return <PlaceholderSlide slideType="quiz-moin" />;
      }
      return (
        <MoinSlide
          moinSpeakers={data.moinSpeakers}
          phase="quiz"
          onQuizAnswer={onQuizAnswer}
          onQuizComplete={onQuizComplete}
        />
      );

    case 'reveal-moin':
      if (!data.moinSpeakers || data.moinSpeakers.length === 0) {
        return <PlaceholderSlide slideType="reveal-moin" />;
      }
      return <MoinSlide moinSpeakers={data.moinSpeakers} phase="result" />;

    // ─────────────────────────────────────────────────────────
    // Swiftie Section
    // ─────────────────────────────────────────────────────────
    case 'intro-swiftie':
      return (
        <SlideIntro
          emoji="🎤"
          title="Taylor Swift im Bundestag?"
          subtitle="Easter Egg Alert!"
        />
      );

    case 'quiz-swiftie':
      return (
        <SwiftieSlide
          phase="quiz"
          onQuizAnswer={onQuizAnswer}
          onQuizComplete={onQuizComplete}
        />
      );

    case 'reveal-swiftie':
      return <SwiftieSlide phase="result" />;

    // ─────────────────────────────────────────────────────────
    // Tone Section
    // ─────────────────────────────────────────────────────────
    case 'intro-tone':
      return (
        <SlideIntro
          emoji="🎭"
          title="Jede Fraktion hat ihren Stil."
          subtitle="Wie klingen die Parteien?"
        />
      );

    case 'reveal-tone':
      return <ToneRevealSlide toneAnalysis={data.toneAnalysis} />;

    // ─────────────────────────────────────────────────────────
    // Gender Section
    // ─────────────────────────────────────────────────────────
    case 'reveal-gender':
      return <GenderRevealSlide genderAnalysis={data.genderAnalysis} />;

    // ─────────────────────────────────────────────────────────
    // Quiz Slides (use shared QUIZZES data)
    // ─────────────────────────────────────────────────────────
    case 'quiz-topics':
    case 'quiz-signature':
    case 'quiz-speeches':
    case 'quiz-drama':
    case 'quiz-discriminatory':
    case 'quiz-common-words':
    case 'quiz-tone':
    case 'quiz-gender': {
      const question = QUIZZES[slide];
      if (!question) return <PlaceholderSlide slideType={slide} />;

      return (
        <SlideQuiz
          quiz={question}
          onAnswer={onQuizAnswer}
          onComplete={onQuizComplete}
          badge={`Frage ${quizNumber}/${TOTAL_QUIZ_QUESTIONS}`}
        />
      );
    }


    // ─────────────────────────────────────────────────────────
    // Info Slides (use shared INFO_SLIDES data)
    // ─────────────────────────────────────────────────────────
    case 'info-topics':
    case 'info-signature':
    case 'info-speeches':
    case 'info-drama':
    case 'info-discriminatory':
    case 'info-moin':
    case 'info-tone':
    case 'info-gender': {
      const info = INFO_SLIDES[slide];
      if (!info) return <PlaceholderSlide slideType={slide} />;

      return <SlideInfo emoji={info.emoji} title={info.title} body={info.body} />;
    }

    // ─────────────────────────────────────────────────────────
    // Share & Finale
    // ─────────────────────────────────────────────────────────
    case 'share':
      return (
        <ShareSlide
          correctCount={correctCount}
          totalQuestions={TOTAL_QUIZ_QUESTIONS}
        />
      );

    case 'finale':
      return <EndSlide onRestart={onRestart} />;

    // ─────────────────────────────────────────────────────────
    // Default (shouldn't happen)
    // ─────────────────────────────────────────────────────────
    default:
      return <PlaceholderSlide slideType={slide} />;
  }
});

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
  },
  endContent: {
    alignItems: 'center',
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  endTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
  endButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  restartButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ec4899',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  speakerButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  speakerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  endCredits: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
