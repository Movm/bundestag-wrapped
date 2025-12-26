import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isNative, isPluginAvailable } from './lib/capacitor'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import './index.css'
import App from './App.tsx'

// Initialize Capacitor native plugins
async function initializeCapacitor() {
  if (!isNative()) return;

  // Configure status bar for dark theme
  if (isPluginAvailable('StatusBar')) {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0a0a0f' });
    } catch (e) {
      console.warn('StatusBar configuration failed:', e);
    }
  }

  // Hide splash screen after app is ready
  if (isPluginAvailable('SplashScreen')) {
    try {
      await SplashScreen.hide();
    } catch (e) {
      console.warn('SplashScreen hide failed:', e);
    }
  }
}

// Run initialization
initializeCapacitor();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min - data is static
      gcTime: 30 * 60 * 1000,   // 30 min cache retention
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
