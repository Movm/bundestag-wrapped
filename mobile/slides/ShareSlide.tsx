/**
 * ShareSlide - Quiz result sharing screen with confetti animation
 * Similar to web version at src/components/slides/ShareSlide/
 */

import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  FadeIn,
  FadeInUp,
  ZoomIn,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Share2 } from 'lucide-react-native';
import {
  SlideContainer,
  emojiPopEntering,
  fadeUpEntering,
  fadeInEntering,
  snappyEntering,
  scaleInEntering,
} from './shared';
import {
  getQuizImageUrl,
  getQuizCacheFilename,
  downloadAndCacheImage,
  shareImage,
  saveToGallery,
} from '../lib/share-utils';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// German flag colors for confetti
const CONFETTI_COLORS = ['#000000', '#DD0000', '#FFCC00'];

interface ShareSlideProps {
  correctCount: number;
  totalQuestions: number;
}

// ─────────────────────────────────────────────────────────────
// Confetti Particle Component
// ─────────────────────────────────────────────────────────────

interface ConfettiParticleProps {
  left: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
}

const ConfettiParticle = memo(function ConfettiParticle({
  left,
  color,
  duration,
  delay,
  rotation,
}: ConfettiParticleProps) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Start animation after delay
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 0 }),
          withTiming(SCREEN_HEIGHT + 20, {
            duration: duration,
            easing: Easing.linear,
          })
        ),
        -1, // infinite
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(1, { duration: duration * 0.1 }),
          withTiming(1, { duration: duration * 0.7 }),
          withTiming(0, { duration: duration * 0.2 })
        ),
        -1,
        false
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(rotation, { duration: duration, easing: Easing.linear })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        { left: `${left}%`, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
});

// ─────────────────────────────────────────────────────────────
// Falling Confetti Container
// ─────────────────────────────────────────────────────────────

const FallingConfetti = memo(function FallingConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * 3)],
        rotation: Math.random() * 720 - 360,
        duration: (Math.random() * 3 + 2) * 1000, // 2-5 seconds in ms
        delay: Math.random() * 3000, // 0-3 seconds delay
      })),
    []
  );

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          left={p.left}
          color={p.color}
          duration={p.duration}
          delay={p.delay}
          rotation={p.rotation}
        />
      ))}
    </View>
  );
});

// ─────────────────────────────────────────────────────────────
// Main ShareSlide Component
// ─────────────────────────────────────────────────────────────

export const ShareSlide = memo(function ShareSlide({
  correctCount,
  totalQuestions,
}: ShareSlideProps) {
  const [userName, setUserName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debounce timer ref
  const [debouncedName, setDebouncedName] = useState('');

  // Debounce name input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(userName);
    }, 500);
    return () => clearTimeout(timer);
  }, [userName]);

  // Fetch image when name changes (debounced)
  useEffect(() => {
    let cancelled = false;

    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const url = getQuizImageUrl(correctCount, totalQuestions, debouncedName || undefined);
        const filename = getQuizCacheFilename(correctCount, totalQuestions, debouncedName || undefined);
        const uri = await downloadAndCacheImage(url, filename);
        if (!cancelled) {
          setImageUri(uri);
        }
      } catch (error) {
        console.error('Failed to fetch share image:', error);
        if (!cancelled) {
          Alert.alert('Fehler', 'Das Bild konnte nicht geladen werden.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();
    return () => {
      cancelled = true;
    };
  }, [correctCount, totalQuestions, debouncedName]);

  // Handle share button
  const handleShare = useCallback(async () => {
    if (!imageUri || isSharing) return;
    setIsSharing(true);
    try {
      await shareImage(imageUri, 'Teile dein Bundestag Wrapped Ergebnis');
    } finally {
      setIsSharing(false);
    }
  }, [imageUri, isSharing]);

  // Handle download/save button
  const handleSave = useCallback(async () => {
    if (!imageUri || isSaving) return;
    setIsSaving(true);
    try {
      await saveToGallery(imageUri);
    } finally {
      setIsSaving(false);
    }
  }, [imageUri, isSaving]);

  return (
    <SlideContainer>
      <FallingConfetti />

      <View style={styles.content}>
        {/* Header */}
        <Animated.Text entering={emojiPopEntering(100)} style={styles.emoji}>
          📸
        </Animated.Text>

        <Animated.View entering={fadeUpEntering(200)}>
          <LinearGradient
            colors={['#ec4899', '#db2777', '#be185d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>Teile dein Ergebnis!</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.Text entering={fadeInEntering(300)} style={styles.subtitle}>
          Erstelle dein persönliches Sharepic
        </Animated.Text>

        {/* Name Input */}
        <Animated.View entering={fadeUpEntering(400)} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Dein Name (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            maxLength={30}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </Animated.View>

        {/* Image Preview */}
        <Animated.View entering={scaleInEntering(500)} style={styles.previewContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ec4899" />
              <Text style={styles.loadingText}>Lade Vorschau...</Text>
            </View>
          ) : imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>Vorschau nicht verfügbar</Text>
            </View>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Save Button */}
          <AnimatedPressable
            entering={snappyEntering(600)}
            style={[styles.saveButton, (isSaving || isLoading) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving || isLoading || !imageUri}
          >
            {isSaving ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Download size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Speichern</Text>
              </>
            )}
          </AnimatedPressable>

          {/* Share Button */}
          <AnimatedPressable
            entering={snappyEntering(700)}
            style={[styles.shareButton, (isSharing || isLoading) && styles.buttonDisabled]}
            onPress={handleShare}
            disabled={isSharing || isLoading || !imageUri}
          >
            {isSharing ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Share2 size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Teilen</Text>
              </>
            )}
          </AnimatedPressable>
        </View>
      </View>
    </SlideContainer>
  );
});

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  titleGradient: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  errorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ec4899',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
