import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ExpandableDetailsProps {
  children: ReactNode;
  expandLabel?: string;
  collapseLabel?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandableDetails({
  children,
  expandLabel = 'Details anzeigen',
  collapseLabel = 'Details ausblenden',
  defaultExpanded = false,
  className,
}: ExpandableDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('w-full', className)}>
      {/* Expand/Collapse Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'group flex items-center gap-3 mx-auto px-6 py-3 rounded-full',
          'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20',
          'text-white/60 hover:text-white/90 transition-all duration-300',
          'text-base md:text-lg font-medium'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {isExpanded ? '▲' : '▼'}
        </motion.span>
        <span>{isExpanded ? collapseLabel : expandLabel}</span>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.25, delay: isExpanded ? 0.1 : 0 },
            }}
            className="overflow-hidden"
          >
            <div className="pt-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
