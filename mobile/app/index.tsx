import { View, Text, Pressable, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiImage } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';

// Floating particle for background effect
function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5, translateY: 0 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5], translateY: -100 }}
      transition={{
        type: 'timing',
        duration: 4000,
        delay,
        loop: true,
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(168, 85, 247, 0.4)',
      }}
    />
  );
}

// Generate random particles
function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 3000,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
  }, [count]);

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }} pointerEvents="none">
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}
    </View>
  );
}

export default function IntroScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  const handleStart = () => {
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#0a0a0f] items-center justify-center">
      {/* Floating particles background */}
      <FloatingParticles count={25} />

      {/* Content */}
      <View className="items-center z-10 px-6">
        {/* Animated Logo */}
        <MotiImage
          source={require('../assets/logo.png')}
          from={{ opacity: 0, scale: 0.8, translateY: -50 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 100,
            delay: 200,
          }}
          style={{
            width: isSmall ? 96 : 120,
            height: isSmall ? 96 : 120,
            marginBottom: 24,
          }}
          resizeMode="contain"
        />

        {/* BUNDESTAG - Pink text with glow */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
        >
          <Text
            style={{
              fontSize: isSmall ? 40 : 48,
              fontWeight: '900',
              color: '#ec4899',
              textAlign: 'center',
              letterSpacing: 2,
              textShadowColor: 'rgba(168, 85, 247, 0.6)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 25,
            }}
          >
            BUNDESTAG
          </Text>
        </MotiView>

        {/* WRAPPED */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 600 }}
        >
          <Text
            style={{
              fontSize: isSmall ? 36 : 44,
              fontWeight: '900',
              color: '#ffffff',
              textAlign: 'center',
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            WRAPPED
          </Text>
        </MotiView>

        {/* 2025 */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
        >
          <Text
            style={{
              fontSize: isSmall ? 24 : 28,
              fontWeight: '700',
              color: '#f472b6',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 48,
            }}
          >
            2025
          </Text>
        </MotiView>

        {/* Starten Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1000 }}
        >
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <LinearGradient
              colors={['#ec4899', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 16,
                borderRadius: 9999,
                shadowColor: '#ec4899',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              >
                Starten
              </Text>
            </LinearGradient>
          </Pressable>
        </MotiView>
      </View>
    </View>
  );
}
