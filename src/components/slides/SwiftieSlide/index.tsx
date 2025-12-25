import { memo, useMemo } from 'react';
import {
  SlideIntro,
  SlideQuiz,
  shuffle,
  type SlidePhase,
  type QuizConfig,
} from '../shared';
import { ResultView } from './ResultView';

interface SwiftieSlideProps {
  phase: SlidePhase;
  onQuizAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
}

// The only person who mentioned Taylor Swift in the Bundestag
const SWIFTIE = {
  name: 'Daniel Baldy',
  party: 'SPD',
};

// Decoys: young women who might plausibly be Swifties (but aren't!)
const DECOYS = [
  { name: 'Ricarda Lang', party: 'GRÜNE' },
  { name: 'Nyke Slawik', party: 'GRÜNE' },
  { name: 'Deborah Düring', party: 'GRÜNE' },
];

export const SwiftieSlide = memo(function SwiftieSlide({
  phase,
  onQuizAnswer,
  onComplete,
}: SwiftieSlideProps) {
  const quiz = useMemo<QuizConfig>(() => {
    const correctOption = `${SWIFTIE.name} (${SWIFTIE.party})`;
    const decoyOptions = DECOYS.map((d) => `${d.name} (${d.party})`);

    return {
      question: 'Wer ist der einzige Swiftie im Bundestag?',
      options: shuffle([correctOption, ...decoyOptions]),
      correctAnswer: correctOption,
      explanation: `${SWIFTIE.name} ist der einzige, der "Taylor Swift" im Bundestag erwähnt hat – in einer Rede über Cybersicherheit!`,
    };
  }, []);

  if (phase === 'intro') {
    return (
      <SlideIntro
        emoji="💜"
        title="Shake it off!"
        subtitle="Ein Popstar hat es in den Bundestag geschafft."
      />
    );
  }

  if (phase === 'quiz') {
    return (
      <SlideQuiz
        quiz={quiz}
        onAnswer={onQuizAnswer ?? (() => {})}
        onComplete={onComplete ?? (() => {})}
      />
    );
  }

  return <ResultView swiftie={SWIFTIE} />;
});
