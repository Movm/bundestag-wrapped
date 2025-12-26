/**
 * Bundestag Wrapped data types
 * Ported from web app src/data/wrapped.ts and src/data/speaker-wrapped.ts
 */

// ============ Main Wrapped Types ============

export interface PartyStats {
  party: string;
  speeches: number;
  wortbeitraege: number;
  totalWords: number;
  uniqueSpeakers: number;
  topWords: Array<{ word: string; count: number }>;
  signatureWords: Array<{ word: string; ratio: number }>;
  keyTopics: Array<{ word: string; count: number; ratio: number }>;
  avgSpeechLength: number;
  descriptiveness: number;
  topSpeaker: { name: string; speeches: number };
}

export interface ZwischenrufStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number;
  classification: {
    positive: string;
    negative: string;
    neutral: string;
  };
}

export interface DramaStats {
  topZwischenrufer: Array<{ name: string; party: string; count: number }>;
  mostInterrupted: Array<{ name: string; party: string; count: number }>;
  applauseChampions: Array<{ party: string; count: number }>;
  loudestHecklers: Array<{ party: string; count: number }>;
  zwischenrufStats: ZwischenrufStats;
}

export interface TopSpeaker {
  name: string;
  party: string;
  speeches: number;
}

export interface QuizQuestion {
  id: string;
  type: 'guess-party' | 'prediction' | 'emoji-quiz';
  question: string;
  word?: string;
  party?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  ratio?: number;
}

export interface FunFact {
  emoji: string;
  value: string;
  label: string;
  sublabel?: string;
  category: 'general' | 'tone' | 'gender';
}

export interface GenderDistribution {
  male: number;
  female: number;
  unknown: number;
  femalePercent: number;
}

export interface GenderByParty {
  party: string;
  male: number;
  female: number;
  femaleRatio: number;
}

export interface GenderSpeaker {
  name: string;
  party: string;
  count: number;
}

export interface InterruptionPatterns {
  maleInterruptions: number;
  femaleInterruptions: number;
  maleInterrupted: number;
  femaleInterrupted: number;
}

export interface GenderAnalysis {
  distribution: GenderDistribution;
  byParty: GenderByParty[];
  topFemaleSpeakersReden: GenderSpeaker[];
  topMaleSpeakersReden: GenderSpeaker[];
  topFemaleSpeakersAll?: GenderSpeaker[];
  topMaleSpeakersAll?: GenderSpeaker[];
  interruptionPatterns: InterruptionPatterns;
  speechLength?: {
    male: number;
    female: number;
  };
  academicTitles?: {
    male: number;
    female: number;
  };
}

export interface BefragungResponder {
  name: string;
  party: string;
  responses: number;
}

export interface ToneRanking {
  party: string;
  score: number;
}

export interface ExtendedToneScores {
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

export interface PartyProfile {
  party: string;
  category: string;
  categoryName: string;
  emoji: string;
  description: string;
  rank: number;
  totalParties: number;
  score: number;
  traits: string[];
  scores: ExtendedToneScores;
  archetype?: string;
  archetypeName?: string;
}

export interface TopicScore {
  topic: string;
  score: number;
  rank: number;
}

export interface TopicAnalysis {
  byParty: Record<string, Record<string, number>>;
  overall: Record<string, number>;
  topTopics: TopicScore[];
}

export interface ToneAnalysis {
  parties: Array<{
    party: string;
    scores: Record<string, number>;
    topAffirmative: Array<{ word: string; count: number }>;
    topCritical: Array<{ word: string; count: number }>;
    topAggressive: Array<{ word: string; count: number }>;
    topLabeling: Array<{ word: string; count: number }>;
    topSolution: Array<{ word: string; count: number }>;
    topProblem: Array<{ word: string; count: number }>;
    topCollaborative: Array<{ word: string; count: number }>;
    topConfrontational: Array<{ word: string; count: number }>;
    topDemanding: Array<{ word: string; count: number }>;
    topAcknowledging: Array<{ word: string; count: number }>;
  }>;
  partyProfiles?: Record<string, PartyProfile>;
  rankings: {
    affirmative: ToneRanking[];
    aggression: ToneRanking[];
    labeling: ToneRanking[];
    solutionFocus: ToneRanking[];
    collaboration: ToneRanking[];
    demandIntensity: ToneRanking[];
    acknowledgment: ToneRanking[];
    authority?: ToneRanking[];
    futureOrientation?: ToneRanking[];
    emotionalIntensity?: ToneRanking[];
    inclusivity?: ToneRanking[];
    discriminatory?: ToneRanking[];
    discriminatoryCounts?: Array<{ party: string; count: number }>;
  };
}

export interface WrappedData {
  metadata: {
    totalSpeeches: number;
    redenCount: number;
    wortbeitraegeCount: number;
    totalWords: number;
    partyCount: number;
    speakerCount: number;
    wahlperiode: number;
    sitzungen: number;
  };
  parties: PartyStats[];
  drama: DramaStats;
  topSpeakers: TopSpeaker[];
  topSpeakersByWords?: Array<{
    name: string;
    party: string;
    totalWords: number;
    speeches: number;
  }>;
  topSpeakersByAvgWords?: Array<{
    name: string;
    party: string;
    avgWords: number;
    totalWords: number;
    speeches: number;
  }>;
  hotTopics: string[];
  quizQuestions?: QuizQuestion[];
  toneAnalysis?: ToneAnalysis | null;
  topicAnalysis?: TopicAnalysis | null;
  funFacts?: FunFact[];
  genderAnalysis?: GenderAnalysis | null;
  topBefragungResponders?: BefragungResponder[];
  moinSpeakers?: Array<{ name: string; party: string; count: number }>;
  topQuestionAskers?: Array<{ name: string; party: string; count: number }>;
}

// ============ Speaker Wrapped Types ============

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
  verbosityRank: number | null;
  verbosityTotal: number | null;
  partyVerbosityRank: number | null;
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
  ratioParty: number;
  ratioBundestag: number;
}

export interface SignatureAdjective {
  word: string;
  count: number;
  ratioParty: number;
  ratioBundestag: number;
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
  explanationParty: string;
  explanationBundestag: string;
}

export interface AdjectiveQuiz {
  question: string;
  options: QuizOption[];
  explanationParty: string;
  explanationBundestag: string;
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

export interface SpeakerTopicScore {
  topic: string;
  score: number;
  rank: number;
}

export interface SpeakerTopics {
  scores: Record<string, number>;
  topTopics: SpeakerTopicScore[];
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
