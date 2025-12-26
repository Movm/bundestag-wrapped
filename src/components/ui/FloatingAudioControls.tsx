import { motion } from 'motion/react';
import { Music, Music2, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isMuted, toggleMuted, toggleBackgroundMusic, isBackgroundMusicPlaying } from '@/lib/sounds';

export function FloatingAudioControls() {
  const [muted, setMuted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
    setMusicPlaying(isBackgroundMusicPlaying());
  }, []);

  const handleToggleMute = () => {
    const newMuted = toggleMuted();
    setMuted(newMuted);
  };

  const handleToggleMusic = () => {
    const nowPlaying = toggleBackgroundMusic();
    setMusicPlaying(nowPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-1"
    >
      {/* Background music toggle */}
      <button
        onClick={handleToggleMusic}
        className={`p-2 rounded-lg transition-colors ${
          musicPlaying
            ? 'text-pink-400 hover:text-pink-300 hover:bg-white/10'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        aria-label={musicPlaying ? 'Musik ausschalten' : 'Musik einschalten'}
      >
        {musicPlaying ? <Music size={20} aria-hidden="true" /> : <Music2 size={20} aria-hidden="true" />}
      </button>

      {/* Sound effects toggle */}
      <button
        onClick={handleToggleMute}
        className="p-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
        aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
      >
        {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
      </button>
    </motion.div>
  );
}
