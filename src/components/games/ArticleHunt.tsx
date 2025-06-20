import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Scenario {
  id: number;
  situation: string;
  correctArticle: string;
  explanation: string;
  options: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: "A newspaper is being prevented from publishing a story about government corruption.",
    correctArticle: "Article 19(1)(a)",
    explanation: "Freedom of Speech and Expression includes freedom of the press.",
    options: ["Article 19(1)(a)", "Article 21", "Article 14", "Article 32"]
  },
  {
    id: 2,
    situation: "A person is arrested and not told the reason for their arrest.",
    correctArticle: "Article 22",
    explanation: "Right to be informed of the grounds of arrest is guaranteed under Article 22.",
    options: ["Article 22", "Article 20", "Article 21", "Article 23"]
  },
  {
    id: 3,
    situation: "A school is denying admission based on religion.",
    correctArticle: "Article 15",
    explanation: "Prohibition of discrimination on grounds of religion, race, caste, sex, or place of birth.",
    options: ["Article 15", "Article 14", "Article 16", "Article 17"]
  },
  {
    id: 4,
    situation: "Workers in a factory are being forced to work without pay.",
    correctArticle: "Article 23",
    explanation: "Prohibition of forced labor and trafficking.",
    options: ["Article 23", "Article 24", "Article 21", "Article 19(1)(g)"]
  },
  {
    id: 5,
    situation: "A minority community wants to establish an educational institution.",
    correctArticle: "Article 30",
    explanation: "Right of minorities to establish and administer educational institutions.",
    options: ["Article 30", "Article 29", "Article 21A", "Article 28"]
  }
];

const ArticleHunt: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [scenarioHistory, setScenarioHistory] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const getRandomScenario = () => {
    const availableScenarios = scenarios.filter(scenario => !scenarioHistory.includes(scenario.id));
    if (availableScenarios.length === 0) {
      setGameOver(true);
      return;
    }
    const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setCurrentScenario(randomScenario);
    setScenarioHistory([...scenarioHistory, randomScenario.id]);
    setTimeLeft(30);
  };

  useEffect(() => {
    getRandomScenario();
  }, []);

  useEffect(() => {
    if (!answered && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !answered) {
      handleAnswer('');
    }
  }, [timeLeft, answered, gameOver]);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    setShowExplanation(true);
    if (answer === currentScenario?.correctArticle) {
      setScore(score + Math.max(10, timeLeft));
    }
  };

  const nextScenario = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    getRandomScenario();
  };

  const resetGame = () => {
    setScore(0);
    setScenarioHistory([]);
    setGameOver(false);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    getRandomScenario();
  };

  if (!currentScenario) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] px-4 py-10">
      <div className="w-full max-w-2xl bg-white/5 border border-[#f5e1a0]/20 rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-[#f5e1a0] mb-4 font-playfair">Article Hunt</h2>
        <div className="flex justify-between mb-6">
          <span className="text-lg text-[#f5e1a0] font-bold">Score: {score}</span>
          {!answered && !gameOver && (
            <span className="text-lg text-white/80">Time Left: {timeLeft}s</span>
          )}
        </div>
        {gameOver ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#f5e1a0] mb-4">Game Over!</h3>
            <p className="mb-4 text-white/80">Final Score: <span className="text-[#f5e1a0] font-bold">{score}</span></p>
            <button
              onClick={resetGame}
              className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-[#232b39] rounded-xl shadow-lg p-6 mb-8 border border-[#f5e1a0]/10">
              <h3 className="text-xl font-bold text-[#f5e1a0] mb-4">Situation:</h3>
              <p className="text-lg text-white mb-4">{currentScenario.situation}</p>
              <p className="text-gray-400">Which constitutional article applies here?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentScenario.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`p-4 rounded-xl text-left font-semibold text-lg transition-all duration-200 shadow-lg border-2 
                    ${answered
                      ? option === currentScenario.correctArticle
                        ? 'bg-[#f5e1a0] text-[#181e26] border-[#f5e1a0]'
                        : option === selectedAnswer
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-[#232b39] text-white border-[#232b39]'
                      : 'bg-[#232b39] text-white border-[#232b39] hover:bg-[#f5e1a0]/10 hover:border-[#f5e1a0]'}
                    ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                  whileHover={!answered ? { scale: 1.03 } : {}}
                  whileTap={!answered ? { scale: 0.97 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            {showExplanation && (
              <div className="bg-[#1a2233] border-l-4 border-[#f5e1a0] rounded-xl p-6 mb-8 text-white/90">
                <h4 className="font-bold text-[#f5e1a0] mb-2">Explanation:</h4>
                <p>{currentScenario.explanation}</p>
              </div>
            )}
            {answered && (
              <div className="text-center">
                <button
                  onClick={nextScenario}
                  className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all"
                >
                  Next Scenario
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleHunt; 