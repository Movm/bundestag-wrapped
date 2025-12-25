import { AnimatePresence } from 'motion/react';
import type { ScoredSpeech, ScoredSpeaker, ScoredWord, ParsedQuery, Speech } from '@/lib/search-utils';
import type { SearchState } from '@/hooks/useSearchState';
import { SpeechCard } from './SpeechCard';
import { SpeakerCard } from './SpeakerCard';
import { WordCard } from './WordCard';

interface SearchResultsProps {
  state: SearchState;
  filteredSpeeches: ScoredSpeech[];
  filteredSpeakers: ScoredSpeaker[];
  filteredWords: ScoredWord[];
  parsedQuery: ParsedQuery;
  visibleCount: number;
  hasActiveFilters: boolean;
  hasQuery: boolean;
  onSpeechClick: (speech: Speech) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
  onSearchWordInSpeeches?: (word: string) => void;
}

export function SearchResults({
  state,
  filteredSpeeches,
  filteredSpeakers,
  filteredWords,
  parsedQuery,
  visibleCount,
  hasActiveFilters,
  hasQuery,
  onSpeechClick,
  onLoadMore,
  onResetFilters,
  onSearchWordInSpeeches,
}: SearchResultsProps) {
  const resultCount = state.tab === 'speeches'
    ? filteredSpeeches.length
    : state.tab === 'speakers'
    ? filteredSpeakers.length
    : filteredWords.length;

  const visibleResults = state.tab === 'speeches'
    ? filteredSpeeches.slice(0, visibleCount)
    : state.tab === 'speakers'
    ? filteredSpeakers.slice(0, visibleCount)
    : filteredWords.slice(0, visibleCount);

  const hasMore = visibleCount < resultCount;

  const resultLabel = state.tab === 'speeches'
    ? 'Reden'
    : state.tab === 'speakers'
    ? 'Abgeordnete'
    : 'Wörter';

  return (
    <main id="search-results" role="tabpanel" className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Screen reader announcement for search results */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {resultCount.toLocaleString('de-DE')} {resultLabel} gefunden
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-white/60 text-sm">
          <span className="text-white font-semibold">
            {resultCount.toLocaleString('de-DE')}
          </span>{' '}
          {resultLabel} gefunden
        </p>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-pink-400 hover:text-pink-300 text-sm"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {state.q && !hasQuery && (
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60">
          <p className="font-medium text-white/80 mb-1">Suchtipps:</p>
          <ul className="space-y-0.5 text-xs">
            <li><code className="bg-white/10 px-1 rounded">"exakte phrase"</code> für exakte Übereinstimmung</li>
            <li><code className="bg-white/10 px-1 rounded">wort1 AND wort2</code> beide Begriffe müssen vorkommen</li>
            <li><code className="bg-white/10 px-1 rounded">wort1 OR wort2</code> einer der Begriffe</li>
            <li><code className="bg-white/10 px-1 rounded">NOT wort</code> Begriff ausschließen</li>
            <li><code className="bg-white/10 px-1 rounded">speaker:name</code> nach Redner:in filtern</li>
            <li><code className="bg-white/10 px-1 rounded">party:SPD</code> nach Partei filtern</li>
            <li><code className="bg-white/10 px-1 rounded">words:&gt;500</code> Mindestwortzahl</li>
          </ul>
        </div>
      )}

      <div className={state.tab === 'speakers' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}>
        <AnimatePresence mode="popLayout">
          {state.tab === 'speeches' &&
            (visibleResults as ScoredSpeech[]).map((speech, index) => (
              <SpeechCard
                key={speech.id}
                speech={speech}
                query={parsedQuery}
                index={index}
                onClick={() => onSpeechClick(speech)}
              />
            ))}
          {state.tab === 'speakers' &&
            (visibleResults as ScoredSpeaker[]).map((speaker, index) => (
              <SpeakerCard
                key={speaker.slug}
                speaker={speaker}
                query={parsedQuery}
                index={index}
              />
            ))}
          {state.tab === 'words' &&
            (visibleResults as ScoredWord[]).map((word, index) => (
              <WordCard
                key={word.word}
                word={word}
                query={parsedQuery}
                index={index}
                onSearchInSpeeches={onSearchWordInSpeeches}
              />
            ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            Mehr laden ({resultCount - visibleCount} weitere)
          </button>
        </div>
      )}

      {resultCount === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/60">Keine Ergebnisse gefunden</p>
          <p className="text-white/40 text-sm mt-1">
            Versuche andere Suchbegriffe oder Filter
          </p>
        </div>
      )}
    </main>
  );
}
