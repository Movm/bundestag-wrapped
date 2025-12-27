/**
 * GradientEffect - Subtle static gradient background
 *
 * Used for: discriminatory (serious, somber - minimal motion)
 * Creates a calm, subdued atmosphere with gentle color transitions.
 */

import { memo } from 'react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface GradientEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const GradientEffect = memo(function GradientEffect({
  colors,
  intensity = 1,
}: GradientEffectProps) {
  const baseOpacity = 0.15 * intensity;

  return (
    <div className="absolute inset-0">
      {/* Primary radial gradient from center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%,
            rgba(${colors.primary}, ${baseOpacity}) 0%,
            transparent 50%)`,
        }}
      />

      {/* Secondary gradient from bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 80% 80%,
            rgba(${colors.secondary}, ${baseOpacity * 0.7}) 0%,
            transparent 45%)`,
        }}
      />

      {/* Subtle glow accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 50%,
            rgba(${colors.glow}, ${baseOpacity * 0.3}) 0%,
            transparent 40%)`,
        }}
      />
    </div>
  );
});
