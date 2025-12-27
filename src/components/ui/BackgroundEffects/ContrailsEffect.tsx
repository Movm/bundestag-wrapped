/**
 * ContrailsEffect - Diagonal streaks wrapper
 *
 * Used for: intro (welcome, celebration)
 * Wrapper around the existing BackgroundContrails with theme colors.
 */

import { memo } from 'react';
import { BackgroundContrails, ContrailGradients } from '../Contrails';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface ContrailsEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const ContrailsEffect = memo(function ContrailsEffect({
  colors,
  intensity = 1,
}: ContrailsEffectProps) {
  const contrailIntensity = intensity < 0.7 ? 'subtle' : intensity > 1.2 ? 'bold' : 'medium';

  return (
    <>
      <ContrailGradients colors={colors} id="themed-contrail" />
      <BackgroundContrails
        intensity={contrailIntensity}
        colors={colors}
      />
    </>
  );
});
