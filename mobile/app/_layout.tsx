import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient, restoreQueryCache } from '../lib/queryClient';
import { initSounds } from '../lib/sounds';
import { useNotifications } from '../hooks/useNotifications';
import '../global.css';

export default function RootLayout() {
  // Initialize push notifications
  const { expoPushToken } = useNotifications();

  // Restore cache and initialize sounds in background (non-blocking)
  useEffect(() => {
    restoreQueryCache().catch(e => console.warn('Cache restore skipped:', e));
    initSounds().catch(e => console.warn('Sound init skipped:', e));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0a0f' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="(tabs)"
            options={{
              animation: 'fade',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="speaker/[slug]"
            options={{
              animation: 'slide_from_bottom',
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="wrapped/[slug]"
            options={{
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
