import { motion } from 'motion/react';
import type { DramaStats } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';

interface ReactionsSlideProps {
  drama: DramaStats;
  onNext: () => void;
}

function ReactionChart({
  title,
  emoji,
  items,
  delay,
}: {
  title: string;
  emoji: string;
  items: Array<{ party: string; count: number }>;
  delay: number;
}) {
  const maxCount = Math.max(...items.map((i) => i.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{emoji}</span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        {items.slice(0, 5).map((item, i) => {
          const partyColor = getPartyColor(item.party);
          const percentage = (item.count / maxCount) * 100;

          return (
            <motion.div
              key={item.party}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-sm">{item.party}</span>
                <span className="text-white/60 text-sm">{formatNumber(item.count)}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: partyColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: delay + 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function ReactionsSlide({ drama, onNext }: ReactionsSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl lg:text-6xl mb-4 block">🎭</span>
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-2">
          Reaktionen im Plenum
        </h2>
        <p className="text-white/60 text-lg">
          Wer klatscht, wer heckelt?
        </p>
      </motion.div>

      {/* Two charts side by side on desktop */}
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">
        <ReactionChart
          title="Applaus-Champions"
          emoji="👏"
          items={drama.applauseChampions}
          delay={0.3}
        />
        <ReactionChart
          title="Lauteste Heckler"
          emoji="📢"
          items={drama.loudestHecklers}
          delay={0.5}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-white/40 text-sm mt-6 text-center max-w-md"
      >
        Beifallsbekundungen und Zwischenrufe aus den Protokollen
      </motion.p>

      <motion.button
        onClick={onNext}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Weiter
      </motion.button>
    </div>
  );
}
