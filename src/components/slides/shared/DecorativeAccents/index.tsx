import { memo, useRef } from 'react';
import { useInView } from 'motion/react';
import { getThemeConfig, type EffectType } from '@/shared/theme-backgrounds/types';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

// Decoration components
import { RibbonDecoration } from './RibbonDecoration';
import { WaveDecoration } from './WaveDecoration';
import { BarsDecoration } from './BarsDecoration';
import { LightningDecoration } from './LightningDecoration';
import { PulseDecoration } from './PulseDecoration';
import { OrbsDecoration } from './OrbsDecoration';
import { SparkleDecoration } from './SparkleDecoration';
import { GradientDecoration } from './GradientDecoration';

interface DecorativeAccentsProps {
  /** Slide ID for themed decoration selection */
  slideId?: string;
  /** Delay before animations start (seconds) */
  delay?: number;
  /** Scale multiplier for larger decorations (default: 1) */
  scale?: number;
}

// Map effect types to decoration components
const EFFECT_TO_DECORATION: Record<EffectType, React.ComponentType<{
  colors: ThemeColors;
  delay?: number;
  animate?: boolean;
  side: 'left' | 'right';
  scale?: number;
}>> = {
  contrails: RibbonDecoration,
  pulse: PulseDecoration,
  waves: WaveDecoration,
  bars: BarsDecoration,
  lightning: LightningDecoration,
  gradient: GradientDecoration,
  orbs: OrbsDecoration,
  stripes: WaveDecoration,      // Use waves for stripes
  sparkles: SparkleDecoration,
  ribbons: RibbonDecoration,
  grid: PulseDecoration,        // Use pulse for grid
  rays: SparkleDecoration,      // Use sparkles for rays
};

/**
 * Decorative accent elements for section intro slides.
 *
 * Displays theme-appropriate decorations on both sides of the viewport.
 * The decoration type and colors are determined by the slideId.
 *
 * When no slideId is provided, falls back to the default ribbon decoration
 * with intro theme colors.
 */
export const DecorativeAccents = memo(function DecorativeAccents({
  slideId,
  delay = 0,
  scale = 1,
}: DecorativeAccentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <div ref={ref} className="absolute inset-0" />;
  }

  // Get theme configuration for the slide
  const config = getThemeConfig(slideId || 'intro');
  const DecorationComponent = EFFECT_TO_DECORATION[config.effectType] || RibbonDecoration;

  return (
    <>
      {/* Invisible anchor to detect when this slide is in view */}
      <div ref={ref} className="absolute inset-0 pointer-events-none" />

      {/* Fixed positioned decorations - only visible when in view */}
      {isInView && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          {/* Left decoration - at viewport edge, vertically centered */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 opacity-80">
            <DecorationComponent
              colors={config.colors}
              side="left"
              delay={delay}
              animate={isInView}
              scale={scale}
            />
          </div>

          {/* Right decoration - at viewport edge, vertically centered */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-80">
            <DecorationComponent
              colors={config.colors}
              side="right"
              delay={delay + 0.15}
              animate={isInView}
              scale={scale}
            />
          </div>
        </div>
      )}
    </>
  );
});

// Re-export individual decorations for direct use if needed
export { RibbonDecoration } from './RibbonDecoration';
export { WaveDecoration } from './WaveDecoration';
export { BarsDecoration } from './BarsDecoration';
export { LightningDecoration } from './LightningDecoration';
export { PulseDecoration } from './PulseDecoration';
export { OrbsDecoration } from './OrbsDecoration';
export { SparkleDecoration } from './SparkleDecoration';
export { GradientDecoration } from './GradientDecoration';

// Abstract particles for immersive intro slides
export { AbstractParticles } from './AbstractParticles';
