import type { SlideConfig, ChampionCardConfig } from './types';

export const topSpeakersConfig: SlideConfig = {
  emoji: '🏆',
  title: 'Top Speakers',
  subtitle: 'Die Rekordhalter des Bundestags',
  filename: 'bundestag-wrapped-top-speakers',
};

export const topSpeakersCardConfig: ChampionCardConfig = {
  width: 230,
  height: 240,
  gap: 24,
  radius: 24,
  championWidth: 280,
  championHeight: 280,
};

export const medalCategories = [
  { emoji: '🎤', title: 'Meiste Reden', key: 'speeches' as const },
  { emoji: '📝', title: 'Meiste Wörter', key: 'words' as const },
  { emoji: '📊', title: 'Längste Reden', key: 'avgWords' as const },
];
