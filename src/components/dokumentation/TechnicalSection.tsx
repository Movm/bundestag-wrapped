import { motion } from 'motion/react';

export function TechnicalSection() {
  return (
    <section className="border-t border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Technische Details
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-8">
            Implementierung
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-stone-900 mb-2">Quelldatei</h4>
              <code className="text-sm text-stone-600 bg-stone-100 px-3 py-2 rounded block">
                src/noun_analysis/parser.py
              </code>
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-900 mb-2">Hauptfunktionen</h4>
              <ul className="text-sm text-stone-600 space-y-1 font-mono">
                <li>• parse_speeches_from_protocol()</li>
                <li>• classify_speech_start()</li>
                <li>• starts_with_president_address()</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-stone-900 mb-2">CLI-Befehle</h4>
              <div className="bg-stone-900 rounded-lg p-4 font-mono text-sm">
                <p className="text-stone-400"># Protokolle neu verarbeiten</p>
                <p className="text-emerald-400">python scripts/reprocess_speeches.py</p>
                <p className="text-stone-400 mt-3"># Web-Export generieren</p>
                <p className="text-emerald-400">noun-analysis export-speeches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
