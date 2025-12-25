import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { ToneAnalysis } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer, ScrollHint, itemVariants } from '../shared';

interface ResultViewProps {
  toneAnalysis?: ToneAnalysis | null;
}

export function ResultView({ toneAnalysis }: ResultViewProps) {
  const rankings = useMemo(() => {
    // Use discriminatoryCounts if available, fallback to discriminatory
    const counts = toneAnalysis?.rankings?.discriminatoryCounts;
    if (counts && counts.length > 0) {
      return counts
        .filter((r) => r.party !== 'fraktionslos')
        .slice(0, 5);
    }
    return [];
  }, [toneAnalysis]);

  const leader = rankings[0];

  if (!leader) {
    return (
      <SlideContainer innerClassName="flex items-center justify-center min-h-[70vh]">
        <p className="text-white/60">Keine Daten verfügbar</p>
      </SlideContainer>
    );
  }

  return (
    <SlideContainer innerClassName="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div variants={itemVariants} className="text-6xl mb-6">
        ⚠️
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
      >
        Diskriminierende Sprache
      </motion.h2>

      <motion.div variants={itemVariants} className="space-y-4">
        {rankings.map((ranking, index) => {
          const isLeader = index === 0;
          const partyColor = getPartyColor(ranking.party);

          return (
            <motion.div
              key={ranking.party}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`flex items-center gap-4 ${isLeader ? 'scale-110' : 'opacity-70'}`}
            >
              <span
                className={`font-bold tabular-nums w-8 text-right ${
                  isLeader ? 'text-3xl text-white' : 'text-xl text-white/50'
                }`}
              >
                {index + 1}.
              </span>
              <PartyBadge party={ranking.party} size={isLeader ? 'lg' : 'md'} />
              <span
                className={`font-mono font-bold ${
                  isLeader ? 'text-2xl' : 'text-lg'
                }`}
                style={{ color: isLeader ? partyColor : undefined }}
              >
                {ranking.count}×
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-white/40 text-xs md:text-sm text-center mt-10 max-w-xs"
      >
        Begriffe wie "Remigration", "Genderideologie" oder "Überfremdung"
      </motion.p>

      <ScrollHint delay={2} className="mt-8" />
    </SlideContainer>
  );
}
