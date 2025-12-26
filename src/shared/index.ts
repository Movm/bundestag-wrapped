/**
 * Shared Layer - Cross-Platform Exports
 *
 * This module contains platform-agnostic code that can be used by both:
 * - Web (src/components/slides/)
 * - Mobile (mobile/slides/)
 */

// Animation configurations
export * from './animations/timings';

// Hooks
export { useQuizConfig, type QuizConfig, type QuizConfigOptions } from './hooks/useQuizConfig';

// Re-export existing shared data (already platform-agnostic)
export { QUIZZES } from '../data/quizzes';
export { INFO_SLIDES, type InfoSlideContent } from '../data/info-slides';

// Re-export party colors (already platform-agnostic)
export {
  PARTY_COLORS,
  PARTY_BG_COLORS,
  getPartyColor,
  getPartyBgColor,
  getPartyGradient,
} from '../lib/party-colors';

// Topic constants
export { TOPICS, TOPIC_BY_ID, type TopicMeta } from './constants/topics';

// Speaker wrapped utilities
export * from './speaker-wrapped';

// Sound system (types and hook factory)
export * from './sounds';
