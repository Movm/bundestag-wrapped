import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { getPartyGradient } from '@/lib/party-colors';
import { FlipCard } from '../shared';

interface PartyWithTotals {
  party: string;
  speeches: number;
  wortbeitraege: number;
  totalBeitraege: number;
}

interface ResultViewProps {
  parties: PartyWithTotals[];
}

const BUBBLE_POSITIONS = [
  { top: '20%', left: '20%' },
  { top: '18%', left: '55%' },
  { top: '45%', left: '38%' },
  { top: '65%', left: '22%' },
  { top: '62%', left: '58%' },
];

const FLOAT_ANIMATIONS = [
  { x: [0, 12, -8, 0], y: [0, -15, 8, 0], duration: 7 },
  { x: [0, -15, 10, 0], y: [0, 10, -12, 0], duration: 8 },
  { x: [0, 8, -12, 0], y: [0, -8, 15, 0], duration: 6.5 },
  { x: [0, -10, 15, 0], y: [0, 15, -8, 0], duration: 9 },
  { x: [0, 15, -8, 0], y: [0, -12, 10, 0], duration: 7.5 },
];

export const ResultView = memo(function ResultView({ parties }: ResultViewProps) {
  const top5 = parties.slice(0, 5);

  const { minSpeeches, speechRange, minWortbeitraege, wortbeitraegeRange } = useMemo(() => {
    const speeches = top5.map((p) => p.speeches);
    const wortbeitraege = top5.map((p) => p.wortbeitraege);
    return {
      minSpeeches: Math.min(...speeches),
      speechRange: Math.max(...speeches) - Math.min(...speeches) || 1,
      minWortbeitraege: Math.min(...wortbeitraege),
      wortbeitraegeRange: Math.max(...wortbeitraege) - Math.min(...wortbeitraege) || 1,
    };
  }, [top5]);

  const totalReden = top5.reduce((sum, p) => sum + p.speeches, 0);

  return (
    <div className="min-h-screen relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20 px-4"
      >
        <span className="text-4xl md:text-5xl mb-2 block">🎤</span>
        <p className="text-white/50 text-xs md:text-sm uppercase tracking-wide mb-1">
          Die Reden
        </p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white">
          {totalReden.toLocaleString('de-DE')} formelle Reden
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-white/30 text-xs mt-2"
        >
          Wir unterscheiden zwischen richtigen Reden und weiteren Wortbeiträgen (Fragestunden oder ähnliches)
        </motion.p>
      </motion.div>

      <div className="absolute inset-0 z-10">
        {top5.map((party, i) => {
          const speechSizePercent = 20 + ((party.speeches - minSpeeches) / speechRange) * 80;
          const wortSizePercent = 20 + ((party.wortbeitraege - minWortbeitraege) / wortbeitraegeRange) * 80;

          const minVw = 14;
          const maxVw = 32;
          const speechVwSize = minVw + (speechSizePercent / 100) * (maxVw - minVw);
          const wortVwSize = minVw + (wortSizePercent / 100) * (maxVw - minVw);

          // Use the larger of the two sizes to prevent jarring size changes
          const vwSize = Math.max(speechVwSize, wortVwSize);

          const gradient = getPartyGradient(party.party);
          const position = BUBBLE_POSITIONS[i];
          const float = FLOAT_ANIMATIONS[i];

          const bubbleClasses = `
            w-full h-full
            rounded-full
            bg-gradient-to-br ${gradient}
            shadow-2xl shadow-black/30
            flex flex-col items-center justify-center
            p-4 text-center
          `;

          const frontContent = (
            <div className={bubbleClasses}>
              <p className="text-white font-black text-2xl md:text-3xl lg:text-4xl drop-shadow-md">
                {party.speeches.toLocaleString('de-DE')}
              </p>
              <p className="text-white/70 text-xs md:text-sm font-medium mt-1">
                Reden
              </p>
            </div>
          );

          const backContent = (
            <div className={bubbleClasses}>
              <h4 className="text-white font-black text-xs md:text-sm drop-shadow-md absolute top-3 md:top-4">
                {party.party}
              </h4>
              <p className="text-white font-black text-xl md:text-2xl lg:text-3xl drop-shadow-md">
                {party.wortbeitraege.toLocaleString('de-DE')}
              </p>
              <p className="text-white/70 text-xs md:text-sm font-medium mt-1">
                Weitere Wortbeiträge
              </p>
            </div>
          );

          return (
            <motion.div
              key={party.party}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.12,
                type: 'spring',
                stiffness: 150,
                damping: 15,
              }}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
              }}
            >
              <motion.div
                animate={{ x: float.x, y: float.y }}
                transition={{
                  repeat: Infinity,
                  duration: float.duration,
                  ease: 'easeInOut',
                }}
                style={{ willChange: 'transform' }}
              >
                <FlipCard
                  front={frontContent}
                  back={backContent}
                  className="min-w-[100px] min-h-[100px] max-w-[280px] max-h-[280px]"
                  size={`${vwSize}vw`}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
