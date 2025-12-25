import { motion } from 'motion/react';
import type { GenderAnalysis } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';

interface GenderSectionProps {
  genderAnalysis: GenderAnalysis;
}

const config = SECTION_CONFIG.gender;

export function GenderSection({ genderAnalysis }: GenderSectionProps) {
  const { distribution, byParty, interruptionPatterns } = genderAnalysis;
  const totalKnown = distribution.male + distribution.female;

  return (
    <SectionWrapper sectionId="gender" noPadding>
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
          value={distribution.femalePercent}
          label="Frauenanteil"
          sublabel="Unter allen Redner:innen"
          format="percentage"
          suffix="%"
          color="#ec4899"
        />

        {/* Gender bar visualization */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-md mt-8"
        >
          <div className="flex h-4 rounded-full overflow-hidden">
            <div
              className="bg-blue-500"
              style={{ width: `${(distribution.male / totalKnown) * 100}%` }}
            />
            <div
              className="bg-pink-500"
              style={{ width: `${(distribution.female / totalKnown) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-blue-400">{distribution.male} Männer</span>
            <span className="text-pink-400">{distribution.female} Frauen</span>
          </div>
        </motion.div>
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Geschlechter-Analyse anzeigen"
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

          <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-6">Gesamtverteilung</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex h-8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${((distribution.male / totalKnown) * 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-blue-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${((distribution.female / totalKnown) * 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-blue-400 font-bold text-3xl">{distribution.male}</p>
                <p className="text-blue-400/60 text-sm">
                  {((distribution.male / totalKnown) * 100).toFixed(1)}% Männer
                </p>
              </div>
              <div className="text-center p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
                <p className="text-pink-400 font-bold text-3xl">{distribution.female}</p>
                <p className="text-pink-400/60 text-sm">
                  {distribution.femalePercent}% Frauen
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-4">Frauenanteil nach Partei</h3>
            <div className="space-y-3">
              {byParty.map((party, i) => (
                <GenderBar key={party.party} data={party} index={i} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">👩</span> Top Redner:innen (w)
            </h3>
            <div className="space-y-3">
              {genderAnalysis.topFemaleSpeakersReden.slice(0, 5).map((speaker, i) => (
                <SpeakerRow
                  key={speaker.name}
                  name={speaker.name}
                  party={speaker.party}
                  count={speaker.count}
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
              <span className="text-2xl">👨</span> Top Redner:innen (m)
            </h3>
            <div className="space-y-3">
              {genderAnalysis.topMaleSpeakersReden.slice(0, 5).map((speaker, i) => (
                <SpeakerRow
                  key={speaker.name}
                  name={speaker.name}
                  party={speaker.party}
                  count={speaker.count}
                  rank={i}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {interruptionPatterns && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-6 text-center">
              Unterbrechungsmuster
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox
                label="Männer unterbrechen"
                value={interruptionPatterns.maleInterruptions}
                icon="🗣️"
                color="blue"
              />
              <StatBox
                label="Frauen unterbrechen"
                value={interruptionPatterns.femaleInterruptions}
                icon="🗣️"
                color="pink"
              />
              <StatBox
                label="Männer werden unterbrochen"
                value={interruptionPatterns.maleInterrupted}
                icon="🎯"
                color="blue"
              />
              <StatBox
                label="Frauen werden unterbrochen"
                value={interruptionPatterns.femaleInterrupted}
                icon="🎯"
                color="pink"
              />
            </div>

            {interruptionPatterns.maleInterruptions > 0 && interruptionPatterns.femaleInterruptions > 0 && (
              <div className="mt-6 text-center">
                <p className="text-white/60">
                  Männer unterbrechen{' '}
                  <span className="text-white font-bold">
                    {(interruptionPatterns.maleInterruptions / interruptionPatterns.femaleInterruptions).toFixed(1)}×
                  </span>{' '}
                  häufiger als Frauen
                </p>
              </div>
            )}
          </motion.div>
        )}

        {genderAnalysis.academicTitles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-4 text-center">
              Akademische Titel (Dr.)
            </h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-blue-400 font-bold text-2xl">
                  {(genderAnalysis.academicTitles.male * 100).toFixed(0)}%
                </p>
                <p className="text-blue-400/60 text-sm">der Männer</p>
              </div>
              <div className="text-center p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
                <p className="text-pink-400 font-bold text-2xl">
                  {(genderAnalysis.academicTitles.female * 100).toFixed(0)}%
                </p>
                <p className="text-pink-400/60 text-sm">der Frauen</p>
              </div>
            </div>
          </motion.div>
          )}
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface GenderBarProps {
  data: {
    party: string;
    male: number;
    female: number;
    femaleRatio: number;
  };
  index: number;
}

function GenderBar({ data, index }: GenderBarProps) {
  const partyColor = getPartyColor(data.party);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3"
    >
      <div className="w-20 text-sm text-white/80 truncate">{data.party}</div>
      <div className="flex-1 h-5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${data.femaleRatio}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-400"
        />
      </div>
      <div className="w-14 text-right text-sm font-medium" style={{ color: partyColor }}>
        {data.femaleRatio.toFixed(1)}%
      </div>
    </motion.div>
  );
}

interface SpeakerRowProps {
  name: string;
  party: string;
  count: number;
  rank: number;
}

function SpeakerRow({ name, party, count, rank }: SpeakerRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.05 }}
      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg w-6">
          {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : (
            <span className="text-white/40 text-sm">{rank + 1}.</span>
          )}
        </span>
        <div>
          <p className="text-white font-medium text-sm">{name}</p>
          <PartyBadge party={party} size="sm" />
        </div>
      </div>
      <span
        className="font-bold"
        style={{ color: getPartyColor(party) }}
      >
        {count}
      </span>
    </motion.div>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'pink';
}

function StatBox({ label, value, icon, color }: StatBoxProps) {
  const colorClasses = color === 'blue'
    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    : 'bg-pink-500/10 border-pink-500/30 text-pink-400';

  return (
    <div className={`text-center p-4 rounded-xl border ${colorClasses}`}>
      <span className="text-xl block mb-1">{icon}</span>
      <p className="font-bold text-xl">{formatNumber(value)}</p>
      <p className="text-xs opacity-60">{label}</p>
    </div>
  );
}
