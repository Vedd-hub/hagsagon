import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Quote {
  id: number;
  text: string;
  author: string;
  context: string;
  options: string[];
}

const quotes: Quote[] = [
  {
    id: 1,
    text: "The Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age.",
    author: "B.R. Ambedkar",
    context: "During the Constituent Assembly debates",
    options: ["B.R. Ambedkar", "Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel"]
  },
  {
    id: 2,
    text: "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.",
    author: "Jawaharlal Nehru",
    context: "Speech on Indian Independence, August 14, 1947",
    options: ["Jawaharlal Nehru", "B.R. Ambedkar", "Mahatma Gandhi", "Rajendra Prasad"]
  },
  {
    id: 3,
    text: "Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age.",
    author: "B.R. Ambedkar",
    context: "Constituent Assembly Debates",
    options: ["B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel", "C. Rajagopalachari"]
  },
  {
    id: 4,
    text: "The Constitution of India has been made possible by the sacrifices of thousands of martyrs who laid down their lives.",
    author: "Sardar Patel",
    context: "Speech during Constitution adoption",
    options: ["Sardar Patel", "B.R. Ambedkar", "Jawaharlal Nehru", "Rajendra Prasad"]
  },
  {
    id: 5,
    text: "Rights and duties of the citizens are correlative and inseparable.",
    author: "Constitution of India",
    context: "Article 51A - Fundamental Duties",
    options: ["Constitution of India", "B.R. Ambedkar", "Supreme Court", "Constituent Assembly"]
  }
];

const WhoSaidIt: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const getRandomQuote = () => {
    const availableQuotes = quotes.filter(quote => !quoteHistory.includes(quote.id));
    if (availableQuotes.length === 0) {
      setGameOver(true);
      return;
    }
    const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
    setCurrentQuote(randomQuote);
    setQuoteHistory([...quoteHistory, randomQuote.id]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentQuote?.author) {
      setScore(score + 10);
    }
  };

  const nextQuote = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    getRandomQuote();
  };

  const resetGame = () => {
    setScore(0);
    setQuoteHistory([]);
    setGameOver(false);
    setAnswered(false);
    setSelectedAnswer(null);
    getRandomQuote();
  };

  if (!currentQuote) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Who Said It?</h2>
        <p className="text-lg">Score: {score}</p>
      </div>

      {gameOver ? (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Game Over!</h3>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <blockquote className="text-xl italic mb-4">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-gray-600">{currentQuote.context}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuote.options.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={`p-4 rounded-lg text-left transition-colors ${
                  answered
                    ? option === currentQuote.author
                      ? 'bg-green-500 text-white'
                      : option === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100'
                    : 'bg-white hover:bg-gray-100'
                } ${
                  answered ? 'cursor-default' : 'cursor-pointer'
                }`}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {answered && (
            <div className="text-center">
              <button
                onClick={nextQuote}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next Quote
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WhoSaidIt; 