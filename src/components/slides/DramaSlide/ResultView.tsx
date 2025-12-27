import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import type { DramaStats } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { formatNumber } from '@/lib/utils';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer, ScrollHint } from '../shared';

interface ResultViewProps {
  drama: DramaStats;
}

// Timing constants for the reveal sequence
const COUNT_DURATION = 2; // seconds for count animation
const LABEL_DELAY = COUNT_DURATION + 0.3;
const NAME_DELAY = LABEL_DELAY + 0.2;
const PARTY_DELAY = NAME_DELAY + 0.2;
const EMOJI_DELAY = PARTY_DELAY + 0.3;
const NOTE_DELAY = EMOJI_DELAY + 0.3;
const SCROLL_HINT_DELAY = NOTE_DELAY + 0.5;

export function ResultView({ drama }: ResultViewProps) {
  const leader = drama.topZwischenrufer[0];
  const partyColor = getPartyColor(leader.party);

  // Use Motion's native animation - runs on compositor thread
  const motionCount = useMotionValue(0);
  const roundedCount = useTransform(motionCount, (v) => Math.floor(v));
  const [displayCount, setDisplayCount] = useState(0);

  // Subscribe to animated value changes
  useEffect(() => {
    const unsubscribe = roundedCount.on('change', (v) => setDisplayCount(v));
    return unsubscribe;
  }, [roundedCount]);

  // Animate on mount
  useEffect(() => {
    const controls = animate(motionCount, leader.count, {
      duration: COUNT_DURATION,
      ease: [0.33, 1, 0.68, 1], // easeOutCubic
    });
    return controls.stop;
  }, [leader.count, motionCount]);

  return (
    <SlideContainer innerClassName="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Phase 2: Emoji (appears after context starts building) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: EMOJI_DELAY, type: 'spring', bounce: 0.4 }}
        className="text-6xl mb-8"
      >
        🎭
      </motion.div>

      {/* Phase 2: Name (wraps above the count) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: NAME_DELAY, duration: 0.4 }}
        className="text-center mb-2"
      >
        <p className="text-white text-2xl md:text-3xl font-bold">{leader.name}</p>
      </motion.div>

      {/* Phase 2: Party badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: PARTY_DELAY, type: 'spring', bounce: 0.3 }}
        className="mb-6"
      >
        <PartyBadge party={leader.party} size="lg" />
      </motion.div>

      {/* Phase 1: The big count - appears FIRST */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0, duration: 0.3 }}
        className="text-8xl md:text-9xl font-black my-4 tabular-nums"
        style={{
          color: partyColor,
          textShadow: `0 0 80px ${partyColor}50, 0 0 120px ${partyColor}30`,
        }}
      >
        {formatNumber(displayCount)}
      </motion.div>

      {/* Phase 1: Label appears right after count finishes */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: LABEL_DELAY, duration: 0.4 }}
        className="text-white/60 text-xl md:text-2xl mb-10"
      >
        Zwischenrufe
      </motion.p>

      {/* Phase 2: Note at the end */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: NOTE_DELAY, duration: 0.5 }}
        className="text-white/40 text-sm md:text-base"
      >
        Mit über 4.000 (!) Zwischenrufen stört die AfD mit Abstand am meisten.
      </motion.p>

      <ScrollHint delay={SCROLL_HINT_DELAY} className="mt-10" />
    </SlideContainer>
  );
}
