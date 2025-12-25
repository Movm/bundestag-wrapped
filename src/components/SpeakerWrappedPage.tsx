import { useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeakerData } from '@/hooks/useDataQueries';
import { getPartyColor } from '@/lib/party-colors';
import { SpeakerSEO } from '@/components/seo/SpeakerSEO';
import {
  IntroSection,
  AnimalSection,
  QuizSection,
  WordsSection,
  TopicsSection,
  ShareSocialSection,
  EndSection,
} from './speaker-wrapped';

type Section = 'intro' | 'animal' | 'quiz' | 'words' | 'topics' | 'share' | 'end';

const SECTIONS: Section[] = ['intro', 'animal', 'quiz', 'words', 'topics', 'share', 'end'];

export function SpeakerWrappedPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, isLoading: loading, error } = useSpeakerData(slug);
  const [currentSection, setCurrentSection] = useState<Section>('intro');

  const sectionIndex = SECTIONS.indexOf(currentSection);
  const progress = ((sectionIndex + 1) / SECTIONS.length) * 100;

  const goToNext = useCallback(() => {
    const idx = SECTIONS.indexOf(currentSection);
    if (idx < SECTIONS.length - 1) {
      setCurrentSection(SECTIONS[idx + 1]);
    }
  }, [currentSection]);

  const restart = useCallback(() => {
    setCurrentSection('intro');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎤</div>
          <p className="text-white/60">Lade Wrapped...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">
            {error?.message?.includes('not found') ? 'Abgeordnete/r nicht gefunden' : 'Fehler beim Laden'}
          </p>
          <p className="text-white/40 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  const partyColor = getPartyColor(data.party);
  const hideProgressBar = currentSection === 'intro' || currentSection === 'share' || currentSection === 'end';

  return (
    <>
      <SpeakerSEO speaker={data} />
      <div className="min-h-screen page-bg pt-14">
        {!hideProgressBar && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-14 left-0 right-0 z-50 p-4"
        >
          <div
            className="max-w-md mx-auto h-1 bg-white/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Fortschritt durch das Wrapped"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: partyColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentSection === 'intro' && <IntroSection data={data} onNext={goToNext} />}
          {currentSection === 'animal' && <AnimalSection data={data} onNext={goToNext} />}
          {currentSection === 'quiz' && <QuizSection data={data} onNext={goToNext} />}
          {currentSection === 'words' && <WordsSection data={data} onNext={goToNext} />}
          {currentSection === 'topics' && <TopicsSection data={data} onNext={goToNext} />}
          {currentSection === 'share' && <ShareSocialSection data={data} onRestart={restart} />}
          {currentSection === 'end' && <EndSection data={data} onRestart={restart} />}
        </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
