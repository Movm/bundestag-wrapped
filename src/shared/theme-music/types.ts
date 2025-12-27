/**
 * Shared Theme Music Types and Constants
 *
 * Platform-agnostic theme music definitions.
 * Used by both web (browser Audio) and mobile (expo-av).
 *
 * Track Credits (alphabetical):
 * - Broke For Free: Night Owl, Living In Reverse
 * - Chromix: I Know You're Out There
 * - HoliznaCC0: Mutant Club
 * - IKILLYA: Godsize
 * - jonas the plugexpert: APC Reflections
 * - Kevin MacLeod: Hyperfun, Hustle, Dirt Rhodes
 * - Kidkanevil & DZA: Nuff Stickers
 * - Lopkerjo: Love Others ICE
 * - Podington Bear: Starling
 * - sarah rasines: Canción Popular
 *
 * All tracks from Free Music Archive, licensed CC BY-NC-ND 4.0
 */

export type ThemeType =
  | 'night'       // Broke For Free - Night Owl (chill, atmospheric)
  | 'mutant'      // HoliznaCC0 - Mutant Club (electronic club)
  | 'starling'    // Podington Bear - Starling (light, airy)
  | 'industrial'  // IKILLYA - Godsize (heavy, dramatic)
  | 'spacey'      // Chromix - I Know You're Out There (electronic, serious)
  | 'playful'     // Kidkanevil & DZA - Nuff Stickers (funky, fun)
  | 'chiptune'    // Kevin MacLeod - Hyperfun (chiptune, fun)
  | 'loveice'     // Lopkerjo - Love Others ICE (mellow, reflective)
  | 'popular'     // sarah rasines - canción popular (regional folk)
  | 'reverse'     // Broke For Free - Living In Reverse (chill, reflective)
  | 'reflections' // jonas the plugexpert - APC Reflections (soft hiphop)
  | 'hustle'      // Kevin MacLeod - Hustle (energetic)
  | 'rhodes';     // Kevin MacLeod - Dirt Rhodes (mellow, smooth)

export const THEME_PATHS: Record<ThemeType, string> = {
  night: '/sounds/Broke%20For%20Free%20-%20Night%20Owl.mp3',
  mutant: '/sounds/HoliznaCC0%20-%20Mutant%20Club.mp3',
  starling: '/sounds/Podington%20Bear%20-%20Starling.mp3',
  industrial: '/sounds/IKILLYA%20-%20Godsize.mp3',
  spacey: '/sounds/Chromix%20-%20I%20Know%20You%27re%20Out%20There.mp3',
  playful: '/sounds/Kidkanevil%20%26%20DZA%20-%20Nuff%20Stickers.mp3',
  chiptune: '/sounds/Kevin%20MacLeod%20-%20Hyperfun.mp3',
  loveice: '/sounds/Lopkerjo%20-%20Love%20Others%20ICE.mp3',
  popular: '/sounds/sarah%20rasines%20-%20canci%C3%B3n%20popular.mp3',
  reverse: '/sounds/Broke%20For%20Free%20-%20Living%20In%20Reverse.mp3',
  reflections: '/sounds/jonas%20the%20plugexpert%20-%20APC%20-%20reflections%20-%20gobot%20rmx.mp3',
  hustle: '/sounds/Kevin%20MacLeod%20-%20Hustle.mp3',
  rhodes: '/sounds/Kevin%20MacLeod%20-%20Dirt%20Rhodes.mp3',
};

export const THEME_TRACK_INFO: Record<ThemeType, { title: string; artist: string }> = {
  night: { title: 'Night Owl', artist: 'Broke For Free' },
  mutant: { title: 'Mutant Club', artist: 'HoliznaCC0' },
  starling: { title: 'Starling', artist: 'Podington Bear' },
  industrial: { title: 'Godsize', artist: 'IKILLYA' },
  spacey: { title: 'I Know You\'re Out There', artist: 'Chromix' },
  playful: { title: 'Nuff Stickers', artist: 'Kidkanevil & DZA' },
  chiptune: { title: 'Hyperfun', artist: 'Kevin MacLeod' },
  loveice: { title: 'Love Others ICE', artist: 'Lopkerjo' },
  popular: { title: 'Canción Popular', artist: 'Sarah Rasines' },
  reverse: { title: 'Living In Reverse', artist: 'Broke For Free' },
  reflections: { title: 'APC Reflections', artist: 'jonas the plugexpert' },
  hustle: { title: 'Hustle', artist: 'Kevin MacLeod' },
  rhodes: { title: 'Dirt Rhodes', artist: 'Kevin MacLeod' },
};

export const SECTION_THEMES: Record<string, ThemeType> = {
  // Main intro - chill atmospheric start
  intro: 'night',

  // Topics section - electronic club
  topics: 'mutant',

  // Vocabulary & Signature section - soft hiphop
  vocabulary: 'reflections',
  signature: 'reflections',

  // Speeches & Speakers section - energetic
  speeches: 'hustle',
  speakers: 'hustle',

  // Drama section - heavy dramatic
  drama: 'industrial',

  // Discriminatory section - serious spacey
  discriminatory: 'spacey',

  // Common words section - mellow smooth
  'common-words': 'rhodes',

  // Moin section - regional folk charm
  moin: 'popular',

  // Swiftie easter egg - chiptune fun
  swiftie: 'chiptune',

  // Tone analysis - mellow reflective
  tone: 'loveice',

  // Gender analysis - funky
  gender: 'playful',

  // Share - energetic
  share: 'hustle',

  // Finale - light airy ending
  finale: 'starling',
};

// Volume settings
export const THEME_VOLUME = 0.35;
export const CROSSFADE_DURATION = 1000; // 1 second

/**
 * Get the theme type for a given slide ID
 */
export function getThemeForSlide(slideId: string): ThemeType {
  // Handle main intro slide
  if (slideId === 'intro') {
    return 'night';
  }

  // Extract section from slide ID (e.g., 'quiz-topics' → 'topics')
  const section = slideId.replace(/^(intro|quiz|info|reveal|chart)-/, '');
  return SECTION_THEMES[section] || 'night';
}
