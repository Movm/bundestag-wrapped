import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Menu, X, Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isMuted, toggleMuted, toggleBackgroundMusic, isBackgroundMusicPlaying } from '@/lib/sounds';

interface HeaderProps {
  variant?: 'dark' | 'light';
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ variant = 'dark', isMenuOpen, onMenuToggle }: HeaderProps) {
  const isDark = variant === 'dark';
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
    <header className="fixed top-0 left-0 right-0 z-60 h-14">
      <div className="h-full px-4 flex items-center justify-between">
        <Link
          to="/"
          className="transition-opacity hover:opacity-80"
          aria-label="Bundestag Wrapped - Zur Startseite"
        >
          <img src="/logo.png" alt="Bundestag Wrapped" className="h-8 w-8" />
        </Link>

        <div className="flex items-center gap-1">
          {/* Background music toggle */}
          <button
            onClick={handleToggleMusic}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? musicPlaying
                  ? 'text-pink-400 hover:text-pink-300 hover:bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                : musicPlaying
                  ? 'text-pink-500 hover:text-pink-600 hover:bg-gray-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={musicPlaying ? 'Musik ausschalten' : 'Musik einschalten'}
          >
            {musicPlaying ? <Music size={20} aria-hidden="true" /> : <Music2 size={20} aria-hidden="true" />}
          </button>

          {/* Sound effects toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
          >
            {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
          </button>

          <button
            onClick={onMenuToggle}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </motion.div>
          </button>
        </div>
      </div>
    </header>
  );
}
