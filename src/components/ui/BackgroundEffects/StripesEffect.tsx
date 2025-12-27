/**
 * StripesEffect - Horizontal bands with gentle sway
 *
 * Used for: moin (regional, friendly)
 * Creates a regional flag-inspired pattern with gentle movement.
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import type { ThemeColors } from '@/shared/theme-backgrounds/types';

interface StripeConfig {
  y: string;
  height: string;
  duration: number;
  delay: number;
}

const STRIPE_CONFIGS: StripeConfig[] = [
  { y: '10%', height: '8%', duration: 12, delay: 0 },
  { y: '25%', height: '6%', duration: 15, delay: 1 },
  { y: '40%', height: '10%', duration: 10, delay: 0.5 },
  { y: '55%', height: '5%', duration: 14, delay: 2 },
  { y: '70%', height: '8%', duration: 11, delay: 1.5 },
  { y: '85%', height: '6%', duration: 13, delay: 0.8 },
];

interface StripesEffectProps {
  colors: ThemeColors;
  intensity?: number;
}

export const StripesEffect = memo(function StripesEffect({
  colors,
  intensity = 1,
}: StripesEffectProps) {
  const baseOpacity = 0.15 * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {STRIPE_CONFIGS.map((stripe, index) => (
        <motion.div
          key={`stripe-${index}`}
          className="absolute left-0 w-full will-change-transform"
          style={{
            top: stripe.y,
            height: stripe.height,
          }}
          animate={{
            x: ['-5%', '5%', '-5%'],
            opacity: [baseOpacity, baseOpacity * 1.3, baseOpacity],
          }}
          transition={{
            duration: stripe.duration,
            delay: stripe.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Main stripe */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(${index % 2 === 0 ? colors.primary : colors.secondary}, ${baseOpacity}) 10%,
                rgba(${colors.glow}, ${baseOpacity * 0.8}) 50%,
                rgba(${index % 2 === 0 ? colors.secondary : colors.primary}, ${baseOpacity}) 90%,
                transparent 100%)`,
            }}
          />

          {/* Stripe glow */}
          <div
            className="absolute inset-0 -top-2 -bottom-2"
            style={{
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(${colors.glow}, ${baseOpacity * 0.3}) 20%,
                rgba(${colors.primary}, ${baseOpacity * 0.2}) 80%,
                transparent 100%)`,
              filter: 'blur(8px)',
            }}
          />
        </motion.div>
      ))}

      {/* Subtle corner accents */}
      <div
        className="absolute top-0 left-0 w-1/3 h-1/4"
        style={{
          background: `radial-gradient(ellipse at top left,
            rgba(${colors.primary}, ${baseOpacity * 0.4}) 0%,
            transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-1/3 h-1/4"
        style={{
          background: `radial-gradient(ellipse at bottom right,
            rgba(${colors.secondary}, ${baseOpacity * 0.4}) 0%,
            transparent 60%)`,
        }}
      />
    </div>
  );
});
