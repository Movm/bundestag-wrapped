export interface SectionConfig {
  id: string;
  number: string;
  emoji: string;
  title: string;
  subtitle: string;
  explanation: string;
  accent: string;
  gradient: string;
  icon: string;
}

export const SECTION_CONFIG: Record<string, SectionConfig> = {
  overview: {
    id: 'overview',
    number: '01',
    emoji: '📊',
    title: 'Bundestag Statistiken',
    subtitle: 'Die 21. Wahlperiode in Zahlen',
    explanation: 'Diese Statistiken basieren auf allen Plenarprotokollen der aktuellen Wahlperiode. Jede Rede wird automatisch analysiert und nach Partei, Redner:in und Thema kategorisiert.',
    accent: '#db2777',
    gradient: 'from-pink-600/10 via-transparent to-transparent',
    icon: 'BarChart3',
  },
  parties: {
    id: 'parties',
    number: '02',
    emoji: '🏛️',
    title: 'Parteien im Vergleich',
    subtitle: 'Wie unterscheiden sich die Fraktionen?',
    explanation: 'Die Signature-Wörter zeigen, welche Begriffe eine Partei überdurchschnittlich oft verwendet - ein linguistischer Fingerabdruck ihrer politischen Sprache.',
    accent: '#8b5cf6',
    gradient: 'from-violet-600/10 via-transparent to-transparent',
    icon: 'Building2',
  },
  speakers: {
    id: 'speakers',
    number: '03',
    emoji: '🎤',
    title: 'Redner:innen-Rankings',
    subtitle: 'Wer prägt die Debatten?',
    explanation: 'Diese Rankings zeigen die aktivsten Abgeordneten nach Anzahl der Reden, Gesamtwortbeitrag und durchschnittlicher Redezeit.',
    accent: '#f59e0b',
    gradient: 'from-amber-600/10 via-transparent to-transparent',
    icon: 'Mic2',
  },
  tone: {
    id: 'tone',
    number: '04',
    emoji: '💬',
    title: 'Tonalitäts-Analyse',
    subtitle: 'Die Sprache der Politik',
    explanation: 'Sprache verrät politische Haltung. Diese Analyse misst, wie kooperativ, fordernd oder aggressiv die Parteien kommunizieren - basierend auf linguistischen Mustern.',
    accent: '#06b6d4',
    gradient: 'from-cyan-600/10 via-transparent to-transparent',
    icon: 'MessageSquare',
  },
  drama: {
    id: 'drama',
    number: '05',
    emoji: '🎭',
    title: 'Drama im Bundestag',
    subtitle: 'Zwischenrufe, Beifall und Unterbrechungen',
    explanation: 'Zwischenrufe sind das Salz der Parlamentsdebatte. Sie zeigen Zustimmung, Kritik oder Protest - und verraten, welche Themen die Gemüter erhitzen.',
    accent: '#ef4444',
    gradient: 'from-red-600/10 via-transparent to-transparent',
    icon: 'Drama',
  },
  gender: {
    id: 'gender',
    number: '06',
    emoji: '👥',
    title: 'Geschlechter-Analyse',
    subtitle: 'Repräsentation im Parlament',
    explanation: 'Die Geschlechterverteilung im Bundestag - nicht nur Zahlen, sondern auch Unterschiede in Redezeit und Unterbrechungsmustern.',
    accent: '#ec4899',
    gradient: 'from-fuchsia-600/10 via-transparent to-transparent',
    icon: 'Users',
  },
  topics: {
    id: 'topics',
    number: '07',
    emoji: '🔤',
    title: 'Häufigste Wörter',
    subtitle: 'Die Themen dieser Wahlperiode',
    explanation: 'Welche Themen bewegen den Bundestag? Die häufigsten Wörter zeigen die zentralen Debatten der 21. Wahlperiode.',
    accent: '#10b981',
    gradient: 'from-emerald-600/10 via-transparent to-transparent',
    icon: 'Type',
  },
};

export const SECTION_ORDER = ['overview', 'parties', 'speakers', 'tone', 'drama', 'gender', 'topics'] as const;

export type SectionId = typeof SECTION_ORDER[number];
