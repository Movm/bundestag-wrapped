import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '@/components/seo/SEO';
import { PAGE_META } from '@/components/seo/constants';
import { type SpeakerSummary } from '@/data/speaker-wrapped';
import { useSpeakerIndex } from '@/hooks/useDataQueries';
import { useDebounce } from '@/hooks/useSearchState';
import { PARTY_BG_CLASSES } from '@/lib/party-colors';

const MotionLink = motion.create(Link);

export function AbgeordnetePage() {
  const { data: speakerIndex, isLoading: loading, error } = useSpeakerIndex();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 200);

  const filteredSpeakers = useMemo((): SpeakerSummary[] => {
    if (!speakerIndex || !debouncedQuery.trim()) return [];
    const query = debouncedQuery.toLowerCase();
    return speakerIndex.speakers
      .filter((s) => s.name.toLowerCase().includes(query))
      .sort((a, b) => {
        // Prioritize names starting with query
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name, 'de');
      })
      .slice(0, 8);
  }, [speakerIndex, debouncedQuery]);

  const showResults = debouncedQuery.trim().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏛️</div>
          <p className="text-white/60">Lade Abgeordnete...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400">Fehler beim Laden</p>
          <p className="text-white/40 text-sm mt-2">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={PAGE_META.speakers.title}
        description={PAGE_META.speakers.description}
        canonicalUrl="/abgeordnete"
      />
      <div className="min-h-screen page-bg pt-14">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎤
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3 text-center"
        >
          Dein Bundestag Wrapped
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 mb-8 text-center max-w-md"
        >
          Finde dich selbst und entdecke deine persönlichen Statistiken aus der
          21. Wahlperiode
        </motion.p>

        {/* Search Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-lg relative"
        >
          <div
            className={`relative bg-white/5 border-2 rounded-2xl transition-all duration-300 ${
              inputFocused
                ? 'border-pink-500/70 shadow-lg shadow-pink-500/20 scale-[1.02]'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Gib deinen Namen ein..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              className="w-full bg-transparent px-14 py-5 text-lg text-white placeholder:text-white/40 focus:outline-none"
              autoComplete="off"
              aria-label="Abgeordneten suchen"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                aria-label="Suche löschen"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                {filteredSpeakers.length > 0 ? (
                  <div className="py-2">
                    {filteredSpeakers.map((speaker, index) => (
                      <motion.a
                        key={speaker.slug}
                        href={`/wrapped/${speaker.slug}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium group-hover:text-pink-300 transition-colors">
                            {speaker.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                              PARTY_BG_CLASSES[speaker.party] || 'bg-gray-500'
                            }`}
                          >
                            {speaker.party}
                          </span>
                        </div>
                        <span className="text-white/40 text-sm">
                          {speaker.speeches} Reden
                        </span>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-white/60">Kein Abgeordneter gefunden</p>
                    <p className="text-white/40 text-sm mt-1">
                      Versuche einen anderen Namen
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats teaser */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-white/40 text-sm"
        >
          {speakerIndex?.speakers.length.toLocaleString('de-DE')} Abgeordnete
          verfügbar
        </motion.p>

        {/* Link to full search */}
        <MotionLink
          to="/suche?tab=speakers"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-pink-400 hover:text-pink-300 text-sm transition-colors"
        >
          Alle Abgeordneten durchsuchen →
        </MotionLink>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex justify-center gap-4 text-xs text-white/40">
          <Link
            to="/"
            className="hover:text-white/60 transition-colors pointer-events-auto"
          >
            ← Zurück
          </Link>
          <span>|</span>
          <a
            href="https://www.moritz-waechter.de/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors pointer-events-auto"
          >
            Impressum
          </a>
          <span>|</span>
          <Link
            to="/datenschutz"
            className="hover:text-white/60 transition-colors pointer-events-auto"
          >
            Datenschutz
          </Link>
        </div>
      </footer>
      </div>
    </>
  );
}
