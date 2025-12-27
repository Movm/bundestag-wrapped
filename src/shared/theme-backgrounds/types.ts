/**
 * Shared Theme Backgrounds Types and Constants
 *
 * Platform-agnostic background theme definitions.
 * Used by both web (React/Motion) and mobile (React Native/Reanimated).
 *
 * Each topic section gets a unique visual effect with its own color palette.
 */

export type BackgroundTheme =
  | 'intro'           // Welcome, celebration - contrails + sparkles
  | 'topics'          // Information, data-viz - radial pulse
  | 'vocabulary'      // Language, sound waves - wave lines
  | 'speeches'        // Energy, voice - rising bars
  | 'drama'           // Intensity, interruptions - lightning flashes
  | 'discriminatory'  // Serious, somber - muted gradient
  | 'common-words'    // Familiar, grounded - floating orbs
  | 'moin'            // Regional, friendly - horizontal stripes
  | 'swiftie'         // Pop culture, playful - sparkle burst
  | 'tone'            // Emotional, flowing - flowing ribbons
  | 'gender'          // Balanced, structured - geometric grid
  | 'finale';         // Warmth, celebration - celebration rays

export type EffectType =
  | 'contrails'   // Diagonal streaks (intro)
  | 'pulse'       // Concentric circles (topics)
  | 'waves'       // Horizontal flowing lines (vocabulary)
  | 'bars'        // Vertical rising bars (speeches)
  | 'lightning'   // Sharp diagonal flashes (drama)
  | 'gradient'    // Static subtle gradient (discriminatory)
  | 'orbs'        // Floating gradient circles (common-words)
  | 'stripes'     // Horizontal bands (moin)
  | 'sparkles'    // Dense particle bursts (swiftie)
  | 'ribbons'     // Curved undulating paths (tone)
  | 'grid'        // Geometric pattern (gender)
  | 'rays';       // Radiating lines (finale)

export interface ThemeColors {
  /** Main color in RGB format: "239, 68, 68" */
  primary: string;
  /** Supporting color in RGB format */
  secondary: string;
  /** Highlight/white core in RGB format */
  accent: string;
  /** Outer glow color in RGB format */
  glow: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  effectType: EffectType;
  /** Intensity multiplier: 0.5 (subtle) to 2.0 (vibrant) */
  intensity: number;
}

/**
 * Background theme configurations for all sections.
 * Colors are in RGB format for easy use with rgba().
 */
