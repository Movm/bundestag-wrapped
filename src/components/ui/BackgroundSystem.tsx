import { useRef, Suspense, lazy } from 'react';
import { useReducedMotion, useScroll, useTransform, AnimatePresence, motion, type MotionValue } from 'motion/react';
import { BackgroundContrails, ContrailGradients } from './Contrails';
import { FloatingParticles } from '@/components/slides/shared/FloatingParticles';
import type { SparklesConfig } from '@/components/slides/shared/SlideContainer';
import {
  type BackgroundTheme,
  type ThemeConfig,
  getBackgroundTheme,
  THEME_BACKGROUNDS,
  BACKGROUND_CROSSFADE_DURATION,
} from '@/shared/theme-backgrounds/types';
import { GradientEffect } from './BackgroundEffects/GradientEffect';

// Lazy load effect components for better performance
const PulseEffect = lazy(() => import('./BackgroundEffects/PulseEffect').then(m => ({ default: m.PulseEffect })));
const WavesEffect = lazy(() => import('./BackgroundEffects/WavesEffect').then(m => ({ default: m.WavesEffect })));
const BarsEffect = lazy(() => import('./BackgroundEffects/BarsEffect').then(m => ({ default: m.BarsEffect })));
const LightningEffect = lazy(() => import('./BackgroundEffects/LightningEffect').then(m => ({ default: m.LightningEffect })));
const OrbsEffect = lazy(() => import('./BackgroundEffects/OrbsEffect').then(m => ({ default: m.OrbsEffect })));
const StripesEffect = lazy(() => import('./BackgroundEffects/StripesEffect').then(m => ({ default: m.StripesEffect })));
const SparklesEffect = lazy(() => import('./BackgroundEffects/SparklesEffect').then(m => ({ default: m.SparklesEffect })));
const RibbonsEffect = lazy(() => import('./BackgroundEffects/RibbonsEffect').then(m => ({ default: m.RibbonsEffect })));
const GridEffect = lazy(() => import('./BackgroundEffects/GridEffect').then(m => ({ default: m.GridEffect })));
const RaysEffect = lazy(() => import('./BackgroundEffects/RaysEffect').then(m => ({ default: m.RaysEffect })));

type Intensity = 'subtle' | 'medium' | 'vibrant';

// 8 parallax speeds for contrails (different depths)
const PARALLAX_SPEEDS = ['-20%', '-35%', '-50%', '-28%', '-42%', '-32%', '-45%', '-25%'] as const;

interface BackgroundSystemProps {
  /** Current slide ID for theme selection */
  slideId?: string;
  /** Legacy intensity prop (used when slideId not provided) */
  intensity?: Intensity;
  scrollContainer?: HTMLDivElement | null;
  sparkles?: boolean | SparklesConfig;
}

/**
 * Themed Background System
 *
 * Renders dynamic background effects based on the current slide's theme.
 * Each section has a unique visual effect with its own color palette.
 *
 * When slideId is provided, the system automatically selects the
 * appropriate theme and effect. Falls back to contrails when not provided.
 */
export function BackgroundSystem({
  slideId,
  intensity = 'medium',
  scrollContainer,
  sparkles,
}: BackgroundSystemProps) {
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

  // Determine theme from slideId
  const theme: BackgroundTheme = slideId ? getBackgroundTheme(slideId) : 'intro';
  const themeConfig: ThemeConfig = THEME_BACKGROUNDS[theme];

  // Map legacy intensity to contrail intensity
  const contrailIntensity = intensity === 'subtle' ? 'subtle' : intensity === 'vibrant' ? 'bold' : 'medium';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* SVG gradient definitions (render once) */}
      <ContrailGradients colors={themeConfig.colors} id={theme} />

      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
        }}
      />

      {/* Themed effect layer with crossfade transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: BACKGROUND_CROSSFADE_DURATION / 1000 }}
        >
          {prefersReducedMotion ? (
            // Reduced motion: always use static gradient
            <GradientEffect
              colors={themeConfig.colors}
              intensity={themeConfig.intensity * 0.5}
            />
          ) : (
            <Suspense fallback={
              <GradientEffect
                colors={themeConfig.colors}
                intensity={themeConfig.intensity * 0.5}
              />
            }>
              <ThemedEffect
                config={themeConfig}
                parallaxY={parallaxTransforms as MotionValue<string>[]}
                contrailIntensity={contrailIntensity}
              />
            </Suspense>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Sparkles layer - fixed positioning to ensure full viewport coverage */}
      {sparkles && !prefersReducedMotion && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <FloatingParticles
            {...(typeof sparkles === 'object' ? sparkles : {})}
            color={`rgb(${themeConfig.colors.glow} / 0.15)`}
          />
        </div>
      )}
    </div>
  );
}

interface ThemedEffectProps {
  config: ThemeConfig;
  parallaxY: MotionValue<string>[];
  contrailIntensity: 'subtle' | 'medium' | 'bold';
}

/**
 * Renders the appropriate effect component based on theme.
 */
function ThemedEffect({ config, parallaxY, contrailIntensity }: ThemedEffectProps) {
  const { colors, intensity, effectType } = config;

  switch (effectType) {
    case 'contrails':
      return (
        <BackgroundContrails
          intensity={contrailIntensity}
          parallaxY={parallaxY}
          colors={colors}
        />
      );

    case 'pulse':
      return <PulseEffect colors={colors} intensity={intensity} />;

    case 'waves':
      return <WavesEffect colors={colors} intensity={intensity} />;

    case 'bars':
      return <BarsEffect colors={colors} intensity={intensity} />;

    case 'lightning':
      return <LightningEffect colors={colors} intensity={intensity} />;

    case 'gradient':
      return <GradientEffect colors={colors} intensity={intensity} />;

    case 'orbs':
      return <OrbsEffect colors={colors} intensity={intensity} />;

    case 'stripes':
      return <StripesEffect colors={colors} intensity={intensity} />;

    case 'sparkles':
      return <SparklesEffect colors={colors} intensity={intensity} />;

    case 'ribbons':
      return <RibbonsEffect colors={colors} intensity={intensity} />;

    case 'grid':
      return <GridEffect colors={colors} intensity={intensity} />;

    case 'rays':
      return <RaysEffect colors={colors} intensity={intensity} />;

    default:
      // Fallback to contrails
      return (
        <BackgroundContrails
          intensity={contrailIntensity}
          parallaxY={parallaxY}
          colors={colors}
        />
      );
  }
}
