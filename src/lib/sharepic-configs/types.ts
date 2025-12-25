/**
 * Shared types for sharepic slide configurations.
 */

export interface SlideConfig {
  emoji: string;
  title: string;
  subtitle: string;
  filename: string;
}

export interface CardConfig {
  width: number;
  height: number;
  gap: number;
  radius: number;
}

export interface ChampionCardConfig extends CardConfig {
  championWidth: number;
  championHeight: number;
}

export const CHAMPION_COLORS = {
  bg: '#f59e0b',
  bgLight: '#fbbf24',
  border: '#fcd34d',
  text: '#78350f',
} as const;

export const SIZE = 1080;
