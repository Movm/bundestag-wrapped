import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PARTY_BG_CLASSES } from '@/lib/party-colors';
import type { Speech } from '@/lib/search-utils';

interface SpeechDetailModalProps {
  speech: Speech;
  onClose: () => void;
}

export function SpeechDetailModal({ speech, onClose }: SpeechDetailModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the currently focused element to restore on close
    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="speech-modal-title"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full sm:max-w-2xl max-h-[90vh] bg-bg-secondary border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 id="speech-modal-title" className="text-xl font-bold text-white">{speech.speaker}</h2>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                  PARTY_BG_CLASSES[speech.party] || 'bg-gray-500'
                }`}
              >
                {speech.party}
              </span>
            </div>
            <p className="text-white/50 text-sm">
              {speech.words.toLocaleString('de-DE')} Wörter · {speech.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
            aria-label="Dialog schließen"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {speech.text}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-bg-primary/50">
          <p className="text-center text-white/40 text-xs">
            Quelle: Deutscher Bundestag, 21. Wahlperiode
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
