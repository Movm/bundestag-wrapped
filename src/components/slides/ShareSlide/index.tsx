import { memo, useState, useRef, useEffect, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import { Download, Share2 } from 'lucide-react';
import { SlideContainer, itemVariants } from '../shared';
import { renderShareImage, downloadShareImage, shareImage, preloadLogo } from '@/lib/share-canvas';

interface ShareSlideProps {
  correctCount: number;
  totalQuestions: number;
}

const CONFETTI_COLORS = ['#000000', '#DD0000', '#FFCC00'];

const FallingConfetti = memo(function FallingConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * 3)],
        rotate: Math.random() * 720 - 360,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 md:w-3 md:h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            willChange: 'transform',
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

export const ShareSlide = memo(function ShareSlide({
  correctCount,
  totalQuestions,
}: ShareSlideProps) {
  const [userName, setUserName] = useState('');
  const [canShare, setCanShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Defer canvas rendering until slide is visible (saves 62ms on initial load)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare);
  }, []);

  useEffect(() => {
    // Only render when slide becomes visible
    if (!isInView) return;

    preloadLogo().then(() => {
      if (canvasRef.current) {
        renderShareImage(canvasRef.current, {
          correctCount,
          totalQuestions,
          userName: userName.trim() || undefined,
        });
      }
    });
  }, [correctCount, totalQuestions, userName, isInView]);

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

  return (
    <div ref={containerRef}>
      <SlideContainer
        innerClassName="max-w-md md:max-w-5xl mx-auto"
        className="relative overflow-hidden"
      >
        <FallingConfetti />

      {/* Grid layout: stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left column: Header, Input, Buttons */}
        <div className="text-center md:text-left order-1">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.span
              className="text-6xl md:text-7xl block"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              📸
            </motion.span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-black gradient-text mb-3"
          >
            Teile dein Ergebnis!
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-white/60 text-base md:text-lg mb-8"
          >
            Erstelle dein persönliches Sharepic
          </motion.p>

          {/* Name Input */}
          <motion.div variants={itemVariants} className="mb-6">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Dein Name (optional)"
              maxLength={30}
              className="w-full max-w-sm mx-auto md:mx-0 px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-xl md:text-2xl text-center md:text-left placeholder-white/30 focus:outline-none focus:border-pink-500/60 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all"
            />
          </motion.div>

          {/* Action Buttons - icon-only on mobile, full buttons on desktop */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-start gap-3 md:gap-4"
          >
            <motion.button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 p-4 md:px-8 md:py-4 bg-gradient-to-r from-pink-600 to-pink-500 rounded-full text-white font-bold text-lg shadow-lg shadow-pink-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Speichern"
            >
              <Download size={22} />
              <span className="hidden md:inline">Speichern</span>
            </motion.button>

            {canShare && (
              <motion.button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 p-4 md:px-8 md:py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-bold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Teilen"
              >
                <Share2 size={22} />
                <span className="hidden md:inline">Teilen</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Right column: Canvas Preview */}
        <motion.div
          variants={itemVariants}
          className="order-2 rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl max-w-xs md:max-w-sm mx-auto md:mx-0 md:ml-auto"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '1 / 1' }}
          />
        </motion.div>
      </div>
      </SlideContainer>
    </div>
  );
});
