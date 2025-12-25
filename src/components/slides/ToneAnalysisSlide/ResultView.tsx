import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { ToneAnalysis, PartyProfile, ExtendedToneScores } from '@/data/wrapped';
import { getPartyGradient, getPartyColor } from '@/lib/party-colors';
import { FlipCard, BUBBLE_POSITIONS, FLOAT_ANIMATIONS } from '../shared';
import { sortParties } from './constants';
import { LegacyResultView } from './LegacyResultView';

const PARTY_SUMMARIES: Record<string, string> = {
  'CDU/CSU': 'Setzt auf positive Rhetorik und sucht Konsens statt Konfrontation.',
  'SPD': 'Fokussiert auf praktische Lösungen und parteiübergreifende Zusammenarbeit.',
  'GRÜNE': 'Balanciert Idealismus mit pragmatischen Ansätzen im Parlament.',
  'AfD': 'Greift scharf an, etikettiert Gegner und setzt auf Konfrontation statt Kooperation.',
  'DIE LINKE': 'Stellt kämpferisch soziale Forderungen und hinterfragt die Regierung.',
};

interface ResultViewProps {
  toneAnalysis: ToneAnalysis;
}

interface ToneBubbleProps {
  profile: PartyProfile;
  index: number;
  position: { top: string; left: string };
  floatOffset: { x: number[]; y: number[] };
  duration: number;
}

// Generate a holistic one-word summary based on ALL tone scores
function getHolisticSummary(scores: ExtendedToneScores): string {
  const {
    aggression,
    collaboration,
    solution_focus,
    demand_intensity,
    affirmative,
    labeling,
    discriminatory,
    inclusivity,
  } = scores;

  // Calculate composite traits
  const isConstructive = solution_focus > 50 && collaboration > 40;
  const isAggressive = aggression > 5 || discriminatory > 3;
  const isDemanding = demand_intensity > 10;
  const isPositive = affirmative > 15 && aggression < 3;
  const isLabeling = labeling > 10;
  const isInclusive = inclusivity > 5 && discriminatory < 2;

  // Priority-based summary selection
  if (isAggressive && isLabeling) return 'Konfrontativ';
  if (isAggressive && isDemanding) return 'Kämpferisch';
  if (isConstructive && isPositive) return 'Lösungsorientiert';
  if (isConstructive && isInclusive) return 'Kooperativ';
  if (isDemanding && !isAggressive) return 'Fordernd';
  if (isPositive && collaboration > 50) return 'Verbindend';
  if (isLabeling && !isAggressive) return 'Analytisch';
  if (solution_focus > 60) return 'Pragmatisch';
  if (affirmative > 20) return 'Optimistisch';
  if (collaboration > 55) return 'Teamorientiert';

  return 'Sachlich'; // Default fallback
}

function ToneBubble({
  profile,
  index,
  position,
  floatOffset,
  duration,
}: ToneBubbleProps) {
  const partyColor = getPartyColor(profile.party);
  const holisticSummary = getHolisticSummary(profile.scores);

  const bubbleClasses = `
    w-full h-full
    rounded-full
    bg-gradient-to-br ${getPartyGradient(profile.party)}
    shadow-2xl shadow-black/30
    flex flex-col items-center justify-center
    p-3 text-center
  `;

  // Front: Just emoji and holistic one-word summary
  const frontContent = (
    <div className={bubbleClasses}>
      <span className="text-4xl md:text-5xl lg:text-6xl mb-1 drop-shadow-lg">
        {profile.emoji}
      </span>
      <p className="text-white font-bold text-sm md:text-base drop-shadow-md">
        {holisticSummary}
      </p>
    </div>
  );

  // Back: Party name + summary sentence
  const backContent = (
    <div className={bubbleClasses}>
      <h4
        className="font-black text-sm md:text-base drop-shadow-md mb-2"
        style={{ color: partyColor }}
      >
        {profile.party}
      </h4>
      <p className="text-white/90 text-xs md:text-sm px-3 leading-relaxed text-center">
        {PARTY_SUMMARIES[profile.party] || 'Keine Beschreibung verfügbar.'}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
      }}
    >
      <motion.div
        animate={{ x: floatOffset.x, y: floatOffset.y }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      >
        <FlipCard
          front={frontContent}
          back={backContent}
          className="w-[28vw] h-[28vw] max-w-[220px] max-h-[220px] min-w-[120px] min-h-[120px]"
        />
      </motion.div>
    </motion.div>
  );
}

export function ResultView({ toneAnalysis }: ResultViewProps) {
  const sortedProfiles = useMemo(() => {
    if (!toneAnalysis.partyProfiles) return [];
    return sortParties(toneAnalysis.partyProfiles).filter(
      (p) => p.party !== 'fraktionslos'
    );
  }, [toneAnalysis.partyProfiles]);

  // Only show first 5 parties for the bubble layout
  const topParties = sortedProfiles.slice(0, 5);

  if (topParties.length === 0) {
    return <LegacyResultView toneAnalysis={toneAnalysis} />;
  }

  return (
    <div className="min-h-screen relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          Fraktions-Persönlichkeiten
        </h2>
        <p className="text-white/50 text-xs md:text-sm">
          Tippe zum Umdrehen
        </p>
      </motion.div>

      <div className="absolute inset-0 z-10">
        {topParties.map((profile, i) => (
          <ToneBubble
            key={profile.party}
            profile={profile}
            index={i}
            position={BUBBLE_POSITIONS[i]}
            floatOffset={FLOAT_ANIMATIONS[i]}
            duration={FLOAT_ANIMATIONS[i].duration}
          />
        ))}
      </div>
    </div>
  );
}
