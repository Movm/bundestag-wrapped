import { motion } from 'motion/react';
import { limitations } from './data';
import { WarningIcon } from './ui';

export function LimitationsSection() {
  return (
    <section className="border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Einschränkungen
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Bekannte Limitierungen
          </h3>
          <ul className="space-y-3 text-stone-600">
            {limitations.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <WarningIcon />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
