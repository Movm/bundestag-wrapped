import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 pt-16 pb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-mono rounded">
          Algorithmus
        </span>
        <span className="text-stone-300">•</span>
        <span className="text-stone-500 text-sm">Wahlperiode 21</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-light text-stone-900 mb-6 leading-tight">
        Klassifikation von<br />
        <span className="font-medium">Bundestagsreden</span>
      </h1>
      <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
        Dokumentation des Algorithmus zur automatischen Kategorisierung
        parlamentarischer Beiträge aus den Plenarprotokollen des Deutschen Bundestages.
      </p>
    </motion.section>
  );
}
