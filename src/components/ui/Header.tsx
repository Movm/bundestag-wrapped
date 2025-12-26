import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { isNative } from '@/lib/capacitor';

interface HeaderProps {
  variant?: 'dark' | 'light';
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ variant = 'dark', isMenuOpen, onMenuToggle }: HeaderProps) {
  const isDark = variant === 'dark';

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

        {/* Hide menu button on native - use tab navigation instead */}
        {!isNative() && (
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
        )}
      </div>
    </header>
  );
}
