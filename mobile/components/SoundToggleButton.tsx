import { useState, useEffect, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { isMuted, toggleMuted } from '../lib/sounds';

interface SoundToggleButtonProps {
  size?: number;
  style?: object;
}

/**
 * Sound mute/unmute toggle button for mobile app.
 * Uses the sounds lib to persist mute preference.
 */
export function SoundToggleButton({ size = 24, style }: SoundToggleButtonProps) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    isMuted().then(setMuted);
  }, []);

  const handlePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMuted = await toggleMuted();
    setMuted(newMuted);
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, style]}
      accessibilityLabel={muted ? 'Ton einschalten' : 'Ton ausschalten'}
      accessibilityRole="button"
    >
      {muted ? (
        <VolumeX color="rgba(255, 255, 255, 0.7)" size={size} />
      ) : (
        <Volume2 color="rgba(255, 255, 255, 0.7)" size={size} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
  },
});
