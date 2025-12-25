import type { SlideConfig, CardConfig } from './types';

export const speechesConfig: SlideConfig = {
  emoji: '🎤',
  title: 'Die Reden',
  subtitle: 'Wer hat am meisten gesprochen?',
  filename: 'bundestag-wrapped-speeches',
};

export const speechesBubbleConfig: CardConfig = {
  width: 160,
  height: 160,
  gap: 16,
  radius: 80, // Full circle
};
