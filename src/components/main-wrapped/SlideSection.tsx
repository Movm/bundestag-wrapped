import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SlideSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SlideSection({ id, children, className }: SlideSectionProps) {
  return (
    <section
      id={id}
      data-slide-id={id}
      className={cn(
        'h-screen w-full',
        'snap-start',
        'flex flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </section>
  );
}