export const THEME_BACKGROUNDS: Record<BackgroundTheme, ThemeConfig> = {
  // Welcome, celebration - pink/purple contrails
  intro: {
    colors: {
      primary: '236, 72, 153',    // pink-500
      secondary: '168, 85, 247',  // purple-500
      accent: '255, 255, 255',    // white
      glow: '244, 114, 182',      // pink-400
    },
    effectType: 'contrails',
    intensity: 1.5,
  },

  // Information, data-viz - blue/cyan radial pulse
  topics: {
    colors: {
      primary: '59, 130, 246',    // blue-500
      secondary: '6, 182, 212',   // cyan-500
      accent: '255, 255, 255',
      glow: '96, 165, 250',       // blue-400
    },
    effectType: 'pulse',
    intensity: 1.0,
  },

  // Language, sound waves - violet/indigo wave lines
  vocabulary: {
    colors: {
      primary: '139, 92, 246',    // violet-500
      secondary: '99, 102, 241',  // indigo-500
      accent: '255, 255, 255',
      glow: '167, 139, 250',      // violet-400
    },
    effectType: 'waves',
    intensity: 1.0,
  },

  // Energy, voice - orange/yellow rising bars
  speeches: {
    colors: {
      primary: '249, 115, 22',    // orange-500
      secondary: '234, 179, 8',   // yellow-500
      accent: '255, 255, 255',
      glow: '251, 146, 60',       // orange-400
    },
    effectType: 'bars',
    intensity: 1.2,
  },

  // Intensity, interruptions - red/crimson lightning
  drama: {
    colors: {
      primary: '239, 68, 68',     // red-500
      secondary: '220, 38, 38',   // red-600
      accent: '255, 255, 255',
      glow: '248, 113, 113',      // red-400
    },
    effectType: 'lightning',
    intensity: 1.5,
  },

  // Serious, somber - slate/gray muted gradient
  discriminatory: {
    colors: {
      primary: '100, 116, 139',   // slate-500
      secondary: '71, 85, 105',   // slate-600
      accent: '255, 255, 255',
      glow: '148, 163, 184',      // slate-400
    },
    effectType: 'gradient',
    intensity: 0.5,
  },

  // Familiar, grounded - teal/aqua floating orbs
  'common-words': {
    colors: {
      primary: '20, 184, 166',    // teal-500
      secondary: '13, 148, 136',  // teal-600
      accent: '255, 255, 255',
      glow: '94, 234, 212',       // teal-300
    },
    effectType: 'orbs',
    intensity: 0.8,
  },

  // Regional, friendly - green/lime wave lines (like northern sea waves)
  moin: {
    colors: {
      primary: '34, 197, 94',     // green-500
      secondary: '22, 163, 74',   // green-600
      accent: '255, 255, 255',
      glow: '74, 222, 128',       // green-400
    },
    effectType: 'waves',
    intensity: 0.8,
  },

  // Pop culture, playful - hot pink sparkle burst
  swiftie: {
    colors: {
      primary: '236, 72, 153',    // pink-500
      secondary: '244, 114, 182', // pink-400
      accent: '255, 255, 255',
      glow: '249, 168, 212',      // pink-300
    },
    effectType: 'sparkles',
    intensity: 1.5,
  },

  // Emotional, flowing - purple/violet ribbons
  tone: {
    colors: {
      primary: '168, 85, 247',    // purple-500
      secondary: '124, 58, 237',  // violet-600
      accent: '255, 255, 255',
      glow: '192, 132, 252',      // purple-400
    },
    effectType: 'ribbons',
    intensity: 1.0,
  },

  // Balanced, structured - sky/cyan geometric grid
  gender: {
    colors: {
      primary: '14, 165, 233',    // sky-500
      secondary: '6, 182, 212',   // cyan-500
      accent: '255, 255, 255',
      glow: '56, 189, 248',       // sky-400
    },
    effectType: 'grid',
    intensity: 0.8,
  },

  // Warmth, celebration - amber/gold rays
  finale: {
    colors: {
      primary: '251, 191, 36',    // amber-400
      secondary: '245, 158, 11',  // amber-500
      accent: '255, 255, 255',
      glow: '252, 211, 77',       // amber-300
    },
    effectType: 'rays',
    intensity: 1.5,
  },
};

/**
 * Section to background theme mapping.
 * Mirrors the SECTION_THEMES pattern from theme-music.
 */
export const SECTION_BACKGROUNDS: Record<string, BackgroundTheme> = {
  // Main intro
  intro: 'intro',

  // Topics section
  topics: 'topics',

  // Vocabulary & Signature section
  vocabulary: 'vocabulary',
  signature: 'vocabulary',

  // Speeches & Speakers section
  speeches: 'speeches',
  speakers: 'speeches',

  // Drama section
  drama: 'drama',

  // Discriminatory section
  discriminatory: 'discriminatory',

  // Common words section
  'common-words': 'common-words',

  // Moin section
  moin: 'moin',

  // Swiftie easter egg
  swiftie: 'swiftie',

  // Tone analysis
  tone: 'tone',

  // Gender analysis
  gender: 'gender',

  // Share uses speeches theme (energetic)
  share: 'speeches',

  // Finale
  finale: 'finale',
};

// Transition settings
export const BACKGROUND_CROSSFADE_DURATION = 800; // ms

/**
 * Get the background theme for a given slide ID.
 * Mirrors getThemeForSlide() from theme-music.
 */
export function getBackgroundTheme(slideId: string): BackgroundTheme {
  // Handle main intro slide
  if (slideId === 'intro') {
    return 'intro';
  }

  // Extract section from slide ID (e.g., 'quiz-topics' → 'topics')
  const section = slideId.replace(/^(intro|quiz|info|reveal|chart)-/, '');
  return SECTION_BACKGROUNDS[section] || 'intro';
}

/**
 * Get the theme config for a slide ID.
 */
export function getThemeConfig(slideId: string): ThemeConfig {
  const theme = getBackgroundTheme(slideId);
  return THEME_BACKGROUNDS[theme];
}
