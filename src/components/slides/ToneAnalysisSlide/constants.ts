import type { PartyProfile } from '@/data/wrapped';

export const CATEGORY_ANIMATIONS: Record<
  string,
  {
    emoji: { scale?: number[]; rotate?: number[]; y?: number[] };
    card: { y?: number[]; scale?: number[] };
    duration: number;
  }
> = {
  aggression: {
    emoji: { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] },
    card: { scale: [1, 1.02, 1] },
    duration: 0.8,
  },
  discriminatory: {
    emoji: { scale: [1, 1.1, 1], rotate: [0, 0, 0] },
    card: {},
    duration: 2,
  },
  labeling: {
    emoji: { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] },
    card: { y: [0, -2, 0] },
    duration: 2.5,
  },
  demand_intensity: {
    emoji: { scale: [1, 1.12, 1], y: [0, -3, 0] },
    card: { scale: [1, 1.01, 1] },
    duration: 1.5,
  },
  collaboration: {
    emoji: { y: [0, -6, 0], rotate: [0, 3, -3, 0] },
    card: { y: [0, -3, 0] },
    duration: 4,
  },
  solution_focus: {
    emoji: { y: [0, -4, 0], scale: [1, 1.05, 1] },
    card: { y: [0, -2, 0] },
    duration: 2.5,
  },
  affirmative: {
    emoji: { scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] },
    card: { y: [0, -4, 0] },
    duration: 3,
  },
};

export const DEFAULT_ANIMATION = {
  emoji: { scale: [1, 1.05, 1] },
  card: {},
  duration: 3,
};

export const PARTY_ORDER = [
  'DIE LINKE',
  'BSW',
  'SPD',
  'GRÜNE',
  'CDU/CSU',
  'AfD',
  'fraktionslos',
];

export function sortParties(
  profiles: Record<string, PartyProfile>
): PartyProfile[] {
  const entries = Object.values(profiles);
  return entries.sort((a, b) => {
    const indexA = PARTY_ORDER.indexOf(a.party);
    const indexB = PARTY_ORDER.indexOf(b.party);
    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;
    return orderA - orderB;
  });
}

export const TONE_CATEGORIES = [
  { key: 'aggression', emoji: '😤', label: 'Aggressiv' },
  { key: 'collaboration', emoji: '🤗', label: 'Kooperativ' },
  { key: 'labeling', emoji: '🧐', label: 'Etikettierend' },
  { key: 'solutionFocus', emoji: '🤓', label: 'Lösungsorientiert' },
  { key: 'demandIntensity', emoji: '😏', label: 'Fordernd' },
  { key: 'affirmative', emoji: '😊', label: 'Positiv' },
] as const;

export const LEGACY_BUBBLE_POSITIONS = [
  { top: '12%', left: '8%' },
  { top: '8%', left: '55%' },
  { top: '35%', left: '75%' },
  { top: '55%', left: '5%' },
  { top: '65%', left: '45%' },
  { top: '40%', left: '30%' },
];

export const LEGACY_FLOAT_ANIMATIONS = [
  { x: [0, 20, -15, 0], y: [0, -25, 15, 0], duration: 9 },
  { x: [0, -25, 20, 0], y: [0, 20, -20, 0], duration: 11 },
  { x: [0, 15, -20, 0], y: [0, -15, 25, 0], duration: 8 },
  { x: [0, -20, 25, 0], y: [0, 25, -15, 0], duration: 12 },
  { x: [0, 25, -15, 0], y: [0, -20, 20, 0], duration: 10 },
  { x: [0, -15, 20, 0], y: [0, 15, -25, 0], duration: 9.5 },
];
