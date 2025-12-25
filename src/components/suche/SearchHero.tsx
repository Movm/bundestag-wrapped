import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import type { SearchState } from '@/hooks/useSearchState';

interface SearchHeroProps {
  state: SearchState;
  updateState: (updates: Partial<SearchState>) => void;
}

const SUGGESTION_TERMS = ['Klimaschutz', 'Migration', 'Digitalisierung', 'Rente', 'Bildung', 'Energie'];

export function SearchHero({ state, updateState }: SearchHeroProps) {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 pb-20"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
      >
        🏛️
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-white mb-3 text-center"
      >
        Bundestag Suche
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/50 mb-8 text-center"
      >
        Durchsuche alle Reden der 21. Wahlperiode
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl mb-6"
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
            placeholder="Suche nach Themen, Redner:innen, Parteien..."
            value={state.q}
            onChange={(e) => updateState({ q: e.target.value })}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="w-full bg-transparent px-14 py-5 text-lg text-white placeholder:text-white/40 focus:outline-none"
            aria-label="Suche nach Themen, Redner:innen oder Parteien"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 mb-10"
        role="tablist"
        aria-label="Suchmodus"
      >
        <button
          role="tab"
          aria-selected={state.tab === 'speeches'}
          onClick={() => updateState({ tab: 'speeches' })}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            state.tab === 'speeches'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <span aria-hidden="true">🎤 </span>Reden
        </button>
        <button
          role="tab"
          aria-selected={state.tab === 'speakers'}
          onClick={() => updateState({ tab: 'speakers' })}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            state.tab === 'speakers'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <span aria-hidden="true">👥 </span>Abgeordnete
        </button>
        <button
          role="tab"
          aria-selected={state.tab === 'words'}
          onClick={() => updateState({ tab: 'words' })}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            state.tab === 'words'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <span aria-hidden="true">📊 </span>Wörter
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-white/40 text-sm mb-4">Probiere es mit:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTION_TERMS.map((term, i) => (
            <motion.button
              key={term}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              onClick={() => updateState({ q: term })}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/70 hover:text-white text-sm transition-all"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex justify-center gap-4 text-xs text-white/40">
          <Link to="/" className="hover:text-white/60 transition-colors pointer-events-auto">
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
          <Link to="/datenschutz" className="hover:text-white/60 transition-colors pointer-events-auto">
            Datenschutz
          </Link>
        </div>
      </footer>
    </motion.div>
  );
}
