/**
 * LocalStorage persistence for Wrapped page progress.
 * Persists quiz answers and current section with 7-day TTL.
 */

const STORAGE_KEY = 'bundestag-wrapped-progress';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface WrappedProgress {
  quizAnswers: Record<string, boolean>;
  currentSection: string;
  savedAt: number;
}

/**
 * Get saved progress from localStorage, returning null if expired or invalid.
 */
export function getWrappedProgress(): WrappedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as WrappedProgress;

    // Check expiration
    if (Date.now() - data.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    // Invalid JSON or other error - clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Save progress to localStorage with current timestamp.
 */
export function setWrappedProgress(
  progress: Omit<WrappedProgress, 'savedAt'>
): void {
  try {
    const data: WrappedProgress = {
      ...progress,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or disabled - fail silently
  }
}

/**
 * Clear saved progress (e.g., when user completes the experience).
 */
export function clearWrappedProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}
