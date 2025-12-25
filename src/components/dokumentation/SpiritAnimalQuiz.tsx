import { useState } from 'react';
import { motion } from 'motion/react';
import { quizQuestions, calculateAnimal, type QuizResult } from './data';

export function SpiritAnimalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleAnswer = (value: string) => {
    const question = quizQuestions[currentQuestion];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult(calculateAnimal(newAnswers));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-pink-50 to-pink-50 border border-pink-200 rounded-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-4"
        >
          {result.emoji}
        </motion.div>
        <h4 className="text-2xl font-bold text-stone-900 mb-1">{result.name}</h4>
        <p className="text-pink-600 font-medium mb-4">{result.title}</p>
        <p className="text-stone-600 mb-6">{result.reason}</p>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Nochmal spielen
        </button>
      </motion.div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-stone-400">
          Frage {currentQuestion + 1} von {quizQuestions.length}
        </span>
        <div className="flex gap-1">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i <= currentQuestion ? 'bg-pink-500' : 'bg-stone-300'}`}
            />
          ))}
        </div>
      </div>
      <h4 className="text-lg font-medium text-stone-900 mb-4">{question.question}</h4>
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="w-full text-left px-4 py-3 bg-white border border-stone-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm text-stone-700"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
