/**
 * AbstractParticles - CSS-animated abstract shapes for immersive intro slides
 *
 * Performance optimizations:
 * - Pure CSS keyframe animations (no JS animation loop)
 * - GPU-accelerated transforms only (translate3d, scale, rotate)
 * - will-change: transform for compositor layer promotion
 * - Particles only render when slide is in view
 * - Max 8-12 particles per slide
 */

import { memo, useMemo } from 'react';
import { getBackgroundTheme, getThemeConfig } from '@/shared/theme-backgrounds/types';
import { getThemeParticles, type ParticleConfig, type ParticleShape } from '@/shared/decorations/particles';
import './particles.css';

interface AbstractParticlesProps {
  /** Slide ID for themed particle selection */
  slideId?: string;
  /** Whether particles are visible (controlled by parent's useInView) */
  isInView?: boolean;
}

/**
 * Render a single particle shape using CSS
 */
function ParticleShape({ shape, size, color }: { shape: ParticleShape; size: number; color: string }) {
  const baseStyle = {
    width: size,
    height: size,
    backgroundColor: `rgba(${color}, 1)`,
    boxShadow: `0 0 ${size * 2}px rgba(${color}, 0.6)`,
  };

  switch (shape) {
    case 'circle':
    case 'dot':
      return (
        <div
          style={{
            ...baseStyle,
            borderRadius: '50%',
          }}
        />
      );

    case 'diamond':
      return (
        <div
          style={{
            ...baseStyle,
            transform: 'rotate(45deg)',
            borderRadius: size * 0.15,
          }}
        />
      );

    case 'square':
      return (
        <div
          style={{
            ...baseStyle,
            borderRadius: size * 0.2,
          }}
        />
      );

    case 'ring':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `2px solid rgba(${color}, 1)`,
            backgroundColor: 'transparent',
            boxShadow: `0 0 ${size}px rgba(${color}, 0.4), inset 0 0 ${size / 2}px rgba(${color}, 0.2)`,
          }}
        />
      );

    case 'droplet':
      return (
        <div
          style={{
            width: size,
            height: size * 1.4,
            backgroundColor: `rgba(${color}, 1)`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            boxShadow: `0 0 ${size}px rgba(${color}, 0.5)`,
          }}
        />
      );

    default:
      return (
        <div
          style={{
            ...baseStyle,
            borderRadius: '50%',
          }}
        />
      );
  }
}

/**
 * Single particle with its animation
 */
const Particle = memo(function Particle({
  config,
  color,
  index,
}: {
  config: ParticleConfig;
  color: string;
  index: number;
}) {
  const animationClass = `particle-${config.animation}`;

  return (
    <div
      className={`absolute ${animationClass}`}
      style={{
        left: `${config.x}%`,
        top: `${config.y}%`,
        opacity: config.opacity,
        animationDuration: `${config.duration}s`,
        animationDelay: `${config.delay}s`,
        willChange: 'transform, opacity',
        // Unique key in animation name prevents all particles from syncing
        animationName: `${config.animation}-${index % 3}`,
      }}
    >
      <ParticleShape shape={config.shape} size={config.size} color={color} />
    </div>
  );
});

/**
 * Abstract floating particles for intro slides.
 * Uses pure CSS animations for optimal performance.
 */
export const AbstractParticles = memo(function AbstractParticles({
  slideId,
  isInView = true,
}: AbstractParticlesProps) {
  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Get theme and particle config
  const theme = getBackgroundTheme(slideId || 'intro');
  const themeConfig = getThemeConfig(slideId || 'intro');
  const particleConfig = getThemeParticles(theme);

  // Memoize particles to prevent re-renders
  const particles = useMemo(() => particleConfig.particles, [particleConfig.particles]);

  // Don't render if reduced motion, particles disabled, or not in view
  if (prefersReducedMotion || !particleConfig.enabled || !isInView) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle, index) => (
        <Particle
          key={`${theme}-particle-${index}`}
          config={particle}
          color={themeConfig.colors.primary}
          index={index}
        />
      ))}
    </div>
  );
});
