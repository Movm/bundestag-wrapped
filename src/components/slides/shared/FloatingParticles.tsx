import { memo, useMemo, useId } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
}

/**
 * High-performance floating particle system using CSS animations.
 *
 * Performance optimizations:
 * - Pre-computed particle data via useMemo (no recalculation on re-render)
 * - CSS @keyframes instead of JS animations (runs on compositor thread)
 * - Percentage-based positioning (SSR-safe, no window object)
 * - willChange hint for GPU acceleration
 * - prefers-reduced-motion support for accessibility
 */
export const FloatingParticles = memo(function FloatingParticles({
  count = 60,
  color = 'rgb(236 72 153 / 0.2)', // pink-500/20
  minSize = 2,
  maxSize = 6,
}: FloatingParticlesProps) {
  // Unique ID for this instance's keyframes (prevents collision)
  const instanceId = useId().replace(/:/g, '');

  // Pre-compute all particle data ONCE
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 3 + 2, // 2-5s
        delay: Math.random() * 3,
        yOffset: Math.random() * 150 + 50, // 50-200px drift
        scale: Math.random() * 0.5 + 0.5, // 0.5-1.0
      })),
    [count, minSize, maxSize]
  );

  // Generate CSS keyframes ONCE (computed on mount)
  const keyframeCSS = useMemo(
    () =>
      particles
        .map(
          (p) => `
          @keyframes float-${instanceId}-${p.id} {
            0%, 100% {
              transform: translateY(0) scale(${p.scale});
              opacity: 0;
            }
            50% {
              transform: translateY(-${p.yOffset}px) scale(${p.scale});
              opacity: 1;
            }
          }
        `
        )
        .join('\n'),
    [particles, instanceId]
  );

  // Check reduced motion preference (client-side only)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Inject keyframes - computed once, never re-rendered */}
      <style dangerouslySetInnerHTML={{ __html: keyframeCSS }} />

      {/* Render particles with CSS animations */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            animation: `float-${instanceId}-${p.id} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
});
