import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

interface WordChipProps {
  word: string;
  count?: number | string;
  delay?: number;
  variant?: 'default' | 'signature' | 'topic';
  partyColor?: string;
}

/**
 * WordChip - Reusable pill component for displaying words with counts
 */
export function WordChip({
  word,
  count,
  delay = 0,
  variant = 'default',
  partyColor,
}: WordChipProps) {
  const chipStyle =
    variant === 'topic' && partyColor
      ? [styles.chip, { backgroundColor: `${partyColor}30`, borderColor: `${partyColor}50` }]
      : [styles.chip, styles[variant]];

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).springify().stiffness(200).damping(15)}
      style={chipStyle}
    >
      <Text style={styles.word}>{word}</Text>
      {count !== undefined && (
        <Text style={styles.count}>
          {typeof count === 'number' ? `${count}×` : count}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signature: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topic: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  word: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  count: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginLeft: 6,
  },
});
