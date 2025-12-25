import type { ReactNode } from 'react';
import { createElement } from 'react';

// Types
export interface ParsedQuery {
  terms: string[];
  phrases: string[];
  notTerms: string[];
  fieldFilters: {
    speaker?: string;
    party?: string;
    minWords?: number;
    maxWords?: number;
  };
  operator: 'AND' | 'OR';
}

export interface Speech {
  id: number;
  speaker: string;
  party: string;
  type: string;
  category: 'rede' | 'wortbeitrag';
  words: number;
  text: string;
  preview?: string;
}

export interface ScoredSpeech extends Speech {
  score: number;
  _idx: number; // Original array index for date sorting
}

export interface SpeakerSummary {
  slug: string;
  name: string;
  party: string;
  speeches: number;
  wortbeitraege: number;
  words: number;
}

export interface ScoredSpeaker extends SpeakerSummary {
  score: number;
}

export type SpeechSortOption = 'relevance' | 'date' | 'words-desc' | 'words-asc' | 'speaker';
export type SpeakerSortOption = 'relevance' | 'speeches-desc' | 'speeches-asc' | 'words-desc' | 'name';
export type WordSortOption = 'relevance' | 'total' | 'alphabetical';
export type SortOption = SpeechSortOption | SpeakerSortOption | WordSortOption;

// Word frequency types for Words search tab
export interface WordPartyStats {
  count: number;
  per1000: number;
}

export interface WordSpeaker {
  slug: string;
  name: string;
  count: number;
}

export interface WordFrequency {
  word: string;
  total: number;
  parties: Record<string, WordPartyStats>;
  topSpeakers?: WordSpeaker[];
}

export interface ScoredWord extends WordFrequency {
  score: number;
}

export interface WordsIndex {
  words: WordFrequency[];
}

export interface SearchFilters {
  party: string;
  minWords?: number;
  maxWords?: number;
}

// Parse advanced search query
export function parseSearchQuery(query: string): ParsedQuery {
  const parsed: ParsedQuery = {
    terms: [],
    phrases: [],
    notTerms: [],
    fieldFilters: {},
    operator: 'AND',
  };

  if (!query.trim()) return parsed;

  let workingQuery = query;

  // Extract quoted phrases first
  const phraseRegex = /"([^"]+)"/g;
  let match;
  while ((match = phraseRegex.exec(query)) !== null) {
    parsed.phrases.push(match[1].toLowerCase());
  }
  workingQuery = workingQuery.replace(phraseRegex, ' ');

  // Extract field filters (speaker:, party:, words:)
  const fieldRegex = /(speaker|party|words):(\S+)/gi;
  while ((match = fieldRegex.exec(workingQuery)) !== null) {
    const [, field, value] = match;
    switch (field.toLowerCase()) {
      case 'speaker':
        parsed.fieldFilters.speaker = value.toLowerCase();
        break;
      case 'party':
        parsed.fieldFilters.party = value.toUpperCase();
        break;
      case 'words':
        if (value.startsWith('>')) {
          parsed.fieldFilters.minWords = parseInt(value.slice(1), 10);
        } else if (value.startsWith('<')) {
          parsed.fieldFilters.maxWords = parseInt(value.slice(1), 10);
        } else {
          const num = parseInt(value, 10);
          if (!isNaN(num)) {
            parsed.fieldFilters.minWords = num;
          }
        }
        break;
    }
  }
  workingQuery = workingQuery.replace(fieldRegex, ' ');

  // Extract NOT terms
  const notRegex = /\bNOT\s+(\S+)/gi;
  while ((match = notRegex.exec(workingQuery)) !== null) {
    parsed.notTerms.push(match[1].toLowerCase());
  }
  workingQuery = workingQuery.replace(notRegex, ' ');

  // Check for OR operator
  if (/\bOR\b/i.test(workingQuery)) {
    parsed.operator = 'OR';
  }

  // Extract remaining terms (remove AND/OR operators)
  const remaining = workingQuery
    .replace(/\s+(AND|OR)\s+/gi, ' ')
    .trim();

  parsed.terms = remaining
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => t.toLowerCase());

  return parsed;
}

// Calculate relevance score for a speech
function calculateSpeechScore(speech: Speech, query: ParsedQuery): number {
  let score = 0;
  const textLower = speech.text?.toLowerCase() || '';
  const speakerLower = speech.speaker?.toLowerCase() || '';

  // Score exact phrases (highest weight)
  for (const phrase of query.phrases) {
    if (textLower.includes(phrase)) score += 10;
    if (speakerLower.includes(phrase)) score += 15;
  }

  // Score terms based on operator
  if (query.operator === 'AND') {
    const allMatch = query.terms.every(
      (term) => textLower.includes(term) || speakerLower.includes(term)
    );
    if (!allMatch && query.terms.length > 0) return 0;
    score += query.terms.length * 3;
  } else {
    // OR: score each match
    for (const term of query.terms) {
      if (textLower.includes(term)) score += 3;
      if (speakerLower.includes(term)) score += 5;
    }
  }

  // Boost for term frequency (capped)
  for (const term of query.terms) {
    const regex = new RegExp(escapeRegex(term), 'gi');
    const matches = (textLower.match(regex) || []).length;
    score += Math.min(matches, 5);
  }

  // Boost for speaker name matches
  for (const term of query.terms) {
    if (speakerLower.includes(term)) {
      score += 10;
    }
  }

  return score;
}

