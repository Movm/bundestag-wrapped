import { motion } from 'motion/react';
import { useState } from 'react';

// Complete lexicons from src/noun_analysis/lexicons.py
const ADJECTIVE_LEXICONS = {
  affirmative: {
    name: 'Positiv',
    emoji: '😊',
    description: 'Positive Bewertungen',
    words: [
      'stark', 'erfolgreich', 'wirksam', 'effektiv', 'leistungsfähig',
      'kompetent', 'qualifiziert', 'professionell', 'zuverlässig',
      'kraftvoll', 'mächtig', 'tatkräftig',
      'sicher', 'stabil', 'geschützt', 'bewährt', 'solide',
      'verlässlich', 'beständig',
      'bedeutend', 'wertvoll', 'wesentlich', 'zentral',
      'entscheidend', 'maßgeblich', 'grundlegend', 'elementar',
      'hervorragend', 'ausgezeichnet', 'vorbildlich', 'beispielhaft',
      'exzellent', 'erstklassig', 'hochwertig', 'brillant',
      'innovativ', 'zukunftsfähig', 'fortschrittlich',
      'nachhaltig', 'zukunftsweisend', 'bahnbrechend',
      'gerecht', 'fair', 'ausgewogen', 'vernünftig', 'angemessen',
      'sachlich', 'konstruktiv', 'lösungsorientiert',
      'solidarisch', 'sozial', 'menschlich', 'würdig',
      'respektvoll', 'demokratisch', 'freiheitlich',
      'wirtschaftlich', 'rentabel', 'produktiv', 'wettbewerbsfähig',
    ],
  },
  critical: {
    name: 'Kritisch',
    emoji: '⚠️',
    description: 'Negative Bewertungen',
    words: [
      'gefährlich', 'riskant', 'bedrohlich', 'kritisch', 'prekär',
      'unsicher', 'instabil', 'brisant',
      'gescheitert', 'verfehlt', 'misslungen', 'fehlgeschlagen',
      'erfolglos', 'wirkungslos',
      'falsch', 'irrig', 'fehlerhaft', 'mangelhaft',
      'unzutreffend', 'irreführend',
      'schlecht', 'schlimm', 'übel', 'miserabel', 'katastrophal',
      'desaströs', 'verheerend', 'fatal', 'dramatisch',
      'schädlich', 'nachteilig', 'destruktiv', 'kontraproduktiv',
      'problematisch', 'bedenklich',
      'ungerecht', 'unfair', 'einseitig', 'parteiisch',
      'willkürlich', 'diskriminierend',
      'schwach', 'ineffektiv', 'unzureichend',
      'ungenügend', 'insuffizient', 'inadäquat',
      'teuer', 'kostspielig', 'unbezahlbar', 'verschwenderisch',
    ],
  },
  aggressive: {
    name: 'Aggressiv',
    emoji: '😤',
    description: 'Angriffe, Spott, Verachtung',
    words: [
      'absurd', 'lächerlich', 'grotesk', 'bizarr', 'abwegig',
      'unsinnig', 'wahnwitzig', 'irrsinnig', 'haarsträubend',
      'hanebüchen', 'aberwitzig',
      'unverantwortlich', 'fahrlässig', 'rücksichtslos', 'skrupellos',
      'verantwortungslos', 'gewissenlos', 'leichtsinnig',
      'skandalös', 'empörend', 'unerhört', 'unverschämt', 'dreist',
      'ungeheuerlich', 'unfassbar', 'bodenlos', 'schändlich',
      'inkompetent', 'unfähig', 'dilettantisch', 'stümperhaft',
      'amateurhaft', 'unprofessionell', 'planlos', 'kopflos',
      'verlogen', 'heuchlerisch', 'scheinheilig', 'unehrlich',
      'unglaubwürdig', 'doppelzüngig', 'korrupt', 'betrügerisch',
      'erbärmlich', 'armselig', 'kläglich', 'jämmerlich',
      'peinlich', 'beschämend', 'blamabel',
    ],
  },
  labeling: {
    name: 'Etikettierend',
    emoji: '🏷️',
    description: 'Ideologische Zuschreibungen',
    words: [
      'ideologisch', 'ideologiegetrieben', 'ideologieverblendet',
      'radikal', 'extremistisch', 'fanatisch', 'fundamentalistisch',
      'verblendet', 'verbohrt', 'dogmatisch',
      'links', 'linksradikal', 'linksextrem', 'linksgrün',
      'rechts', 'rechtsradikal', 'rechtsextrem', 'rechtspopulistisch',
      'populistisch', 'nationalistisch', 'sozialistisch', 'kommunistisch',
      'klimahysterisch', 'woke',
      'weltfremd', 'realitätsfern', 'abgehoben', 'elitär',
      'systemisch', 'staatsfeindlich', 'verfassungsfeindlich',
    ],
  },
};

