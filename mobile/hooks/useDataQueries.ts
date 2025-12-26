import { useQuery } from '@tanstack/react-query';
import type { WrappedData, SpeakerIndex, SpeakerWrapped } from '../types/wrapped';

// Import bundled data
import wrappedData from '../assets/data/wrapped.json';

// Base URL for fetching speaker data (fallback to web server)
const API_BASE = 'https://bundestag-wrapped.de';

/**
 * Load main wrapped data - bundled in app for offline support
 */
export function useWrappedData() {
  return useQuery<WrappedData, Error>({
    queryKey: ['wrapped'],
    queryFn: async () => {
      // Data is bundled in the app
      return wrappedData as WrappedData;
    },
    staleTime: Infinity, // Bundled data never goes stale
  });
}

/**
 * Load speaker index - bundled or fetched
 */
export function useSpeakerIndex() {
  return useQuery<SpeakerIndex, Error>({
    queryKey: ['speakerIndex'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/speakers/index.json`);
      if (!response.ok) {
        throw new Error('Failed to load speaker index');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Load individual speaker data
 */
export function useSpeakerData(slug: string) {
  return useQuery<SpeakerWrapped, Error>({
    queryKey: ['speaker', slug],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/speakers/${slug}.json`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Speaker not found: ${slug}`);
        }
        throw new Error('Failed to load speaker data');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
