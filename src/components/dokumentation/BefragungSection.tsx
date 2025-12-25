import { motion } from 'motion/react';
import { CodeBlock } from './ui';

export function BefragungSection() {
  return (
    <section className="border-t border-stone-200" id="befragung-klassifikation">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Regierungsbefragung
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Session-basierte Klassifikation
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Um formelle Reden von Antworten in der Regierungsbefragung zu unterscheiden, erkennt
            der Algorithmus <strong>Session-Grenzen</strong> im Protokolltext. Regierungsmitglieder
            (Bundeskanzler, Minister, Staatssekretäre) werden nur dann als "Befragung" klassifiziert,
            wenn sie innerhalb einer erkannten Q&A-Session sprechen.
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Das Problem</h4>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-900">
              <strong>Beispiel:</strong> Friedrich Merz hatte ursprünglich 108 "Reden" – aber nur
              13 davon waren tatsächliche Plenarvorträge. Die restlichen 95 waren Antworten auf
              Abgeordnetenfragen in der Regierungsbefragung.
            </p>
          </div>
          <p className="text-sm text-stone-600">
            Regierungsmitglieder sprechen im Format <code className="px-1.5 py-0.5 bg-stone-100 rounded text-xs">Name, Rolle:</code> statt
            <code className="px-1.5 py-0.5 bg-stone-100 rounded text-xs mx-1">Name (Partei):</code> –
            ohne Session-Erkennung würden alle ihre Beiträge als formelle Reden gezählt.
          </p>
        </motion.div>

        {/* Session Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.57, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Session-Erkennung</h4>
          <div className="bg-stone-900 rounded-xl p-6 text-white font-mono text-sm mb-4">
            <div className="space-y-2">
              <p className="text-stone-400"># Erkannte Session-Typen</p>
              <p className="text-emerald-400">BEFRAGUNG_START: <span className="text-white">"Befragung der Bundesregierung"</span></p>
              <p className="text-emerald-400">REGIERUNGSBEFRAGUNG: <span className="text-white">"Regierungsbefragung"</span></p>
              <p className="text-red-400">SESSION_END: <span className="text-white">"schließe ich die Befragung"</span></p>
              <p className="text-stone-500 mt-4"># Position-basierte Zuordnung</p>
              <p className="text-amber-400">IF <span className="text-white">speech_position</span> BETWEEN <span className="text-white">session_start</span> AND <span className="text-white">session_end</span>:</p>
              <p className="pl-4 text-stone-300">→ type = <span className="text-emerald-400">"befragung"</span></p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Session-Start (Beispiel)
              </div>
              <p className="text-sm text-stone-700 font-mono">
                "Ich rufe auf den Tagesordnungspunkt 1:<br/>
                <span className="text-emerald-600 font-semibold">Befragung der Bundesregierung</span>"
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Session-Ende (Beispiel)
              </div>
              <p className="text-sm text-stone-700 font-mono">
                "Hiermit <span className="text-red-600 font-semibold">schließe ich die Befragung</span><br/>
                der Bundesregierung."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Classification Logic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Klassifikationslogik</h4>
          <CodeBlock note="Formelle Reden und Befragungsantworten werden separat gezählt und in den Speaker-Profilen unterschieden.">
            <p className="text-stone-400"># Für Regierungsmitglieder</p>
            <p className="text-emerald-400">IF <span className="text-white">is_government_official</span> AND <span className="text-white">in_qa_session</span>:</p>
            <p className="pl-4 text-stone-300">→ type = <span className="text-sky-400">"befragung"</span> <span className="text-stone-500"># Q&A-Antwort</span></p>
            <p className="text-amber-400">ELIF <span className="text-white">is_government_official</span>:</p>
            <p className="pl-4 text-stone-300">→ type = <span className="text-emerald-400">"rede"</span> <span className="text-stone-500"># Formelle Rede</span></p>
          </CodeBlock>
        </motion.div>

        {/* Data Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.59, duration: 0.6 }}
        >
          <h4 className="font-medium text-stone-900 mb-4">Neue Datenfelder</h4>
          <p className="text-sm text-stone-600 mb-4">
            Im Speaker-JSON werden beide Metriken separat ausgewiesen:
          </p>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
              <span className="text-xs font-mono text-stone-500">friedrich-merz.json</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <p className="text-stone-600">{'{'}</p>
              <p className="pl-4 text-stone-700">"name": <span className="text-emerald-600">"Friedrich Merz"</span>,</p>
              <p className="pl-4 text-stone-700">"speeches": <span className="text-sky-600">13</span>, <span className="text-stone-400">// Formelle Reden</span></p>
              <p className="pl-4 text-stone-700">"befragungResponses": <span className="text-sky-600">86</span>, <span className="text-stone-400">// Q&A-Antworten</span></p>
              <p className="pl-4 text-stone-700">"totalWords": <span className="text-sky-600">37822</span></p>
              <p className="text-stone-600">{'}'}</p>
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <a
              href="/wrapped.json"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-colors group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="font-medium text-stone-900">Top Befragung-Responder</span>
                </div>
                <p className="text-xs text-stone-500">topBefragungResponders in wrapped.json</p>
              </div>
              <div className="flex items-center gap-2 text-stone-400 group-hover:text-sky-600">
                <span className="text-xs font-mono">JSON</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Top 3 Befragung-Responder
              </div>
              <ol className="text-sm text-stone-700 space-y-1">
                <li>1. Friedrich Merz (CDU/CSU) – 86</li>
                <li>2. Lars Klingbeil (SPD) – 79</li>
                <li>3. Stefan Rouenhoff (CDU/CSU) – 63</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
