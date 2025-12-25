import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { DramaStats } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { formatNumber } from '@/lib/utils';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer, ScrollHint, itemVariants } from '../shared';

interface ResultViewProps {
  drama: DramaStats;
}

export function ResultView({ drama }: ResultViewProps) {
  const leader = drama.topZwischenrufer[0];
  const [count, setCount] = useState(0);
  const partyColor = getPartyColor(leader.party);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * leader.count));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [leader.count]);

  return (
    <SlideContainer innerClassName="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div variants={itemVariants} className="text-6xl mb-8">
        🎭
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-2">
        <p className="text-white text-2xl md:text-3xl font-bold">{leader.name}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <PartyBadge party={leader.party} size="lg" />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-8xl md:text-9xl font-black my-4 tabular-nums"
        style={{
          color: partyColor,
          textShadow: `0 0 80px ${partyColor}50, 0 0 120px ${partyColor}30`,
        }}
      >
        {formatNumber(count)}
      </motion.div>

      <motion.p variants={itemVariants} className="text-white/60 text-xl md:text-2xl mb-10">
        Zwischenrufe
      </motion.p>

      <motion.p variants={itemVariants} className="text-white/40 text-sm md:text-base">
        Mit über 4.000 (!) Zwischenrufen stört die AfD mit Abstand am meisten.
      </motion.p>

      <ScrollHint delay={2.5} className="mt-10" />
    </SlideContainer>
  );
}
