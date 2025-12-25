import { useMemo } from 'react';
import { motion } from 'motion/react';
import { WavingCard } from './WavingCard';

interface MoinSpeaker {
  name: string;
  party: string;
  count: number;
}

interface ResultViewProps {
  speakers: MoinSpeaker[];
}

export function ResultView({ speakers }: ResultViewProps) {
  const topSpeakers = useMemo(() => speakers.slice(0, 4), [speakers]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <motion.span
          animate={{ rotate: [0, 15, -10, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="text-5xl md:text-6xl mb-4 block"
        >
          👋
        </motion.span>
        <h2 className="text-2xl md:text-4xl font-black text-white">
          Die Moin-Champions
        </h2>
        <p className="text-white/60 mt-2 text-base md:text-lg">
          Norddeutsche Grüße im Bundestag
        </p>
      </motion.div>

      {/* Champion - always full display */}
      {topSpeakers[0] && (
        <div className="mb-6 w-full max-w-xs">
          <WavingCard
            speaker={topSpeakers[0]}
            rank={1}
            delay={0.1}
            isChampion={true}
          />
        </div>
      )}

      {/* 2nd and 3rd place - compact on mobile, side by side */}
      {topSpeakers.length > 1 && (
        <div className="grid grid-cols-2 gap-3 md:gap-6 w-full max-w-md mb-6">
          {topSpeakers.slice(1, 3).map((speaker, index) => (
            <WavingCard
              key={speaker.name}
              speaker={speaker}
              rank={index + 2}
              delay={0.25 + index * 0.15}
              isChampion={false}
              compact={true}
            />
          ))}
        </div>
      )}

      {/* 4th place if exists - also compact */}
      {topSpeakers[3] && (
        <div className="w-full max-w-[10rem]">
          <WavingCard
            speaker={topSpeakers[3]}
            rank={4}
            delay={0.55}
            isChampion={false}
            compact={true}
          />
        </div>
      )}
    </div>
  );
}
