import { memo } from 'react';
import type { WrappedData } from '@/data/wrapped';
import { QUIZZES } from '@/data/quizzes';
import { INFO_SLIDES } from '@/data/info-slides';
import { TOTAL_QUIZ_QUESTIONS, type SlideType } from './constants';
import {
  IntroSlide,
  QuizSlide,
  VocabularySlide,
  SpeechesSlide,
  DramaSlide,
  TopicsSlide,
  CommonWordsSlide,
  MoinSlide,
  SwiftieSlide,
  ToneAnalysisSlide,
  DiscriminatorySlide,
  GenderSlide,
  ShareSlide,
  EndSlide,
} from '@/components/slides';
import { SlideInfo } from '@/components/slides/shared';
import type { SlideData } from '@/lib/slide-sharepics';

// Map slide types to their share data (exported for MainWrappedPage)
export function getSlideShareData(slide: SlideType, data: WrappedData): SlideData | null {
  switch (slide) {
    case 'reveal-signature':
      return { type: 'vocabulary', data: { parties: data.parties } };
    case 'chart-speeches':
      return {
        type: 'speeches',
        data: {
          parties: data.parties.map(p => ({
            party: p.party,
            speeches: p.speeches,
            wortbeitraege: p.wortbeitraege,
          })),
        },
      };
    case 'reveal-drama':
      return { type: 'drama', drama: data.drama };
    case 'reveal-common-words':
      return { type: 'commonWords', data: { topics: data.hotTopics } };
    case 'reveal-moin':
      return { type: 'moin', speakers: data.moinSpeakers ?? [] };
    case 'reveal-swiftie':
      return { type: 'swiftie', data: { name: 'Daniel Baldy', party: 'SPD' } };
    case 'reveal-tone':
      return data.toneAnalysis?.partyProfiles
        ? { type: 'toneAnalysis', data: { partyProfiles: data.toneAnalysis.partyProfiles } }
        : null;
    case 'reveal-gender':
      return data.genderAnalysis
        ? { type: 'gender', genderAnalysis: data.genderAnalysis }
        : null;
    default:
      return null;
  }
}

interface SlideRendererProps {
  slide: SlideType;
  data: WrappedData;
  quizNumber: number;
  correctCount: number;
  isQuizAnswered: boolean;
  onQuizAnswer: (isCorrect: boolean) => void;
  onQuizEnter: () => void;
  onQuizComplete: () => void;
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
  onRestart,
}: SlideRendererProps) {
  const renderSlideContent = () => {
    switch (slide) {
    case 'intro':
      return <IntroSlide onStart={onQuizComplete} />;

    // Topics: intro -> result (first section)
    case 'intro-topics':
      return data.topicAnalysis ? (
        <TopicsSlide topicAnalysis={data.topicAnalysis} phase="intro" />
      ) : null;

    case 'reveal-topics':
      return data.topicAnalysis ? (
        <TopicsSlide topicAnalysis={data.topicAnalysis} phase="result" />
      ) : null;

    // Vocabulary: intro -> quiz -> result
    case 'intro-vocabulary':
      return <VocabularySlide parties={data.parties} phase="intro" />;

    case 'reveal-signature':
      return <VocabularySlide parties={data.parties} phase="result" />;

    // Speeches: intro -> result
    case 'intro-speeches':
      return <SpeechesSlide parties={data.parties} phase="intro" />;

    case 'chart-speeches':
      return <SpeechesSlide parties={data.parties} phase="result" />;

    // Drama: intro -> result
    case 'intro-drama':
      return <DramaSlide drama={data.drama} phase="intro" />;

    // Discriminatory Language: intro -> quiz -> info -> result
    case 'intro-discriminatory':
      return <DiscriminatorySlide toneAnalysis={data.toneAnalysis} phase="intro" />;

    // Common Words: intro -> result
    case 'intro-common-words':
      return <CommonWordsSlide topics={data.hotTopics} phase="intro" />;

    // Moin: intro -> quiz -> result
    case 'intro-moin':
      return <MoinSlide moinSpeakers={data.moinSpeakers ?? []} phase="intro" />;

    case 'quiz-moin':
      return (
        <MoinSlide
          moinSpeakers={data.moinSpeakers ?? []}
          phase="quiz"
          onQuizAnswer={onQuizAnswer}
          onComplete={onQuizComplete}
        />
      );

    case 'reveal-moin':
      return <MoinSlide moinSpeakers={data.moinSpeakers ?? []} phase="result" />;

    // Swiftie Easter Egg: intro -> quiz -> result
    case 'intro-swiftie':
      return <SwiftieSlide phase="intro" />;

    case 'quiz-swiftie':
      return (
        <SwiftieSlide
          phase="quiz"
          onQuizAnswer={onQuizAnswer}
          onComplete={onQuizComplete}
        />
      );

    case 'reveal-swiftie':
      return <SwiftieSlide phase="result" />;

    // Tone: intro -> result
    case 'intro-tone':
      return data.toneAnalysis ? (
        <ToneAnalysisSlide toneAnalysis={data.toneAnalysis} phase="intro" />
      ) : null;

    // All quiz slides use hardcoded QUIZZES
    case 'quiz-topics':
    case 'quiz-signature':
    case 'quiz-speeches':
    case 'quiz-drama':
    case 'quiz-discriminatory':
    case 'quiz-common-words':
    case 'quiz-tone':
    case 'quiz-gender': {
      const question = QUIZZES[slide];
      return (
        <QuizSlide
          question={question}
          questionNumber={quizNumber}
          totalQuestions={TOTAL_QUIZ_QUESTIONS}
          isAnswered={isQuizAnswered}
          onAnswer={onQuizAnswer}
          onEnterView={onQuizEnter}
          onComplete={onQuizComplete}
          slideId={slide}
        />
      );
    }

    // Info slides - educational context between quiz and reveal
    case 'info-topics':
    case 'info-signature':
    case 'info-speeches':
    case 'info-drama':
    case 'info-discriminatory':
    case 'info-moin':
    case 'info-tone':
    case 'info-gender':
      return <SlideInfo {...INFO_SLIDES[slide]} />;

    case 'reveal-drama':
      return <DramaSlide drama={data.drama} phase="result" />;

    case 'reveal-discriminatory':
      return <DiscriminatorySlide toneAnalysis={data.toneAnalysis} phase="result" />;

    case 'reveal-common-words':
      return <CommonWordsSlide topics={data.hotTopics} phase="result" />;

    case 'reveal-tone':
      return data.toneAnalysis ? (
        <ToneAnalysisSlide toneAnalysis={data.toneAnalysis} phase="result" />
      ) : null;

    case 'reveal-gender':
      return data.genderAnalysis ? (
        <GenderSlide genderAnalysis={data.genderAnalysis} phase="result" />
      ) : null;

    case 'share':
      return (
        <ShareSlide
          correctCount={correctCount}
          totalQuestions={TOTAL_QUIZ_QUESTIONS}
        />
      );

    case 'finale':
      return <EndSlide onRestart={onRestart} />;

    default:
      return null;
    }
  };

  return renderSlideContent();
}, (prev, next) => {
  // Only re-render if this specific slide's relevant data changed
  if (prev.slide !== next.slide) return false;
  if (prev.isQuizAnswered !== next.isQuizAnswered) return false;
  if (prev.data !== next.data) return false;
  // For share slide, also check correctCount
  if (prev.slide === 'share' && prev.correctCount !== next.correctCount) return false;
  // For quiz slides using old pattern, check quizNumber
  if (prev.slide.startsWith('quiz-') && prev.quizNumber !== next.quizNumber) return false;
  return true;
})
