import { useMemo } from 'react';
import { motion } from 'motion/react';
import type { TopSpeaker } from '@/data/wrapped';
import { SpeakerBubble } from './SpeakerBubble';
import { FLOAT_ANIMATIONS } from '../shared/utils';

interface TopSpeakerByWords {
  name: string;
  party: string;
  totalWords: number;
  speeches: number;
}

interface TopSpeakerByAvgWords {
  name: string;
  party: string;
  avgWords: number;
  totalWords: number;
  speeches: number;
}

interface ResultViewProps {
  speakers: TopSpeaker[];
  speakersByWords?: TopSpeakerByWords[];
  speakersByAvgWords?: TopSpeakerByAvgWords[];
}

const SPEAKER_POSITIONS = [
  { top: '18%', left: '8%' },
  { top: '15%', left: '55%' },
  { top: '55%', left: '30%' },
];

export function ResultView({
  speakers,
  speakersByWords = [],
  speakersByAvgWords = [],
}: ResultViewProps) {
  const medals = useMemo(() => {
    const topBySpeechCount = speakers[0];
    const topByWords = speakersByWords[0];
    const topByAvg = speakersByAvgWords[0];

    return [
      topBySpeechCount && {
        emoji: '🎤',
        title: 'Meiste Reden',
        name: topBySpeechCount.name,
        party: topBySpeechCount.party,
        value: `${topBySpeechCount.speeches} Reden`,
      },
      topByWords && {
        emoji: '📝',
        title: 'Meiste Wörter',
        name: topByWords.name,
        party: topByWords.party,
        value: `${(topByWords.totalWords / 1000).toFixed(0)}k Wörter`,
      },
      topByAvg && {
        emoji: '📊',
        title: 'Längste Reden',
        name: topByAvg.name,
        party: topByAvg.party,
        value: `Ø ${topByAvg.avgWords} Wörter`,
      },
    ].filter(Boolean) as Array<{
      emoji: string;
      title: string;
      name: string;
      party: string;
      value: string;
    }>;
  }, [speakers, speakersByWords, speakersByAvgWords]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center pt-8 px-6"
      >
        <span className="text-4xl md:text-5xl mb-3 block">🏆</span>
        <h2 className="text-2xl md:text-4xl font-black text-white">
          Top Speakers
        </h2>
        <p className="text-white/60 mt-1 text-base">
          Die Rekordhalter des Bundestags
        </p>
      </motion.div>

      {medals.map((medal, i) => (
        <SpeakerBubble
          key={medal.title}
          emoji={medal.emoji}
          title={medal.title}
          name={medal.name}
          party={medal.party}
          value={medal.value}
          index={i}
          position={SPEAKER_POSITIONS[i]}
          floatOffset={FLOAT_ANIMATIONS[i]}
          duration={FLOAT_ANIMATIONS[i].duration}
        />
      ))}
    </div>
  );
}
