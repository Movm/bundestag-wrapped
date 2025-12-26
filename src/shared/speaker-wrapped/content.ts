/**
 * Speaker Wrapped Content Strings
 * German copy for speaker wrapped sections - shared between web and mobile.
 */

export const SPEAKER_CONTENT = {
  intro: {
    emoji: '🏛️',
    subtitle: 'Dein Bundestag Wrapped 2025',
    cta: "Los geht's",
  },

  words: {
    emoji: '💬',
    title: 'Deine Lieblingswörter',
    subtitle: 'Die häufigsten Begriffe in deinen Reden',
    signatureEmoji: '✨',
    signatureTitle: 'Deine Signature Words',
    signatureSubtitle: 'Wörter die du häufiger nutzt als andere',
  },

  topics: {
    subtitle: 'Deine Top-Themen',
    title: 'Worüber du am meisten sprichst',
    keywordsPrefix: 'Deine',
    keywordsSuffix: '-Wörter',
  },

  animal: {
    subtitle: 'Dein Bundestag-Tier ist...',
    rankLabels: ['1', '2', '3'],
  },

  quiz: {
    emoji: '🎯',
    title: 'Wort-Quiz',
    fallbackEmoji: '✨',
    fallbackTitle: 'Bereit für die Statistiken?',
    fallbackSubtitle: 'Lass uns sehen, wie du im Bundestag performt hast.',
    successEmoji: '🎉',
    successText: 'Richtig!',
    wrongEmoji: '😅',
    wrongText: 'Nicht ganz...',
  },

  end: {
    emoji: '🎉',
    title: "Das war's!",
    subtitle: 'Dein Bundestag Wrapped 2025',
    shareButton: 'Ergebnis teilen',
    restartButton: '🔄 Nochmal ansehen',
    otherSpeakersButton: 'Andere Abgeordnete ansehen',
    homeButton: 'Zum Haupt-Wrapped',
  },

  navigation: {
    continue: 'Weiter',
  },
} as const;

/**
 * Section order for speaker wrapped experience
 */
export const SPEAKER_SECTIONS = [
  'intro',
  'words',
  'topics',
  'animal',
  'quiz',
  'end',
] as const;

export type SpeakerSection = (typeof SPEAKER_SECTIONS)[number];
