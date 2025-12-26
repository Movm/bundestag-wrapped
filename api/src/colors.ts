/**
 * Design tokens and party colors for OG image generation
 * Keep in sync with src/lib/design-tokens.ts and src/lib/party-colors.ts
 */

export const BRAND_COLORS = {
  primary: '#db2777',
  secondary: '#ec4899',
  light: '#f472b6',
  gradientStart: '#be185d',
  gradientMid: '#db2777',
  gradientEnd: '#f472b6',
} as const;

export const BG_COLORS = {
  primary: '#0a0a0f',
  secondary: '#12121a',
  card: '#1a1a24',
  elevated: '#242430',
} as const;

export const PARTY_COLORS: Record<string, string> = {
  SPD: '#E3000F',
  'CDU/CSU': '#000000',
  GRÜNE: '#1AA037',
  AfD: '#009EE0',
  'DIE LINKE': '#BE3075',
  BSW: '#FF6B35',
  fraktionslos: '#6B7280',
};

export function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || PARTY_COLORS.fraktionslos;
}

// German articles for spirit animals (der/die/das)
export const ANIMAL_ARTICLES: Record<string, string> = {
  // Masculine (der)
  'Elefant': 'der',
  'Adler': 'der',
  'Löwe': 'der',
  'Pfau': 'der',
  'Wolf': 'der',
  'Bär': 'der',
  'Papagei': 'der',
  'Kolibri': 'der',
  'Delfin': 'der',
  'Schwan': 'der',
  'Fuchs': 'der',
  'Igel': 'der',
  'Biber': 'der',
  'Hase': 'der',
  'Otter': 'der',
  'Tiger': 'der',
  // Feminine (die)
  'Eule': 'die',
  'Schildkröte': 'die',
  'Biene': 'die',
  'Krabbe': 'die',
  // Neuter (das)
  'Pferd': 'das',
  'Eichhörnchen': 'das',
};

export function getAnimalArticle(animalName: string): string {
  return ANIMAL_ARTICLES[animalName] || 'der';
}
