import { motion } from 'motion/react';
import type { TopSpeaker } from '@/data/wrapped';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';

interface TopSpeakersSlideProps {
  speakers: TopSpeaker[];
  onNext: () => void;
}

export function TopSpeakersSlide({ speakers, onNext }: TopSpeakersSlideProps) {
  const top3 = speakers.slice(0, 3);
  const rest = speakers.slice(3, 10);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10"
        >
          <span className="text-5xl md:text-6xl mb-4 block">🏆</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Top Speakers</h2>
          <p className="text-white/60 mt-2 text-lg">Wer hat am meisten geredet?</p>
        </motion.div>

        {/* Podium - larger on desktop */}
        <div className="flex items-end justify-center gap-4 md:gap-8 mb-10 h-72 md:h-80">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl"
                style={{ backgroundColor: `${getPartyColor(top3[1].party)}30` }}
              >
                🥈
              </div>
            </motion.div>
            <div
              className="w-28 md:w-36 rounded-t-2xl flex flex-col items-center justify-end pb-4 md:pb-6"
              style={{
                height: '140px',
                background: `linear-gradient(to top, ${getPartyColor(top3[1].party)}60, ${getPartyColor(top3[1].party)}20)`,
              }}
            >
              <p className="text-white font-bold text-sm md:text-base text-center px-2 leading-tight">
                {top3[1].name}
              </p>
              <PartyBadge party={top3[1].party} size="sm" className="mt-2" />
              <p className="text-white/80 text-sm md:text-base font-bold mt-1">{top3[1].speeches} Reden</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="mb-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg"
                style={{
                  backgroundColor: `${getPartyColor(top3[0].party)}40`,
                  boxShadow: `0 0 40px ${getPartyColor(top3[0].party)}40`
                }}
              >
                🥇
              </div>
            </motion.div>
            <div
              className="w-32 md:w-44 rounded-t-2xl flex flex-col items-center justify-end pb-4 md:pb-6"
              style={{
                height: '180px',
                background: `linear-gradient(to top, ${getPartyColor(top3[0].party)}70, ${getPartyColor(top3[0].party)}20)`,
              }}
            >
              <p className="text-white font-bold text-base md:text-lg text-center px-2 leading-tight">
                {top3[0].name}
              </p>
              <PartyBadge party={top3[0].party} size="md" className="mt-2" />
              <p className="text-white text-lg md:text-xl font-bold mt-1">{top3[0].speeches} Reden</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl"
                style={{ backgroundColor: `${getPartyColor(top3[2].party)}30` }}
              >
                🥉
              </div>
            </motion.div>
            <div
              className="w-24 md:w-32 rounded-t-2xl flex flex-col items-center justify-end pb-4"
              style={{
                height: '110px',
                background: `linear-gradient(to top, ${getPartyColor(top3[2].party)}50, ${getPartyColor(top3[2].party)}15)`,
              }}
            >
              <p className="text-white font-bold text-xs md:text-sm text-center px-1 leading-tight">
                {top3[2].name}
              </p>
              <PartyBadge party={top3[2].party} size="sm" className="mt-1" />
              <p className="text-white/80 text-xs md:text-sm font-bold mt-1">{top3[2].speeches}</p>
            </div>
          </motion.div>
        </div>

        {/* Rest of speakers - horizontal on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rest.map((speaker, i) => (
              <div
                key={speaker.name}
                className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/40 font-bold">{i + 4}.</span>
                  <span className="text-white text-sm">{speaker.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PartyBadge party={speaker.party} size="sm" />
                  <span className="text-white/60 text-sm font-medium">{speaker.speeches}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={onNext}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Weiter
        </motion.button>
      </motion.div>
    </div>
  );
}
