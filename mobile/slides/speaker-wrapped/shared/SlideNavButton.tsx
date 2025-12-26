import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SPEAKER_CONTENT } from '@/shared/speaker-wrapped';

interface SlideNavButtonProps {
  onPress: () => void;
  partyColor: string;
  label?: string;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * SlideNavButton - Navigation button for speaker wrapped slides
 * Styled with party color background
 */
export function SlideNavButton({
  onPress,
  partyColor,
  label = SPEAKER_CONTENT.navigation.continue,
  delay = 500,
}: SlideNavButtonProps) {
  return (
    <AnimatedPressable
      entering={FadeInUp.delay(delay).springify()}
      onPress={onPress}
      style={[styles.button, { backgroundColor: partyColor }]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
