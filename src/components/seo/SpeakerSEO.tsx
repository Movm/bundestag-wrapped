import { SEO } from './SEO';
import { SITE_CONFIG } from './constants';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';

interface SpeakerSEOProps {
  speaker: SpeakerWrapped;
}

export function SpeakerSEO({ speaker }: SpeakerSEOProps) {
  const title = `${speaker.name} (${speaker.party})`;

  const description = speaker.spiritAnimal
    ? `${speaker.name} ist ein ${speaker.spiritAnimal.emoji} ${speaker.spiritAnimal.name}: ` +
      `${speaker.speeches} Reden, ${speaker.totalWords.toLocaleString('de-DE')} Worter. ` +
      `Entdecke das personliche Bundestag Wrapped.`
    : `${speaker.name} (${speaker.party}): ${speaker.speeches} Reden im Bundestag. ` +
      `Entdecke die personlichen Statistiken der 21. Wahlperiode.`;

  // Use slug for potential share image path
  const ogImage = `/og-default.png`; // Could be `/speakers/${speaker.slug}-share.png` if available

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: speaker.name,
    jobTitle: 'Mitglied des Bundestages',
    affiliation: {
      '@type': 'Organization',
      name: speaker.party,
    },
    memberOf: {
      '@type': 'Organization',
      name: 'Deutscher Bundestag',
      url: 'https://www.bundestag.de',
    },
    url: `${SITE_CONFIG.siteUrl}/wrapped/${speaker.slug}`,
  };

  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={`/wrapped/${speaker.slug}`}
      ogImage={ogImage}
      ogType="profile"
      structuredData={personSchema}
    />
  );
}
