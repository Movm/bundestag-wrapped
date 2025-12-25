import { motion } from 'motion/react';
import { SECTION_CONFIG, SECTION_ORDER } from './shared';

interface SectionNavProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function SectionNav({ activeSection, onSectionClick }: SectionNavProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 md:gap-2 py-2 overflow-x-auto scrollbar-hide">
          {SECTION_ORDER.map((sectionId) => {
            const section = SECTION_CONFIG[sectionId];
            const isActive = activeSection === sectionId;

            return (
              <button
                key={sectionId}
                onClick={() => onSectionClick(sectionId)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'border'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }
                `}
                style={isActive ? {
                  backgroundColor: `${section.accent}20`,
                  borderColor: `${section.accent}40`,
                  color: section.accent,
                } : undefined}
              >
                <span className="font-mono text-xs opacity-60 hidden sm:inline">
                  {section.number}
                </span>
                <span className="text-base">{section.emoji}</span>
                <span className="hidden md:inline">{section.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
