import { useEffect } from 'react';
import { motion } from 'motion/react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';
import { getPartyColor } from './party-colors';
import { TOPIC_BY_ID } from '@/components/slides/TopicsSlide/constants';

interface TopicsSectionProps {
  data: SpeakerWrapped;
  onNext: () => void;
}

export function TopicsSection({ data, onNext }: TopicsSectionProps) {
  const partyColor = getPartyColor(data.party);
  const { topics } = data;

  useEffect(() => {
    if (!topics || topics.topTopics.length === 0) {
      onNext();
    }
  }, [topics, onNext]);

  if (!topics || topics.topTopics.length === 0) {
    return null;
  }

  const topTopics = topics.topTopics.slice(0, 5);
  const primaryTopic = topTopics[0];
  const primaryMeta = TOPIC_BY_ID[primaryTopic.topic];
  const topicWords = topics.topicWords[primaryTopic.topic] || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full max-w-2xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 text-lg mb-2"
        >
          Deine Top-Themen
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white mb-8"
        >
          Worüber du am meisten sprichst
        </motion.h2>

        {/* Topic Bubbles */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {topTopics.map((topicScore, i) => {
            const meta = TOPIC_BY_ID[topicScore.topic];
            if (!meta) return null;

            const isPrimary = i === 0;
            const size = isPrimary
              ? 'w-28 h-28 md:w-32 md:h-32'
              : 'w-20 h-20 md:w-24 md:h-24';

            return (
              <motion.div
                key={topicScore.topic}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2 + i * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className={`${size} rounded-full flex flex-col items-center justify-center shadow-lg relative`}
                style={{
                  background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                }}
              >
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-bold text-gray-800">
                  {topicScore.rank}
                </div>
                <span className={isPrimary ? 'text-3xl md:text-4xl' : 'text-2xl'}>{meta.emoji}</span>
                <span className={`text-white font-semibold mt-1 ${isPrimary ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs'}`}>
                  {meta.name}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Primary Topic Keywords */}
        {primaryMeta && topicWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">{primaryMeta.emoji}</span>
              <h3 className="text-lg font-semibold text-white">
                Deine {primaryMeta.name}-Wörter
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {topicWords.slice(0, 6).map((tw, i) => (
                <motion.div
                  key={tw.word}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.05, type: 'spring' }}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                  style={{
                    backgroundColor: `${partyColor}30`,
                    borderColor: `${partyColor}50`,
                    borderWidth: 1,
                  }}
                >
                  {tw.word}
                  <span className="ml-1.5 opacity-60">{tw.count}×</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onNext}
        className="mt-10 px-8 py-4 text-lg font-semibold rounded-2xl text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: partyColor }}
      >
        Weiter
      </motion.button>
    </div>
  );
}
