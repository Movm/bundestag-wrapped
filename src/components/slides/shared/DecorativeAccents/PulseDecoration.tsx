import { motion } from 'motion/react';
import {
  PULSE_CIRCLES,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Pulse Decoration - Concentric circles
 *
 * Used for: topics section
 * Creates radiating concentric rings with staggered draw animations.
 */
export function PulseDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.pulse;
  const gradientStops = createGradientStops(colors);
  const gradientId = `pulse-gradient-${side}`;

  // Offset position based on side
  const translateX = side === 'right' ? 20 : -20;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-28 md:w-36 lg:w-44 h-auto"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {gradientStops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>

      <g transform={`translate(${translateX}, 0)`}>
        {PULSE_CIRCLES.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            stroke={`url(#${gradientId})`}
            strokeWidth={10 - i * 2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animate ? { pathLength: 1, opacity: 1 - i * 0.2 } : { pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: {
                duration: DECORATION_TIMINGS.drawDuration * 0.8,
                ease: DECORATION_TIMINGS.drawEasing,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay * 1.5,
              },
              opacity: {
                duration: DECORATION_TIMINGS.fadeInDuration,
                delay: delay + i * DECORATION_TIMINGS.staggerDelay * 1.5,
              },
            }}
          />
        ))}
      </g>
    </svg>
    </div>
  );
}
