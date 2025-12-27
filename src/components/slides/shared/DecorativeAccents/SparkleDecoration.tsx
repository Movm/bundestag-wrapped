import { motion } from 'motion/react';
import {
  SPARKLE_PATH,
  SPARKLE_POSITIONS,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  rgbToHex,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Sparkle Decoration - Four-point stars
 *
 * Used for: swiftie section
 * Creates scattered sparkle/star shapes with pop and rotation animations.
 */
export function SparkleDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.sparkle;
  const primaryColor = rgbToHex(colors.primary);
  const glowColor = rgbToHex(colors.glow);

  // Mirror for right side
  const containerTransform = side === 'right' ? `scale(-1, 1) translate(-${width}, 0)` : undefined;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-24 md:w-32 lg:w-40 h-auto"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`sparkle-glow-${side}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={containerTransform}>
        {SPARKLE_POSITIONS.map((pos, i) => (
          <motion.g
            key={i}
            transform={`translate(${pos.x}, ${pos.y})`}
            initial={{ scale: 0, opacity: 0, rotate: pos.rotation - 30 }}
            animate={
              animate
                ? {
                    scale: pos.scale,
                    opacity: 1,
                    rotate: pos.rotation,
                  }
                : { scale: 0, opacity: 0, rotate: pos.rotation - 30 }
            }
            transition={{
              scale: {
                type: 'spring',
                stiffness: 300,
                damping: 15,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay * 1.2,
              },
              opacity: {
                duration: DECORATION_TIMINGS.fadeInDuration,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay * 1.2,
              },
              rotate: {
                type: 'spring',
                stiffness: 150,
                damping: 12,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay * 1.2,
              },
            }}
          >
            {/* Glow layer */}
            <path
              d={SPARKLE_PATH}
              fill={glowColor}
              filter={`url(#sparkle-glow-${side})`}
              opacity={0.6}
            />
            {/* Main star */}
            <path d={SPARKLE_PATH} fill={primaryColor} />
          </motion.g>
        ))}
      </g>
    </svg>
    </div>
  );
}
