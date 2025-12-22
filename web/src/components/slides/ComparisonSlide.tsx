import { motion } from 'motion/react';
import { getPartyColor } from '@/lib/party-colors';

interface ComparisonItem {
  label: string;
  value: number;
  party?: string;
}

interface ComparisonSlideProps {
  emoji: string;
  headline: string;
  question: string;
  items: ComparisonItem[];
  unit?: string;
  onNext: () => void;
}

export function ComparisonSlide({
  emoji,
  headline,
  question,
  items,
  unit = '',
  onNext,
}: ComparisonSlideProps) {
  const maxValue = Math.max(...items.map((i) => i.value));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-5xl md:text-6xl mb-4 block">{emoji}</span>
          <p className="text-white/60 text-lg uppercase tracking-wide mb-2">
            {headline}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-white">{question}</h2>
        </motion.div>

        {/* Bar chart */}
        <div className="space-y-4 mb-12">
          {items.map((item, i) => {
            const color = item.party ? getPartyColor(item.party) : '#8b5cf6';
            const width = (item.value / maxValue) * 100;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-lg">{item.label}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="text-white/60"
                  >
                    {item.value.toLocaleString('de-DE')} {unit}
                  </motion.span>
                </div>
                <div className="h-8 md:h-10 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <button
            onClick={onNext}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium text-lg transition-colors"
          >
            Weiter
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
