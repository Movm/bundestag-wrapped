import { motion } from 'motion/react';
import {
  BAR_CONFIGS,
  DECORATION_VIEWBOX,
  DECORATION_TIMINGS,
  createGradientStops,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Bars Decoration - Vertical equalizer bars
 *
 * Used for: speeches section
 * Creates rising bar elements like an audio visualizer.
 */
export function BarsDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.bars;
  const gradientStops = createGradientStops(colors);
  const gradientId = `bars-gradient-${side}`;

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
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
          {gradientStops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>

      <g transform={transform}>
        {BAR_CONFIGS.map((bar, i) => (
          <motion.rect
            key={i}
            x={bar.x}
            y={height - bar.height}
            width={bar.width || 16}
            height={bar.height}
            rx={8}
            fill={`url(#${gradientId})`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={animate ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            style={{ originY: '100%', transformBox: 'fill-box' }}
            transition={{
              scaleY: {
                type: 'spring',
                stiffness: 150,
                damping: 15,
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