const VERB_LEXICONS = {
  solution: {
    name: 'Lösungsorientiert',
    emoji: '🔧',
    description: 'Aufbauen, verbessern, ermöglichen',
    words: [
      'unterstützen', 'fördern', 'stärken', 'helfen', 'beistehen',
      'assistieren', 'beitragen', 'mitwirken',
      'aufbauen', 'entwickeln', 'gestalten', 'schaffen', 'errichten',
      'etablieren', 'gründen', 'initiieren',
      'investieren', 'finanzieren', 'bereitstellen', 'zuweisen',
      'bewilligen', 'ausgeben',
      'schützen', 'bewahren', 'sichern', 'verteidigen', 'garantieren',
      'wahren', 'erhalten',
      'verbessern', 'optimieren', 'modernisieren', 'reformieren',
      'erneuern', 'weiterentwickeln', 'ausbauen', 'erweitern',
      'lösen', 'beheben', 'beseitigen', 'überwinden', 'meistern',
      'ermöglichen', 'erlauben', 'eröffnen', 'befähigen',
      'berechtigen', 'freigeben',
      'vorankommen', 'fortschreiten', 'gelingen', 'erreichen',
      'verwirklichen', 'realisieren', 'umsetzen',
      'heilen', 'reparieren', 'wiederherstellen', 'sanieren',
      'rehabilitieren', 'regenerieren',
      'planen', 'vorbereiten', 'anstreben', 'beabsichtigen',
      'vorhaben', 'anvisieren',
    ],
  },
  problem: {
    name: 'Problemfokussiert',
    emoji: '⚠️',
    description: 'Schaden, scheitern, blockieren',
    words: [
      'zerstören', 'vernichten', 'ruinieren', 'demolieren',
      'kaputtmachen', 'zunichtemachen', 'zersetzen',
      'kürzen', 'streichen', 'reduzieren', 'abbauen', 'einsparen',
      'zusammenstreichen', 'halbieren', 'dezimieren',
      'gefährden', 'bedrohen', 'riskieren', 'aufs-spiel-setzen',
      'untergraben', 'aushöhlen',
      'versagen', 'scheitern', 'fehlschlagen', 'versäumen',
      'vernachlässigen', 'verpassen',
      'schaden', 'schädigen', 'beeinträchtigen',
      'schwächen', 'beschädigen', 'belasten',
      'blockieren', 'verhindern', 'sabotieren', 'torpedieren',
      'boykottieren', 'obstruieren',
      'eskalieren', 'verschlimmern', 'verschlechtern',
      'verschärfen', 'zuspitzen',
      'zusammenbrechen', 'kollabieren', 'abstürzen', 'einbrechen',
    ],
  },
  collaborative: {
    name: 'Kooperativ',
    emoji: '🤝',
    description: 'Zusammenarbeiten, verhandeln',
    words: [
      'zustimmen', 'einwilligen', 'genehmigen', 'billigen',
      'befürworten', 'gutheißen',
      'zusammenarbeiten', 'kooperieren', 'mitwirken', 'mitarbeiten',
      'partizipieren', 'teilnehmen',
      'einigen', 'vermitteln', 'ausgleichen', 'annähern',
      'überbrücken', 'versöhnen',
      'verhandeln', 'beraten', 'diskutieren', 'austauschen',
      'konsultieren', 'abstimmen',
      'einbeziehen', 'einbinden', 'beteiligen', 'integrieren',
      'berücksichtigen', 'respektieren',
    ],
  },
  confrontational: {
    name: 'Konfrontativ',
    emoji: '⚔️',
    description: 'Angreifen, vorwerfen, ablehnen',
    words: [
      'angreifen', 'attackieren', 'bekämpfen', 'bekriegen',
      'anfechten', 'anprangern',
      'vorwerfen', 'beschuldigen', 'bezichtigen', 'anklagen',
      'unterstellen', 'verleumden', 'diffamieren',
      'kritisieren', 'tadeln', 'rügen', 'beanstanden', 'bemängeln',
      'monieren', 'missbilligen',
      'ablehnen', 'zurückweisen', 'verwerfen', 'widersprechen',
      'verweigern', 'abweisen', 'abschmettern',
      'verantworten', 'verurteilen', 'brandmarken', 'geißeln',
      'bestreiten', 'anzweifeln', 'infrage-stellen', 'dementieren',
      'widerlegen',
      'drohen', 'androhen', 'warnen', 'mahnen',
    ],
  },
  demanding: {
    name: 'Fordernd',
    emoji: '💪',
    description: 'Fordern, verlangen, bestehen',
    words: [
      'fordern', 'verlangen', 'bestehen', 'drängen', 'pochen',
      'beharren', 'insistieren',
      'müssen', 'zwingen', 'nötigen', 'verpflichten',
      'auffordern', 'auferlegen',
      'druck-machen', 'unter-druck-setzen', 'einfordern',
      'durchsetzen', 'erzwingen',
      'aufrufen', 'appellieren', 'anmahnen', 'ermahnen',
      'beschwören', 'antreiben',
    ],
  },
  acknowledging: {
    name: 'Anerkennend',
    emoji: '👏',
    description: 'Loben, danken, würdigen',
    words: [
      'loben', 'würdigen', 'honorieren', 'wertschätzen',
      'anerkennen', 'respektieren',
      'danken', 'bedanken', 'verdanken',
      'begrüßen', 'willkommen-heißen', 'freuen',
      'gratulieren', 'beglückwünschen', 'feiern',
      'hervorheben', 'betonen',
      'schätzen', 'achten', 'ehren', 'hochachten',
    ],
  },
};

