import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { playSound } from '@/lib/sounds';

interface FlipCardProps {
  /** Content shown on the front (initial) side */
  front: ReactNode;
  /** Content shown on the back (flipped) side */
  back: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Width/height of the card (CSS value) */
  size?: string;
  /** Whether to scale up slightly on hover (default: true) */
  hoverScale?: boolean;
}

/**
 * A 3D flip card component that shows front content initially,
 * and flips to show back content on hover (desktop) or tap (mobile).
 */
export function FlipCard({
  front,
  back,
  className = '',
  size,
  hoverScale = true,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const handleTouchStart = () => {
    setIsTouchDevice(true);
    setIsFlipped((prev) => !prev);
    playSound('click');
  };

  const handleHoverStart = () => {
    if (!isTouchDevice) {
      setIsFlipped(true);
      playSound('click');
    }
  };

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
      onTouchStart={handleTouchStart}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => !isTouchDevice && setIsFlipped(false)}
      whileHover={hoverScale && !isTouchDevice ? { scale: 1.03 } : undefined}
      className={`cursor-pointer relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        width: size,
        height: size,
      }}
    >
      {/* Front face */}
      <div
        className="absolute inset-0"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {front}
      </div>

      {/* Back face (pre-rotated 180deg) */}
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        {back}
      </div>
    </motion.div>
  );
}
