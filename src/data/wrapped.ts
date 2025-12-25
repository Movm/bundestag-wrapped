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
  party?: string;  // For emoji-quiz: the party to match
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

// Extended tone scores (Scheme D + E)
export interface ExtendedToneScores {
  // Scheme D (original)
  affirmative: number;
  aggression: number;
  labeling: number;
  solution_focus: number;
  collaboration: number;
  demand_intensity: number;
  acknowledgment: number;
  // Scheme E (extended)
  authority: number;
  future_orientation: number;
  emotional_intensity: number;
  inclusivity: number;
  discriminatory: number;
}

// Party category profile (rank-based classification)
export interface PartyProfile {
  party: string;
  category: string;       // Category ID (e.g., "aggression", "discriminatory")
  categoryName: string;   // German name (e.g., "Aggressiv", "Ausgrenzend")
  emoji: string;
  description: string;
  rank: number;           // 1 = highest in this category
  totalParties: number;   // Total parties compared
  score: number;          // Raw score value
  traits: string[];
  scores: ExtendedToneScores;
  // Legacy aliases for backwards compatibility
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
    // Scheme D (original)
    affirmative: ToneRanking[];
    aggression: ToneRanking[];
    labeling: ToneRanking[];
    solutionFocus: ToneRanking[];
    collaboration: ToneRanking[];
    demandIntensity: ToneRanking[];
    acknowledgment: ToneRanking[];
    // Scheme E (extended)
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
  // Raw data for quiz generation
  moinSpeakers?: Array<{ name: string; party: string; count: number }>;
  topQuestionAskers?: Array<{ name: string; party: string; count: number }>;
}

export async function loadWrappedData(): Promise<WrappedData> {
  const response = await fetch('/wrapped.json');
  if (!response.ok) {
    throw new Error('Failed to load wrapped data');
  }
  return response.json();
}
