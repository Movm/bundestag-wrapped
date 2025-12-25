/**
 * Main Wrapped slide configuration
 *
 * Slide naming convention:
 * - quiz-*   : Interactive quiz questions
 * - info-*   : Educational context (between quiz and reveal)
 * - reveal-* : Reveals answer/stats after quiz
 * - chart-*  : Bar chart comparisons
 * - fun-*    : Fun/lighthearted content
 */

export const SLIDES = [
  'intro',

  // Topics (first section - what does the Bundestag talk about?)
  'intro-topics',
  'quiz-topics',
  'info-topics',
  'reveal-topics',

  // Vocabulary
  'intro-vocabulary',
  'quiz-signature',
  'info-signature',
  'reveal-signature',

  // Speech Volume + Top Speakers
  'intro-speeches',
  'quiz-speeches',
  'info-speeches',
  'chart-speeches',
  'reveal-speakers',

  // Drama
  'intro-drama',
  'quiz-drama',
  'info-drama',
  'reveal-drama',

  // Discriminatory Language
  'intro-discriminatory',
  'quiz-discriminatory',
  'info-discriminatory',
  'reveal-discriminatory',

  // Common Words
  'intro-common-words',
  'quiz-common-words',
  'reveal-common-words',

  // Moin
  'intro-moin',
  'quiz-moin',
  'info-moin',
  'reveal-moin',

  // Swiftie Easter Egg
  'intro-swiftie',
  'quiz-swiftie',
  'reveal-swiftie',

  // Zwischenfragen
  'quiz-zwischenfragen',

  // Tone Analysis
  'intro-tone',
  'quiz-tone',
  'info-tone',
  'reveal-tone',

  // Gender
  'quiz-gender',
  'info-gender',
  'reveal-gender',

  // Share
  'share',

  // Finale
  'finale',
] as const;

export type SlideType = (typeof SLIDES)[number];

export const TOTAL_QUIZ_QUESTIONS = 11;

// Slides that auto-scroll to next after a delay (section intros and info slides)
export const AUTO_SCROLL_SLIDES = new Set<SlideType>([
  'intro-topics',
  'info-topics',
  'intro-vocabulary',
  'intro-speeches',
  'intro-drama',
  'intro-discriminatory',
  'intro-common-words',
  'intro-moin',
  'intro-swiftie',
  'intro-tone',
  // Info slides also auto-scroll
  'info-signature',
  'info-speeches',
  'info-drama',
  'info-discriminatory',
  'info-moin',
  'info-tone',
  'info-gender',
]);

export const AUTO_SCROLL_DELAY = 4000; // 4 seconds

// Slides that have shareable sharepic images
export const SHAREABLE_SLIDES = new Set<SlideType>([
  'reveal-signature',       // Vocabulary
  'chart-speeches',         // Speeches
  'reveal-drama',           // Drama
  'reveal-discriminatory',  // Discriminatory Language
  'reveal-speakers',        // Top Speakers
  'reveal-common-words',    // Common Words
  'reveal-moin',            // Moin
  'reveal-swiftie',         // Swiftie
  'reveal-tone',            // Tone Analysis
  'reveal-gender',          // Gender
]);
