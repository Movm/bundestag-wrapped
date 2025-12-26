import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWrappedData } from '@/hooks/useDataQueries';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { isNative } from '@/lib/capacitor';
import { SEO } from '@/components/seo/SEO';
import { SITE_CONFIG } from '@/components/seo/constants';
import { BackgroundSystem } from '@/components/ui/BackgroundSystem';
import { getSlideIntensity } from '@/lib/background-config';
import {
  ScrollContainer,
  SlideSection,
  useScrollWrapped,
  useAutoScroll,
  SlideRenderer,
  SLIDES,
  SHAREABLE_SLIDES,
  getSlideShareData,
  type ScrollContainerRef,
  type SlideType,
} from './main-wrapped';
import { SlideShareFAB } from './slides/shared';

// Stable no-op function to avoid recreating on each render
const noop = () => {};

interface MainWrappedPageProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function MainWrappedPage({ isMenuOpen, onMenuToggle }: MainWrappedPageProps) {
  const { data, isLoading: loading, error } = useWrappedData();
  const scrollContainerRef = useRef<ScrollContainerRef>(null);

  const {
    correctCount,
    quizNumber,
    currentSection,
    initialSection,
    handleQuizAnswer,
    setCurrentSection,
    isQuizAnswered,
    quizAnsweredMap,
  } = useScrollWrapped();

  // Auto-scroll on intro slides after 4 seconds
  useAutoScroll(currentSection, scrollContainerRef);

  // Track if intro slide has been started (for scroll lock)
  // If we're restoring past intro, mark as started
  const [introStarted, setIntroStarted] = useState(
    () => initialSection !== null && initialSection !== 'intro'
  );

  // Restore scroll position on mount if we have saved progress
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (initialSection && !hasRestoredRef.current && !loading && data) {
      hasRestoredRef.current = true;
      // Small delay to ensure ScrollContainer is mounted
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollToSlide(initialSection);
      });
    }
  }, [initialSection, loading, data]);

  const handleQuizComplete = useCallback((slideId: string) => {
    if (slideId === 'intro') {
      setIntroStarted(true);
    }
    setTimeout(() => {
      scrollContainerRef.current?.scrollToNextSlide(slideId);
    }, 100);
  }, []);

  // Stable section change handler
  const handleSectionChange = useCallback((id: string) => {
    setCurrentSection(id as SlideType);
  }, [setCurrentSection]);

  // Pre-compute slide callbacks to avoid inline arrow functions
  const slideCallbacks = useMemo(() => {
    return Object.fromEntries(
      SLIDES.map((slideId) => [
        slideId,
        {
          onQuizAnswer: (isCorrect: boolean) => handleQuizAnswer(slideId, isCorrect),
          onQuizComplete: () => handleQuizComplete(slideId),
        },
      ])
    ) as Record<SlideType, { onQuizAnswer: (isCorrect: boolean) => void; onQuizComplete: () => void }>;
  }, [handleQuizAnswer, handleQuizComplete]);

  // Lock scroll on intro (until started) and unanswered quiz slides
  const [scrollLocked, setScrollLocked] = useState(true); // Start locked for intro
  const shouldLock =
    (currentSection === 'intro' && !introStarted) ||
    (currentSection.startsWith('quiz-') && !isQuizAnswered(currentSection));

  useEffect(() => {
    if (shouldLock) {
      // Delay lock to let scroll-snap animation complete before triggering reflow
      const timer = setTimeout(() => setScrollLocked(true), 200);
      return () => clearTimeout(timer);
    } else {
      // Unlock immediately (no delay needed)
      setScrollLocked(false);
    }
  }, [shouldLock]);

  if (loading) {
    return null;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Fehler beim Laden</p>
          <p className="text-white/40 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  const showHeader = !isNative() && currentSection === 'intro';
  const showFooter = currentSection === 'finale';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.defaultDescription,
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.siteUrl}/suche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SEO canonicalUrl="/" structuredData={websiteSchema} />
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Header variant="dark" isMenuOpen={isMenuOpen} onMenuToggle={onMenuToggle} />
          </motion.div>
        )}
      </AnimatePresence>

      <BackgroundSystem
        intensity={getSlideIntensity(currentSection)}
        scrollContainer={scrollContainerRef.current?.containerRef}
        sparkles={{ color: 'rgb(147 51 234 / 0.15)', count: 40 }}
      />

      <div className="relative z-10">
        <ScrollContainer
          ref={scrollContainerRef}
          onSectionChange={handleSectionChange}
          locked={scrollLocked}
        >
          {SLIDES.map((slideId) => (
            <SlideSection key={slideId} id={slideId}>
              <SlideRenderer
                slide={slideId}
                data={data}
                quizNumber={quizNumber}
                correctCount={correctCount}
                isQuizAnswered={quizAnsweredMap[slideId] ?? false}
                onQuizAnswer={slideCallbacks[slideId].onQuizAnswer}
                onQuizEnter={noop}
                onQuizComplete={slideCallbacks[slideId].onQuizComplete}
              />
            </SlideSection>
          ))}
        </ScrollContainer>

        {/* Single FAB instance - only show on shareable slides */}
        {SHAREABLE_SLIDES.has(currentSection) && (() => {
          const shareData = getSlideShareData(currentSection, data);
          return shareData ? <SlideShareFAB slideData={shareData} /> : null;
        })()}

        <AnimatePresence>
          {showFooter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hide footer on native - tab navigation handles navigation */}
              {!isNative() && <Footer />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
