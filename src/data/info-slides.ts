/**
 * Info slide content - educational context shown between quiz and reveal
 */

export interface InfoSlideContent {
  emoji: string;
  title: string;
  body: string;
}

export const INFO_SLIDES: Record<string, InfoSlideContent> = {
  'info-topics': {
    emoji: '📊',
    title: 'Top-Themen der Fraktionen',
    body: 'Neben Finanzen (Platz 1) setzen die Parteien unterschiedliche Schwerpunkte: Die GRÜNEN fokussieren auf Klima, CDU/CSU auf Europa und Wirtschaft, SPD auf Soziales und Sicherheit, die AfD auf Justiz und Migration.',
  },
  'info-signature': {
    emoji: '📊',
    title: 'Was sind Signature Words?',
    body: 'Signature Words sind Wörter, die eine Partei im Vergleich zu anderen besonders häufig verwendet. Ein hoher Ratio zeigt, dass diese Partei das Wort viel öfter nutzt als der Durchschnitt.',
  },
  'info-speeches': {
    emoji: '🎤',
    title: 'Wer redet am meisten?',
    body: 'Friedrich Merz führt die Redezeit-Statistik an – als Kanzler beantwortet er viele Fragen in der Fragestunde. Die längste Einzelrede hielt jedoch Lars Klingbeil mit 5.977 Wörtern (knapp vor Merz). Die CDU/CSU hat die meisten Redner:innen, weil sie die größte Fraktion stellt.',
  },
  'info-drama': {
    emoji: '🎭',
    title: 'Zwischenrufe im Bundestag',
    body: 'Zwischenrufe sind spontane Reaktionen während Reden. Oppositionsparteien rufen häufiger dazwischen – die AfD als größte Oppositionsfraktion führt diese Statistik überdeutlich an.',
  },
  'info-moin': {
    emoji: '🌊',
    title: 'Der SSW im Bundestag',
    body: "Stefan Seidler vertritt den Südschleswigschen Wählerverband (SSW) – die Partei der dänischen und friesischen Minderheiten, die seit 2021 wieder im Bundestag sitzt. Für diese gilt die 5-Prozent-Hürde nicht.",
  },
  'info-tone': {
    emoji: '🎭',
    title: 'Tonfall-Profile',
    body: 'Jede Fraktion hat einen eigenen sprachlichen Stil. Wir messen sieben Dimensionen – von kooperativ bis fordernd, von lösungsorientiert bis konfrontativ – und fassen sie zu einem Persönlichkeitsprofil zusammen.',
  },
  'info-gender': {
    emoji: '👩‍💼',
    title: 'Redezeit nach Geschlecht',
    body: 'Der Frauenanteil bei Bundestagsreden variiert stark zwischen Fraktionen. Dies hängt von der Zusammensetzung der Fraktion, internen Strukturen und Themenschwerpunkten ab. Der Frauenanteil sank im Bundestag zuletzt, vor allem durch die AfD.',
  },
  'info-discriminatory': {
    emoji: '⚠️',
    title: 'Diskriminierende Sprache',
    body: 'Wir tracken vier Kategorien: fremdenfeindlich (z.B. "Überfremdung"), homophob (z.B. "Genderideologie"), islamophob (z.B. "Islamisierung") und Dog Whistles (z.B. "Remigration"). Der Score zeigt Begriffe pro 1.000 Wörter.',
  },
};
