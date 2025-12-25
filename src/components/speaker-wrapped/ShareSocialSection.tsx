import { memo, useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Download, Share2, RotateCcw, Users, Home } from 'lucide-react';
import type { SpeakerWrapped } from '@/data/speaker-wrapped';
import { getPartyColor } from './party-colors';
import {
  preloadLogo,
  renderSpeakerShareImage,
  downloadSpeakerShareImage,
  shareSpeakerImage,
  type SpeakerShareData,
} from '@/lib/speaker-share-canvas';

interface ShareSocialSectionProps {
  data: SpeakerWrapped;
  onRestart: () => void;
}

const CONFETTI_COLORS = ['#000000', '#DD0000', '#FFCC00'];

const MotionLink = motion.create(Link);

function toShareData(data: SpeakerWrapped, wordIndex: number): SpeakerShareData {
  const sigWord = data.words.signatureWords[wordIndex];
  return {
    name: data.name,
    party: data.party,
    spiritAnimal: data.spiritAnimal
      ? {
          emoji: data.spiritAnimal.emoji,
          name: data.spiritAnimal.name,
          title: data.spiritAnimal.title,
          reason: data.spiritAnimal.reason,
        }
      : null,
    signatureWord: sigWord
      ? {
          word: sigWord.word,
          ratioParty: sigWord.ratioParty ?? (sigWord as any).ratio ?? 0,
          ratioBundestag: sigWord.ratioBundestag ?? sigWord.ratioParty ?? 0,
        }
      : null,
  };
}

const FallingConfetti = memo(function FallingConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
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
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
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

export const ShareSocialSection = memo(function ShareSocialSection({
  data,
  onRestart,
}: ShareSocialSectionProps) {
  const [canShare, setCanShare] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partyColor = getPartyColor(data.party);
  const signatureWords = data.words.signatureWords;

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare);
  }, []);

  useEffect(() => {
    preloadLogo().then(() => {
      if (canvasRef.current) {
        renderSpeakerShareImage(canvasRef.current, toShareData(data, selectedWordIndex));
      }
    });
  }, [data, selectedWordIndex]);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <FallingConfetti />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-12"
      >
        {/* Left: Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0 lg:flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl mb-6 lg:mb-0"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '1 / 1' }}
            aria-label={`Sharepic für ${data.name}`}
          />
        </motion.div>

        {/* Right: Controls */}
        <div className="flex-1 text-center lg:text-left">
          <motion.span
            className="text-6xl block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            📸
          </motion.span>

          <h2 className="text-3xl font-black text-white mb-2">
            Teile dein Ergebnis!
          </h2>
          <p className="text-white/60 mb-6">
            Erstelle dein persönliches Sharepic
          </p>

          {signatureWords.length > 1 && (
            <div className="mb-6">
              <p className="text-white/50 text-sm mb-2">Wähle dein Signaturwort:</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {signatureWords.map((word, index) => (
                  <button
                    key={word.word}
                    onClick={() => setSelectedWordIndex(index)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: index === selectedWordIndex ? partyColor : 'rgba(255,255,255,0.1)',
                      color: index === selectedWordIndex ? 'white' : 'rgba(255,255,255,0.7)',
                      border: index === selectedWordIndex ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {word.word} {word.ratioParty.toFixed(1)}×
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
            <motion.button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 rounded-full text-white font-bold shadow-lg shadow-pink-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} aria-hidden="true" />
              Speichern
            </motion.button>

            {canShare && (
              <motion.button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-bold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} aria-hidden="true" />
                Teilen
              </motion.button>
            )}
          </div>

          <div className="flex justify-center lg:justify-start gap-3">
            <motion.button
              onClick={onRestart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: partyColor }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Nochmal ansehen"
            >
              <RotateCcw size={20} aria-hidden="true" />
            </motion.button>
            <MotionLink
              to="/abgeordnete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Andere Abgeordnete anzeigen"
            >
              <Users size={20} aria-hidden="true" />
            </MotionLink>
            <MotionLink
              to="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Zur Startseite"
            >
              <Home size={20} aria-hidden="true" />
            </MotionLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
});
