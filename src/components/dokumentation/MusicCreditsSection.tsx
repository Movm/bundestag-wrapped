import { motion } from 'motion/react';
import { Music, ExternalLink } from 'lucide-react';

interface TrackCredit {
  title: string;
  artist: string;
  section: string;
}

const tracks: TrackCredit[] = [
  { title: 'Night Owl', artist: 'Broke For Free', section: 'Intro' },
  { title: 'Living In Reverse', artist: 'Broke For Free', section: 'Zwischenfragen' },
  { title: 'I Know You\'re Out There', artist: 'Chromix', section: 'Diskriminierung' },
  { title: 'Mutant Club', artist: 'HoliznaCC0', section: 'Themen' },
  { title: 'Godsize', artist: 'IKILLYA', section: 'Drama' },
  { title: 'Hyperfun', artist: 'Kevin MacLeod', section: 'Swiftie' },
  { title: 'Hustle', artist: 'Kevin MacLeod', section: 'Reden, Top-Redner & Teilen' },
  { title: 'Dirt Rhodes', artist: 'Kevin MacLeod', section: 'Häufige Wörter' },
  { title: 'Nuff Stickers', artist: 'Kidkanevil & DZA', section: 'Gender' },
  { title: 'Love Others ICE', artist: 'Lopkerjo', section: 'Tonalität' },
  { title: 'APC Reflections', artist: 'jonas the plugexpert', section: 'Vokabular & Lieblingswörter' },
  { title: 'Canción Popular', artist: 'sarah rasines', section: 'Moin' },
  { title: 'Starling', artist: 'Podington Bear', section: 'Finale' },
];

export function MusicCreditsSection() {
  return (
    <section className="border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
            Musik-Credits
          </h2>
          <h3 className="text-2xl font-serif text-stone-900 mb-6">
            Hintergrundmusik
          </h3>

          <div className="bg-stone-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-stone-600 leading-relaxed">
              Alle Musiktitel stammen vom{' '}
              <a
                href="https://freemusicarchive.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Free Music Archive
              </a>{' '}
              und sind lizenziert unter{' '}
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 underline inline-flex items-center gap-1"
              >
                CC BY-NC-ND 4.0
                <ExternalLink size={12} />
              </a>
              .
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 pr-4 font-medium text-stone-500">Titel</th>
                  <th className="text-left py-2 pr-4 font-medium text-stone-500">Künstler</th>
                  <th className="text-left py-2 font-medium text-stone-500">Sektion</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    <td className="py-2 pr-4 text-stone-900 flex items-center gap-2">
                      <Music size={14} className="text-pink-400 flex-shrink-0" />
                      {track.title}
                    </td>
                    <td className="py-2 pr-4 text-stone-600">{track.artist}</td>
                    <td className="py-2 text-stone-400">{track.section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-stone-400 leading-relaxed">
            Quelle: Free Music Archive (freemusicarchive.org) | Lizenz: Creative Commons
            Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
