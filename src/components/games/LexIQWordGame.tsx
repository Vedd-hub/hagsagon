import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import StreakNotification from '../streak/StreakNotification';

interface Word {
  term: string;
  hint: string;
  category: string;
}

const words: Word[] = [
  {
    term: "WRIT",
    hint: "A written court order directing a person to do something or refrain from doing something",
    category: "Legal Term"
  },
  {
    term: "SECULAR",
    hint: "State has no official religion and treats all religions equally",
    category: "Constitutional Principle"
  },
  {
    term: "SOVEREIGN",
    hint: "Having supreme, independent authority over a territory",
    category: "Constitutional Term"
  },
  {
    term: "FEDERAL",
    hint: "System of government where power is divided between central and state governments",
    category: "Government Structure"
  },
  {
    term: "AMENDMENT",
    hint: "A formal alteration to a legal document",
    category: "Legal Process"
  }
];

const LexIQWordGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const { currentUser } = useAuth();
  const [showStreakNotification, setShowStreakNotification] = useState(false);
  const [streakMessage, setStreakMessage] = useState('');
  const [streakBonus, setStreakBonus] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const getRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setRemainingAttempts(6);
    setGameStatus('playing');
    setShowHint(false);
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'lost') && currentUser) {
      userService.incrementGamesPlayed(currentUser.uid);
    }
    // eslint-disable-next-line
  }, [gameStatus]);

  const handleGuess = async (letter: string) => {
    if (gameStatus !== 'playing' || !currentWord) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter.toUpperCase());
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.term.includes(letter.toUpperCase())) {
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);

      if (newAttempts === 0) {
        setGameStatus('lost');
        setStreak(0);
      }
    } else {
      const allLettersGuessed = Array.from(currentWord.term).every(char =>
        newGuessedLetters.has(char)
      );

      if (allLettersGuessed) {
        setGameStatus('won');
        const attemptBonus = remainingAttempts * 10;
        const newScore = score + 50 + attemptBonus;
        setScore(newScore);
        setStreak(streak + 1);
        
        // Update streak in database
        if (currentUser) {
          try {
            const streakResult = await userService.completeQuiz(currentUser.uid, newScore, 'lexiq-word');
            if (streakResult.streakUpdated) {
              setStreakMessage(streakResult.message);
              setStreakBonus(streakResult.streakBonus);
              setCurrentStreak(streakResult.newStreak);
              setShowStreakNotification(true);
            }
          } catch (error) {
            console.error('Error updating streak:', error);
          }
        }
      }
    }
  };

  const renderWord = () => {
    if (!currentWord) return null;
    return currentWord.term.split('').map((letter, index) => (
      <motion.div
        key={index}
        className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold rounded-lg ${
          guessedLetters.has(letter)
            ? 'bg-green-500 text-white border-green-600'
            : 'bg-white border-gray-300'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        {guessedLetters.has(letter) ? letter : '_'}
      </motion.div>
    ));
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] px-4 py-10">
      <div className="w-full max-w-2xl bg-white/5 border border-[#f5e1a0]/20 rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-[#f5e1a0] mb-4 font-playfair">LexIQ Word Game</h2>
        <div className="flex justify-between mb-6">
          <span className="text-lg text-[#f5e1a0] font-bold">Score: {score}</span>
          <span className="text-lg text-[#f5e1a0] font-bold">Streak: {streak}</span>
          <span className="text-lg text-white/80">Attempts Left: {remainingAttempts}</span>
        </div>
        <div className="flex justify-center mb-8 space-x-2">
          {renderWord()}
        </div>
        <div className="text-center mb-4">
          <p className="text-gray-400">Category: <span className="text-[#f5e1a0]">{currentWord?.category}</span></p>
          <button
            onClick={() => setShowHint(true)}
            disabled={showHint}
            className={`mt-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg
              ${showHint ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#f5e1a0] text-[#181e26] hover:bg-[#ffe08a]'}`}
          >
            Show Hint
          </button>
        </div>
        {showHint && (
          <div className="text-center mb-6 p-4 bg-[#1a2233] border-l-4 border-[#f5e1a0] rounded-xl text-white/90">
            <p>{currentWord?.hint}</p>
          </div>
        )}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {alphabet.map((letter) => (
            <motion.button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
              className={`p-2 rounded-lg font-bold text-lg shadow-lg border-2 transition-all duration-200
                ${guessedLetters.has(letter)
                  ? currentWord?.term.includes(letter)
                    ? 'bg-[#f5e1a0] text-[#181e26] border-[#f5e1a0]'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-[#232b39] text-white border-[#232b39] hover:bg-[#f5e1a0]/10 hover:border-[#f5e1a0]'}
                ${gameStatus !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              whileHover={gameStatus === 'playing' && !guessedLetters.has(letter) ? { scale: 1.1 } : {}}
              whileTap={gameStatus === 'playing' && !guessedLetters.has(letter) ? { scale: 0.95 } : {}}
            >
              {letter}
            </motion.button>
          ))}
        </div>
        {gameStatus !== 'playing' && (
          <div className="text-center flex flex-col items-center justify-center">
            <div
              className={`p-4 rounded-xl mb-4 font-bold text-lg shadow-lg w-full max-w-xs sm:max-w-md mx-auto flex flex-col items-center
                ${gameStatus === 'won'
                  ? 'bg-[#f5e1a0]/20 text-[#f5e1a0] border-l-4 border-[#f5e1a0]'
                  : 'bg-red-100 text-red-800 border-l-4 border-red-500'}
              `}
            >
              <p className="text-2xl mb-2 font-extrabold tracking-wide">
                {gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}
              </p>
              <div className="flex flex-col items-center w-full">
                <span className="text-base sm:text-lg text-gray-700 dark:text-gray-200 mb-1 font-semibold">The word was:</span>
                <span
                  className="inline-block px-6 py-3 rounded-full bg-[#ffe066] text-[#232b39] text-2xl sm:text-3xl font-extrabold shadow-lg border-2 border-[#f5e1a0] mt-1 mb-2 animate-pulse"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {currentWord?.term}
                </span>
              </div>
            </div>
            <button
              onClick={getRandomWord}
              className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all w-full max-w-xs sm:max-w-md mx-auto"
            >
              Next Word
            </button>
          </div>
        )}
      </div>
      {showStreakNotification && (
        <StreakNotification
          message={streakMessage}
          streak={currentStreak}
          bonus={streakBonus}
          isVisible={showStreakNotification}
          onClose={() => setShowStreakNotification(false)}
        />
      )}
    </div>
  );
};

export default LexIQWordGame; 