/**
 * BackgroundEffects - Effect Selector
 *
 * Renders the appropriate background effect based on theme configuration.
 * Handles smooth transitions between effects during theme changes.
 */

import { memo, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { EffectType, ThemeColors, ThemeConfig } from '@/shared/theme-backgrounds/types';
import { BACKGROUND_CROSSFADE_DURATION } from '@/shared/theme-backgrounds/types';

// Lazy load effects for better performance
const ContrailsEffect = lazy(() => import('./ContrailsEffect').then(m => ({ default: m.ContrailsEffect })));
const PulseEffect = lazy(() => import('./PulseEffect').then(m => ({ default: m.PulseEffect })));
const WavesEffect = lazy(() => import('./WavesEffect').then(m => ({ default: m.WavesEffect })));
const BarsEffect = lazy(() => import('./BarsEffect').then(m => ({ default: m.BarsEffect })));
const LightningEffect = lazy(() => import('./LightningEffect').then(m => ({ default: m.LightningEffect })));
const GradientEffect = lazy(() => import('./GradientEffect').then(m => ({ default: m.GradientEffect })));
const OrbsEffect = lazy(() => import('./OrbsEffect').then(m => ({ default: m.OrbsEffect })));
const StripesEffect = lazy(() => import('./StripesEffect').then(m => ({ default: m.StripesEffect })));
const SparklesEffect = lazy(() => import('./SparklesEffect').then(m => ({ default: m.SparklesEffect })));
const RibbonsEffect = lazy(() => import('./RibbonsEffect').then(m => ({ default: m.RibbonsEffect })));
const GridEffect = lazy(() => import('./GridEffect').then(m => ({ default: m.GridEffect })));
const RaysEffect = lazy(() => import('./RaysEffect').then(m => ({ default: m.RaysEffect })));

interface EffectProps {
  colors: ThemeColors;
  intensity: number;
}

const EFFECT_COMPONENTS: Record<EffectType, React.LazyExoticComponent<React.ComponentType<EffectProps>>> = {
  contrails: ContrailsEffect,
  pulse: PulseEffect,
  waves: WavesEffect,
  bars: BarsEffect,
  lightning: LightningEffect,
  gradient: GradientEffect,
  orbs: OrbsEffect,
  stripes: StripesEffect,
  sparkles: SparklesEffect,
  ribbons: RibbonsEffect,
  grid: GridEffect,
  rays: RaysEffect,
};

interface EffectSelectorProps {
  config: ThemeConfig;
  themeKey: string;
}

/**
 * Renders a single effect layer.
 */
const EffectLayer = memo(function EffectLayer({
  config,
  themeKey,
}: EffectSelectorProps) {
  const EffectComponent = EFFECT_COMPONENTS[config.effectType];

  return (
    <motion.div
      key={themeKey}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: BACKGROUND_CROSSFADE_DURATION / 1000 }}
      style={{
        // CSS containment isolates layout/paint reflows to this container only
        contain: 'layout style paint',
        // Promote to GPU layer for better animation performance
        willChange: 'opacity',
      }}
    >
      <Suspense fallback={null}>
        <EffectComponent
          colors={config.colors}
          intensity={config.intensity}
        />
      </Suspense>
    </motion.div>
  );
});

interface BackgroundEffectProps {
  config: ThemeConfig;
  themeKey: string;
}

/**
 * Main effect component with AnimatePresence for transitions.
 */
export const BackgroundEffect = memo(function BackgroundEffect({
  config,
  themeKey,
}: BackgroundEffectProps) {
  return (
    <AnimatePresence mode="wait">
      <EffectLayer
        key={themeKey}
        config={config}
        themeKey={themeKey}
      />
    </AnimatePresence>
  );
});

// Re-export individual effects for direct use
export { ContrailsEffect } from './ContrailsEffect';
export { PulseEffect } from './PulseEffect';
export { WavesEffect } from './WavesEffect';
export { BarsEffect } from './BarsEffect';
export { LightningEffect } from './LightningEffect';
export { GradientEffect } from './GradientEffect';
export { OrbsEffect } from './OrbsEffect';
export { StripesEffect } from './StripesEffect';
export { SparklesEffect } from './SparklesEffect';
export { RibbonsEffect } from './RibbonsEffect';
export { GridEffect } from './GridEffect';
export { RaysEffect } from './RaysEffect';
