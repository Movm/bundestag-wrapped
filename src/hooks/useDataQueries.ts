import { useQuery } from '@tanstack/react-query'
import { loadWrappedData, type WrappedData } from '../data/wrapped'
import { loadSpeakerIndex, loadSpeakerData, type SpeakerIndex, type SpeakerWrapped } from '../data/speaker-wrapped'
import { type Speech, type WordsIndex } from '../lib/search-utils'

export interface SpeechesData {
  speeches: Speech[]
}

export function useWrappedData() {
  return useQuery<WrappedData, Error>({
    queryKey: ['wrapped'],
    queryFn: loadWrappedData,
  })
}

export function useSpeakerIndex() {
  return useQuery<SpeakerIndex, Error>({
    queryKey: ['speakerIndex'],
    queryFn: loadSpeakerIndex,
  })
}

export function useSpeakerData(slug: string) {
  return useQuery<SpeakerWrapped, Error>({
    queryKey: ['speaker', slug],
    queryFn: () => loadSpeakerData(slug),
    enabled: !!slug,
  })
}

export function useSpeechesDb() {
  return useQuery<SpeechesData, Error>({
    queryKey: ['speeches'],
    queryFn: () => fetch('/speeches_db.json').then(r => {
      if (!r.ok) throw new Error('Failed to load speeches')
      return r.json()
    }),
  })
}

export function useWordsIndex() {
  return useQuery<WordsIndex, Error>({
    queryKey: ['words-index'],
    queryFn: () => fetch('/words_index.json').then(r => {
      if (!r.ok) throw new Error('Failed to load words index')
      return r.json()
    }),
  })
}
