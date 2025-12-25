import { motion } from 'motion/react';
import type { PartyStats } from '@/data/wrapped';
import { getPartyGradient } from '@/lib/party-colors';
import { FlipCard } from '../shared';

interface PartyBubbleProps {
  party: PartyStats;
  index: number;
  position: { top: string; left: string };
  floatOffset: { x: number[]; y: number[] };
  duration: number;
}

export function PartyBubble({
  party,
  index,
  position,
  floatOffset,
  duration,
}: PartyBubbleProps) {
  const signatureWord = party.signatureWords[0];
  const backWords = party.signatureWords.slice(0, 5);

  const bubbleClasses = `
    w-full h-full
    rounded-full
    bg-gradient-to-br ${getPartyGradient(party.party)}
    shadow-2xl shadow-black/30
    flex flex-col items-center justify-center
    p-3 text-center
  `;

  const frontContent = (
    <div className={bubbleClasses}>
      <p className="text-white font-bold text-lg md:text-xl lg:text-2xl drop-shadow-md px-2 break-words hyphens-auto" lang="de">
        {signatureWord?.word ?? '–'}
      </p>
    </div>
  );

  const backContent = (
    <div className={bubbleClasses}>
      <h4 className="text-white font-black text-xs md:text-sm drop-shadow-md absolute top-3 md:top-4">
        {party.party}
      </h4>
      <div className="space-y-0.5 text-center px-2" lang="de">
        {backWords.map((w, i) => (
          <p
            key={w.word}
            className={`text-white font-semibold break-words hyphens-auto leading-tight ${
              i === 0 ? 'text-sm md:text-base' : 'text-xs md:text-sm'
            }`}
          >
            {w.word}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
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
        animate={{ x: floatOffset.x, y: floatOffset.y }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      >
        <FlipCard
          front={frontContent}
          back={backContent}
          className="w-[28vw] h-[28vw] max-w-[220px] max-h-[220px] min-w-[120px] min-h-[120px]"
        />
      </motion.div>
    </motion.div>
  );
}
