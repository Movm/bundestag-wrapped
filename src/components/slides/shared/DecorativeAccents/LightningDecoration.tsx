import { motion } from 'motion/react';
import {
  LIGHTNING_PATH,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Lightning Decoration - Angular zigzag bolt
 *
 * Used for: drama section
 * Creates a sharp lightning bolt with fast draw animation and flash effect.
 */
export function LightningDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.lightning;
  const gradientStops = createGradientStops(colors);
  const gradientId = `lightning-gradient-${side}`;

  // Mirror for right side
  const transform = side === 'right' ? `scale(-1, 1) translate(-${width}, 0)` : undefined;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-20 md:w-28 lg:w-36 h-auto"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          {gradientStops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter id={`lightning-glow-${side}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={transform}>
        {/* Glow layer */}
        <motion.path
          d={LIGHTNING_PATH}
          stroke={`url(#${gradientId})`}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#lightning-glow-${side})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={animate ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: {
              duration: DECORATION_TIMINGS.drawDuration * 0.6,
              ease: [0.4, 0, 0.2, 1],
              delay,
            },
            opacity: { duration: 0.2, delay },
          }}
        />

        {/* Main bolt */}
        <motion.path
          d={LIGHTNING_PATH}
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: {
              duration: DECORATION_TIMINGS.drawDuration * 0.6,
              ease: [0.4, 0, 0.2, 1],
              delay,
            },
            opacity: { duration: 0.15, delay },
          }}
        />
      </g>
    </svg>
    </div>
  );
}
