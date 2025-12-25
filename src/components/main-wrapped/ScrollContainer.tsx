import { useRef, useImperativeHandle, forwardRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollContainerProps {
  children: ReactNode;
  onSectionChange?: (sectionId: string) => void;
  locked?: boolean;
  className?: string;
}

export interface ScrollContainerRef {
  scrollToNextSlide: (currentSlideId: string) => void;
  containerRef: HTMLDivElement | null;
}

export const ScrollContainer = forwardRef<ScrollContainerRef, ScrollContainerProps>(
  function ScrollContainer({ children, onSectionChange, locked, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Store callback in ref to avoid recreating IntersectionObserver
    const onSectionChangeRef = useRef(onSectionChange);
    onSectionChangeRef.current = onSectionChange;

    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              const id = entry.target.getAttribute('data-slide-id');
              if (id) onSectionChangeRef.current?.(id);
            }
          }
        },
        { root: containerRef.current, threshold: 0.5 }
      );

      const sections = containerRef.current.querySelectorAll('[data-slide-id]');
      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
    }, []); // Empty deps - observer is stable, callback accessed via ref

    useImperativeHandle(ref, () => ({
      scrollToNextSlide: (currentSlideId: string) => {
        const sections = Array.from(containerRef.current?.querySelectorAll('[data-slide-id]') || []);
        const idx = sections.findIndex(s => s.getAttribute('data-slide-id') === currentSlideId);
        sections[idx + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      get containerRef() {
        return containerRef.current;
      },
    }));

    return (
      <div
        ref={containerRef}
        className={cn(
          'h-screen scroll-smooth',
          'snap-y snap-mandatory',
          'scrollbar-hide',
          locked ? 'overflow-hidden' : 'overflow-y-scroll',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
