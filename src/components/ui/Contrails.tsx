import { memo, useMemo } from 'react';
import { motion, type MotionValue } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

// Default colors (pink/purple) for backwards compatibility
const DEFAULT_COLORS: ThemeColors = {
  primary: '236, 72, 153',    // pink-500
  secondary: '168, 85, 247',  // purple-500
  accent: '255, 255, 255',    // white
  glow: '244, 114, 182',      // pink-400
};

interface ContrailGradientsProps {
  colors?: ThemeColors;
  id?: string;
}

// Shared gradient definitions - render once, reference by ID
export const ContrailGradients = memo(function ContrailGradients({
  colors = DEFAULT_COLORS,
  id = 'contrail',
}: ContrailGradientsProps) {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Main contrail gradient - white core fading to primary/secondary */}
        <linearGradient id={`${id}-gradient-vertical`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${colors.accent})`} stopOpacity="1" />
          <stop offset="5%" stopColor={`rgb(${colors.glow})`} stopOpacity="0.95" />
          <stop offset="20%" stopColor={`rgb(${colors.primary})`} stopOpacity="0.8" />
          <stop offset="50%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0.4" />
          <stop offset="80%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0.15" />
          <stop offset="100%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0" />
        </linearGradient>

        {/* Outer glow gradient */}
        <linearGradient id={`${id}-glow-vertical`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${colors.primary})`} stopOpacity="0.6" />
          <stop offset="30%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0.3" />
          <stop offset="100%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0" />
        </linearGradient>

        {/* Diagonal gradient (for background drifting) */}
        <linearGradient id={`${id}-gradient-diagonal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${colors.accent})`} stopOpacity="0" />
          <stop offset="10%" stopColor={`rgb(${colors.glow})`} stopOpacity="0.6" />
          <stop offset="30%" stopColor={`rgb(${colors.primary})`} stopOpacity="0.4" />
          <stop offset="60%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0.2" />
          <stop offset="100%" stopColor={`rgb(${colors.secondary})`} stopOpacity="0" />
        </linearGradient>

        {/* Intense glow filter for dramatic effects */}
        <filter id={`${id}-glow-filter`} x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle glow for background contrails */}
        <filter id={`${id}-glow-subtle`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
});

// Background contrail configuration
interface ContrailConfig {
  x: string;          // CSS left position
  length: string;     // CSS height
  angle: number;      // Rotation in degrees
  width: number;      // Stroke width
  opacity: number;    // Base opacity
  delay: number;      // Animation delay
  duration: number;   // Float cycle duration
}

// 8 contrails distributed across viewport
const BACKGROUND_CONTRAILS: ContrailConfig[] = [
  { x: '12%', length: '45%', angle: 35, width: 4, opacity: 0.25, delay: 0, duration: 12 },
  { x: '25%', length: '55%', angle: 42, width: 6, opacity: 0.3, delay: 1.5, duration: 15 },
  { x: '38%', length: '40%', angle: 38, width: 3, opacity: 0.2, delay: 0.8, duration: 11 },
  { x: '52%', length: '60%', angle: 45, width: 5, opacity: 0.28, delay: 2.2, duration: 14 },
  { x: '65%', length: '50%', angle: 40, width: 4, opacity: 0.22, delay: 1.2, duration: 13 },
  { x: '78%', length: '48%', angle: 36, width: 5, opacity: 0.26, delay: 0.5, duration: 16 },
  { x: '88%', length: '42%', angle: 43, width: 3, opacity: 0.18, delay: 2.8, duration: 12 },
  { x: '95%', length: '35%', angle: 39, width: 4, opacity: 0.15, delay: 1.8, duration: 14 },
];

interface BackgroundContrailsProps {
  intensity?: 'subtle' | 'medium' | 'bold';
  parallaxY?: MotionValue<string>[];
  colors?: ThemeColors;
}

/**
 * Background contrails that replace the pillar system.
 * 8 diagonal streaks with organic floating animation.
 */