// Calculate relevance score for a speaker
function calculateSpeakerScore(speaker: SpeakerSummary, query: ParsedQuery): number {
  let score = 0;
  const nameLower = speaker.name.toLowerCase();
  const partyLower = speaker.party.toLowerCase();

  // Score phrases
  for (const phrase of query.phrases) {
    if (nameLower.includes(phrase)) score += 15;
  }

  // Score terms
  if (query.operator === 'AND') {
    const allMatch = query.terms.every(
      (term) => nameLower.includes(term) || partyLower.includes(term)
    );
    if (!allMatch && query.terms.length > 0) return 0;
    score += query.terms.length * 5;
  } else {
    for (const term of query.terms) {
      if (nameLower.includes(term)) score += 5;
      if (partyLower.includes(term)) score += 3;
    }
  }

  return score;
}

// Search speeches with scoring
export function searchSpeeches(
  speeches: Speech[],
  query: ParsedQuery,
  filters: SearchFilters
): ScoredSpeech[] {
  return speeches
    .map((speech, idx) => ({
      ...speech,
      score: calculateSpeechScore(speech, query),
      _idx: idx,
    }))
    .filter((speech) => {
      // Apply parsed query field filters
      if (
        query.fieldFilters.speaker &&
        !speech.speaker.toLowerCase().includes(query.fieldFilters.speaker)
      ) {
        return false;
      }
      if (
        query.fieldFilters.party &&
        speech.party.toUpperCase() !== query.fieldFilters.party
      ) {
        return false;
      }
      if (
        query.fieldFilters.minWords &&
        speech.words < query.fieldFilters.minWords
      ) {
        return false;
      }
      if (
        query.fieldFilters.maxWords &&
        speech.words > query.fieldFilters.maxWords
      ) {
        return false;
      }

      // Apply UI filters
      if (filters.party && speech.party !== filters.party) {
        return false;
      }
      if (filters.minWords && speech.words < filters.minWords) {
        return false;
      }
      if (filters.maxWords && speech.words > filters.maxWords) {
        return false;
      }

      // Check NOT terms
      const textLower = speech.text.toLowerCase();
      for (const notTerm of query.notTerms) {
        if (textLower.includes(notTerm)) return false;
      }

      // If no search query, include all (filters only)
      if (query.terms.length === 0 && query.phrases.length === 0) {
        return true;
      }

      return speech.score > 0;
    });
}

// Search speakers with scoring
export function searchSpeakers(
  speakers: SpeakerSummary[],
  query: ParsedQuery,
  filters: SearchFilters
): ScoredSpeaker[] {
  return speakers
    .map((speaker) => ({
      ...speaker,
      score: calculateSpeakerScore(speaker, query),
    }))
    .filter((speaker) => {
      // Apply parsed query field filters
      if (
        query.fieldFilters.speaker &&
        !speaker.name.toLowerCase().includes(query.fieldFilters.speaker)
      ) {
        return false;
      }
      if (
        query.fieldFilters.party &&
        speaker.party.toUpperCase() !== query.fieldFilters.party
      ) {
        return false;
      }

      // Apply UI filters
      if (filters.party && speaker.party !== filters.party) {
        return false;
      }

      // Check NOT terms in name
      const nameLower = speaker.name.toLowerCase();
      for (const notTerm of query.notTerms) {
        if (nameLower.includes(notTerm)) return false;
      }

      // If no search query, include all (filters only)
      if (query.terms.length === 0 && query.phrases.length === 0) {
        return true;
      }

      return speaker.score > 0;
    });
}

// Sort speeches
export function sortSpeeches(
  speeches: ScoredSpeech[],
  sortKey: SpeechSortOption,
  hasQuery: boolean
): ScoredSpeech[] {
  const sorted = [...speeches];

  switch (sortKey) {
    case 'relevance':
      if (hasQuery) {
        sorted.sort((a, b) => b.score - a.score);
      }
      break;
    case 'date':
      sorted.sort((a, b) => b._idx - a._idx);
      break;
    case 'words-desc':
      sorted.sort((a, b) => b.words - a.words);
      break;
    case 'words-asc':
      sorted.sort((a, b) => a.words - b.words);
      break;
    case 'speaker':
      sorted.sort((a, b) => a.speaker.localeCompare(b.speaker, 'de'));
      break;
  }

  return sorted;
}

