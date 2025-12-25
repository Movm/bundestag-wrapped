import { motion } from 'motion/react';
import { CodeBlock, InfoIcon } from './ui';

export function SignatureWordsSection() {
  return (
    <section className="border-t border-stone-200 bg-white" id="signature-words">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Wortanalyse
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Signature Words
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Signature Words sind Begriffe, die ein Sprecher oder eine Fraktion
            signifikant häufiger verwendet als der Durchschnitt. Sie zeigen thematische
            Schwerpunkte und sprachliche Eigenheiten auf.
          </p>
        </motion.div>

        {/* Formula */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.96, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Berechnung</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
                Für Abgeordnete
              </div>
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <code className="text-sm text-stone-800">
                  ratio = speaker_freq / party_freq
                </code>
                <p className="text-xs text-stone-500 mt-2">
                  Wie oft nutzt der Sprecher ein Wort im Vergleich zum Fraktionsdurchschnitt?
                </p>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
                Für Fraktionen
              </div>
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <code className="text-sm text-stone-800">
                  ratio = party_freq / others_avg
                </code>
                <p className="text-xs text-stone-500 mt-2">
                  Wie oft nutzt die Fraktion ein Wort im Vergleich zu allen anderen?
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Algorithm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.97, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Algorithmus</h4>
          <p className="text-sm text-stone-600 mb-4">
            Der Algorithmus kombiniert drei Mechanismen, um aussagekräftige Signature Words zu identifizieren:
          </p>

          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono">1</div>
                <span className="font-medium text-stone-900">Prozentualer Schwellenwert</span>
              </div>
              <p className="text-sm text-stone-600 ml-9">
                Nur Wörter mit mindestens <strong>0,05%</strong> aller Wörter der Fraktion werden berücksichtigt.
                Dieser Schwellenwert skaliert automatisch mit der Redezeit (CDU: ~65 Nennungen, LINKE: ~25).
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono">2</div>
                <span className="font-medium text-stone-900">Stopwort-Filter</span>
              </div>
              <p className="text-sm text-stone-600 ml-9">
                Zwei Kategorien werden ausgeschlossen:
              </p>
              <div className="ml-9 mt-2 grid md:grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded p-3">
                  <div className="text-xs font-mono text-stone-400 mb-1">Event-Stopwords</div>
                  <div className="text-xs text-stone-600">
                    afghanistan, ortskräfte, aufnahmezusage...
                  </div>
                </div>
                <div className="bg-stone-50 rounded p-3">
                  <div className="text-xs font-mono text-stone-400 mb-1">Partei-Stopwords</div>
                  <div className="text-xs text-stone-600">
                    spd-fraktion, sozialdemokrat, cdu-fraktion...
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono">3</div>
                <span className="font-medium text-stone-900">Balanced Score</span>
              </div>
              <p className="text-sm text-stone-600 ml-9 mb-2">
                Die Rangfolge basiert auf einem kombinierten Score:
              </p>
              <div className="ml-9 bg-stone-900 rounded p-3 font-mono text-sm">
                <span className="text-emerald-400">score</span>
                <span className="text-white"> = </span>
                <span className="text-amber-400">ratio</span>
                <span className="text-white"> × </span>
                <span className="text-blue-400">√</span>
                <span className="text-stone-400">(</span>
                <span className="text-amber-400">per1000</span>
                <span className="text-stone-400">)</span>
              </div>
              <p className="text-xs text-stone-500 ml-9 mt-2">
                Die Wurzel der Frequenz (per1000) dämpft den Einfluss der Häufigkeit,
                sodass seltene aber hochdistinktive Wörter (wie "altpartei" für AfD) nicht untergehen,
                aber häufig genutzte Wörter einen Bonus erhalten.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why this formula? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.975, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Warum diese Formel?</h4>
          <p className="text-sm text-stone-600 mb-4">
            Das Problem: Weder reine Distinktivität (ratio) noch reine Häufigkeit (per1000) liefern
            gute Ergebnisse. Die Wurzel-Formel findet die Balance.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 pr-4 font-medium text-stone-700">Formel</th>
                  <th className="text-left py-2 px-4 font-medium text-stone-700">Problem</th>
                  <th className="text-left py-2 pl-4 font-medium text-stone-700">Beispiel</th>
                </tr>
              </thead>
              <tbody className="text-stone-600">
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-mono text-xs">ratio</td>
                  <td className="py-3 px-4">Seltene Wörter dominieren</td>
                  <td className="py-3 pl-4 text-xs">"ip-adresse" (21×, nur 16 Nennungen)</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-mono text-xs">per1000</td>
                  <td className="py-3 px-4">Generische Wörter dominieren</td>
                  <td className="py-3 pl-4 text-xs">"mensch", "land", "frage"</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-mono text-xs">ratio × per1000</td>
                  <td className="py-3 px-4">Häufigkeit übersteuert</td>
                  <td className="py-3 pl-4 text-xs">"deutschland" statt "altpartei"</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="py-3 pr-4 font-mono text-xs text-emerald-700">ratio × √per1000</td>
                  <td className="py-3 px-4 text-emerald-700">Balanciert beide Faktoren</td>
                  <td className="py-3 pl-4 text-xs text-emerald-700">"altpartei" für AfD ✓</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              Mathematische Intuition
            </div>
            <p className="text-sm text-stone-600 mb-3">
              Die Wurzel <strong>dämpft</strong> den Frequenz-Einfluss logarithmisch:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white rounded p-2 border border-stone-200">
                <div className="font-mono text-stone-500">per1000 = 1</div>
                <div className="text-stone-400">√1 = 1</div>
              </div>
              <div className="bg-white rounded p-2 border border-stone-200">
                <div className="font-mono text-stone-500">per1000 = 4</div>
                <div className="text-stone-400">√4 = 2 <span className="text-amber-600">(nicht 4×)</span></div>
              </div>
              <div className="bg-white rounded p-2 border border-stone-200">
                <div className="font-mono text-stone-500">per1000 = 16</div>
                <div className="text-stone-400">√16 = 4 <span className="text-amber-600">(nicht 16×)</span></div>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-3">
              Ein 16× häufigeres Wort bekommt nur 4× mehr Gewicht – nicht 16×.
              So können seltene aber hochdistinktive Begriffe mithalten.
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.978, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Ergebnisse</h4>
          <p className="text-sm text-stone-600 mb-4">
            Mit der balancierten Formel zeigt jede Fraktion charakteristische ideologische Begriffe:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-stone-50 rounded-lg p-3 border border-stone-200">
              <div className="w-20 text-xs font-medium text-stone-700">CDU/CSU</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-stone-900 text-white text-xs rounded">wettbewerbsfähigkeit</span>
                <span className="px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded">europa</span>
                <span className="px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded">wachstum</span>
                <span className="px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded">marktwirtschaft</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="w-20 text-xs font-medium text-blue-700">AfD</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">altpartei <span className="opacity-70">82×</span></span>
                <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded">steuerzahler</span>
                <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded">bürger</span>
                <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded">steuergeld</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="w-20 text-xs font-medium text-red-700">SPD</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">zusammenhalt</span>
                <span className="px-2 py-1 bg-red-200 text-red-700 text-xs rounded">arbeitsplatz</span>
                <span className="px-2 py-1 bg-red-200 text-red-700 text-xs rounded">zusammenarbeit</span>
                <span className="px-2 py-1 bg-red-200 text-red-700 text-xs rounded">signal</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <div className="w-20 text-xs font-medium text-emerald-700">GRÜNE</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded">klimakrise</span>
                <span className="px-2 py-1 bg-emerald-200 text-emerald-700 text-xs rounded">rechtsextreme</span>
                <span className="px-2 py-1 bg-emerald-200 text-emerald-700 text-xs rounded">lücke</span>
                <span className="px-2 py-1 bg-emerald-200 text-emerald-700 text-xs rounded">gas</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="w-20 text-xs font-medium text-purple-700">LINKE</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">aufrüstung <span className="opacity-70">25×</span></span>
                <span className="px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded">vermögensteuer</span>
                <span className="px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded">superreiche</span>
                <span className="px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded">profit</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-4">
            Die Signature Words spiegeln die politischen Schwerpunkte wider: CDU mit Wirtschaft,
            AfD mit Anti-Establishment-Rhetorik, SPD mit Sozialkohäsion, GRÜNE mit Klima,
            LINKE mit Anti-Militarismus und Vermögensverteilung.
          </p>
        </motion.div>

        {/* Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.98, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Schwellenwerte</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Fraktionen
              </div>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Mindestens 0,05% der Fraktionswörter</li>
                <li>• Ratio &gt; 2.0 (doppelt so häufig)</li>
                <li>• Kein Event-/Partei-Stopword</li>
                <li>• Ranking nach score (ratio × √per1000)</li>
              </ul>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Abgeordnete
              </div>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Mindestens 5× verwendet</li>
                <li>• Ratio &gt; 2.0 (doppelt so häufig)</li>
                <li>• Mindestens 5 Zeichen lang</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.99, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Implementation</h4>
          <CodeBlock title="get_distinctive_words()">
            <p className="text-stone-400"># 0.05% Minimum-Schwellenwert (skaliert mit Redezeit)</p>
            <p className="text-emerald-400">min_count <span className="text-white">= total_words × 0.0005</span></p>
            <p className="text-stone-400 mt-3"># Ratio berechnen</p>
            <p className="text-emerald-400">ratio <span className="text-white">= party_freq / (others_avg + 0.001)</span></p>
            <p className="text-stone-400 mt-3"># Balanced Score für Ranking</p>
            <p className="text-emerald-400">score <span className="text-white">= ratio × √(per1000)</span></p>
            <p className="text-stone-400 mt-3"># Filter anwenden</p>
            <p className="text-white">words = df[</p>
            <p className="text-amber-400 ml-4">(count &gt;= min_count) &amp;</p>
            <p className="text-amber-400 ml-4">(ratio &gt; 2.0) &amp;</p>
            <p className="text-amber-400 ml-4">~word.isin(EVENT_STOPWORDS) &amp;</p>
            <p className="text-amber-400 ml-4">~word.isin(PARTY_STOPWORDS)</p>
            <p className="text-white">].nlargest(n, 'score')</p>
          </CodeBlock>
        </motion.div>

        {/* Why stopwords? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <h4 className="font-medium text-stone-900 mb-4">Warum Stopwords?</h4>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <InfoIcon />
              <div>
                <div className="text-sm font-medium text-amber-800 mb-1">Problem: Triviale Exklusivität</div>
                <p className="text-sm text-amber-700">
                  Ohne Filter wäre "spd-fraktion" das Top-Signature-Word der SPD mit 11.4× ratio.
                  Technisch korrekt, aber inhaltlich nicht aussagekräftig: Jede Fraktion referenziert
                  ihren eigenen Namen häufig.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-stone-200 rounded-lg p-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
                Partei-Stopwords
              </div>
              <p className="text-sm text-stone-600 mb-3">
                Selbstreferenzen wie Fraktionsnamen und Parteimitglied-Bezeichnungen.
              </p>
              <div className="font-mono text-xs text-stone-500 bg-stone-50 p-2 rounded">
                spd-fraktion, sozialdemokrat, unionsfraktion, christdemokrat...
              </div>
            </div>
            <div className="border border-stone-200 rounded-lg p-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
                Event-Stopwords
              </div>
              <p className="text-sm text-stone-600 mb-3">
                Wörter aus spezifischen Debatten (z.B. Afghanistan-Ortskräfte), die Statistiken verzerren.
              </p>
              <div className="font-mono text-xs text-stone-500 bg-stone-50 p-2 rounded">
                afghanistan, ortskräfte, aufnahmezusage...
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-4">
            Quelldatei: <code className="bg-stone-100 px-1.5 py-0.5 rounded">src/noun_analysis/wrapped/queries.py</code>
          </p>
        </motion.div>

        {/* Complete Stopword List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.02, duration: 0.6 }}
          className="mt-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Vollständige Stopwort-Listen</h4>
          <p className="text-sm text-stone-600 mb-6">
            Für maximale Transparenz: Alle Wörter, die bei der Signature-Word-Berechnung für
            <strong> Abgeordnete</strong> ausgeschlossen werden.
          </p>

          <div className="space-y-4">
            <details className="border border-stone-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50 select-none">
                Generische Stopwords <span className="text-stone-400 font-normal">(~100 Wörter)</span>
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-stone-200 bg-stone-50">
                <p className="text-xs text-stone-500 mb-3">
                  Funktionswörter, Pronomen, Präpositionen und parlamentarische Floskeln ohne semantischen Mehrwert.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 font-mono text-xs text-stone-600">
                  {[
                    'dass', 'wird', 'werden', 'haben', 'sind', 'sein', 'eine', 'einer',
                    'einem', 'einen', 'auch', 'aber', 'oder', 'wenn', 'noch', 'mehr',
                    'schon', 'kann', 'muss', 'hier', 'diese', 'dieser', 'diesem',
                    'dieses', 'sehr', 'denn', 'weil', 'nach', 'über', 'unter', 'nicht',
                    'sich', 'für', 'mit', 'von', 'bei', 'auf', 'aus', 'zum', 'zur',
                    'das', 'der', 'die', 'und', 'ist', 'ich', 'sie', 'wir', 'uns',
                    'meine', 'damen', 'herren', 'kolleginnen', 'kollegen', 'frau',
                    'herr', 'präsidentin', 'präsident', 'liebe', 'lieber',
                    'geehrte', 'geehrter', 'vielen', 'dank', 'danke', 'also', 'gibt',
                    'ganz', 'heute', 'jetzt', 'dann', 'dort', 'immer', 'wieder',
                    'wollen', 'sagen', 'müssen', 'können', 'sollen', 'brauchen',
                    'macht', 'machen', 'geht', 'gehen', 'kommen', 'nehmen', 'stellen',
                    'unsere', 'unserer', 'unseren', 'unserem', 'unseres', 'unser',
                    'ihre', 'ihrer', 'ihren', 'ihrem', 'ihres', 'euer', 'eure',
                    'meiner', 'meinen', 'meinem', 'meines',
                    'sondern', 'sowie', 'doch', 'etwa', 'dabei', 'deshalb', 'daher',
                    'darum', 'deswegen', 'dadurch', 'dafür', 'dagegen', 'davon',
                    'darauf', 'darüber', 'daran', 'darunter', 'daneben', 'darin',
                    'natürlich', 'tatsächlich', 'wirklich', 'eigentlich', 'überhaupt',
                    'andere', 'anderen', 'anderem', 'anderer', 'anderes',
                    'viele', 'vieler', 'vieles', 'einige', 'einiger', 'einigen',
                    'welche', 'welcher', 'welchen', 'welchem', 'welches',
                    'solche', 'solcher', 'solchen', 'solchem', 'solches',
                    'jede', 'jeder', 'jeden', 'jedem', 'jedes', 'alle', 'allen', 'allem',
                    'durch', 'ohne', 'gegen', 'während', 'trotz', 'außer', 'seit',
                    'zwischen', 'wegen', 'statt', 'entlang', 'binnen', 'dank',
                    'weise', 'punkt', 'frage', 'stelle', 'seite', 'teil', 'grund',
                    'ende', 'endes', 'anfang', 'rahmen', 'bereich', 'blick',
                    'dinge', 'dingen', 'sache', 'sachen', 'thema', 'themen',
                  ].map((word) => (
                    <span key={word} className="bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      {word}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-3">
                  Quelldatei: <code className="bg-stone-100 px-1 rounded">src/noun_analysis/analyzer.py</code> → <code>STOPWORD_GENERIC</code>
                </p>
              </div>
            </details>

            <details className="border border-stone-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50 select-none">
                Mindestlänge <span className="text-stone-400 font-normal">(5 Zeichen)</span>
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-stone-200 bg-stone-50">
                <p className="text-xs text-stone-500 mb-2">
                  Wörter mit weniger als 5 Zeichen werden automatisch ausgeschlossen. Dies filtert
                  kurze Funktionswörter wie "auch", "aber", "wir", "sie", die hohe Ratios haben können.
                </p>
              </div>
            </details>

            <details className="border border-stone-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50 select-none">
                Mindestanzahl <span className="text-stone-400 font-normal">(5× verwendet)</span>
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-stone-200 bg-stone-50">
                <p className="text-xs text-stone-500 mb-2">
                  Wörter, die der Sprecher weniger als 5× verwendet hat, werden ausgeschlossen.
                  Dies verhindert, dass zufällige Einmalverwendungen mit hohen Ratios erscheinen.
                </p>
              </div>
            </details>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <InfoIcon />
              <div>
                <div className="text-sm font-medium text-blue-800 mb-1">Transparenz-Hinweis</div>
                <p className="text-sm text-blue-700">
                  Diese Stopwort-Liste wird kontinuierlich verbessert. Falls Sie ein Wort bemerken,
                  das gefiltert werden sollte (oder fälschlicherweise gefiltert wird), öffnen Sie
                  gerne ein Issue auf <a href="https://github.com/morit/bundestag-noun-analysis" className="underline">GitHub</a>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
