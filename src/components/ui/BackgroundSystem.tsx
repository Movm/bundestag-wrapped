import { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BackgroundContrails, ContrailGradients } from './Contrails';
import { FloatingParticles } from '@/components/slides/shared/FloatingParticles';
import type { SparklesConfig } from '@/components/slides/shared/SlideContainer';

type Intensity = 'subtle' | 'medium' | 'vibrant';

// 8 parallax speeds for contrails (different depths)
const PARALLAX_SPEEDS = ['-20%', '-35%', '-50%', '-28%', '-42%', '-32%', '-45%', '-25%'] as const;

interface BackgroundSystemProps {
  intensity?: Intensity;
  scrollContainer?: HTMLDivElement | null;
  sparkles?: boolean | SparklesConfig;
}

/**
 * Contrail Background System
 *
 * Renders 8 diagonal contrails across the viewport,
 * creating a bold, cohesive visual signature.
 * Each contrail drifts independently with organic movement.
 *
 * - subtle: 0.5x opacity, minimal animation
 * - medium: 1.0x opacity, organic floating movement
 * - vibrant: 1.5x opacity, enhanced movement + breathing
 */
export function BackgroundSystem({ intensity = 'medium', scrollContainer, sparkles }: BackgroundSystemProps) {
  const prefersReducedMotion = useReducedMotion();

  // Create a ref wrapper for the scroll container
  const containerRef = useRef<HTMLDivElement | null>(null);
  containerRef.current = scrollContainer ?? null;

  // Track scroll progress through all slides
  const { scrollYProgress } = useScroll({
    container: scrollContainer ? containerRef : undefined,
  });

  // Create parallax transforms for each contrail
  const parallaxTransforms = PARALLAX_SPEEDS.map((speed) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, [0, 1], ['0%', speed])
  );

  // Map intensity to contrail intensity
  const contrailIntensity = intensity === 'subtle' ? 'subtle' : intensity === 'vibrant' ? 'bold' : 'medium';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* SVG gradient definitions (render once) */}
      <ContrailGradients />

      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
        }}
      />

      {/* 8 Contrails with parallax */}
      {!prefersReducedMotion && (
        <BackgroundContrails
          intensity={contrailIntensity}
          parallaxY={parallaxTransforms}
        />
      )}

      {/* Static fallback for reduced motion */}
      {prefersReducedMotion && (
        <BackgroundContrails intensity="subtle" />
      )}

      {/* Sparkles layer - fixed positioning to ensure full viewport coverage */}
      {sparkles && !prefersReducedMotion && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <FloatingParticles
            {...(typeof sparkles === 'object' ? sparkles : {})}
          />
        </div>
      )}
    </div>
  );
}