const DISCRIMINATORY_LEXICONS = {
  xenophobic: {
    name: 'Fremdenfeindlich',
    emoji: '🚫',
    description: 'Anti-Ausländer Begriffe',
    words: [
      'überfremdung', 'masseneinwanderung', 'massenmigration',
      'migrationswelle', 'flüchtlingswelle', 'asylflut',
      'einwanderungsflut', 'migrantenkriminalität',
      'ausländerkriminalität', 'ausländergewalt',
      'grenzöffnung', 'kontrollverlust', 'staatsversagen',
    ],
  },
  homophobic: {
    name: 'Homophob',
    emoji: '🚫',
    description: 'Anti-LGBTQ+ Begriffe',
    words: [
      'genderideologie', 'genderwahn', 'gendergaga',
      'frühsexualisierung', 'regenbogenideologie',
      'transideologie', 'transwahn',
      'gendersprache', 'gendersternchen',
    ],
  },
  islamophobic: {
    name: 'Islamophob',
    emoji: '🚫',
    description: 'Geladene anti-muslimische Begriffe',
    words: [
      'islamisierung', 'islamofaschismus', 'kopftuchzwang',
    ],
  },
  dog_whistle: {
    name: 'Codiert',
    emoji: '🔔',
    description: 'Verdeckte extremistische Begriffe',
    words: [
      'bevölkerungsaustausch', 'umvolkung', 'großer-austausch',
      'remigration', 'rückführungsoffensive',
      'ethnokulturell', 'biodeutsch', 'passdeutsch',
      'altparteien', 'systemmedien', 'lügenpresse',
      'globalisten', 'eliten', 'davos',
      'great-reset', 'plandemie',
    ],
  },
};

