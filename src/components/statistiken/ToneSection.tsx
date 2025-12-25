import { motion } from 'motion/react';
import type { ToneAnalysis } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';

interface ToneSectionProps {
  toneAnalysis: ToneAnalysis;
}

// Only include keys that have ToneRanking[] values (not discriminatoryCounts)
type ToneRankingKey = Exclude<keyof ToneAnalysis['rankings'], 'discriminatoryCounts'>;

interface ToneMetric {
  key: ToneRankingKey;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const toneMetrics: ToneMetric[] = [
  {
    key: 'affirmative',
    label: 'Positivität',
    description: 'Anteil positiver Adjektive',
    icon: '😊',
    color: '#22c55e',
  },
  {
    key: 'aggression',
    label: 'Aggression',
    description: 'Anteil aggressiver Sprache',
    icon: '😤',
    color: '#ef4444',
  },
  {
    key: 'labeling',
    label: 'Etikettierung',
    description: 'Verwendung ideologischer Labels',
    icon: '🏷️',
    color: '#f97316',
  },
  {
    key: 'collaboration',
    label: 'Kooperation',
    description: 'Kooperative Verben',
    icon: '🤝',
    color: '#3b82f6',
  },
  {
    key: 'solutionFocus',
    label: 'Lösungsfokus',
    description: 'Lösungsorientierte Sprache',
    icon: '💡',
    color: '#eab308',
  },
  {
    key: 'demandIntensity',
    label: 'Forderungsstärke',
    description: 'Fordernde Verben',
    icon: '📣',
    color: '#a855f7',
  },
  {
    key: 'acknowledgment',
    label: 'Anerkennung',
    description: 'Anerkennende Sprache',
    icon: '👏',
    color: '#06b6d4',
  },
];

const config = SECTION_CONFIG.tone;

export function ToneSection({ toneAnalysis }: ToneSectionProps) {
  // Find the most aggressive party for hero stat
  const aggressionRankings = toneAnalysis.rankings.aggression || [];
  const topAggressive = aggressionRankings[0];

  return (
    <SectionWrapper sectionId="tone" noPadding>
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

        {topAggressive && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-4"
            >
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{ color: getPartyColor(topAggressive.party) }}
              >
                {topAggressive.party}
              </span>
            </motion.div>

            <HeroStat
              value={topAggressive.score}
              label="Aggression"
              sublabel="Höchster Anteil aggressiver Sprache"
              format="percentage"
              suffix="%"
              color="#ef4444"
            />
          </>
        )}
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Tonalitäts-Analyse anzeigen"
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

          <div className="grid md:grid-cols-2 gap-6">
            {toneMetrics.map((metric, i) => {
              const rankings = toneAnalysis.rankings[metric.key];
              if (!rankings || rankings.length === 0) return null;

              const maxScore = Math.max(...rankings.map((r) => r.score));

              return (
                <motion.div
                  key={metric.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{metric.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{metric.label}</h3>
                      <p className="text-white/40 text-sm">{metric.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {rankings.map((ranking, j) => (
                      <ToneBar
                        key={ranking.party}
                        party={ranking.party}
                        score={ranking.score}
                        maxScore={maxScore}
                        index={j}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {toneAnalysis.parties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Top Wörter nach Kategorie
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toneAnalysis.parties.map((partyData) => (
                  <PartyToneWords key={partyData.party} partyData={partyData} />
                ))}
              </div>
            </motion.div>
          )}
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface ToneBarProps {
  party: string;
  score: number;
  maxScore: number;
  index: number;
}

function ToneBar({ party, score, maxScore, index }: ToneBarProps) {
  const partyColor = getPartyColor(party);
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3"
    >
      <div className="w-20 text-sm text-white/80 truncate">{party}</div>
      <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: partyColor }}
        />
      </div>
      <div className="w-12 text-right text-sm font-medium" style={{ color: partyColor }}>
        {score.toFixed(1)}%
      </div>
    </motion.div>
  );
}

interface PartyToneWordsProps {
  partyData: ToneAnalysis['parties'][0];
}

function PartyToneWords({ partyData }: PartyToneWordsProps) {
  const partyColor = getPartyColor(partyData.party);

  const categories = [
    { key: 'topAggressive', label: 'Aggressiv', data: partyData.topAggressive },
    { key: 'topLabeling', label: 'Labels', data: partyData.topLabeling },
    { key: 'topCollaborative', label: 'Kooperativ', data: partyData.topCollaborative },
  ].filter((c) => c.data && c.data.length > 0);

  if (categories.length === 0) return null;

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: partyColor }}
        />
        <h4 className="text-white font-bold">{partyData.party}</h4>
      </div>

      <div className="space-y-2">
        {categories.slice(0, 2).map((category) => (
          <div key={category.key}>
            <p className="text-white/40 text-xs uppercase tracking-wide mb-1">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {category.data.slice(0, 3).map((word) => (
                <span
                  key={word.word}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: `${partyColor}20`,
                    color: partyColor,
                  }}
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