// Sort speakers
export function sortSpeakers(
  speakers: ScoredSpeaker[],
  sortKey: SpeakerSortOption,
  hasQuery: boolean
): ScoredSpeaker[] {
  const sorted = [...speakers];

  switch (sortKey) {
    case 'relevance':
      if (hasQuery) {
        sorted.sort((a, b) => b.score - a.score);
      }
      break;
    case 'speeches-desc':
      sorted.sort((a, b) => b.speeches - a.speeches);
      break;
    case 'speeches-asc':
      sorted.sort((a, b) => a.speeches - b.speeches);
      break;
    case 'words-desc':
      sorted.sort((a, b) => b.words - a.words);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'de'));
      break;
  }

  return sorted;
}

// Escape special regex characters
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Find best snippet containing search terms
export function findBestSnippet(
  text: string,
  terms: string[],
  maxLength = 200
): string {
  if (terms.length === 0) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  const textLower = text.toLowerCase();

  // Find first occurrence of any term
  let bestIndex = -1;
  for (const term of terms) {
    const idx = textLower.indexOf(term.toLowerCase());
    if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
      bestIndex = idx;
    }
  }

  if (bestIndex === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Start 50 chars before match for context
  const start = Math.max(0, bestIndex - 50);
  const end = Math.min(text.length, start + maxLength);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

// Highlight terms in text (returns array of ReactNodes)
export function highlightTerms(
  text: string,
  query: ParsedQuery,
  maxLength = 200
): ReactNode[] {
  const allTerms = [...query.terms, ...query.phrases];

  if (allTerms.length === 0) {
    const truncated = text.slice(0, maxLength);
    return [truncated + (text.length > maxLength ? '...' : '')];
  }

  // Find best snippet
  const snippet = findBestSnippet(text, allTerms, maxLength);

  // Create regex for all terms
  const termPattern = allTerms.map(escapeRegex).join('|');
  const regex = new RegExp(`(${termPattern})`, 'gi');

  // Split by matches and create nodes
  const parts = snippet.split(regex);
  const nodes: ReactNode[] = [];

  parts.forEach((part, i) => {
    if (!part) return;

    const isHighlight = allTerms.some(
      (term) => part.toLowerCase() === term.toLowerCase()
    );

    if (isHighlight) {
      nodes.push(
        createElement(
          'mark',
          {
            key: i,
            className: 'bg-yellow-500/30 text-yellow-200 px-0.5 rounded',
          },
          part
        )
      );
    } else {
      nodes.push(createElement('span', { key: i }, part));
    }
  });

  return nodes;
}

// Check if query has any search content
export function hasSearchContent(query: ParsedQuery): boolean {
  return (
    query.terms.length > 0 ||
    query.phrases.length > 0 ||
    query.notTerms.length > 0 ||
    Object.keys(query.fieldFilters).length > 0
  );
}

// Calculate relevance score for a word
function calculateWordScore(word: WordFrequency, query: ParsedQuery): number {
  let score = 0;
  const wordLower = word.word.toLowerCase();

  // Score phrases (exact match)
  for (const phrase of query.phrases) {
    if (wordLower === phrase) score += 20;
    else if (wordLower.includes(phrase)) score += 10;
  }

  // Score terms
  for (const term of query.terms) {
    if (wordLower === term) {
      score += 15; // Exact match
    } else if (wordLower.startsWith(term)) {
      score += 10; // Prefix match
    } else if (wordLower.includes(term)) {
      score += 5; // Contains match
    }
  }

  // Boost by frequency (log scale to avoid huge scores)
  if (score > 0) {
    score += Math.log10(word.total + 1) * 2;
  }

  return score;
}

// Search words with scoring
export function searchWords(
  words: WordFrequency[],
  query: ParsedQuery,
  filters: SearchFilters
): ScoredWord[] {
  return words
    .map((word) => ({
      ...word,
      score: calculateWordScore(word, query),
    }))
    .filter((word) => {
      // Apply party filter - only show words used by this party
      if (filters.party) {
        if (!word.parties[filters.party] || word.parties[filters.party].count === 0) {
          return false;
        }
      }

      // Check NOT terms
      const wordLower = word.word.toLowerCase();
      for (const notTerm of query.notTerms) {
        if (wordLower.includes(notTerm)) return false;
      }

      // If no search query, include all (show top words by frequency)
      if (query.terms.length === 0 && query.phrases.length === 0) {
        return true;
      }

      return word.score > 0;
    });
}

// Sort words
export function sortWords(
  words: ScoredWord[],
  sortKey: WordSortOption,
  hasQuery: boolean
): ScoredWord[] {
  const sorted = [...words];

  switch (sortKey) {
    case 'relevance':
      if (hasQuery) {
        sorted.sort((a, b) => b.score - a.score);
      } else {
        // Default to total frequency when no query
        sorted.sort((a, b) => b.total - a.total);
      }
      break;
    case 'total':
      sorted.sort((a, b) => b.total - a.total);
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.word.localeCompare(b.word, 'de'));
      break;
  }

  return sorted;
}
