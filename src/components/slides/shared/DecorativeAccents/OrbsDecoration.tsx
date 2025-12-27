import { motion } from 'motion/react';
import {
  ORB_CIRCLES,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Orbs Decoration - Overlapping soft circles
 *
 * Used for: common-words section
 * Creates bubble-like overlapping circles with scale and float animations.
 */
export function OrbsDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.orbs;
  const gradientStops = createGradientStops(colors);
  const gradientId = `orbs-gradient-${side}`;

  // Mirror for right side
  const transform = side === 'right' ? `scale(-1, 1) translate(-${width}, 0)` : undefined;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-24 md:w-32 lg:w-40 h-auto"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {gradientStops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter id={`orbs-blur-${side}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <g transform={transform}>
        {ORB_CIRCLES.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            stroke={`url(#${gradientId})`}
            strokeWidth={8 - i}
            strokeLinecap="round"
            fill="none"
            filter={`url(#orbs-blur-${side})`}
            initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={
              animate
                ? {
                    pathLength: 1,
                    opacity: 0.9 - i * 0.1,
                    scale: 1,
                  }
                : { pathLength: 0, opacity: 0, scale: 0.8 }
            }
            transition={{
              pathLength: {
                duration: DECORATION_TIMINGS.drawDuration * 0.8,
                ease: DECORATION_TIMINGS.drawEasing,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay,
              },
              opacity: {
                duration: DECORATION_TIMINGS.fadeInDuration,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay,
              },
              scale: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay,
              },
            }}
          />
        ))}
      </g>
    </svg>
    </div>
  );
}
