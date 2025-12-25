import { memo } from 'react';
import { motion } from 'motion/react';
import { PartyBadge } from '@/components/ui/PartyBadge';

interface MoinSpeaker {
  name: string;
  party: string;
  count: number;
}

interface WavingCardProps {
  speaker: MoinSpeaker;
  rank: number;
  delay: number;
  isChampion: boolean;
  compact?: boolean;
}

export const WavingCard = memo(function WavingCard({
  speaker,
  rank,
  delay,
  isChampion,
  compact = false,
}: WavingCardProps) {
  // Compact version for runners-up on mobile
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, type: 'spring', stiffness: 150, damping: 15 }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: rank * 0.2,
          }}
          className="relative flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
        >
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/20 text-white/80">
            #{rank}
          </div>

          <p className="font-semibold text-center text-sm text-white/90 mb-1 mt-1">
            {speaker.name}
          </p>

          <PartyBadge party={speaker.party} size="sm" className="mb-2 scale-90" />

          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/80">
            <span className="text-sm font-bold">{speaker.count}×</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -10 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
      className="relative"
    >
      <motion.div
        animate={{
          rotate: [-3, 3, -3],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2 + rank * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: rank * 0.2,
        }}
        className={`
          relative flex flex-col items-center p-6 rounded-2xl
          ${isChampion
            ? 'bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border-2 border-amber-400/50'
            : 'bg-white/10 border border-white/20'
          }
          backdrop-blur-sm shadow-xl
        `}
      >
        {isChampion && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
            className="absolute -top-4 -right-2 text-2xl"
          >
            👑
          </motion.div>
        )}

        <motion.div
          animate={{ rotate: [0, 15, -10, 15, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2 + rank,
            ease: 'easeInOut',
          }}
          className={`text-4xl md:text-5xl mb-3 ${isChampion ? '' : 'opacity-80'}`}
        >
          👋
        </motion.div>

        <div
          className={`
            absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
            font-bold text-sm
            ${isChampion ? 'bg-amber-400 text-amber-900' : 'bg-white/20 text-white/80'}
          `}
        >
          #{rank}
        </div>

        <p
          className={`font-bold text-center mb-2 ${isChampion ? 'text-lg text-white' : 'text-base text-white/90'}`}
        >
          {speaker.name}
        </p>

        <PartyBadge party={speaker.party} size="sm" className="mb-3" />

        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${isChampion ? 'bg-amber-400/30 text-amber-100' : 'bg-white/10 text-white/80'}
          `}
        >
          <span className="text-lg font-black">{speaker.count}×</span>
          <span className="text-sm font-medium">"Moin"</span>
        </div>
      </motion.div>
    </motion.div>
  );
});
