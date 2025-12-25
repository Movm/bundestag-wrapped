import { memo } from 'react';
import { motion } from 'motion/react';
import type { PartyProfile } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { CATEGORY_ANIMATIONS, DEFAULT_ANIMATION } from './constants';

interface PartyCardProps {
  profile: PartyProfile;
  index: number;
}

export const PartyCard = memo(function PartyCard({
  profile,
  index,
}: PartyCardProps) {
  const partyColor = getPartyColor(profile.party);
  const categoryId =
    profile.category ||
    (profile as unknown as { archetype?: string }).archetype ||
    '';
  const animation = CATEGORY_ANIMATIONS[categoryId] || DEFAULT_ANIMATION;

  const displayName =
    profile.categoryName ||
    (profile as unknown as { archetypeName?: string }).archetypeName ||
    '';

  const rankDisplay =
    profile.rank && profile.totalParties
      ? `#${profile.rank} von ${profile.totalParties}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 150,
        damping: 20,
      }}
      className="relative group"
    >
      <motion.div
        animate={animation.card}
        transition={{
          repeat: Infinity,
          duration: animation.duration,
          ease: 'easeInOut',
        }}
        className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-5
                   border border-white/10 hover:border-white/20 transition-all duration-300
                   hover:bg-white/10 cursor-default"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
          style={{ backgroundColor: partyColor }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [0.95, 1.02, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.3,
          }}
        />

        <motion.div
          className="text-4xl md:text-5xl lg:text-6xl text-center mb-3"
          animate={animation.emoji}
          transition={{
            repeat: Infinity,
            duration: animation.duration,
            ease: 'easeInOut',
          }}
        >
          {profile.emoji}
        </motion.div>

        <motion.h3
          className="text-base md:text-lg font-bold text-center mb-1"
          style={{ color: partyColor }}
        >
          {profile.party}
        </motion.h3>

        <div className="text-center mb-3">
          <p className="text-xs md:text-sm text-white/80 font-medium">
            {displayName}
          </p>
          {rankDisplay && (
            <p className="text-[10px] md:text-xs text-white/40 mt-0.5">
              {rankDisplay}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {profile.traits.slice(0, 3).map((trait, i) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
              className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70"
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});
