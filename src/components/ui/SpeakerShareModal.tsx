import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, X } from 'lucide-react';
import {
  renderSpeakerShareImage,
  downloadSpeakerShareImage,
  shareSpeakerImage,
  type SpeakerShareData,
} from '@/lib/speaker-share-canvas';

interface SpeakerShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SpeakerShareData;
}

export function SpeakerShareModal({ isOpen, onClose, data }: SpeakerShareModalProps) {
  const [canShare, setCanShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare);
  }, []);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderSpeakerShareImage(canvasRef.current, data);
    }
  }, [isOpen, data]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadSpeakerShareImage(canvasRef.current, data.name);
    }
  };

  const handleShare = async () => {
    if (canvasRef.current) {
      await shareSpeakerImage(canvasRef.current, data.name);
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
            className="relative w-full max-w-md modal-bg rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Teile das Ergebnis!
            </h2>
            <p className="text-white/60 text-sm mb-6 text-center">
              {data.name}'s Bundestag Wrapped
            </p>

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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full text-white font-bold"
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