export const BackgroundContrails = memo(function BackgroundContrails({
  intensity = 'medium',
  parallaxY,
  colors = DEFAULT_COLORS,
}: BackgroundContrailsProps) {
  const intensityMultiplier = intensity === 'subtle' ? 0.5 : intensity === 'bold' ? 1.5 : 1;

  const contrails = useMemo(() => {
    return BACKGROUND_CONTRAILS.map((config, index) => ({
      ...config,
      opacity: config.opacity * intensityMultiplier,
      parallaxY: parallaxY?.[index % parallaxY.length],
    }));
  }, [intensityMultiplier, parallaxY]);

  return (
    <>
      {contrails.map((config, index) => (
        <motion.div
          key={`contrail-${index}`}
          className="absolute will-change-transform"
          style={{
            left: config.x,
            top: '10%',
            height: config.length,
            width: config.width + 20, // Extra width for glow
            transform: `rotate(${config.angle}deg)`,
            transformOrigin: 'top center',
            y: config.parallaxY,
          }}
          animate={{
            opacity: [config.opacity, config.opacity * 1.3, config.opacity],
            x: [0, 8, -5, 0],
            scaleY: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Outer glow layer */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(${colors.primary}, ${config.opacity * 0.4}) 15%,
                rgba(${colors.secondary}, ${config.opacity * 0.3}) 50%,
                rgba(${colors.secondary}, ${config.opacity * 0.15}) 85%,
                transparent 100%)`,
              filter: 'blur(8px)',
              width: config.width + 16,
              marginLeft: -8,
            }}
          />
          {/* Core line */}
          <div
            className="absolute"
            style={{
              left: '50%',
              marginLeft: -config.width / 2,
              width: config.width,
              height: '100%',
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(${colors.accent}, ${config.opacity * 0.8}) 5%,
                rgba(${colors.glow}, ${config.opacity}) 15%,
                rgba(${colors.primary}, ${config.opacity * 0.7}) 40%,
                rgba(${colors.secondary}, ${config.opacity * 0.3}) 70%,
                transparent 100%)`,
              borderRadius: 2,
            }}
          />
        </motion.div>
      ))}
    </>
  );
});

interface LaunchContrailsProps {
  duration?: number;
}

/**
 * Dramatic launch contrails for the bird takeoff.
 * Bold, bright trails shooting upward.
 */
export const LaunchContrails = memo(function LaunchContrails({
  duration = 1.2,
}: LaunchContrailsProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      {/* Left outer glow trail */}
      <motion.line
        x1="50%"
        y1="50%"
        x2="44%"
        y2="100%"
        stroke="url(#contrail-glow-vertical)"
        strokeWidth="24"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0.2, 0] }}
        transition={{
          duration,
          ease: [0.15, 0.8, 0.3, 1],
          opacity: { times: [0, 0.1, 0.4, 0.75, 1], duration },
        }}
      />

      {/* Left main contrail */}
      <motion.line
        x1="50%"
        y1="50%"
        x2="46%"
        y2="100%"
        stroke="url(#contrail-gradient-vertical)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#contrail-glow-filter)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0.5, 0] }}
        transition={{
          duration,
          ease: [0.15, 0.8, 0.3, 1],
          opacity: { times: [0, 0.05, 0.4, 0.75, 1], duration },
        }}
      />

      {/* Right outer glow trail */}
      <motion.line
        x1="50%"
        y1="50%"
        x2="56%"
        y2="100%"
        stroke="url(#contrail-glow-vertical)"
        strokeWidth="24"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0.2, 0] }}
        transition={{
          duration,
          ease: [0.15, 0.8, 0.3, 1],
          opacity: { times: [0, 0.1, 0.4, 0.75, 1], duration },
        }}
      />

      {/* Right main contrail */}
      <motion.line
        x1="50%"
        y1="50%"
        x2="54%"
        y2="100%"
        stroke="url(#contrail-gradient-vertical)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#contrail-glow-filter)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0.5, 0] }}
        transition={{
          duration,
          ease: [0.15, 0.8, 0.3, 1],
          opacity: { times: [0, 0.05, 0.4, 0.75, 1], duration },
        }}
      />

      {/* Center bright core trail */}
      <motion.line
        x1="50%"
        y1="50%"
        x2="50%"
        y2="100%"
        stroke="url(#contrail-gradient-vertical)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#contrail-glow-filter)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.8, 0.8, 0.3, 0] }}
        transition={{
          duration,
          delay: 0.03,
          ease: [0.15, 0.8, 0.3, 1],
          opacity: { times: [0, 0.05, 0.4, 0.75, 1], duration },
        }}
      />
    </svg>
  );
});
