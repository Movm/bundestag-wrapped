import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { getPartyColor, TOPIC_BY_ID } from '@/shared';
import {
  SPEAKER_CONTENT,
  getTopTopics,
  getTopicWords,
} from '@/shared/speaker-wrapped';
import type { SpeakerWrapped } from '~/types/wrapped';
import { WordChip } from './shared';
import {
  fadeInEntering,
  fadeUpEntering,
  bubbleAnimations,
  scaleInEntering,
} from '../shared';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TopicsSectionProps {
  data: SpeakerWrapped;
}

/**
 * TopicsSection - Shows top topics with bubble layout
 */
export function TopicsSection({ data }: TopicsSectionProps) {
  const partyColor = getPartyColor(data.party);
  const content = SPEAKER_CONTENT.topics;
  const topTopics = getTopTopics(data, 5);

  if (topTopics.length === 0) {
    return null;
  }

  const primaryTopic = topTopics[0];
  const primaryMeta = TOPIC_BY_ID[primaryTopic.topic];
  const topicWords = getTopicWords(data, primaryTopic.topic, 6);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.Text entering={fadeInEntering(100)} style={styles.subtitle}>
          {content.subtitle}
        </Animated.Text>
        <Animated.Text entering={fadeUpEntering(200)} style={styles.title}>
          {content.title}
        </Animated.Text>

        {/* Topic Bubbles */}
        <View style={styles.bubblesContainer}>
          {topTopics.map((topicScore, i) => {
            const meta = TOPIC_BY_ID[topicScore.topic];
            if (!meta) return null;

            const isPrimary = i === 0;
            const size = isPrimary ? 100 : 72;

            return (
              <Animated.View
                key={topicScore.topic}
                entering={bubbleAnimations.bubble(i)}
                style={[
                  styles.bubble,
                  {
                    width: size,
                    height: size,
                    backgroundColor: meta.color,
                  },
                ]}
              >
                {/* Rank Badge */}
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{topicScore.rank}</Text>
                </View>
                <Text style={isPrimary ? styles.emojiLarge : styles.emojiSmall}>
                  {meta.emoji}
                </Text>
                <Text
                  style={[
                    styles.topicName,
                    { fontSize: isPrimary ? 11 : 9 },
                  ]}
                  numberOfLines={1}
                >
                  {meta.name}
                </Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Primary Topic Keywords */}
        {primaryMeta && topicWords.length > 0 && (
          <Animated.View entering={scaleInEntering(800)} style={styles.keywordsCard}>
            <View style={styles.keywordsHeader}>
              <Text style={styles.keywordsEmoji}>{primaryMeta.emoji}</Text>
              <Text style={styles.keywordsTitle}>
                {content.keywordsPrefix} {primaryMeta.name}{content.keywordsSuffix}
              </Text>
            </View>
            <View style={styles.keywordsChips}>
              {topicWords.map((tw, i) => (
                <WordChip
                  key={tw.word}
                  word={tw.word}
                  count={tw.count}
                  delay={900 + i * 50}
                  variant="topic"
                  partyColor={partyColor}
                />
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  bubble: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emojiLarge: {
    fontSize: 36,
  },
  emojiSmall: {
    fontSize: 24,
  },
  topicName: {
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 4,
  },
  keywordsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  keywordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  keywordsEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  keywordsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
