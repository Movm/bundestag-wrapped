import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';
import type { FunFact } from '@/data/wrapped';

interface HeroSectionProps {
  metadata: {
    totalSpeeches: number;
    totalWords: number;
    partyCount: number;
    speakerCount: number;
    wahlperiode: number;
    sitzungen: number;
  };
  funFacts?: FunFact[];
}

const config = SECTION_CONFIG.overview;

export function HeroSection({ metadata, funFacts }: HeroSectionProps) {
  return (
    <SectionWrapper sectionId="overview" showTopBorder={false} noPadding>
      {/* HERO ZONE - Giant stat fills viewport */}
      <div className="min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16">
        <SectionHeader
          sectionNumber={config.number}
          emoji={config.emoji}
          title={config.title}
          subtitle={`Die ${metadata.wahlperiode}. Wahlperiode`}
          accentColor={config.accent}
          size="large"
          className="mb-12"
        />

        {/* THE HERO STAT - Total Words */}
        <HeroStat
          value={metadata.totalWords}
          label="Wörter gesprochen"
          sublabel="im Deutschen Bundestag"
          suffix="M"
          format="compact"
          color={config.accent}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-20 text-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl text-white/30"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Statistiken & Fun Facts anzeigen"
          collapseLabel="Details ausblenden"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto mb-16"
          >
            <StatCard
              value={metadata.totalSpeeches}
              label="Reden"
              icon="🎤"
            />
            <StatCard
              value={metadata.speakerCount}
              label="Redner:innen"
              icon="👥"
            />
            <StatCard
              value={metadata.sitzungen}
              label="Sitzungen"
              icon="📅"
            />
            <StatCard
              value={metadata.partyCount}
              label="Fraktionen"
              icon="🏛️"
            />
          </motion.div>

          {funFacts && funFacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white/80 mb-6 text-center">Fun Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {funFacts.slice(0, 8).map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <span className="text-2xl block mb-2">{fact.emoji}</span>
                    <p className="text-white font-bold text-lg">{fact.value}</p>
                    <p className="text-white/60 text-sm">{fact.label}</p>
                    {fact.sublabel && (
                      <p className="text-white/40 text-xs mt-1">{fact.sublabel}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  icon: string;
}

function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-pink-500/30 transition-colors text-center"
    >
      <span className="text-3xl md:text-4xl block mb-2">{icon}</span>
      <AnimatedCounter
        value={value}
        className="text-2xl md:text-3xl font-black text-white"
      />
      <p className="text-white/60 text-sm mt-1">{label}</p>
    </motion.div>
  );
}
