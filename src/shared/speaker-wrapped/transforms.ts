/**
 * Speaker Wrapped Data Transforms
 * Platform-agnostic business logic for speaker wrapped features.
 */

import type {
  SpeakerWrapped,
  SpeakerWords,
  SignatureQuiz,
  SpiritAnimal,
  SpiritAnimalAlternative,
  SignatureWord,
  SpeakerWord,
} from '../../data/speaker-wrapped';

// ─────────────────────────────────────────────────────────────
// Quiz Config Types & Transforms
// ─────────────────────────────────────────────────────────────

export interface NormalizedQuizConfig {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string[];
}

/**
 * Normalize quiz config from SignatureQuiz to a consistent format
 */
export function buildQuizConfig(quiz: SignatureQuiz | null): NormalizedQuizConfig | null {
  if (!quiz) return null;

  const correctOption = quiz.options.find((o) => o.isCorrect);
  const explanationParty = quiz.explanationParty ?? '';
  const explanationBundestag = quiz.explanationBundestag ?? '';

  return {
    question: quiz.question,
    options: quiz.options.map((o) => o.text),
    correctAnswer: correctOption?.text ?? '',
    explanation: explanationBundestag
      ? [explanationParty, explanationBundestag]
      : [explanationParty],
  };
}

// ─────────────────────────────────────────────────────────────
// Words Processing
// ─────────────────────────────────────────────────────────────

export interface DisplayWords {
  topWords: SpeakerWord[];
  signatureWords: SignatureWord[];
}

/**
 * Get display-ready words from speaker data
 * @param words - SpeakerWords from speaker wrapped data
 * @param topLimit - Max number of top words to return (default: 6)
 */
export function getDisplayWords(words: SpeakerWords, topLimit = 6): DisplayWords {
  return {
    topWords: words.topWords.slice(0, topLimit),
    signatureWords: words.signatureWords || [],
  };
}

/**
 * Get ratio display value for a signature word
 * Handles different data formats
 */
export function getSignatureWordRatio(word: SignatureWord): number {
  return word.ratioBundestag ?? word.ratioParty ?? (word as any).ratio ?? 0;
}

// ─────────────────────────────────────────────────────────────
// Spirit Animal Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Get sorted alternatives for spirit animal podium
 * Returns [2nd place, 3rd place] or fewer if not available
 */
export function getAnimalAlternatives(
  animal: SpiritAnimal | null
): SpiritAnimalAlternative[] {
  if (!animal?.alternatives) return [];
  return animal.alternatives.slice(0, 2);
}

// ─────────────────────────────────────────────────────────────
// Topics Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Get top topics with limit
 */
export function getTopTopics(data: SpeakerWrapped, limit = 5) {
  if (!data.topics?.topTopics) return [];
  return data.topics.topTopics.slice(0, limit);
}

/**
 * Get topic words for a specific topic
 */
export function getTopicWords(data: SpeakerWrapped, topicId: string, limit = 6) {
  if (!data.topics?.topicWords) return [];
  return (data.topics.topicWords[topicId] || []).slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// Display Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Format speaker name with optional academic title
 */
export function formatSpeakerName(data: SpeakerWrapped): string {
  return data.academicTitle ? `${data.academicTitle} ${data.name}` : data.name;
}

/**
 * Check if speaker has enough data for a specific section
 */
export function hasSpiritAnimal(data: SpeakerWrapped): boolean {
  return !!data.spiritAnimal;
}

export function hasTopics(data: SpeakerWrapped): boolean {
  return !!data.topics && data.topics.topTopics.length > 0;
}

export function hasQuiz(data: SpeakerWrapped): boolean {
  return !!data.signatureQuiz;
}
