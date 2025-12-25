import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PARTY_BG_CLASSES, PARTY_BG_COLORS } from '@/lib/party-colors';
import { highlightTerms, type ScoredWord, type ParsedQuery } from '@/lib/search-utils';

interface WordCardProps {
  word: ScoredWord;
  query: ParsedQuery;
  index: number;
  onSearchInSpeeches?: (word: string) => void;
}

const PARTY_ORDER = ['CDU/CSU', 'SPD', 'GRÜNE', 'AfD', 'DIE LINKE', 'fraktionslos'];

export function WordCard({ word, query, index, onSearchInSpeeches }: WordCardProps) {
  const [expanded, setExpanded] = useState(false);

  const highlightedWord = useMemo(
    () => highlightTerms(word.word, query, 100),
    [word.word, query]
  );

  // Calculate max per1000 for scaling bars
  const maxPer1000 = useMemo(() => {
    return Math.max(...Object.values(word.parties).map((p) => p.per1000));
  }, [word.parties]);

  // Get parties sorted by usage
  const sortedParties = useMemo(() => {
    return PARTY_ORDER
      .filter((party) => word.parties[party]?.count > 0)
      .sort((a, b) => (word.parties[b]?.per1000 || 0) - (word.parties[a]?.per1000 || 0));
  }, [word.parties]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl overflow-hidden transition-all"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
        aria-expanded={expanded}
        aria-controls={`wordcard-details-${word.word}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium text-lg">
              {highlightedWord}
            </h3>
            <div className="text-white/50 text-sm mt-0.5">
              {word.total.toLocaleString('de-DE')}x verwendet
            </div>
          </div>
          <div className="flex-shrink-0 text-white/40">
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              ▼
            </motion.span>
          </div>
        </div>

        {/* Party bars - always visible */}
        <div className="mt-3 space-y-1.5">
          {sortedParties.slice(0, expanded ? undefined : 3).map((party) => {
            const stats = word.parties[party];
            if (!stats) return null;

            const widthPercent = maxPer1000 > 0 ? (stats.per1000 / maxPer1000) * 100 : 0;

            return (
              <div key={party} className="flex items-center gap-2">
                <div className="w-20 text-xs text-white/60 truncate">{party}</div>
                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(widthPercent, 2)}%`,
                      backgroundColor: PARTY_BG_COLORS[party] || '#6B7280',
                    }}
                  />
                </div>
                <div className="w-16 text-xs text-white/50 text-right">
                  {stats.per1000.toFixed(2)}‰
                </div>
              </div>
            );
          })}
          {!expanded && sortedParties.length > 3 && (
            <div className="text-xs text-white/40 text-center pt-1">
              +{sortedParties.length - 3} weitere Parteien
            </div>
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`wordcard-details-${word.word}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/10">
              {/* Top speakers */}
              {word.topSpeakers && word.topSpeakers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white/60 text-xs uppercase tracking-wider mb-2">
                    Top Sprecher
                  </h4>
                  <div className="space-y-1">
                    {word.topSpeakers.map((speaker) => (
                      <a
                        key={speaker.slug}
                        href={`/abgeordnete/${speaker.slug}`}
                        className="flex items-center justify-between text-sm hover:bg-white/5 rounded px-2 py-1 -mx-2 transition-colors"
                      >
                        <span className="text-white/80 hover:text-pink-300">
                          {speaker.name}
                        </span>
                        <span className="text-white/40">
                          {speaker.count}x
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Party breakdown table */}
              <div className="mb-4">
                <h4 className="text-white/60 text-xs uppercase tracking-wider mb-2">
                  Nutzung nach Partei
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {sortedParties.map((party) => {
                    const stats = word.parties[party];
                    if (!stats) return null;
                    return (
                      <div key={party} className="flex items-center justify-between">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs text-white ${
                            PARTY_BG_CLASSES[party] || 'bg-gray-500'
                          }`}
                        >
                          {party}
                        </span>
                        <span className="text-white/50">
                          {stats.count.toLocaleString('de-DE')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {onSearchInSpeeches && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearchInSpeeches(word.word);
                    }}
                    className="flex-1 text-sm bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg py-2 px-3 transition-colors"
                  >
                    In Reden suchen →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
