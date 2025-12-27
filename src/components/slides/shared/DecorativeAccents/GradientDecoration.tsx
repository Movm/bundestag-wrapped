import { motion } from 'motion/react';
import {
  GRADIENT_LINES,
  DECORATION_VIEWBOX,
  rgbToHex,
  type DecorationProps,
} from '@/shared/decorations/paths';

/**
 * Gradient Decoration - Subtle horizontal lines
 *
 * Used for: discriminatory section
 * Creates minimal, muted horizontal lines with slow fade-in.
 * Designed to be understated for the serious topic.
 */
export function GradientDecoration({
  colors,
  delay = 0,
  animate = true,
  side,
  scale = 1,
}: DecorationProps) {
  const { width, height } = DECORATION_VIEWBOX.gradient;
  const primaryColor = rgbToHex(colors.primary);
  const secondaryColor = rgbToHex(colors.secondary);

  // Offset position based on side
  const offsetX = side === 'right' ? 10 : 0;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: side === 'left' ? 'left center' : 'right center' }}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-20 md:w-28 lg:w-36 h-auto"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gradient-line-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
          <stop offset="30%" stopColor={primaryColor} />
          <stop offset="70%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform={`translate(${offsetX}, 0)`}>
        {GRADIENT_LINES.map((line, i) => (
          <motion.line
            key={i}
            x1={10}
            y1={line.y}
            x2={10 + line.width}
            y2={line.y}
            stroke={`url(#gradient-line-${side})`}
            strokeWidth={4}
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={
              animate
                ? { opacity: line.opacity, pathLength: 1 }
                : { opacity: 0, pathLength: 0 }
            }
            transition={{
              opacity: {
                duration: 1.5,
                delay: delay + i * 0.3,
              },
              pathLength: {
                duration: 2,
                ease: [0.4, 0, 0.2, 1],
                delay: delay + i * 0.3,
              },
            }}
          />
        ))}
      </g>
    </svg>
    </div>
  );
}
