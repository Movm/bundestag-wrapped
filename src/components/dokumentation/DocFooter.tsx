export function DocFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <p>
            Datenquelle:{' '}
            <a
              href="https://www.bundestag.de/protokolle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-stone-900 underline"
            >
              Plenarprotokolle des Deutschen Bundestages
            </a>
          </p>
          <p className="font-mono text-xs text-stone-400">
            Stand: Dezember 2025 • WP21
          </p>
        </div>
      </div>
    </footer>
  );
}
