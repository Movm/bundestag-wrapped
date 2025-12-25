import { motion } from 'motion/react';
import { PartyBadge } from '@/components/ui/PartyBadge';
import { getPartyColor } from '@/lib/party-colors';
import { SlideContainer, ScrollHint, itemVariants } from '../shared';

interface SwiftieData {
  name: string;
  party: string;
}

interface ResultViewProps {
  swiftie: SwiftieData;
}

export function ResultView({ swiftie }: ResultViewProps) {
  const partyColor = getPartyColor(swiftie.party);

  return (
    <SlideContainer
      innerClassName="flex flex-col items-center justify-center min-h-[70vh]"
      sparkles={{ color: '#9333ea', count: 15 }}
    >
      {/* Friendship bracelet emoji with bounce */}
      <motion.div
        variants={itemVariants}
        className="text-6xl md:text-7xl mb-6"
        animate={{
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        💜
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Der einzige Swiftie
        </h2>
        <p className="text-white/60 text-lg">im Bundestag</p>
      </motion.div>

      {/* Champion card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-purple-500/30 to-pink-500/20
                   border-2 border-purple-400/50 rounded-2xl p-8 backdrop-blur-sm
                   shadow-xl max-w-sm w-full mx-auto"
      >
        {/* Crown */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute -top-5 -right-3 text-3xl"
        >
          👑
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Friendship bracelets */}
          <div className="text-4xl mb-4">🩷💎🩵</div>

          <p
            className="text-2xl md:text-3xl font-black text-center mb-3"
            style={{
              color: partyColor,
              textShadow: `0 0 30px ${partyColor}50`,
            }}
          >
            {swiftie.name}
          </p>

          <PartyBadge party={swiftie.party} size="lg" className="mb-4" />

          <div className="text-center text-white/60 text-sm mt-2">
            <p>Erwähnte "Taylor Swift" und "Swifties"</p>
            <p className="mt-1">in einer Rede über Cybersicherheit</p>
          </div>
        </div>
      </motion.div>

      {/* Fun quote */}
      <motion.div
        variants={itemVariants}
        className="mt-8 max-w-md text-center px-4"
      >
        <p className="text-white/40 text-sm italic">
          "Taylor-Swift-Fans, Energiebetreiber oder auch die Polizei in
          Mecklenburg-Vorpommern, sie alle sind von Cyberangriffen betroffen."
        </p>
      </motion.div>

      <ScrollHint delay={2.5} className="mt-10" />
    </SlideContainer>
  );
}
