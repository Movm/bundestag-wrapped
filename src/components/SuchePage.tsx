import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { SEO } from '@/components/seo/SEO';
import { PAGE_META } from '@/components/seo/constants';
import {
  parseSearchQuery,
  searchSpeeches,
  searchSpeakers,
  searchWords,
  sortSpeeches,
  sortSpeakers,
  sortWords,
  hasSearchContent,
  type Speech,
  type ScoredSpeech,
  type ScoredSpeaker,
  type ScoredWord,
  type SpeechSortOption,
  type SpeakerSortOption,
  type WordSortOption,
} from '@/lib/search-utils';
import { useSearchState, useDebounce } from '@/hooks/useSearchState';
import { useSpeakerIndex, useSpeechesDb, useWordsIndex } from '@/hooks/useDataQueries';
import {
  SearchHero,
  SearchHeader,
  SearchResults,
  SpeechDetailModal,
} from './suche';
import { SuchePageSkeleton } from './skeletons/SuchePageSkeleton';

export function SuchePage() {
  const [state, updateState, resetFilters] = useSearchState();
  const { data: speechesData, isLoading: speechesLoading, error: speechesError } = useSpeechesDb();
  const { data: speakerIndex, isLoading: speakersLoading, error: speakersError } = useSpeakerIndex();
  const { data: wordsIndex, isLoading: wordsLoading, error: wordsError } = useWordsIndex();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [visibleCount, setVisibleCount] = useState(50);

  const loading = speechesLoading || speakersLoading || wordsLoading;
  const error = speechesError || speakersError || wordsError;

  const debouncedQuery = useDebounce(state.q, 300);

  const parsedQuery = useMemo(
    () => parseSearchQuery(debouncedQuery),
    [debouncedQuery]
  );

  const hasQuery = hasSearchContent(parsedQuery);
  const showResults = hasQuery || state.party || state.minWords > 0 || state.maxWords > 0 || state.tab === 'words';

  const parties = useMemo(() => {
    if (!speakerIndex) return [];
    return [...new Set(speakerIndex.speakers.map(s => s.party))];
  }, [speakerIndex]);

  const filteredSpeeches = useMemo((): ScoredSpeech[] => {
    if (!speechesData || state.tab !== 'speeches') return [];

    const filtered = searchSpeeches(speechesData.speeches, parsedQuery, {
      party: state.party,
      minWords: state.minWords || undefined,
      maxWords: state.maxWords || undefined,
    });

    return sortSpeeches(filtered, state.sort as SpeechSortOption, hasQuery);
  }, [speechesData, parsedQuery, state.party, state.minWords, state.maxWords, state.sort, state.tab, hasQuery]);

  const filteredSpeakers = useMemo((): ScoredSpeaker[] => {
    if (!speakerIndex || state.tab !== 'speakers') return [];

    const filtered = searchSpeakers(speakerIndex.speakers, parsedQuery, {
      party: state.party,
    });

    return sortSpeakers(filtered, state.sort as SpeakerSortOption, hasQuery);
  }, [speakerIndex, parsedQuery, state.party, state.sort, state.tab, hasQuery]);

  const filteredWords = useMemo((): ScoredWord[] => {
    if (!wordsIndex || state.tab !== 'words') return [];

    const filtered = searchWords(wordsIndex.words, parsedQuery, {
      party: state.party,
    });

    return sortWords(filtered, state.sort as WordSortOption, hasQuery);
  }, [wordsIndex, parsedQuery, state.party, state.sort, state.tab, hasQuery]);

  const handleSearchWordInSpeeches = useCallback((word: string) => {
    updateState({ q: word, tab: 'speeches' });
  }, [updateState]);

  useEffect(() => {
    setVisibleCount(50);
  }, [state.party, state.tab, debouncedQuery, state.sort, state.minWords, state.maxWords]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 50);
  }, []);

  const hasActiveFilters = state.party || state.q || state.minWords > 0 || state.maxWords > 0;

  if (loading) {
    return <SuchePageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400">Fehler beim Laden</p>
          <p className="text-white/40 text-sm mt-2">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={PAGE_META.search.title}
        description={PAGE_META.search.description}
        canonicalUrl="/suche"
      />
      <div className="min-h-screen page-bg pt-14">
        {!showResults && (
        <SearchHero state={state} updateState={updateState} />
      )}

      {showResults && (
        <>
          <SearchHeader
            state={state}
            updateState={updateState}
            parties={parties}
          />

          <SearchResults
            state={state}
            filteredSpeeches={filteredSpeeches}
            filteredSpeakers={filteredSpeakers}
            filteredWords={filteredWords}
            parsedQuery={parsedQuery}
            visibleCount={visibleCount}
            hasActiveFilters={!!hasActiveFilters}
            hasQuery={hasQuery}
            onSpeechClick={setSelectedSpeech}
            onLoadMore={loadMore}
            onResetFilters={resetFilters}
            onSearchWordInSpeeches={handleSearchWordInSpeeches}
          />

          <AnimatePresence>
            {selectedSpeech && (
              <SpeechDetailModal
                speech={selectedSpeech}
                onClose={() => setSelectedSpeech(null)}
              />
            )}
          </AnimatePresence>

          <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 pointer-events-none">
            <div className="flex justify-center gap-4 text-xs text-white/40">
              <a
                href="https://www.moritz-waechter.de/impressum"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors pointer-events-auto"
              >
                Impressum
              </a>
              <span>|</span>
              <Link
                to="/datenschutz"
                className="hover:text-white/60 transition-colors pointer-events-auto"
              >
                Datenschutz
              </Link>
            </div>
          </footer>
        </>
      )}
      </div>
    </>
  );
}
