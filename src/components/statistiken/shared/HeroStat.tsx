import { motion, useSpring, useTransform, useInView } from 'motion/react';
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeroStatProps {
  value: number | string;
  label: string;
  sublabel?: string;
  suffix?: string;
  prefix?: string;
  format?: 'compact' | 'number' | 'percentage' | 'text';
  color?: string;
  className?: string;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toLocaleString('de-DE');
}

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE');
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}`;
}

export function HeroStat({
  value,
  label,
  sublabel,
  suffix,
  prefix,
  format = 'number',
  color,
  className,
}: HeroStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const isTextValue = typeof value === 'string' || format === 'text';
  const numericValue = typeof value === 'number' ? value : 0;

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: 2000,
  });

  const displayValue = useTransform(springValue, (latest): string => {
    switch (format) {
      case 'compact':
        return formatCompact(Math.round(latest));
      case 'percentage':
        return formatPercentage(latest);
      default:
        return formatNumber(Math.round(latest));
    }
  });

  useEffect(() => {
    if (isInView && !isTextValue) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue, isTextValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.8 }}
      className={cn('text-center', className)}
    >
      {/* Giant Number */}
      <div className="mb-6">
        <motion.span
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[14rem] font-black tracking-tighter leading-none"
          style={{ color: color || 'white' }}
        >
          {prefix}
          {isTextValue ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {value}
            </motion.span>
          ) : (
            <motion.span>{displayValue}</motion.span>
          )}
          {suffix && (
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl opacity-70">
              {suffix}
            </span>
          )}
        </motion.span>
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-2xl md:text-3xl lg:text-4xl text-white/70 font-medium"
      >
        {label}
      </motion.p>

      {/* Sublabel */}
      {sublabel && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg md:text-xl lg:text-2xl text-white/50 mt-3"
        >
          {sublabel}
        </motion.p>
      )}
    </motion.div>
  );
}
