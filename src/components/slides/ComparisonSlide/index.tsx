import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { ComparisonBubble } from './ComparisonBubble';

export interface ComparisonItem {
  label: string;
  value: number;
  party?: string;
  subValue?: string;
}

interface ComparisonSlideProps {
  emoji: string;
  headline: string;
  question: string;
  items: ComparisonItem[];
  unit?: string;
  subtitle?: string;
}

const BUBBLE_POSITIONS: Record<number, { top: string; left: string }[]> = {
  3: [
    { top: '25%', left: '25%' },
    { top: '22%', left: '55%' },
    { top: '55%', left: '40%' },
  ],
  4: [
    { top: '22%', left: '22%' },
    { top: '20%', left: '55%' },
    { top: '52%', left: '25%' },
    { top: '50%', left: '55%' },
  ],
  5: [
    { top: '20%', left: '20%' },
    { top: '18%', left: '55%' },
    { top: '45%', left: '38%' },
    { top: '65%', left: '22%' },
    { top: '62%', left: '58%' },
  ],
  6: [
    { top: '18%', left: '22%' },
    { top: '16%', left: '55%' },
    { top: '42%', left: '30%' },
    { top: '40%', left: '58%' },
    { top: '65%', left: '25%' },
    { top: '63%', left: '55%' },
  ],
};

const FLOAT_ANIMATIONS = [
  { x: [0, 12, -8, 0], y: [0, -15, 8, 0], duration: 7 },
  { x: [0, -15, 10, 0], y: [0, 10, -12, 0], duration: 8 },
  { x: [0, 8, -12, 0], y: [0, -8, 15, 0], duration: 6.5 },
  { x: [0, -10, 15, 0], y: [0, 15, -8, 0], duration: 9 },
  { x: [0, 15, -8, 0], y: [0, -12, 10, 0], duration: 7.5 },
  { x: [0, -8, 12, 0], y: [0, 8, -15, 0], duration: 8.5 },
];

export const ComparisonSlide = memo(function ComparisonSlide({
  emoji,
  headline,
  question,
  items,
  unit = '',
  subtitle,
}: ComparisonSlideProps) {
  const { minValue, range } = useMemo(() => {
    const max = Math.max(...items.map((i) => i.value));
    const min = Math.min(...items.map((i) => i.value));
    return { minValue: min, range: max - min || 1 };
  }, [items]);

  const positions = BUBBLE_POSITIONS[items.length] || BUBBLE_POSITIONS[5];

  return (
    <div className="min-h-screen relative w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-0 right-0 text-center z-20 px-4"
      >
        <span className="text-4xl md:text-5xl mb-2 block">{emoji}</span>
        <p className="text-white/50 text-xs md:text-sm uppercase tracking-wide mb-1">
          {headline}
        </p>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white">
          {question}
        </h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-sm mt-2 max-w-md mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      <div className="absolute inset-0 z-10">
        {items.map((item, i) => {
          const sizePercent = 20 + ((item.value - minValue) / range) * 80;

          return (
            <ComparisonBubble
              key={item.label}
              item={item}
              index={i}
              position={positions[i % positions.length]}
              floatAnimation={FLOAT_ANIMATIONS[i % FLOAT_ANIMATIONS.length]}
              sizePercent={sizePercent}
              unit={unit}
            />
          );
        })}
      </div>
    </div>
  );
});
