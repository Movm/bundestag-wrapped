import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, X } from 'lucide-react';
import { renderShareImage, downloadShareImage, shareImage } from '@/lib/share-canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctCount: number;
  totalQuestions: number;
}

export function ShareModal({ isOpen, onClose, correctCount, totalQuestions }: ShareModalProps) {
  const [userName, setUserName] = useState('');
  const [canShare, setCanShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare);
  }, []);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderShareImage(canvasRef.current, {
        correctCount,
        totalQuestions,
        userName: userName.trim() || undefined,
      });
    }
  }, [isOpen, correctCount, totalQuestions, userName]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadShareImage(canvasRef.current, userName);
    }
  };

  const handleShare = async () => {
    if (canvasRef.current) {
      await shareImage(canvasRef.current);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0f] rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Teile dein Ergebnis!
            </h2>
            <p className="text-white/60 text-sm mb-6 text-center">
              Erstelle ein Bild für Social Media
            </p>

            {/* Name Input */}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Dein Name (optional)"
              maxLength={30}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-center focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all mb-4"
            />

            {/* Canvas Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
                style={{ aspectRatio: '1 / 1' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} />
                Speichern
              </motion.button>

              {canShare && (
                <motion.button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-bold"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={20} />
                  Teilen
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
