import { motion } from 'motion/react';
import { useWrappedData } from '@/hooks/useDataQueries';
import { BackgroundSystem } from '@/components/ui/BackgroundSystem';
import { Footer } from '@/components/ui/Footer';
import { isNative } from '@/lib/capacitor';
import { HeroSection } from './statistiken/HeroSection';
import { PartySection } from './statistiken/PartySection';
import { SpeakerSection } from './statistiken/SpeakerSection';
import { ToneSection } from './statistiken/ToneSection';
import { DramaSection } from './statistiken/DramaSection';
import { GenderSection } from './statistiken/GenderSection';
import { CommonWordsSection } from './statistiken/CommonWordsSection';

export function StatistikenPage() {
  const { data, isLoading: loading, error } = useWrappedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <BackgroundSystem intensity="subtle" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Lade Statistiken...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <BackgroundSystem intensity="subtle" />
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Fehler beim Laden der Daten</p>
          <p className="text-white/60">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <BackgroundSystem intensity="medium" />

      <main className="relative z-10">
        <section id="overview">
          <HeroSection metadata={data.metadata} funFacts={data.funFacts} />
        </section>

        <section id="parties">
          <PartySection parties={data.parties} />
        </section>

        <section id="speakers">
          <SpeakerSection
            topSpeakers={data.topSpeakers}
            topSpeakersByWords={data.topSpeakersByWords}
            topSpeakersByAvgWords={data.topSpeakersByAvgWords}
            topBefragungResponders={data.topBefragungResponders}
          />
        </section>

        {data.toneAnalysis && (
          <section id="tone">
            <ToneSection toneAnalysis={data.toneAnalysis} />
          </section>
        )}

        <section id="drama">
          <DramaSection drama={data.drama} />
        </section>

        {data.genderAnalysis && (
          <section id="gender">
            <GenderSection genderAnalysis={data.genderAnalysis} />
          </section>
        )}

        <section id="topics">
          <CommonWordsSection commonWords={data.hotTopics} />
        </section>
      </main>

      {/* Hide footer on native - tab navigation handles navigation */}
      {!isNative() && <Footer />}
    </div>
  );
}
