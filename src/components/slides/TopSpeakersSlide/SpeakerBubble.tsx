import { motion } from 'motion/react';
import { getPartyGradient } from '@/lib/party-colors';
import { FlipCard } from '../shared';

interface SpeakerBubbleProps {
  emoji: string;
  title: string;
  name: string;
  party: string;
  value: string;
  index: number;
  position: { top: string; left: string };
  floatOffset: { x: number[]; y: number[] };
  duration: number;
}

export function SpeakerBubble({
  emoji,
  title,
  name,
  party,
  value,
  index,
  position,
  floatOffset,
  duration,
}: SpeakerBubbleProps) {
  const lastName = name.split(' ').slice(-1)[0];

  const bubbleClasses = `
    w-full h-full
    rounded-full
    bg-gradient-to-br ${getPartyGradient(party)}
    shadow-2xl shadow-black/30
    flex flex-col items-center justify-center
    p-3 text-center
  `;

  const frontContent = (
    <div className={bubbleClasses}>
      <span className="text-2xl md:text-3xl mb-1">{emoji}</span>
      <p className="text-white font-bold text-sm md:text-base lg:text-lg drop-shadow-md">
        {lastName}
      </p>
    </div>
  );

  const backContent = (
    <div className={bubbleClasses}>
      <p className="text-white/70 text-xs uppercase tracking-wide absolute top-3 md:top-4">
        {title}
      </p>
      <div className="space-y-0.5 text-center px-2">
        <p className="text-white font-bold text-sm md:text-base leading-tight">
          {name}
        </p>
        <p className="text-white/80 text-xs md:text-sm font-medium">
          {party}
        </p>
        <p className="text-white font-black text-base md:text-lg">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.15,
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
          className="w-[28vw] h-[28vw] max-w-[180px] max-h-[180px] min-w-[110px] min-h-[110px]"
        />
      </motion.div>
    </motion.div>
  );
}
