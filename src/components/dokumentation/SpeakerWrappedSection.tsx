import { motion } from 'motion/react';
import {
  spiritAnimalsTier1,
  spiritAnimalsTier2,
  spiritAnimalsTier3,
  spiritAnimalsTier4,
  spiritAnimalDistribution,
  slidesOverview,
} from './data';
import { CodeBlock, InfoIcon } from './ui';
import { SpiritAnimalQuiz } from './SpiritAnimalQuiz';

function AnimalCard({ emoji, name, title, criteria, size = 'normal' }: {
  emoji: string;
  name: string;
  title: string;
  criteria?: string;
  size?: 'normal' | 'small';
}) {
  const isSmall = size === 'small';
  return (
    <div className="border border-stone-200 rounded-lg p-3 bg-white">
      <div className={isSmall ? 'text-2xl mb-1' : 'text-3xl mb-2'}>{emoji}</div>
      <div className={`font-medium text-stone-900 ${isSmall ? 'text-xs' : 'text-sm'}`}>{name}</div>
      <div className={`text-pink-600 ${isSmall ? 'text-xs' : 'text-xs mb-2'}`}>{title}</div>
      {criteria && <div className="text-xs text-stone-500">{criteria}</div>}
    </div>
  );
}

export function SpeakerWrappedSection() {
  return (
    <section className="border-t border-stone-200 bg-white" id="speaker-wrapped">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.98, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Individual Wrapped
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Personalisierte Abgeordneten-Statistiken
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Jeder Abgeordnete erhält unter <code className="px-1.5 py-0.5 bg-stone-100 rounded text-xs">/wrapped/[slug]</code> eine
            personalisierte "Bundestag Wrapped"-Erfahrung mit Statistiken, Rankings, Signature Words und einem Spirit Animal.
          </p>
        </motion.div>

        {/* Slides Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Die 6 Slides</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {slidesOverview.map((slide) => (
              <div key={slide.num} className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-mono">
                  {slide.num}
                </div>
                <div>
                  <span className="font-medium text-stone-900 text-sm">{slide.name}</span>
                  <span className="text-stone-500 text-sm ml-2">– {slide.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Spirit Animal Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.01, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-2">Welches Bundestag-Tier bist du?</h4>
          <p className="text-sm text-stone-600 mb-4">
            Beantworte 4 kurze Fragen und finde heraus, welches Spirit Animal du im Bundestag wärst!
          </p>
          <SpiritAnimalQuiz />
        </motion.div>

        {/* Spirit Animals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.02, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-2">Alle 17 Spirit Animals</h4>
          <p className="text-sm text-stone-600 mb-6">
            Jeder Abgeordnete erhält ein "Bundestag-Tier" basierend auf dem Redeverhalten.
            Alle Charakterisierungen sind <strong>positiv</strong>. Die Zuweisung erfolgt
            nach einem priorisierten Tier-System.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-800">
              <InfoIcon />
              <span className="text-sm font-medium">AfD-Abgeordnete erhalten keine Spirit Animals.</span>
            </div>
          </div>

          {/* Tier 1 */}
          <div className="mb-6">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              Tier 1: Elite-Redner
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {spiritAnimalsTier1.map((animal) => (
                <AnimalCard key={animal.name} {...animal} />
              ))}
            </div>
          </div>

          {/* Tier 2 */}
          <div className="mb-6">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              Tier 2: Spezialisten
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              {spiritAnimalsTier2.map((animal) => (
                <AnimalCard key={animal.name} {...animal} size="small" />
              ))}
            </div>
          </div>

          {/* Tier 3 */}
          <div className="mb-6">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              Tier 3: Arbeitsstile
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {spiritAnimalsTier3.map((animal) => (
                <div key={animal.name} className="border border-stone-200 rounded-lg p-3 bg-white">
                  <div className="text-2xl mb-1">{animal.emoji}</div>
                  <div className="font-medium text-stone-900 text-xs">{animal.name}</div>
                  <div className="text-xs text-pink-600">{animal.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 4 */}
          <div>
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              Tier 4: Zuverlässige Mitstreiter
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              {spiritAnimalsTier4.map((animal) => (
                <AnimalCard key={animal.name} {...animal} size="small" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Assignment Logic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.04, duration: 0.6 }}
          className="mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-4">Zuweisungslogik</h4>
          <CodeBlock>
            <p className="text-stone-400"># Priorisierte Prüfung (erste Übereinstimmung gewinnt)</p>
            <p className="text-emerald-400">IF <span className="text-white">wordsRank ≤ 10</span>: → 🐘 Elefant</p>
            <p className="text-emerald-400">ELIF <span className="text-white">speechRank ≤ 10 AND wordsRank ≤ 20</span>: → 🦅 Adler</p>
            <p className="text-emerald-400">ELIF <span className="text-white">partySpeechRank ≤ 3 AND partySize ≥ 20</span>: → 🦁 Löwe</p>
            <p className="text-amber-400">ELIF <span className="text-white">signatureWordRatio ≥ 50</span>: → 🦉 Eule</p>
            <p className="text-amber-400">ELIF <span className="text-white">interrupterRank ≤ 20</span>: → 🐺 Wolf</p>
            <p className="text-amber-400">ELIF <span className="text-white">interruptedRank ≤ 20</span>: → 🐻 Bär</p>
            <p className="text-stone-500">...</p>
            <p className="text-red-400">ELSE: → 🐝 Biene <span className="text-stone-500"># Default</span></p>
          </CodeBlock>
        </motion.div>

        {/* Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.06, duration: 0.6 }}
        >
          <h4 className="font-medium text-stone-900 mb-4">Verteilung (WP21)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {spiritAnimalDistribution.map((item) => (
              <div key={item.name} className="bg-stone-50 rounded-lg p-3 text-center">
                <div className="text-2xl">{item.emoji}</div>
                <div className="text-sm font-medium text-stone-900">{item.name}</div>
                <div className="text-xs text-stone-500">{item.count} ({item.pct})</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-4">
            Die hohe Anzahl an Eulen erklärt sich dadurch, dass viele Abgeordnete mindestens
            ein Wort haben, das sie 50× häufiger als ihre Fraktion nutzen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
