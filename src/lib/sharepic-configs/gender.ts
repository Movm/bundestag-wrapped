import type { SlideConfig, CardConfig } from './types';

export const genderConfig: SlideConfig = {
  emoji: '👩‍💼',
  title: 'Frauenanteil bei Reden',
  subtitle: 'Anteil weiblicher Rednerinnen pro Fraktion',
  filename: 'bundestag-wrapped-gender',
};

export const genderBarConfig: CardConfig = {
  width: 700,
  height: 44,
  gap: 16,
  radius: 22, // height / 2 for full rounding
};
