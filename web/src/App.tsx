import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { loadWrappedData, type WrappedData } from '@/data/wrapped';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { IntroSlide } from '@/components/slides/IntroSlide';
import { ComparisonSlide } from '@/components/slides/ComparisonSlide';
import { QuizSlide } from '@/components/slides/QuizSlide';
import { DramaSlide } from '@/components/slides/DramaSlide';
import { TopSpeakersSlide } from '@/components/slides/TopSpeakersSlide';
import { HotTopicsSlide } from '@/components/slides/HotTopicsSlide';
import { GrandFinaleSlide } from '@/components/slides/GrandFinaleSlide';
import { SignatureWordsSlide } from '@/components/slides/SignatureWordsSlide';
import { KeyTopicsSlide } from '@/components/slides/KeyTopicsSlide';

// Spotify Wrapped style: Quiz → Answer → Full Stats for each section
const SLIDES = [
  'intro',

  // Section 1: Vocabulary
  'quiz-signature',        // Signature word quiz (one question)
  'quiz-key-topic',        // Key topic quiz (one question)
  'stats-signature',       // All parties' signature words
  'stats-key-topics',      // Key topics (count + ratio combined)

  // Section 2: Speech Volume
  'quiz-speeches',         // Who spoke most? → CDU/CSU
  'stats-speeches',        // Bar chart of all parties

  // Section 3: Drama King
  'quiz-interrupter',      // Who interrupted most? → Brandner
  'stats-drama',           // Full drama slide

  // Section 4: Reactions (Applause + Heckling)
  'quiz-applause',         // Applause champion → CDU/CSU
  'quiz-heckler',          // Loudest heckler → AfD

  // Section 5: Top Speakers
  'quiz-speakers',         // Who spoke most? → Brandner
  'quiz-words-total',      // Most words total → Jens Spahn
  'stats-speakers',        // Top speakers podium

  // Section 6: Hot Topics
  'quiz-topics',           // Which word do all parties use?
  'stats-topics',          // Hot topics word cloud

  // Section 7: Fun bonus
  'quiz-moin',             // Who says Moin?

  // Section 8: Speaker Spread
  'quiz-speaker-spread',   // Which party has most different speakers?
  'stats-speaker-spread',  // Bar chart of unique speakers per party

  // Section 9: Zwischenfragen
  'quiz-zwischenfragen',   // Who asks the most questions?

  // Finale
  'finale',                // Grand stats reveal + quiz score + share
] as const;

type SlideType = (typeof SLIDES)[number];

const TOTAL_QUIZ_QUESTIONS = 12;

// Map slide names to quiz question indices (matches Python _generate_quiz_questions order)
const QUIZ_MAP: Partial<Record<SlideType, number>> = {
  // Vocabulary quizzes
  'quiz-signature': 0,     // Signature word (one question)
  'quiz-key-topic': 1,     // Key topic (one question)
  // Other quizzes
  'quiz-speeches': 2,      // Most speeches (party)
  'quiz-interrupter': 3,   // Who interrupted most (person)
  'quiz-applause': 4,      // Applause champion (party)
  'quiz-heckler': 5,       // Loudest heckler (party)
  'quiz-speakers': 6,      // Top speaker (person)
  'quiz-words-total': 7,   // Most words total (person)
  'quiz-topics': 8,        // Hot topics (word)
  'quiz-moin': 9,          // Moin!
  'quiz-speaker-spread': 10, // Most unique speakers (party)
  'quiz-zwischenfragen': 11, // Top question asker (person)
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<SlideType>('intro');
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWrappedData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const slideIndex = SLIDES.indexOf(currentSlide);
  const progress = ((slideIndex + 1) / SLIDES.length) * 100;

  const goToNextSlide = useCallback(() => {
    const currentIndex = SLIDES.indexOf(currentSlide);
    if (currentIndex < SLIDES.length - 1) {
      setCurrentSlide(SLIDES[currentIndex + 1]);
    }
  }, [currentSlide]);

  const handleQuizAnswer = (isCorrect: boolean) => {
    setQuizAnswers((prev) => [...prev, isCorrect]);
  };

  const getQuizNumber = () => {
    const quizSlides = SLIDES.filter((s) => s.startsWith('quiz-'));
    const currentQuizIndex = quizSlides.indexOf(currentSlide as (typeof quizSlides)[number]);
    return currentQuizIndex + 1;
  };

  const renderSlide = () => {
    if (!data) return null;

    // Handle quiz slides dynamically
    if (currentSlide.startsWith('quiz-')) {
      const questionIndex = QUIZ_MAP[currentSlide];
      if (questionIndex !== undefined) {
        return (
          <QuizSlide
            question={data.quizQuestions[questionIndex]}
            questionNumber={getQuizNumber()}
            totalQuestions={TOTAL_QUIZ_QUESTIONS}
            onAnswer={handleQuizAnswer}
            onNext={goToNextSlide}
          />
        );
      }
    }

    switch (currentSlide) {
      case 'intro':
        return <IntroSlide onStart={goToNextSlide} />;

      case 'stats-signature':
        return (
          <SignatureWordsSlide
            parties={data.parties}
            onNext={goToNextSlide}
          />
        );

      case 'stats-key-topics':
        return (
          <KeyTopicsSlide
            parties={data.parties}
            onNext={goToNextSlide}
          />
        );

      case 'stats-speeches':
        return (
          <ComparisonSlide
            emoji="🎤"
            headline="Die Reden-Bilanz"
            question="So viel hat jede Partei geredet"
            items={data.parties.slice(0, 5).map((p) => ({
              label: p.party,
              value: p.speeches,
              party: p.party,
            }))}
            unit="Reden"
            onNext={goToNextSlide}
          />
        );

      case 'stats-drama':
        return <DramaSlide drama={data.drama} onNext={goToNextSlide} />;

      case 'stats-speakers':
        return (
          <TopSpeakersSlide
            speakers={data.topSpeakers}
            onNext={goToNextSlide}
          />
        );

      case 'stats-topics':
        return (
          <HotTopicsSlide topics={data.hotTopics} onNext={goToNextSlide} />
        );

      case 'stats-speaker-spread':
        return (
          <ComparisonSlide
            emoji="👥"
            headline="Redner-Vielfalt"
            question="So viele verschiedene Redner pro Fraktion"
            items={data.parties
              .filter((p) => p.party !== 'fraktionslos')
              .slice(0, 5)
              .map((p) => ({
                label: p.party,
                value: p.uniqueSpeakers,
                party: p.party,
              }))}
            unit="Redner"
            onNext={goToNextSlide}
          />
        );

      case 'finale':
        return (
          <GrandFinaleSlide
            totalSpeeches={data.metadata.totalSpeeches}
            totalWords={data.metadata.totalWords}
            partyCount={data.metadata.partyCount}
            speakerCount={data.metadata.speakerCount}
            sitzungen={data.metadata.sitzungen}
            correctCount={quizAnswers.filter(Boolean).length}
            totalQuestions={TOTAL_QUIZ_QUESTIONS}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏛️</div>
          <p className="text-white/60">Lade Daten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Fehler beim Laden</p>
          <p className="text-white/40 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121a]">
      {/* Progress Bar */}
      {currentSlide !== 'intro' && currentSlide !== 'finale' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
        >
          <ProgressBar progress={progress} />
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
