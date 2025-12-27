import { motion } from 'motion/react';
import {
  RIBBON_PATH,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Ribbon Decoration - Flowing S-curve
 *
 * Used for: tone section
 * Creates a smooth, ribbon-like decorative element with a draw-in animation.
 */
export function RibbonDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.ribbon;
  const gradientStops = createGradientStops(colors);
  const gradientId = `ribbon-gradient-${side}`;

  // Mirror the SVG for the right side
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
      </defs>

      <motion.path
        d={RIBBON_PATH}
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={transform}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: {
            duration: DECORATION_TIMINGS.drawDuration,
            ease: DECORATION_TIMINGS.drawEasing,
            delay,
          },
          opacity: { duration: DECORATION_TIMINGS.fadeInDuration, delay },
        }}
      />
    </svg>
    </div>
  );
}
