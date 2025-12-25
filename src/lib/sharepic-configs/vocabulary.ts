import type { SlideConfig, CardConfig } from './types';

export const vocabularyConfig: SlideConfig = {
  emoji: '📚',
  title: 'Partei-Vokabular',
  subtitle: 'Diese Wörter zeichnen die Parteien aus',
  filename: 'bundestag-wrapped-vocabulary',
};

export const vocabularyBubbleConfig: CardConfig = {
  width: 180,
  height: 180,
  gap: 20,
  radius: 90, // Full circle
};
