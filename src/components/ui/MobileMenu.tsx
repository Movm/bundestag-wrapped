import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, BookOpen, Shield, FileText, ExternalLink, Users, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Bundestag Wrapped', icon: <Home size={20} /> },
  { href: '/abgeordnete', label: 'Abgeordnete-Wrapped', icon: <Users size={20} /> },
  { href: '/suche', label: 'Suche', icon: <Search size={20} /> },
  { href: '/dokumentation', label: 'Dokumentation', icon: <BookOpen size={20} /> },
];

const FOOTER_LINKS: NavItem[] = [
  { href: '/datenschutz', label: 'Datenschutz', icon: <Shield size={14} /> },
  {
    href: 'https://www.moritz-waechter.de/impressum',
    label: 'Impressum',
    icon: <FileText size={14} />,
    external: true,
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'dark' | 'light';
}

export function MobileMenu({ isOpen, onClose, variant = 'dark' }: MobileMenuProps) {
  const menuRef = useRef<HTMLElement>(null);
  const isDark = variant === 'dark';
  const location = useLocation();
  const currentPath = location.pathname;

  // Focus trap and focus management
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus close button when menu opens
    const closeButton = menu.querySelector<HTMLButtonElement>('button');
    closeButton?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    menu.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      menu.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleNavClick = (item: NavItem) => {
    if (!item.external) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          >
            {/* Subtle pink gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-transparent to-transparent" />
          </motion.div>

          {/* Premium Drawer */}
          <motion.nav
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] z-70 overflow-hidden
              ${isDark
                ? 'bg-gradient-to-b from-[#1a1a24] via-[#12121a] to-[#0a0a0f]'
                : 'bg-white'
              }
              border-l ${isDark ? 'border-pink-500/20' : 'border-gray-200'}
              shadow-2xl ${isDark ? 'shadow-pink-500/10' : ''}`}
            style={isDark ? {
              boxShadow: 'inset 0 0 80px rgba(219, 39, 119, 0.08), -20px 0 60px rgba(0, 0, 0, 0.5)',
            } : undefined}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            aria-label="Hauptnavigation"
          >
            {/* Decorative pink orb */}
            {isDark && (
              <div
                className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(219, 39, 119, 0.4) 0%, transparent 70%)',
                }}
              />
            )}

            {/* Close button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors
                  ${isDark
                    ? 'bg-white/5 hover:bg-pink-500/20 text-white/60 hover:text-pink-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                  }`}
                aria-label="Menü schließen"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col h-full pt-20 px-5">
              {/* Navigation items */}
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = !item.external && currentPath === item.href;

                  const linkClassName = `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors
                    ${isDark
                      ? isActive
                        ? 'bg-gradient-to-r from-pink-600/25 to-pink-500/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      : isActive
                        ? 'bg-pink-50 text-pink-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`;

                  const linkContent = (
                    <>
                      {/* Active indicator bar */}
                      {isActive && isDark && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
                      )}

                      {/* Icon container */}
                      <span className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors
                        ${isDark
                          ? isActive
                            ? 'bg-pink-500/20 text-pink-400'
                            : 'bg-white/5 text-white/50 group-hover:bg-pink-500/10 group-hover:text-pink-400'
                          : isActive
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-gray-100 text-gray-400 group-hover:text-pink-500'
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className="font-medium">{item.label}</span>

                      {item.external && (
                        <ExternalLink size={14} className="ml-auto opacity-40" />
                      )}
                    </>
                  );

                  return (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleNavClick(item)}
                          className={linkClassName}
                        >
                          {linkContent}
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => handleNavClick(item)}
                          className={linkClassName}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {linkContent}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Pink separator line */}
              <div className={`mt-auto mb-6 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-pink-500/30 to-transparent' : 'bg-gray-200'}`} />

              {/* Footer area */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-3">
                  {FOOTER_LINKS.map((item, index) => {
                    const footerLinkClassName = `text-xs transition-colors
                      ${isDark
                        ? 'text-white/40 hover:text-pink-400'
                        : 'text-gray-400 hover:text-pink-500'
                      }`;

                    return (
                      <span key={item.href} className="flex items-center">
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={footerLinkClassName}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => handleNavClick(item)}
                            className={footerLinkClassName}
                          >
                            {item.label}
                          </Link>
                        )}
                        {index < FOOTER_LINKS.length - 1 && (
                          <span className={`mx-2 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>·</span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <p className={`text-xs ${isDark ? 'text-white/25' : 'text-gray-300'}`}>
                  Daten aus der 21. Wahlperiode
                </p>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
