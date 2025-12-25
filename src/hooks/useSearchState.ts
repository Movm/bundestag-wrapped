import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { SpeechSortOption, SpeakerSortOption, WordSortOption } from '@/lib/search-utils';

export type TabType = 'speeches' | 'speakers' | 'words';

export interface SearchState {
  q: string;
  tab: TabType;
  party: string;
  sort: SpeechSortOption | SpeakerSortOption | WordSortOption;
  minWords: number;
  maxWords: number;
}

const DEFAULT_STATE: SearchState = {
  q: '',
  tab: 'speeches',
  party: '',
  sort: 'relevance',
  minWords: 0,
  maxWords: 0,
};

function parseStateFromParams(params: URLSearchParams): SearchState {
  return {
    q: params.get('q') || '',
    tab: (params.get('tab') as TabType) || 'speeches',
    party: params.get('party') || '',
    sort: (params.get('sort') as SpeechSortOption | SpeakerSortOption) || 'relevance',
    minWords: parseInt(params.get('minWords') || '0', 10) || 0,
    maxWords: parseInt(params.get('maxWords') || '0', 10) || 0,
  };
}

function buildParamsFromState(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.q) params.set('q', state.q);
  if (state.tab !== 'speeches') params.set('tab', state.tab);
  if (state.party) params.set('party', state.party);
  if (state.sort !== 'relevance') params.set('sort', state.sort);
  if (state.minWords > 0) params.set('minWords', String(state.minWords));
  if (state.maxWords > 0) params.set('maxWords', String(state.maxWords));

  return params;
}

export function useSearchState(): [
  SearchState,
  (updates: Partial<SearchState>) => void,
  () => void
] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<SearchState>(() => parseStateFromParams(searchParams));

  // Sync state from URL when it changes externally (back/forward navigation)
  useEffect(() => {
    const urlState = parseStateFromParams(searchParams);
    setState(urlState);
  }, [searchParams]);

  const updateState = useCallback((updates: Partial<SearchState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };

      // Reset sort to relevance when changing tabs (if current sort doesn't apply)
      if (updates.tab && updates.tab !== prev.tab) {
        const speechSorts: SpeechSortOption[] = ['relevance', 'date', 'words-desc', 'words-asc', 'speaker'];
        const speakerSorts: SpeakerSortOption[] = ['relevance', 'speeches-desc', 'speeches-asc', 'words-desc', 'name'];
        const wordSorts: WordSortOption[] = ['relevance', 'total', 'alphabetical'];

        if (updates.tab === 'speeches' && !speechSorts.includes(prev.sort as SpeechSortOption)) {
          next.sort = 'relevance';
        } else if (updates.tab === 'speakers' && !speakerSorts.includes(prev.sort as SpeakerSortOption)) {
          next.sort = 'relevance';
        } else if (updates.tab === 'words' && !wordSorts.includes(prev.sort as WordSortOption)) {
          next.sort = 'relevance';
        }

        // Clear word filters when switching to speakers or words
        if (updates.tab === 'speakers' || updates.tab === 'words') {
          next.minWords = 0;
          next.maxWords = 0;
        }
      }

      // Update URL
      setSearchParams(buildParamsFromState(next), { replace: true });

      return next;
    });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setState((prev) => {
      const next = {
        ...DEFAULT_STATE,
        tab: prev.tab, // Keep current tab
      };

      // Update URL
      setSearchParams(buildParamsFromState(next), { replace: true });

      return next;
    });
  }, [setSearchParams]);

  return [state, updateState, resetFilters];
}

// Debounce hook for search input
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
