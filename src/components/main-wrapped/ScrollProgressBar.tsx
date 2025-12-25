import { motion } from 'motion/react';

interface ScrollProgressBarProps {
  progress: number;
  totalSlides?: number;
  visible?: boolean;
}

export function ScrollProgressBar({
  progress,
  totalSlides,
  visible = true,
}: ScrollProgressBarProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-2 pointer-events-none"
    >
      <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
        {/* Section markers */}
        {totalSlides &&
          Array.from({ length: totalSlides - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-full bg-white/20"
              style={{ left: `${((i + 1) / totalSlides) * 100}%` }}
            />
          ))}

        {/* Progress fill - smooth motion */}
        <motion.div
          className="h-full bg-gradient-to-r from-flag-schwarz via-flag-rot to-flag-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        />
      </div>
    </motion.div>
  );
}
