import type { SlideConfig } from './types';

export const commonWordsConfig: SlideConfig = {
  emoji: '📊',
  title: 'Häufigste Wörter',
  subtitle: 'Die meistgenutzten Wörter im Bundestag',
  filename: 'bundestag-wrapped-common-words',
};

export const wordCloudColors = [
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#84cc16', // lime-500
];

export const wordSizes = [
  { fontSize: 48, weight: 900 }, // index 0-1
  { fontSize: 40, weight: 800 }, // index 2-3
  { fontSize: 32, weight: 700 }, // index 4-5
  { fontSize: 26, weight: 600 }, // index 6-9
  { fontSize: 22, weight: 500 }, // index 10+
];
