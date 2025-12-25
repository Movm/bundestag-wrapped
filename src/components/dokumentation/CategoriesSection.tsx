import { motion } from 'motion/react';
import { categories } from './data';
import { FileIcon } from './ui';

export function CategoriesSection() {
  return (
    <section className="border-t border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Kategorien
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-8">
            Die 8 Redetypen im Detail
          </h3>
        </motion.div>

        <div className="space-y-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
              className="border border-stone-200 rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h4 className="font-medium text-stone-900">{cat.name}</h4>
                    <code className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded font-mono">
                      {cat.id}
                    </code>
                  </div>
                  <span className="text-sm font-mono text-stone-500">
                    {cat.count.toLocaleString('de-DE')} Beiträge
                  </span>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                  <FileIcon />
                  <span>Erkennungsmuster: {cat.pattern}</span>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 mb-4">
                  <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                    Beispiele
                  </div>
                  <div className="space-y-2">
                    {cat.examples.map((ex, i) => (
                      <p key={i} className="text-sm text-stone-700 font-mono leading-relaxed">
                        "{ex}"
                      </p>
                    ))}
                  </div>
                </div>
                <a
                  href={`/speeches_${cat.id}.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono rounded transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {cat.count} Einträge als JSON
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
