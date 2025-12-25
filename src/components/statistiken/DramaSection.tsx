import { motion } from 'motion/react';
import type { DramaStats } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';

interface DramaSectionProps {
  drama: DramaStats;
}

const config = SECTION_CONFIG.drama;

export function DramaSection({ drama }: DramaSectionProps) {
  const stats = drama.zwischenrufStats;
  const totalZwischenrufe = stats ? stats.positive + stats.negative + stats.neutral : 0;

  return (
    <SectionWrapper sectionId="drama" noPadding>
      {/* HERO ZONE */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-16">
        <SectionHeader
          sectionNumber={config.number}
          emoji={config.emoji}
          title={config.title}
          subtitle={config.subtitle}
          accentColor={config.accent}
          className="mb-8"
        />

        <HeroStat
          value={totalZwischenrufe}
          label="Zwischenrufe"
          sublabel="Reaktionen im Bundestag"
          format="number"
          color={config.accent}
        />

        {/* Sentiment breakdown under hero */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 mt-8"
          >
            <div className="text-center">
              <span className="text-emerald-400 font-bold text-xl">{stats.positivePercent}%</span>
              <p className="text-emerald-400/60 text-sm">Zustimmung</p>
            </div>
            <div className="text-center">
              <span className="text-red-400 font-bold text-xl">{stats.negativePercent}%</span>
              <p className="text-red-400/60 text-sm">Kritik</p>
            </div>
            <div className="text-center">
              <span className="text-white/60 font-bold text-xl">{stats.neutralPercent}%</span>
              <p className="text-white/40 text-sm">Neutral</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Wer unterbricht wen?"
          collapseLabel="Details ausblenden"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/50 text-base max-w-2xl mx-auto mb-12"
          >
            {config.explanation}
          </motion.p>

          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto"
            >
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                <div className="text-emerald-400 font-bold text-2xl md:text-3xl">
                  {formatNumber(stats.positive)}
                </div>
                <div className="text-emerald-400/60 text-sm">{stats.positivePercent}%</div>
                <div className="text-emerald-300/60 text-xs md:text-sm mt-1">Zustimmung</div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                <div className="text-red-400 font-bold text-2xl md:text-3xl">
                  {formatNumber(stats.negative)}
                </div>
                <div className="text-red-400/60 text-sm">{stats.negativePercent}%</div>
                <div className="text-red-300/60 text-xs md:text-sm mt-1">Kritik</div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-white/80 font-bold text-2xl md:text-3xl">
                  {formatNumber(stats.neutral)}
                </div>
                <div className="text-white/50 text-sm">{stats.neutralPercent}%</div>
                <div className="text-white/40 text-xs md:text-sm mt-1">Neutral</div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-2xl">📢</span> Top Zwischenrufer
              </h3>
              <div className="space-y-3">
                {drama.topZwischenrufer.slice(0, 5).map((item, i) => (
                  <PersonRow
                    key={item.name}
                    name={item.name}
                    party={item.party}
                    value={item.count}
                    rank={i}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Meistens unterbrochen
              </h3>
              <div className="space-y-3">
                {drama.mostInterrupted.slice(0, 5).map((item, i) => (
                  <PersonRow
                    key={item.name}
                    name={item.name}
                    party={item.party}
                    value={item.count}
                    rank={i}
                    suffix="×"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-2xl">👏</span> Applaus-Champions
              </h3>
              <div className="space-y-3">
                {drama.applauseChampions.slice(0, 5).map((item, i) => (
                  <PartyRow
                    key={item.party}
                    party={item.party}
                    value={item.count}
                    rank={i}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-2xl">📣</span> Häufigste Zwischenrufer (Partei)
              </h3>
              <div className="space-y-3">
                {drama.loudestHecklers.slice(0, 5).map((item, i) => (
                  <PartyRow
                    key={item.party}
                    party={item.party}
                    value={item.count}
                    rank={i}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface PersonRowProps {
  name: string;
  party: string;
  value: number;
  rank: number;
  suffix?: string;
}

function PersonRow({ name, party, value, rank, suffix = '' }: PersonRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.05 }}
      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl w-8">
          {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : (
            <span className="text-white/40 text-sm">{rank + 1}.</span>
          )}
        </span>
        <div>
          <p className="text-white font-medium">{name}</p>
          <PartyBadge party={party} size="sm" />
        </div>
      </div>
      <span
        className="text-xl font-bold"
        style={{ color: getPartyColor(party) }}
      >
        {formatNumber(value)}{suffix}
      </span>
    </motion.div>
  );
}

interface PartyRowProps {
  party: string;
  value: number;
  rank: number;
}

function PartyRow({ party, value, rank }: PartyRowProps) {
  const partyColor = getPartyColor(party);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.05 }}
      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl w-8">
          {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : (
            <span className="text-white/40 text-sm">{rank + 1}.</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: partyColor }}
          />
          <p className="text-white font-medium">{party}</p>
        </div>
      </div>
      <span className="text-xl font-bold" style={{ color: partyColor }}>
        {formatNumber(value)}
      </span>
    </motion.div>
  );
}
