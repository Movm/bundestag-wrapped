/**
 * Skip Link Component
 * Allows keyboard/screen reader users to bypass navigation
 * and jump directly to main content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-pink-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      Zum Hauptinhalt springen
    </a>
  );
}
