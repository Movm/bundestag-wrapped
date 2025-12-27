/**
 * 6-Säulen Background System Configuration
 *
 * Inspired by the 6 Corinthian columns of the Reichstag portico.
 * Creates a subtle, cohesive visual identity across all slides.
 */

export type Intensity = 'subtle' | 'medium' | 'vibrant';

export interface PillarConfig {
  x: string;       // CSS left position
  y: string;       // CSS top position
  width: number;   // Width in pixels
  height: string;  // Height (vh units for varied lengths)
  opacity: number; // Base opacity (0-1)
  delay: number;   // Animation delay in seconds
  duration: number; // Animation duration (seconds)
}

/**
 * Sound design inspired bars - 6 thin diagonal elements
 * Clustered on the right side, varied heights (15-25vh)
 * Logo goes on the left to balance the composition
 */
export const PILLAR_CONFIG: PillarConfig[] = [
  // Right side cluster - varied heights for audio visualizer effect
  { x: '50%',  y: '10%',  width: 4, height: '18vh', opacity: 0.12, delay: 0,   duration: 18 },
  { x: '58%',  y: '35%',  width: 3, height: '15vh', opacity: 0.08, delay: 0.4, duration: 22 },
  { x: '68%',  y: '5%',   width: 5, height: '22vh', opacity: 0.15, delay: 0.8, duration: 15 },
  { x: '76%',  y: '30%',  width: 4, height: '20vh', opacity: 0.12, delay: 1.2, duration: 20 },
  { x: '85%',  y: '8%',   width: 3, height: '16vh', opacity: 0.10, delay: 1.6, duration: 24 },
  { x: '92%',  y: '25%',  width: 5, height: '25vh', opacity: 0.14, delay: 2.0, duration: 17 },
];

/**
 * Intensity multipliers for different slide contexts
 */
export const INTENSITY_MULTIPLIERS: Record<Intensity, number> = {
  subtle: 0.5,
  medium: 1.0,
  vibrant: 1.5,
};

/**
 * Map slide names to their appropriate intensity level
 *
 * Naming convention:
 * - quiz-*   : Interactive quiz questions (medium)
 * - reveal-* : Reveals answer/stats after quiz (subtle - text heavy)
 * - chart-*  : Bar chart comparisons (medium)
 * - fun-*    : Fun/lighthearted content (medium)
 */
export const SLIDE_INTENSITY: Record<string, Intensity> = {
  // Vibrant: Celebration/intro moments
  intro: 'vibrant',
  finale: 'vibrant',

  // Subtle: Text-heavy reveal slides
  'reveal-signature': 'subtle',
  'reveal-topics': 'subtle',
  'reveal-drama': 'subtle',
  'reveal-speakers': 'subtle',
  'reveal-hot-topics': 'subtle',
  'reveal-tone': 'subtle',
  transparency: 'subtle',

  // Medium: Quizzes
  'quiz-signature': 'medium',
  'quiz-party-topic': 'medium',
  'quiz-speeches': 'medium',
  'quiz-interrupter': 'medium',
  'quiz-heckler': 'medium',
  'quiz-words-total': 'medium',
  'quiz-hot-topic': 'medium',
  'quiz-moin-person': 'medium',
  'quiz-aggressive': 'medium',
  'quiz-labeling': 'medium',
  'quiz-collaborative': 'medium',
  'quiz-solution': 'medium',
  'quiz-demanding': 'medium',

  // Medium: Charts
  'chart-speeches': 'medium',
};

/**
 * Get intensity for a slide, defaulting to 'medium' for unknown slides
 */
export function getSlideIntensity(slideName: string): Intensity {
  return SLIDE_INTENSITY[slideName] ?? 'medium';
}
