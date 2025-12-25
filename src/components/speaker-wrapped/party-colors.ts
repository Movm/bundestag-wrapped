/**
 * Party Colors - Speaker Wrapped Feature Override
 *
 * Local override for speaker-wrapped components.
 * CDU is explicitly set to black here for this feature.
 */

import {
  PARTY_COLORS as GLOBAL_PARTY_COLORS,
  PARTY_BG_COLORS as GLOBAL_PARTY_BG_COLORS,
  PARTY_BG_CLASSES as GLOBAL_PARTY_BG_CLASSES,
  PARTY_GRADIENTS as GLOBAL_PARTY_GRADIENTS,
} from '@/lib/party-colors';

// Override CDU to black for speaker-wrapped
export const PARTY_COLORS: Record<string, string> = {
  ...GLOBAL_PARTY_COLORS,
  'CDU/CSU': '#000000',
};

export const PARTY_BG_COLORS: Record<string, string> = {
  ...GLOBAL_PARTY_BG_COLORS,
  'CDU/CSU': '#000000',
};

export const PARTY_BG_CLASSES: Record<string, string> = {
  ...GLOBAL_PARTY_BG_CLASSES,
  'CDU/CSU': 'bg-black',
};

export const PARTY_GRADIENTS: Record<string, string> = {
  ...GLOBAL_PARTY_GRADIENTS,
  'CDU/CSU': 'from-gray-800 to-black',
};

export function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || PARTY_COLORS.fraktionslos;
}

export function getPartyBgColor(party: string): string {
  return PARTY_BG_COLORS[party] || PARTY_BG_COLORS.fraktionslos;
}

export function getPartyGradient(party: string): string {
  return PARTY_GRADIENTS[party] || PARTY_GRADIENTS.fraktionslos;
}

export function getPartyBgClass(party: string): string {
  return PARTY_BG_CLASSES[party] || PARTY_BG_CLASSES.fraktionslos;
}
