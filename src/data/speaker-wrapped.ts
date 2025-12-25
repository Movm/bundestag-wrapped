/**
 * Types and loaders for individual speaker Bundestag Wrapped data.
 */

export interface SpeakerSummary {
  slug: string;
  name: string;
  party: string;
  speeches: number;
  wortbeitraege: number;
  words: number;
}

export interface SpeakerIndex {
  speakers: SpeakerSummary[];
}

export interface SpeakerRankings {
  speechRank: number;
  wordsRank: number;
  partySpeechRank: number;
  partyWordsRank: number;
  partySize: number;
  totalSpeakers: number;
  percentile: number;
  // Verbosity rankings (avg words per speech, min 3 speeches required)
  verbosityRank: number | null;
  verbosityTotal: number | null;
  partyVerbosityRank: number | null;
  // Longest speech ranking
  longestSpeechRank: number;
}

export interface SpeakerDrama {
  interruptionsGiven: number;
  interruptionsReceived: number;
  interrupterRank: number | null;
  interruptedRank: number | null;
}

export interface SpeakerWord {
  word: string;
  count: number;
}

export interface SignatureWord {
  word: string;
  count: number;
  ratioParty: number; // How much more than party average (e.g., 3.2 = 3.2x party avg)
  ratioBundestag: number; // How much more than Bundestag average
}

export interface SignatureAdjective {
  word: string;
  count: number;
  ratioParty: number; // How much more than party average
  ratioBundestag: number; // How much more than Bundestag average
}

export interface SpeakerWords {
  topWords: SpeakerWord[];
  signatureWords: SignatureWord[];
  signatureAdjectives: SignatureAdjective[];
}

export interface SpeakerComparison {
  speakerAvgWords: number;
  partyAvgWords: number;
  parliamentAvgWords: number;
  vsParty: number;
  vsParliament: number;
}

export interface SpeakerFunFact {
  emoji: string;
  label: string;
  value: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface SignatureQuiz {
  question: string;
  options: QuizOption[];
  explanationParty: string; // "X× häufiger als SPD-Durchschnitt"
  explanationBundestag: string; // "Y× häufiger als Bundestag-Durchschnitt"
}

export interface AdjectiveQuiz {
  question: string;
  options: QuizOption[];
  explanationParty: string; // "X× häufiger als SPD-Durchschnitt"
  explanationBundestag: string; // "Y× häufiger als Bundestag-Durchschnitt"
}

export interface SpiritAnimalAlternative {
  id: string;
  emoji: string;
  name: string;
  title: string;
  reason: string;
  score: number;
}

export interface SpiritAnimal {
  id: string;
  emoji: string;
  name: string;
  title: string;
  reason: string;
  alternatives?: SpiritAnimalAlternative[];
}

export interface ToneScores {
  affirmative: number;
  aggression: number;
  labeling: number;
  solution_focus: number;
  collaboration: number;
  demand_intensity: number;
  acknowledgment: number;
  authority: number;
  future_orientation: number;
  emotional_intensity: number;
  inclusivity: number;
  discriminatory: number;
}

export interface ToneSampleSize {
  speeches: number;
  words: number;
  adjectives: number;
  verbs: number;
}

export interface ToneProfile {
  scores: ToneScores;
  confidence: 'sufficient' | 'low';
  sampleSize: ToneSampleSize;
}

export interface TopicWord {
  word: string;
  count: number;
}

export interface TopicScore {
  topic: string;
  score: number;
  rank: number;
}

export interface SpeakerTopics {
  scores: Record<string, number>;
  topTopics: TopicScore[];
  topicWords: Record<string, TopicWord[]>;
}

export interface SpeakerWrapped {
  name: string;
  party: string;
  slug: string;
  academicTitle: string | null;
  speeches: number;
  wortbeitraege: number;
  totalWords: number;
  avgWords: number;
  minWords: number;
  maxWords: number;
  rankings: SpeakerRankings;
  drama: SpeakerDrama;
  words: SpeakerWords;
  comparison: SpeakerComparison;
  funFacts: SpeakerFunFact[];
  signatureQuiz: SignatureQuiz | null;
  signatureAdjectiveQuiz: AdjectiveQuiz | null;
  spiritAnimal: SpiritAnimal | null;
  toneProfile: ToneProfile | null;
  topics: SpeakerTopics | null;
}

/**
 * Load the speaker index (list of all speakers with basic stats).
 * Note: Caching is handled by React Query.
 */
export async function loadSpeakerIndex(): Promise<SpeakerIndex> {
  const response = await fetch('/speakers/index.json');
  if (!response.ok) {
    throw new Error(`Failed to load speaker index: ${response.status}`);
  }
  return response.json();
}

/**
 * Load detailed wrapped data for a specific speaker.
 */
export async function loadSpeakerData(slug: string): Promise<SpeakerWrapped> {
  const response = await fetch(`/speakers/${slug}.json`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Speaker not found: ${slug}`);
    }
    throw new Error(`Failed to load speaker data: ${response.status}`);
  }

  return response.json();
}

/**
 * Search speakers by name.
 */
export function searchSpeakers(
  speakers: SpeakerSummary[],
  query: string
): SpeakerSummary[] {
  if (!query.trim()) return speakers;

  const lowerQuery = query.toLowerCase();
  return speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.party.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter speakers by party.
 */
export function filterByParty(
  speakers: SpeakerSummary[],
  party: string
): SpeakerSummary[] {
  if (!party) return speakers;
  return speakers.filter((s) => s.party === party);
}
