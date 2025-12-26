import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persist query cache to AsyncStorage
const CACHE_KEY = 'bundestag-wrapped-query-cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Optional: Persist cache to AsyncStorage
export async function persistQueryCache() {
  try {
    const cache = queryClient.getQueryCache().getAll();
    const serializable = cache
      .filter(query => query.state.data !== undefined)
      .map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      }));
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.warn('Failed to persist query cache:', error);
  }
}

export async function restoreQueryCache() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const entries = JSON.parse(cached);
      for (const entry of entries) {
        // Only restore if less than 24 hours old
        if (Date.now() - entry.dataUpdatedAt < 1000 * 60 * 60 * 24) {
          queryClient.setQueryData(entry.queryKey, entry.data);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to restore query cache:', error);
  }
}
