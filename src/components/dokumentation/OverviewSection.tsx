import { motion } from 'motion/react';
import { StepCard, CodeBlock } from './ui';

export function OverviewSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
        Übersicht
      </h2>
      <h3 className="text-2xl font-serif text-stone-900 mb-6">
        Wie funktioniert die Klassifikation?
      </h3>
      <div className="prose prose-stone max-w-none">
        <p className="text-stone-600 leading-relaxed">
          Der Algorithmus analysiert Plenarprotokolle des Bundestages in zwei Schritten:
          Zunächst werden <strong>strukturelle Grenzen</strong> erkannt (Rednerwechsel,
          Präsidiumseinschübe), dann wird der <strong>Textbeginn</strong> jedes Beitrags
          analysiert, um den Typ zu bestimmen.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <StepCard number={1} title="Grenzenerkennung">
          Identifikation von Rednergrenzen durch Regex-Muster wie
          <code className="px-1.5 py-0.5 bg-stone-100 rounded text-xs mx-1">Name (Partei):</code>
          und Präsidiumseinschüben wie
          <code className="px-1.5 py-0.5 bg-stone-100 rounded text-xs mx-1">Präsident/in Name:</code>
        </StepCard>
        <StepCard number={2} title="Musterabgleich">
          Analyse der ersten 100-300 Zeichen auf charakteristische Eröffnungsmuster
          wie Präsidiums-Anrede, Frage-Formulierung oder Abstimmungserklärung.
        </StepCard>
      </div>

      <div className="mt-12">
        <CodeBlock
          title="Entscheidungslogik"
          note="Formelle Reden (Präsidium + Anrede) werden unabhängig von der Länge erfasst. Die 500-Wort-Grenze gilt nur für nicht-formelle Beiträge wie Zwischenfragen oder Erklärungen."
        >
          <p className="text-emerald-400">
            IF <span className="text-white">vorherige_grenze == Präsidium</span> AND <span className="text-white">beginnt_mit_anrede</span>:
          </p>
          <p className="pl-4 text-stone-300">→ <span className="text-emerald-400">"rede"</span> <span className="text-stone-500"># jede Länge</span></p>
          <p className="text-amber-400">ELIF <span className="text-white">wortanzahl &gt;= 500</span>:</p>
          <p className="pl-4 text-stone-300">→ klassifiziere_nach_eröffnungsmuster() <span className="text-stone-500"># sonstige Kategorien</span></p>
          <p className="text-red-400">ELSE:</p>
          <p className="pl-4 text-stone-300">→ überspringe <span className="text-stone-500"># nicht formell + kurz</span></p>
        </CodeBlock>
      </div>
    </motion.section>
  );
}
