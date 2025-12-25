import { motion } from 'motion/react';
import type { PartyStats } from '@/data/wrapped';
import { BUBBLE_POSITIONS, FLOAT_ANIMATIONS } from '../shared';
import { PartyBubble } from './PartyBubble';

interface ResultViewProps {
  parties: PartyStats[];
}

export function ResultView({ parties }: ResultViewProps) {
  const topParties = parties
    .filter((p) => p.party !== 'fraktionslos')
    .slice(0, 5);

  return (
    <div className="min-h-screen relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          Partei-Vokabular
        </h2>
        <p className="text-white/50 text-xs md:text-sm">
Diese Wörter zeichnen die Parteien aus.        </p>
      </motion.div>

      <div className="absolute inset-0 z-10">
        {topParties.map((party, i) => (
          <PartyBubble
            key={party.party}
            party={party}
            index={i}
            position={BUBBLE_POSITIONS[i]}
            floatOffset={FLOAT_ANIMATIONS[i]}
            duration={FLOAT_ANIMATIONS[i].duration}
          />
        ))}
      </div>
    </div>
  );
}
