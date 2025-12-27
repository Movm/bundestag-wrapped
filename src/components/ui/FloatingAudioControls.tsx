import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isMuted, toggleMuted } from '@/lib/sounds';
import { themeMusic, THEME_TRACK_INFO, type ThemeType } from '@/lib/theme-music';

interface FloatingAudioControlsProps {
  currentTheme?: ThemeType | null;
}

export function FloatingAudioControls({ currentTheme }: FloatingAudioControlsProps) {
  const [muted, setMuted] = useState(false);
  const [showTrackInfo, setShowTrackInfo] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  // Show track info briefly when theme changes
  useEffect(() => {
    if (currentTheme && !muted) {
      setShowTrackInfo(true);
      const timer = setTimeout(() => setShowTrackInfo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentTheme, muted]);

  const handleToggleMute = () => {
    const newMuted = toggleMuted();
    setMuted(newMuted);

    // Also control theme music when muting/unmuting
    if (newMuted) {
      themeMusic.pause();
    } else {
      themeMusic.resume();
    }
  };

  const trackInfo = currentTheme ? THEME_TRACK_INFO[currentTheme] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
    >
      {/* Track info (shows on theme change) */}
      <AnimatePresence>
        {showTrackInfo && trackInfo && !muted && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm"
          >
            <Music size={14} className="text-pink-400" aria-hidden="true" />
            <div className="text-xs">
              <div className="text-white/90 font-medium">{trackInfo.title}</div>
              <div className="text-white/50">{trackInfo.artist}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio toggle */}
      <button
        onClick={handleToggleMute}
        className="p-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
        aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
        title={trackInfo ? `${trackInfo.title} - ${trackInfo.artist}` : undefined}
      >
        {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
      </button>
    </motion.div>
  );
}
