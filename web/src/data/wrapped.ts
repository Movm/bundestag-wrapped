export interface PartyStats {
  party: string;
  speeches: number;
  totalWords: number;
  uniqueSpeakers: number;
  topWords: Array<{ word: string; count: number }>;
  signatureWords: Array<{ word: string; ratio: number }>;
  keyTopics: Array<{ word: string; count: number; ratio: number }>;
  avgSpeechLength: number;
  descriptiveness: number;
  topSpeaker: { name: string; speeches: number };
}

export interface DramaStats {
  topInterrupters: Array<{ name: string; party: string; count: number }>;
  mostInterrupted: Array<{ name: string; party: string; count: number }>;
  applauseChampions: Array<{ party: string; count: number }>;
  loudestHecklers: Array<{ party: string; count: number }>;
}

export interface TopSpeaker {
  name: string;
  party: string;
  speeches: number;
}

export interface QuizQuestion {
  type: 'guess-party' | 'prediction';
  question: string;
  word?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  ratio?: number;
}

export interface WrappedData {
  metadata: {
    totalSpeeches: number;
    totalWords: number;
    partyCount: number;
    speakerCount: number;
    wahlperiode: number;
    sitzungen: number;
  };
  parties: PartyStats[];
  drama: DramaStats;
  topSpeakers: TopSpeaker[];
  hotTopics: string[];
  quizQuestions: QuizQuestion[];
}

export async function loadWrappedData(): Promise<WrappedData> {
  const response = await fetch('/wrapped.json');
  if (!response.ok) {
    throw new Error('Failed to load wrapped data');
  }
  return response.json();
}
