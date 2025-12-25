/**
 * Party Colors - Single Source of Truth
 *
 * Hex values defined here, CSS variables in index.css reference these same values.
 * Keep both in sync when changing colors.
 */

export const PARTY_COLORS: Record<string, string> = {
  SPD: '#E3000F',
  'CDU/CSU': '#000000',  // Black - traditional CDU color
  GRÜNE: '#1AA037',
  AfD: '#009EE0',
  'DIE LINKE': '#BE3075',
  BSW: '#FF6B35',
  fraktionslos: '#6B7280',
};

export const PARTY_BG_COLORS: Record<string, string> = {
  SPD: '#E3000F',
  'CDU/CSU': '#000000',  // Traditional black for backgrounds (white doesn't work)
  GRÜNE: '#1AA037',
  AfD: '#009EE0',
  'DIE LINKE': '#BE3075',
  BSW: '#FF6B35',
  fraktionslos: '#6B7280',
};

export const PARTY_GRADIENTS: Record<string, string> = {
  SPD: 'from-spd/80 to-spd',
  'CDU/CSU': 'from-gray-800 to-cdu',
  GRÜNE: 'from-gruene/80 to-gruene',
  AfD: 'from-afd/80 to-afd',
  'DIE LINKE': 'from-linke/80 to-linke',
  BSW: 'from-bsw/80 to-bsw',
  fraktionslos: 'from-fraktionslos/80 to-fraktionslos',
};

export const PARTY_BG_CLASSES: Record<string, string> = {
  SPD: 'bg-spd',
  'CDU/CSU': 'bg-cdu',
  GRÜNE: 'bg-gruene',
  AfD: 'bg-afd',
  'DIE LINKE': 'bg-linke',
  BSW: 'bg-bsw',
  fraktionslos: 'bg-fraktionslos',
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
