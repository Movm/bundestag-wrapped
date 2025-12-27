import { useQuery } from '@tanstack/react-query'
import { loadWrappedData, type WrappedData } from '../data/wrapped'
import { loadSpeakerIndex, loadSpeakerData, type SpeakerIndex, type SpeakerWrapped } from '../data/speaker-wrapped'
import { type Speech, type WordsIndex } from '../lib/search-utils'

export interface SpeechesData {
  speeches: Speech[]
}

// Static data never changes during a session - cache indefinitely
const STATIC_DATA_OPTIONS = {
  staleTime: Infinity,  // Data is never considered stale
  gcTime: Infinity,     // Keep in cache indefinitely (prevents GC)
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const

export function useWrappedData() {
  return useQuery<WrappedData, Error>({
    queryKey: ['wrapped'],
    queryFn: loadWrappedData,
    ...STATIC_DATA_OPTIONS,
  })
}

export function useSpeakerIndex() {
  return useQuery<SpeakerIndex, Error>({
    queryKey: ['speakerIndex'],
    queryFn: loadSpeakerIndex,
    ...STATIC_DATA_OPTIONS,
  })
}

export function useSpeakerData(slug: string) {
  return useQuery<SpeakerWrapped, Error>({
    queryKey: ['speaker', slug],
    queryFn: () => loadSpeakerData(slug),
    enabled: !!slug,
    ...STATIC_DATA_OPTIONS,
  })
}

export function useSpeechesDb() {
  return useQuery<SpeechesData, Error>({
    queryKey: ['speeches'],
    queryFn: () => fetch('/speeches_db.json').then(r => {
      if (!r.ok) throw new Error('Failed to load speeches')
      return r.json()
    }),
    ...STATIC_DATA_OPTIONS,
  })
}

export function useWordsIndex() {
  return useQuery<WordsIndex, Error>({
    queryKey: ['words-index'],
    queryFn: () => fetch('/words_index.json').then(r => {
      if (!r.ok) throw new Error('Failed to load words index')
      return r.json()
    }),
    ...STATIC_DATA_OPTIONS,
  })
}
