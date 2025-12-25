import { motion } from 'motion/react';

export function GenderAnalysisSection() {
  return (
    <section className="border-t border-stone-200" id="geschlechteranalyse">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Geschlechteranalyse
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Redezeit und Unterbrechungen nach Geschlecht
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Das Geschlecht wird anhand der Vornamen erkannt (100% Erkennungsrate durch
            kuratierte Namenslisten). Dies ermöglicht Analysen zu Redebeteiligung,
            Wortlängen und Unterbrechungsmustern.
          </p>
        </motion.div>

        {/* Distribution Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.87, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-mono text-blue-600 mb-2">409</div>
            <div className="text-sm text-stone-600">Männliche Redner:innen</div>
            <div className="text-xs text-stone-400 mt-1">67,3%</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-mono text-pink-600 mb-2">199</div>
            <div className="text-sm text-stone-600">Weibliche Redner:innen</div>
            <div className="text-xs text-stone-400 mt-1">32,7%</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-mono text-stone-900 mb-2">608</div>
            <div className="text-sm text-stone-600">Redner:innen gesamt</div>
            <div className="text-xs text-stone-400 mt-1">100% erkannt</div>
          </div>
        </motion.div>

        {/* Speech Length */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.89, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Durchschnittliche Redelänge</h4>
          <p className="text-sm text-stone-600 mb-4">
            Gemessen in Wörtern pro Rede. Berechnung: Gesamtzahl aller Wörter eines
            Geschlechts geteilt durch Anzahl der Reden.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium text-stone-900">Männliche Redner:innen</span>
              </div>
              <div className="text-3xl font-mono text-blue-700 mb-1">415</div>
              <div className="text-sm text-stone-600">Wörter pro Rede (Durchschnitt)</div>
            </div>
            <div className="border border-pink-200 bg-pink-50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="font-medium text-stone-900">Weibliche Redner:innen</span>
              </div>
              <div className="text-3xl font-mono text-pink-700 mb-1">396</div>
              <div className="text-sm text-stone-600">Wörter pro Rede (Durchschnitt)</div>
            </div>
          </div>
          <div className="mt-4 bg-stone-50 rounded-lg p-4">
            <p className="text-sm text-stone-600">
              <strong>Differenz:</strong> Männliche Redner:innen sprechen im Schnitt ~5% länger
              (19 Wörter mehr pro Rede).
            </p>
          </div>
        </motion.div>

        {/* Interruption Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.91, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Unterbrechungsmuster</h4>
          <p className="text-sm text-stone-600 mb-4">
            Gezählt werden Zwischenrufe aus dem Plenum. Jeder dokumentierte Zwischenruf
            im Protokoll wird der:dem Unterbrecher:in und der:dem unterbrochenen Redner:in zugeordnet.
          </p>

          {/* Raw Numbers */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-stone-200 rounded-lg p-5">
              <h5 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
                Zwischenrufe gemacht
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Männer</span>
                  </div>
                  <span className="font-mono text-stone-900">6.551</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-sm text-stone-700">Frauen</span>
                  </div>
                  <span className="font-mono text-stone-900">1.440</span>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <div className="text-xs text-stone-500">
                    Männeranteil: <span className="font-mono">82,0%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg p-5">
              <h5 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
                Zwischenrufe erhalten
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Männer</span>
                  </div>
                  <span className="font-mono text-stone-900">5.280</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-sm text-stone-700">Frauen</span>
                  </div>
                  <span className="font-mono text-stone-900">2.724</span>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <div className="text-xs text-stone-500">
                    Frauenanteil: <span className="font-mono">34,0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Finding */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h5 className="font-medium text-amber-900 mb-2">Zentrale Erkenntnis</h5>
            <p className="text-sm text-amber-800">
              Frauen stellen <strong>32,7%</strong> der Redner:innen, machen aber nur <strong>18,0%</strong> der
              Zwischenrufe. Gleichzeitig erhalten sie <strong>34,0%</strong> aller Zwischenrufe –
              überproportional zu ihrem Anteil. Männer unterbrechen häufiger als sie selbst
              unterbrochen werden (Ratio 1,24).
            </p>
          </div>
        </motion.div>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.93, duration: 0.6 }}
        >
          <h4 className="font-medium text-stone-900 mb-4">Methodik</h4>
          <div className="bg-stone-900 rounded-xl p-6 text-white font-mono text-sm">
            <p className="text-stone-400 mb-2"># Redelänge pro Geschlecht</p>
            <p className="text-emerald-400">avg_words[gender] = total_words[gender] / total_speeches[gender]</p>
            <p className="text-stone-400 mt-4 mb-2"># Unterbrechungsrate</p>
            <p className="text-emerald-400">interruption_ratio[gender] = made[gender] / received[gender]</p>
            <p className="text-stone-400 mt-4 mb-2"># Geschlechtserkennung</p>
            <p className="text-amber-400">detect(vorname) → Lookup in FEMALE_NAMES, MALE_NAMES, OVERRIDES</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
