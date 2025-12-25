import { motion } from 'motion/react';
import type { TopSpeaker, BefragungResponder } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';

interface SpeakerSectionProps {
  topSpeakers: TopSpeaker[];
  topSpeakersByWords?: Array<{
    name: string;
    party: string;
    totalWords: number;
    speeches: number;
  }>;
  topSpeakersByAvgWords?: Array<{
    name: string;
    party: string;
    avgWords: number;
    totalWords: number;
    speeches: number;
  }>;
  topBefragungResponders?: BefragungResponder[];
}

const config = SECTION_CONFIG.speakers;

export function SpeakerSection({
  topSpeakers,
  topSpeakersByWords,
  topSpeakersByAvgWords,
  topBefragungResponders,
}: SpeakerSectionProps) {
  // Find the speaker with most words
  const topSpeakerByWords = topSpeakersByWords?.[0];
  const topSpeakerColor = topSpeakerByWords ? getPartyColor(topSpeakerByWords.party) : config.accent;

  return (
    <SectionWrapper sectionId="speakers" noPadding>
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

        {topSpeakerByWords && (
          <>
            {/* Speaker name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-4"
            >
              <span className="text-2xl md:text-3xl font-bold text-white">
                {topSpeakerByWords.name}
              </span>
              <div className="mt-2">
                <PartyBadge party={topSpeakerByWords.party} size="md" />
              </div>
            </motion.div>

            <HeroStat
              value={topSpeakerByWords.totalWords}
              label="Wörter gesprochen"
              sublabel={`In ${topSpeakerByWords.speeches} Reden`}
              format="compact"
              suffix="M"
              color={topSpeakerColor}
            />
          </>
        )}
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Rankings anzeigen"
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

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <RankingCard
              title="Meiste Reden"
              icon="📢"
              items={topSpeakers.slice(0, 10).map((s) => ({
                name: s.name,
                party: s.party,
                value: s.speeches,
                label: 'Reden',
              }))}
            />

            {topSpeakersByWords && (
              <RankingCard
                title="Meiste Wörter"
                icon="📝"
                items={topSpeakersByWords.slice(0, 10).map((s) => ({
                  name: s.name,
                  party: s.party,
                  value: s.totalWords,
                  label: 'Wörter',
                  subValue: `${s.speeches} Reden`,
                }))}
                formatValue={(v) => `${Math.round(v / 1000)}K`}
              />
            )}

            {topSpeakersByAvgWords && (
              <RankingCard
                title="Längste Reden"
                icon="📏"
                items={topSpeakersByAvgWords.slice(0, 10).map((s) => ({
                  name: s.name,
                  party: s.party,
                  value: s.avgWords,
                  label: 'Ø Wörter',
                  subValue: `${s.speeches} Reden`,
                }))}
                formatValue={(v) => formatNumber(Math.round(v))}
              />
            )}
          </div>

          {topBefragungResponders && topBefragungResponders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <span className="text-2xl">❓</span>
                Regierungsbefragung - Top Antwortgeber
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {topBefragungResponders.slice(0, 5).map((responder, i) => (
                  <motion.div
                    key={responder.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <span className="text-2xl block mb-2">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <p className="text-white font-medium text-sm truncate">{responder.name}</p>
                    <PartyBadge party={responder.party} size="sm" />
                    <p
                      className="text-xl font-bold mt-2"
                      style={{ color: getPartyColor(responder.party) }}
                    >
                      {responder.responses}
                    </p>
                    <p className="text-white/40 text-xs">Antworten</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface RankingCardProps {
  title: string;
  icon: string;
  items: Array<{
    name: string;
    party: string;
    value: number;
    label: string;
    subValue?: string;
  }>;
  formatValue?: (value: number) => string;
}

function RankingCard({ title, icon, items, formatValue }: RankingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-2xl p-5 border border-white/10"
    >
      <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span> {title}
      </h3>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 py-2 ${
              i < items.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <span className="text-lg w-6 text-center">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                <span className="text-white/40 text-sm">{i + 1}.</span>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{item.name}</p>
              <div className="flex items-center gap-2">
                <PartyBadge party={item.party} size="sm" />
                {item.subValue && (
                  <span className="text-white/40 text-xs">{item.subValue}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className="font-bold"
                style={{ color: getPartyColor(item.party) }}
              >
                {formatValue ? formatValue(item.value) : formatNumber(item.value)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
