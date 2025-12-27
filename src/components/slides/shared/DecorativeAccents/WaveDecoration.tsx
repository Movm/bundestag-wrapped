import { motion } from 'motion/react';
import {
  WAVE_PATHS,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Wave Decoration - Flowing horizontal waves
 *
 * Used for: vocabulary, moin sections
 * Creates stacked wave lines with staggered draw-in animations.
 */
export function WaveDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.wave;
  const gradientStops = createGradientStops(colors);
  const gradientId = `wave-gradient-${side}`;

  // Mirror the SVG for the right side
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
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {gradientStops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>

      <g transform={transform}>
        {WAVE_PATHS.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke={`url(#${gradientId})`}
            strokeWidth={10 - i * 1.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: {
                duration: DECORATION_TIMINGS.drawDuration * 0.9,
                ease: DECORATION_TIMINGS.drawEasing,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay,
              },
              opacity: {
                duration: DECORATION_TIMINGS.fadeInDuration,
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
