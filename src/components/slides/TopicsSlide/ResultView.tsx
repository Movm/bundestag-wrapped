import { useCallback } from 'react';
import { motion } from 'motion/react';
import type { TopicAnalysis } from '@/data/wrapped';
import { BUBBLE_POSITIONS, FLOAT_ANIMATIONS, FlipCard } from '../shared';
import { TOPIC_BY_ID, type TopicMeta } from './constants';
import { getPartyBgColor } from '@/lib/party-colors';

interface ResultViewProps {
  topicAnalysis: TopicAnalysis;
}

interface PartyRanking {
  party: string;
  score: number;
}

interface TopicBubbleProps {
  topic: TopicMeta;
  rank: number;
  index: number;
  position: { top: string; left: string };
  floatOffset: { x: number[]; y: number[] };
  duration: number;
  partyRankings: PartyRanking[];
}

function TopicBubble({
  topic,
  rank,
  index,
  position,
  floatOffset,
  duration,
  partyRankings,
}: TopicBubbleProps) {
  const bubbleClasses = `
    w-full h-full
    rounded-full
    shadow-2xl shadow-black/30
    flex flex-col items-center justify-center
    p-3 text-center
  `;

  const frontContent = (
    <div
      className={bubbleClasses}
      style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.color}dd)` }}
    >
      <span className="text-white/70 font-black text-2xl md:text-3xl">{rank}</span>
      <p className="text-white font-bold text-sm md:text-base drop-shadow-md mt-1">
        {topic.name}
      </p>
    </div>
  );

  const backContent = (
    <div
      className={bubbleClasses}
      style={{ background: `linear-gradient(135deg, ${topic.color}ee, ${topic.color}cc)` }}
    >
      <div className="space-y-0.5 px-1">
        {partyRankings.slice(0, 5).map((pr, i) => (
          <div key={pr.party} className="flex items-center gap-1.5 justify-center">
            <span className="text-white/60 text-[10px] md:text-xs w-3">{i + 1}.</span>
            <div
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getPartyBgColor(pr.party) }}
            />
            <span className="text-white text-[10px] md:text-xs font-semibold truncate max-w-[60px] md:max-w-[80px]">
              {pr.party}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
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
          className="w-[28vw] h-[28vw] max-w-[200px] max-h-[200px] min-w-[110px] min-h-[110px]"
        />
      </motion.div>
    </motion.div>
  );
}

export function ResultView({ topicAnalysis }: ResultViewProps) {
  const { topTopics, byParty } = topicAnalysis;

  // Get top 5 topics for the bubble layout
  const displayTopics = topTopics.slice(0, 5);

  // Calculate party rankings for a given topic
  const getPartyRankings = useCallback((topicId: string): PartyRanking[] => {
    const rankings: PartyRanking[] = [];
    for (const [party, topics] of Object.entries(byParty)) {
      if (party === 'fraktionslos') continue; // Skip independents
      const score = topics[topicId] || 0;
      rankings.push({ party, score });
    }
    return rankings.sort((a, b) => b.score - a.score);
  }, [byParty]);

  return (
    <div className="min-h-screen relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          Die Themen des Bundestags
        </h2>
        <p className="text-white/50 text-xs md:text-sm">
          Worüber wurde am meisten gesprochen?
        </p>
      </motion.div>

      <div className="absolute inset-0 z-10">
        {displayTopics.map((topicScore, i) => {
          const topic = TOPIC_BY_ID[topicScore.topic];
          if (!topic) return null;
          return (
            <TopicBubble
              key={topicScore.topic}
              topic={topic}
              rank={topicScore.rank}
              index={i}
              position={BUBBLE_POSITIONS[i]}
              floatOffset={FLOAT_ANIMATIONS[i]}
              duration={FLOAT_ANIMATIONS[i].duration}
              partyRankings={getPartyRankings(topicScore.topic)}
            />
          );
        })}
      </div>
    </div>
  );
}
