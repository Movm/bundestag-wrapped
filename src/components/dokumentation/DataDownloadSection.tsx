import { DocSection, SectionHeader, DownloadLink, InfoCard } from './ui';

const GITHUB_RELEASE_BASE =
  'https://github.com/Movm/bundestag-analysis/releases/download/v1.0.0-wp21';

const DATA_FILES = [
  {
    name: 'reden.json.gz',
    title: 'Reden',
    description: '4.226 formelle Reden mit Volltext',
    color: 'blue' as const,
  },
  {
    name: 'wortbeitraege.json.gz',
    title: 'Wortbeiträge',
    description: '2.114 Beiträge (Befragung, Fragestunde, etc.)',
    color: 'emerald' as const,
  },
  {
    name: 'zwischenrufe.json.gz',
    title: 'Zwischenrufe',
    description: '8.004 Zwischenrufe mit Sentiment-Klassifikation',
    color: 'pink' as const,
  },
  {
    name: 'sprecher.json',
    title: 'Sprecher:innen',
    description: '~700 Profile mit Statistiken',
    color: 'stone' as const,
  },
  {
    name: 'parteien.json',
    title: 'Parteien',
    description: 'Statistiken je Fraktion',
    color: 'blue' as const,
  },
  {
    name: 'ton.json',
    title: 'Ton-Analyse',
    description: 'Schema D+E Scores pro Partei',
    color: 'emerald' as const,
  },
  {
    name: 'gender.json',
    title: 'Gender-Analyse',
    description: 'Geschlechterverteilung im Bundestag',
    color: 'pink' as const,
  },
  {
    name: 'themen.json',
    title: 'Themen-Analyse',
    description: '13 Politikfelder pro Partei',
    color: 'stone' as const,
  },
];

export function DataDownloadSection() {
  return (
    <DocSection className="py-16 px-4 bg-stone-50" delay={0.8} id="daten-download">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          tag="Open Data"
          title="Rohdaten herunterladen"
          description="Alle Analysedaten stehen als JSON zum Download bereit. Die Daten sind frei nutzbar für Forschung, Journalismus und eigene Projekte."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {DATA_FILES.map((file) => (
            <DownloadLink
              key={file.name}
              href={`${GITHUB_RELEASE_BASE}/${file.name}`}
              title={file.title}
              description={file.description}
              color={file.color}
            />
          ))}
        </div>

        <InfoCard className="mt-8">
          <h4 className="font-medium text-stone-900 mb-3">Hinweise zur Nutzung</h4>
          <ul className="text-sm text-stone-600 space-y-2">
            <li>
              <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                .json.gz
              </span>{' '}
              Dateien sind gzip-komprimiert für schnelleren Download
            </li>
            <li>
              Alle Dateien folgen einem einheitlichen Schema mit Metadaten-Header
            </li>
            <li>
              Die{' '}
              <a
                href={`${GITHUB_RELEASE_BASE}/manifest.json`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 underline hover:text-stone-700"
              >
                manifest.json
              </a>{' '}
              enthält SHA-256 Prüfsummen aller Dateien
            </li>
            <li>
              Datenquelle:{' '}
              <a
                href="https://www.bundestag.de/protokolle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 underline hover:text-stone-700"
              >
                Plenarprotokolle des Deutschen Bundestages
              </a>
            </li>
          </ul>
        </InfoCard>

        <div className="mt-6 text-center">
          <a
            href="https://github.com/Movm/bundestag-analysis/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Alle Releases auf GitHub
          </a>
        </div>
      </div>
    </DocSection>
  );
}
