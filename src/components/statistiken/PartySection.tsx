import { motion } from 'motion/react';
import type { PartyStats } from '@/data/wrapped';
import { getPartyColor } from '@/lib/party-colors';
import { formatNumber } from '@/lib/utils';
import { SectionHeader, SectionWrapper, HeroStat, ExpandableDetails, SECTION_CONFIG } from './shared';

interface PartySectionProps {
  parties: PartyStats[];
}

const config = SECTION_CONFIG.parties;

export function PartySection({ parties }: PartySectionProps) {
  // Find the party with most contributions (speeches + wortbeitraege)
  const topParty = parties.reduce((top, party) => {
    const total = party.speeches + (party.wortbeitraege || 0);
    const topTotal = top.speeches + (top.wortbeitraege || 0);
    return total > topTotal ? party : top;
  }, parties[0]);

  const topPartyTotal = topParty.speeches + (topParty.wortbeitraege || 0);
  const topPartyColor = getPartyColor(topParty.party);

  return (
    <SectionWrapper sectionId="parties" noPadding>
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

        {/* Hero: Top Party */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span
            className="text-2xl md:text-3xl font-bold"
            style={{ color: topPartyColor }}
          >
            {topParty.party}
          </span>
        </motion.div>

        <HeroStat
          value={topPartyTotal}
          label="Wortbeiträge"
          sublabel="Aktivste Fraktion"
          format="number"
          color={topPartyColor}
        />
      </div>

      {/* EXPANDABLE DETAILS */}
      <div className="py-12">
        <ExpandableDetails
          expandLabel="Alle Fraktionen anzeigen"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parties.map((party, i) => (
              <PartyCard key={party.party} party={party} index={i} />
            ))}
          </div>
        </ExpandableDetails>
      </div>
    </SectionWrapper>
  );
}

interface PartyCardProps {
  party: PartyStats;
  index: number;
}

function PartyCard({ party, index }: PartyCardProps) {
  const partyColor = getPartyColor(party.party);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: partyColor }}
        />
        <h3 className="text-xl font-bold text-white">{party.party}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <p className="text-2xl font-bold" style={{ color: partyColor }}>
            {formatNumber(party.speeches + (party.wortbeitraege || 0))}
          </p>
          <p className="text-white/60 text-sm">
            Wortbeiträge <span className="text-white/40">(davon {formatNumber(party.speeches)} Reden)</span>
          </p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">
            {formatNumber(party.uniqueSpeakers)}
          </p>
          <p className="text-white/60 text-sm">Redner:innen</p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">
            {formatNumber(party.avgSpeechLength)}
          </p>
          <p className="text-white/60 text-sm">Ø Wörter/Rede</p>
        </div>
      </div>

      {party.topSpeaker && party.topSpeaker.name && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Top Redner:in</p>
          <p className="text-white font-medium">{party.topSpeaker.name}</p>
          <p className="text-white/60 text-sm">{party.topSpeaker.speeches} Reden</p>
        </div>
      )}

      {party.signatureWords.length > 0 && (
        <div className="mb-4">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Signature-Wörter</p>
          <div className="flex flex-wrap gap-2">
            {party.signatureWords.slice(0, 4).map((word) => (
              <span
                key={word.word}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${partyColor}20`,
                  color: partyColor,
                  border: `1px solid ${partyColor}40`,
                }}
              >
                {word.word} ({word.ratio.toFixed(1)}x)
              </span>
            ))}
          </div>
        </div>
      )}

      {party.keyTopics.length > 0 && (
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Key Topics</p>
          <div className="space-y-1">
            {party.keyTopics.slice(0, 3).map((topic) => (
              <div key={topic.word} className="flex items-center justify-between">
                <span className="text-white/80 text-sm">{topic.word}</span>
                <span className="text-white/40 text-xs">
                  {formatNumber(topic.count)}× ({topic.ratio.toFixed(1)}x)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
