import { motion } from 'motion/react';
import { CodeBlock, DownloadLink } from './ui';
import { sentimentKeywordsPositive, sentimentKeywordsNegative } from './data';

export function ZwischenrufeSection() {
  return (
    <section className="border-t border-stone-200 bg-white" id="zwischenrufanalyse">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.86, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Zwischenrufanalyse
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Erkennung von Zwischenrufen
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Das System erkennt Zwischenrufe (Unterbrechungen) in den Plenarprotokollen und
            analysiert, wer am häufigsten unterbricht und wer am häufigsten unterbrochen wird.
            Dies ermöglicht Einblicke in die parlamentarische Debattenkultur.
          </p>
        </motion.div>

        {/* Detection Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.87, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Erkennungsablauf</h4>
          <CodeBlock>
            <p className="text-stone-400">detect_interruption(protokoll_text)</p>
            <p className="pl-4 text-stone-300">├─ Suche Pattern: <span className="text-amber-400">(Name [PARTEI]: Text)</span></p>
            <p className="pl-4 text-stone-300">├─ Filtere Rauschen: Beifall, Zuruf, Lachen, Heiterkeit</p>
            <p className="pl-4 text-stone-300">├─ Prüfe Selbst-Unterbrechung (gleicher Nachname)</p>
            <p className="pl-4 text-stone-300">├─ Zähle für <span className="text-pink-400">Unterbrecher</span> (interruptions_made)</p>
            <p className="pl-4 text-stone-300">└─ Zähle für <span className="text-blue-400">Unterbrochene</span> (interruptions_received)</p>
          </CodeBlock>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.875, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12"
        >
          <div className="bg-white border border-stone-200 rounded-lg p-4 text-center">
            <div className="text-xl font-mono text-stone-900 mb-1">8.004</div>
            <div className="text-xs text-stone-500">Zwischenrufe</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-4 text-center">
            <div className="text-xl font-mono text-pink-600 mb-1">342</div>
            <div className="text-xs text-stone-500">Zwischenrufer</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <div className="text-xl font-mono text-emerald-600 mb-1">17,9%</div>
            <div className="text-xs text-emerald-700">Zustimmung</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-xl font-mono text-red-600 mb-1">11,1%</div>
            <div className="text-xs text-red-700">Kritik</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-center col-span-2 md:col-span-1">
            <div className="text-xl font-mono text-stone-600 mb-1">71,0%</div>
            <div className="text-xs text-stone-500">Neutral</div>
          </div>
        </motion.div>

        {/* Regex Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Erkennungsmuster</h4>
          <p className="text-sm text-stone-600 mb-4">
            Zwischenrufe werden im Protokoll in einem standardisierten Format erfasst:
          </p>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
              <span className="text-xs font-mono text-stone-500">Regex Pattern</span>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto">
              <code className="text-emerald-600">
                \(([A-ZÄÖÜ][^\[\]]{'{'}2,40{'}'})\s*\[([A-ZÄÖÜa-zäöü/\s]+)\]:[^)]+\)
              </code>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
              <span className="text-xs font-mono text-stone-500">Beispiele aus Protokollen</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-2">
              <p className="text-stone-700">
                <span className="text-stone-400">(</span>
                <span className="text-pink-600">Dr. Alice Weidel</span>
                <span className="text-stone-400"> [</span>
                <span className="text-blue-600">AfD</span>
                <span className="text-stone-400">]:</span>
                <span className="text-stone-600"> Das ist doch Unsinn!</span>
                <span className="text-stone-400">)</span>
              </p>
              <p className="text-stone-700">
                <span className="text-stone-400">(</span>
                <span className="text-pink-600">Beatrix von Storch</span>
                <span className="text-stone-400"> [</span>
                <span className="text-blue-600">AfD</span>
                <span className="text-stone-400">]:</span>
                <span className="text-stone-600"> Hört, hört!</span>
                <span className="text-stone-400">)</span>
              </p>
              <p className="text-stone-700">
                <span className="text-stone-400">(</span>
                <span className="text-pink-600">Friedrich Merz</span>
                <span className="text-stone-400"> [</span>
                <span className="text-blue-600">CDU/CSU</span>
                <span className="text-stone-400">]:</span>
                <span className="text-stone-600"> Wie bitte?</span>
                <span className="text-stone-400">)</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Noise Filtering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.89, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Rauschfilterung</h4>
          <p className="text-sm text-stone-600 mb-4">
            Nicht alle Klammern im Protokoll sind Zwischenrufe. Folgende Muster werden herausgefiltert:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs font-mono text-red-600 uppercase tracking-wider mb-2">
                Wird ignoriert
              </div>
              <ul className="text-sm text-stone-600 space-y-1 font-mono">
                <li>• (Beifall bei der SPD)</li>
                <li>• (Zuruf von der CDU/CSU)</li>
                <li>• (Lachen bei den GRÜNEN)</li>
                <li>• (Heiterkeit)</li>
                <li>• (Widerspruch bei der AfD)</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="text-xs font-mono text-emerald-600 uppercase tracking-wider mb-2">
                Wird gezählt
              </div>
              <ul className="text-sm text-stone-600 space-y-1 font-mono">
                <li>• (Name [PARTEI]: Text)</li>
                <li>• Direkte Zwischenrufe</li>
                <li>• Namentlich zuordenbar</li>
                <li>• Mit Partei-Zuordnung</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Two Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.90, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Zwei Perspektiven</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-pink-200 bg-pink-50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="font-medium text-stone-900">Top Zwischenrufer</span>
              </div>
              <p className="text-sm text-stone-600 mb-3">
                Wer ruft am häufigsten dazwischen während anderer Reden?
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded text-stone-600 border border-pink-200">
                interruptions_made
              </code>
            </div>
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium text-stone-900">Meistens unterbrochen</span>
              </div>
              <p className="text-sm text-stone-600 mb-3">
                Wer wird am häufigsten während der eigenen Rede von anderen unterbrochen?
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded text-stone-600 border border-blue-200">
                interruptions_received
              </code>
            </div>
          </div>
        </motion.div>

        {/* Data Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.91, duration: 0.6 }}
        >
          <h4 className="font-medium text-stone-900 mb-4">Datenfluss</h4>
          <div className="bg-stone-900 rounded-xl p-6 text-white font-mono text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="px-2 py-1 bg-stone-700 rounded">Protokoll-Text</span>
              <span className="text-stone-500">→</span>
              <span className="px-2 py-1 bg-stone-700 rounded">Regex-Matching</span>
              <span className="text-stone-500">→</span>
              <span className="px-2 py-1 bg-stone-700 rounded">Counter-Aggregation</span>
              <span className="text-stone-500">→</span>
              <span className="px-2 py-1 bg-stone-700 rounded">Rankings</span>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-700 text-stone-400 text-xs">
              <strong className="text-stone-300">Speicherung:</strong> Pro Abgeordnetem werden beide Werte
              (<code className="text-pink-400">interruptions_made</code> und <code className="text-blue-400">interruptions_received</code>)
              im SpeakerProfile gespeichert.
            </div>
          </div>
        </motion.div>

        {/* Sentiment Classification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.915, duration: 0.6 }}
          className="mt-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Sentiment-Klassifikation</h4>
          <p className="text-sm text-stone-600 mb-6">
            Jeder Zwischenruf wird anhand von Schlüsselwörtern als <strong className="text-emerald-600">Zustimmung</strong>,
            <strong className="text-red-600"> Kritik</strong> oder <strong className="text-stone-600">Neutral</strong> klassifiziert.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="text-xs font-mono text-emerald-600 uppercase tracking-wider mb-3">
                Zustimmung (17,9%)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sentimentKeywordsPositive.map(word => (
                  <span key={word} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono">
                    {word}
                  </span>
                ))}
                <span className="text-xs text-emerald-500">+30 weitere</span>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs font-mono text-red-600 uppercase tracking-wider mb-3">
                Kritik (11,1%)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sentimentKeywordsNegative.map(word => (
                  <span key={word} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">
                    {word}
                  </span>
                ))}
                <span className="text-xs text-red-500">+35 weitere</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
              Neutral (71,0%)
            </div>
            <p className="text-sm text-stone-600">
              Fragen ("Was?", "Wie bitte?"), Kommentare, thematische Einwürfe ("Infrastruktur!")
              und alles, was nicht eindeutig zugeordnet werden kann.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
              <span className="text-xs font-mono text-stone-500">Ranking-Formel (Quiz)</span>
            </div>
            <div className="p-4">
              <code className="text-sm font-mono text-stone-700">
                score = absolute_count × √(total_count)
              </code>
              <p className="text-xs text-stone-500 mt-2">
                Gewichtet sowohl absolute Anzahl als auch Gesamtaktivität –
                nur Personen mit ≥50 Zwischenrufen werden berücksichtigt.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Download Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92, duration: 0.6 }}
          className="mt-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Daten herunterladen</h4>
          <p className="text-sm text-stone-600 mb-4">
            Die JSON-Dateien enthalten pro Person: <code className="text-xs bg-stone-100 px-1 rounded">count</code>,
            <code className="text-xs bg-emerald-100 text-emerald-700 px-1 rounded">positive</code>,
            <code className="text-xs bg-red-100 text-red-700 px-1 rounded">negative</code>,
            <code className="text-xs bg-stone-100 px-1 rounded">neutral</code>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <DownloadLink
              href="/zwischenrufer.json"
              title="Top Zwischenrufer"
              description="342 Personen mit Sentiment-Klassifikation (pos/neg/neutral)"
              color="pink"
            />
            <DownloadLink
              href="/interrupted.json"
              title="Meistens unterbrochen"
              description="Vollständige Rangliste aller Unterbrochenen"
              color="blue"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
