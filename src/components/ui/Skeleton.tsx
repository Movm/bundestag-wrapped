import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('bg-white/10 rounded animate-pulse', className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonShimmer({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-white/5 via-white/15 to-white/5',
        'bg-[length:200%_100%] animate-shimmer rounded',
        className
      )}
      aria-hidden="true"
    />
  );
}
