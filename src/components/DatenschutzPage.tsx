import { motion } from 'motion/react';
import { SEO } from '@/components/seo/SEO';
import { PAGE_META } from '@/components/seo/constants';

export function DatenschutzPage() {
  return (
    <>
      <SEO
        title={PAGE_META.privacy.title}
        description={PAGE_META.privacy.description}
        canonicalUrl="/datenschutz"
      />
    <div className="min-h-screen page-bg flex flex-col items-center justify-center px-6 py-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
          Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortlich für diese Website ist Moritz Wächter.
              Kontaktdaten finden Sie im{' '}
              <a
                href="https://www.moritz-waechter.de/impressum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline"
              >
                Impressum
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Keine Datenerhebung</h2>
            <p>
              Diese Website erhebt, speichert oder verarbeitet keine personenbezogenen Daten.
              Es werden keine Cookies gesetzt, keine Tracking-Tools verwendet und keine
              Analyse-Dienste eingebunden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Hosting</h2>
            <p>
              Die Website wird als statische Seite gehostet. Der Hosting-Anbieter kann
              in Server-Logfiles automatisch Informationen speichern, die Ihr Browser
              übermittelt (z.B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs).
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Externe Links</h2>
            <p>
              Diese Website enthält Links zu externen Websites (GitHub, Bundestag).
              Für deren Inhalte und Datenschutzpraktiken sind die jeweiligen Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Ihre Rechte</h2>
            <p>
              Da wir keine personenbezogenen Daten erheben, entfallen die üblichen
              Betroffenenrechte (Auskunft, Löschung, etc.) mangels Anwendbarkeit.
              Bei Fragen können Sie sich dennoch jederzeit an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Sound Credits</h2>
            <p className="mb-2">
              Diese Website verwendet Sounds von{' '}
              <a
                href="https://freesound.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline"
              >
                Freesound.org
              </a>:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <a
                  href="https://freesound.org/people/nckn/sounds/256112/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  pleasant-done-notification.wav
                </a>{' '}
                von{' '}
                <a
                  href="https://freesound.org/people/nckn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  nckn
                </a>{' '}
                – Lizenz:{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  CC BY-NC 4.0
                </a>
              </li>
              <li>
                <a
                  href="https://freesound.org/people/The-Sacha-Rush/sounds/472506/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  appearance-effect.wav
                </a>{' '}
                von{' '}
                <a
                  href="https://freesound.org/people/The-Sacha-Rush/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  The-Sacha-Rush
                </a>{' '}
                – Lizenz:{' '}
                <a
                  href="https://creativecommons.org/publicdomain/zero/1.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline"
                >
                  CC0 1.0
                </a>
              </li>
            </ul>
          </section>
        </div>

        <p className="text-white/40 text-xs mt-10">
          Stand: Dezember 2024
        </p>
      </motion.div>
    </div>
    </>
  );
}
