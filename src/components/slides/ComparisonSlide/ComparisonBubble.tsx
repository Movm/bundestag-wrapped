import { memo } from 'react';
import { motion } from 'motion/react';
import { getPartyGradient } from '@/lib/party-colors';

interface ComparisonItem {
  label: string;
  value: number;
  party?: string;
  subValue?: string;
}

interface ComparisonBubbleProps {
  item: ComparisonItem;
  index: number;
  position: { top: string; left: string };
  floatAnimation: { x: number[]; y: number[]; duration: number };
  sizePercent: number;
  unit: string;
}

export const ComparisonBubble = memo(function ComparisonBubble({
  item,
  index,
  position,
  floatAnimation,
  sizePercent,
  unit,
}: ComparisonBubbleProps) {
  const minVw = 14;
  const maxVw = 32;
  const vwSize = minVw + (sizePercent / 100) * (maxVw - minVw);

  const gradient = item.party
    ? getPartyGradient(item.party)
    : 'from-purple-500 to-purple-700';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
      }}
    >
      <motion.div
        animate={{ x: floatAnimation.x, y: floatAnimation.y }}
        transition={{
          repeat: Infinity,
          duration: floatAnimation.duration,
          ease: 'easeInOut',
        }}
        className={`
          rounded-full
          bg-gradient-to-br ${gradient}
          shadow-2xl shadow-black/30
          flex flex-col items-center justify-center
          p-4 text-center
          min-w-[100px] min-h-[100px]
          max-w-[280px] max-h-[280px]
        `}
        style={{
          width: `${vwSize}vw`,
          height: `${vwSize}vw`,
          willChange: 'transform',
        }}
      >
        <h4 className="text-white font-black text-sm md:text-base lg:text-lg drop-shadow-md leading-tight mb-2">
          {item.label}
        </h4>
        <p className="text-white/90 text-xs md:text-sm font-semibold">
          {item.value.toLocaleString('de-DE')} {unit}
        </p>
        {item.subValue && (
          <p className="text-white/60 text-[10px] md:text-xs mt-1">
            {item.subValue}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
});
