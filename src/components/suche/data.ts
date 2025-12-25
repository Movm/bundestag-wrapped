import type { SpeechSortOption, SpeakerSortOption, WordSortOption } from '@/lib/search-utils';

export const SPEECH_SORT_OPTIONS: { value: SpeechSortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevanz' },
  { value: 'date', label: 'Neueste zuerst' },
  { value: 'words-desc', label: 'Längste zuerst' },
  { value: 'words-asc', label: 'Kürzeste zuerst' },
  { value: 'speaker', label: 'Redner:in A-Z' },
];

export const SPEAKER_SORT_OPTIONS: { value: SpeakerSortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevanz' },
  { value: 'speeches-desc', label: 'Meiste Reden' },
  { value: 'speeches-asc', label: 'Wenigste Reden' },
  { value: 'words-desc', label: 'Meiste Wörter' },
  { value: 'name', label: 'Name A-Z' },
];

export const WORD_SORT_OPTIONS: { value: WordSortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevanz' },
  { value: 'total', label: 'Häufigste zuerst' },
  { value: 'alphabetical', label: 'A-Z' },
];