function WordList({ words, color = 'stone' }: { words: string[]; color?: string }) {
  const bgColor = color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600';
  return (
    <div className="flex flex-wrap gap-1">
      {words.map((word) => (
        <span
          key={word}
          className={`text-xs px-2 py-0.5 ${bgColor} rounded font-mono`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function CollapsibleCategory({
  name,
  emoji,
  description,
  words,
  color = 'stone',
  defaultOpen = false,
}: {
  name: string;
  emoji: string;
  description: string;
  words: string[];
  color?: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const borderColor = color === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-stone-200';

  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <div className="text-left">
            <span className="font-medium text-stone-900">{name}</span>
            <span className="text-stone-400 text-sm ml-2">({words.length} Wörter)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">{description}</span>
          <span className="text-stone-400">{isOpen ? '▼' : '▶'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-stone-100">
          <WordList words={words} color={color} />
        </div>
      )}
    </div>
  );
}

export function ToneMethodologySection() {
  return (
    <section className="border-t border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Sprachanalyse
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-4">
            Zwei Dimensionen der politischen Kommunikation
          </h3>
          <p className="text-stone-600 leading-relaxed mb-8">
            Die Analyse unterscheidet zwischen <strong>Tonalität</strong> (wie wird gesprochen)
            und <strong>Framing</strong> (welche Begriffe werden verwendet). Diese Trennung
            folgt der Politolinguistik: Adjektive und Verben sind bewertend, Substantive sind rahmend.
          </p>
        </motion.div>

        {/* Two-dimension visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Tonalität */}
          <div className="border border-stone-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎭</span>
              <div>
                <h4 className="font-medium text-stone-900">Tonalität</h4>
                <p className="text-sm text-stone-500">Wie wird gesprochen?</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Wortarten:</span>
                <span className="font-mono text-stone-700">Adjektive, Verben</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Misst:</span>
                <span className="text-stone-700">Evaluativen Stil</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Beispiel:</span>
                <span className="text-stone-700 italic">"Das ist absurd"</span>
              </div>
            </div>
          </div>

          {/* Framing */}
          <div className="border border-stone-200 rounded-lg p-6 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏷️</span>
              <div>
                <h4 className="font-medium text-stone-900">Framing</h4>
                <p className="text-sm text-stone-500">Welche Begriffe werden verwendet?</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Wortarten:</span>
                <span className="font-mono text-stone-700">Substantive (Schlagwörter)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Misst:</span>
                <span className="text-stone-700">Konzeptuelle Rahmung</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500">Beispiel:</span>
                <span className="text-stone-700 italic">"Asylflut" vs "Schutzsuchende"</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why separate? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-stone-50 rounded-lg p-6 mb-12"
        >
          <h4 className="font-medium text-stone-900 mb-3">Warum getrennt?</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-0.5">•</span>
              <span><strong>Adjektive sind bewertend:</strong> "Das ist lächerlich" – direkte Wertung</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-0.5">•</span>
              <span><strong>Substantive sind rahmend:</strong> "Überfremdung" – setzt Deutungsrahmen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 mt-0.5">•</span>
              <span><strong>Beides misst verschiedene Phänomene:</strong> Eine Partei kann höflichen Ton (wenig aggressive Adjektive) mit geladener Terminologie (Schlagwörter) kombinieren</span>
            </li>
          </ul>
        </motion.div>

        {/* Adjective Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-12"
        >
          <h4 className="text-sm font-medium text-stone-900 mb-2">Adjektiv-Kategorien</h4>
          <p className="text-xs text-stone-500 mb-4">Klicken zum Aufklappen • {Object.values(ADJECTIVE_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Wörter gesamt</p>
          <div className="space-y-2">
            {Object.entries(ADJECTIVE_LEXICONS).map(([id, cat]) => (
              <CollapsibleCategory
                key={id}
                name={cat.name}
                emoji={cat.emoji}
                description={cat.description}
                words={cat.words}
              />
            ))}
          </div>
        </motion.div>

        {/* Verb Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-12"
        >
          <h4 className="text-sm font-medium text-stone-900 mb-2">Verb-Kategorien</h4>
          <p className="text-xs text-stone-500 mb-4">Klicken zum Aufklappen • {Object.values(VERB_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Wörter gesamt</p>
          <div className="space-y-2">
            {Object.entries(VERB_LEXICONS).map(([id, cat]) => (
              <CollapsibleCategory
                key={id}
                name={cat.name}
                emoji={cat.emoji}
                description={cat.description}
                words={cat.words}
              />
            ))}
          </div>
        </motion.div>

        {/* Framing Categories (Discriminatory) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-12"
        >
          <h4 className="text-sm font-medium text-stone-900 mb-2">Framing-Kategorien (Schlagwörter)</h4>
          <p className="text-xs text-stone-500 mb-4">Separat angezeigt, nicht im Ranking • {Object.values(DISCRIMINATORY_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Wörter gesamt</p>
          <div className="space-y-2">
            {Object.entries(DISCRIMINATORY_LEXICONS).map(([id, cat]) => (
              <CollapsibleCategory
                key={id}
                name={cat.name}
                emoji={cat.emoji}
                description={cat.description}
                words={cat.words}
                color="amber"
              />
            ))}
          </div>
        </motion.div>

        {/* Methodik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <h4 className="text-sm font-medium text-stone-900 mb-4">Technische Methodik</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">Verarbeitung</h5>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• spaCy de_core_news_lg für POS-Tagging</li>
                <li>• Lemmatisierung für Wortformenabgleich</li>
                <li>• {Object.values(ADJECTIVE_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Adjektive in 4 Kategorien</li>
                <li>• {Object.values(VERB_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Verben in 6 Kategorien</li>
                <li>• {Object.values(DISCRIMINATORY_LEXICONS).reduce((sum, cat) => sum + cat.words.length, 0)} Schlagwörter in 4 Kategorien</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">Score-Formeln</h5>
              <ul className="text-sm text-stone-600 space-y-1 font-mono">
                <li>• Aggression = aggressive_adj / all_adj</li>
                <li>• Kooperation = collab_verbs / (collab + confront)</li>
                <li>• Framing = discrim_terms / total_words × 1000</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Academic reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-stone-200"
        >
          <p className="text-xs text-stone-400">
            Methodischer Ansatz basiert auf der Politolinguistik (Wengeler, Klein, Wodak).
            Unterscheidung zwischen Schlagwörtern (Framing) und wertender Sprache (Tonalität)
            folgt der Forschung zu politischen Kampfbegriffen im deutschen Parlamentsdiskurs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
