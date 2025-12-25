import { useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PARTY_BG_CLASSES } from '@/lib/party-colors';
import { highlightTerms, type ScoredSpeaker, type ParsedQuery } from '@/lib/search-utils';

const MotionLink = motion.create(Link);

interface SpeakerCardProps {
  speaker: ScoredSpeaker;
  query: ParsedQuery;
  index: number;
}

export function SpeakerCard({ speaker, query, index }: SpeakerCardProps) {
  const highlightedName = useMemo(
    () => highlightTerms(speaker.name, query, 100),
    [speaker.name, query]
  );

  return (
    <MotionLink
      to="/abgeordnete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium truncate group-hover:text-pink-300 transition-colors">
            {highlightedName}
          </h3>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium text-white ${
              PARTY_BG_CLASSES[speaker.party] || 'bg-gray-500'
            }`}
          >
            {speaker.party}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-white/80 font-semibold">
            {speaker.speeches + (speaker.wortbeitraege || 0)} Wortbeitr.
          </div>
          <div className="text-white/40 text-xs">
            davon {speaker.speeches} Reden
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-white/50">
          {speaker.words.toLocaleString('de-DE')} Wörter
        </span>
        <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Zur Abgeordneten-Suche →
        </span>
      </div>
    </MotionLink>
  );
}
