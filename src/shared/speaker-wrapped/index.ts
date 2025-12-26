/**
 * Speaker Wrapped Shared Exports
 * Platform-agnostic code for speaker wrapped features.
 */

// Transforms and business logic
export {
  buildQuizConfig,
  getDisplayWords,
  getSignatureWordRatio,
  getAnimalAlternatives,
  getTopTopics,
  getTopicWords,
  formatSpeakerName,
  hasSpiritAnimal,
  hasTopics,
  hasQuiz,
  type NormalizedQuizConfig,
  type DisplayWords,
} from './transforms';

// Content strings
export {
  SPEAKER_CONTENT,
  SPEAKER_SECTIONS,
  type SpeakerSection,
} from './content';
