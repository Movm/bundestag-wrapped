import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SECTION_CONFIG, type SectionId } from './section-config';

interface SectionWrapperProps {
  sectionId: SectionId;
  children: ReactNode;
  className?: string;
  showTopBorder?: boolean;
  noPadding?: boolean;
}

export function SectionWrapper({
  sectionId,
  children,
  className,
  showTopBorder = true,
  noPadding = false,
}: SectionWrapperProps) {
  const config = SECTION_CONFIG[sectionId];

  if (!config) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'relative px-6',
        !noPadding && 'py-8',
        className
      )}
    >
      {/* Background gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b pointer-events-none',
          config.gradient
        )}
      />

      {/* Top accent border */}
      {showTopBorder && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8">
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${config.accent}40 20%, ${config.accent}60 50%, ${config.accent}40 80%, transparent 100%)`,
            }}
          />
        </div>
      )}

      {/* Subtle glow effect at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center top, ${config.accent}20 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
