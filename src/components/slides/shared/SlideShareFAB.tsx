import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, X } from 'lucide-react';
import {
  type SlideData,
  renderSlideSharepic,
  downloadSharepic,
  shareSharepic,
  preloadLogo,
} from '@/lib/slide-sharepics';

interface SlideShareFABProps {
  slideData: SlideData;
}

export function SlideShareFAB({ slideData }: SlideShareFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare);
  }, []);

  // Render the sharepic when modal opens and canvas is mounted
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      preloadLogo().then(() => {
        if (canvasRef.current) {
          renderSlideSharepic(canvasRef.current, slideData);
        }
      });
    }
  }, [isOpen, slideData]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const filename = `bundestag-wrapped-${slideData.type}.png`;
    downloadSharepic(canvasRef.current, filename);
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    await shareSharepic(canvasRef.current, 'Bundestag Wrapped 2025');
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
      >
        <Share2 className="w-6 h-6 text-white" />
      </motion.button>

      {/* Share Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-50 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl w-72"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Preview */}
              <div className="mb-4">
                <canvas
                  ref={canvasRef}
                  width={1080}
                  height={1080}
                  className="w-full aspect-square rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-pink-400 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Speichern
                </button>
                {canShare && (
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Teilen
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
