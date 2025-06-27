import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
}

const constitutionalEvents: Event[] = [
  {
    id: 1,
    date: "1946",
    title: "Constituent Assembly's First Gathering",
    description: "A historic assembly convenes to begin drafting the nation's supreme law."
  },
  {
    id: 2,
    date: "1947",
    title: "Birth of a New Nation",
    description: "The country achieves independence and the assembly gains full authority."
  },
  {
    id: 3,
    date: "1949",
    title: "Constitution is Finalized",
    description: "After extensive debates and revisions, the supreme law is formally adopted."
  },
  {
    id: 4,
    date: "1950",
    title: "Constitution Comes Alive",
    description: "The supreme law is officially enforced, shaping the nation's governance."
  },
  {
    id: 5,
    date: "1951",
    title: "First Major Change",
    description: "The supreme law undergoes its initial amendment, setting a precedent for future changes."
  },
  {
    id: 6,
    date: "1971",
    title: "Parliament's Power Affirmed",
    description: "A significant amendment confirms the authority to revise the supreme law."
  },
  {
    id: 7,
    date: "1973",
    title: "Basic Structure Principle Established",
    description: "A landmark case defines the core principles that cannot be altered."
  },
  {
    id: 8,
    date: "1976",
    title: "Major Overhaul of the Constitution",
    description: "A sweeping amendment introduces new ideals and values to the preamble."
  }
];

const timeOptions = [
  { value: 60, label: "1 min", color: "bg-red-500" },
  { value: 120, label: "2 min", color: "bg-orange-500" },
  { value: 300, label: "5 min", color: "bg-yellow-500" },
  { value: 600, label: "10 min", color: "bg-green-500" }
];

const TimelineChallenge: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState(300); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  const shuffleEvents = () => {
    const shuffled = [...constitutionalEvents]
      .sort(() => Math.random() - 0.5)
      .map((event, index) => ({ ...event, currentPosition: index }));
    setEvents(shuffled);
  };

  useEffect(() => {
    const savedBestScore = localStorage.getItem('timelineBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            checkOrder();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    shuffleEvents();
    setGameStarted(true);
    setGameOver(false);
    setShowResults(false);
    setScore(0);
    setTimeLeft(selectedTime);
    setTimerActive(true);
  };

  const checkOrder = () => {
    setTimerActive(false);
    let correctCount = 0;
    const sortedEvents = [...events].sort((a, b) => parseInt(a.date) - parseInt(b.date));
    
    events.forEach((event, index) => {
      if (event.id === sortedEvents[index].id) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / events.length) * 100);
    setScore(finalScore);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('timelineBestScore', finalScore.toString());
    }

    setShowResults(true);
    setGameOver(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] px-4 py-10">
        <div className="w-full max-w-2xl bg-white/5 border border-[#f5e1a0]/20 rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#f5e1a0] mb-4 font-playfair">Timeline Challenge</h2>
          <p className="text-lg text-white/80 mb-6">
            Arrange the constitutional events in chronological order within the time limit.
          </p>
          
          {/* Time Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Time Limit:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTime(option.value)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    selectedTime === option.value
                      ? `${option.color} text-white shadow-lg scale-105`
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#ffe08a] transition-all text-lg"
          >
            Start Game ({formatTime(selectedTime)})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] px-4 py-10">
      <div className="w-full max-w-2xl bg-white/5 border border-[#f5e1a0]/20 rounded-2xl shadow-xl p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#f5e1a0] mb-4 font-playfair">Timeline Challenge</h2>
        
        {/* Timer Display */}
        {!gameOver && (
          <div className="mb-4">
            <div className={`text-2xl font-bold mb-2 ${
              timeLeft <= 30 ? 'text-red-500 animate-pulse' : 
              timeLeft <= 60 ? 'text-orange-500' : 'text-[#f5e1a0]'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  timeLeft <= 30 ? 'bg-red-500' : 
                  timeLeft <= 60 ? 'bg-orange-500' : 'bg-[#f5e1a0]'
                }`}
                style={{ width: `${(timeLeft / selectedTime) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {!gameOver && (
          <p className="text-lg text-white/80 mb-4">
            Drag and drop the events to arrange them in chronological order
          </p>
        )}
        
        {showResults && (
          <div className="mb-4">
            <p className="text-xl font-bold text-[#f5e1a0]">Your Score: {score}%</p>
            <p className="text-lg text-white/80">Best Score: <span className="text-[#f5e1a0]">{bestScore}%</span></p>
            {timeLeft === 0 && (
              <p className="text-red-400 font-semibold mt-2">⏰ Time's up!</p>
            )}
          </div>
        )}

        {/* Correct Order Reveal */}
        {showResults && (
          <div className="mb-8 w-full max-w-lg mx-auto">
            <div className="bg-[#ffe066]/20 border-l-4 border-[#ffe066] rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
              <h3 className="text-lg sm:text-xl font-bold text-[#ffe066] mb-3 text-center">Correct Chronological Order</h3>
              <ol className="w-full flex flex-col gap-2">
                {[...constitutionalEvents].sort((a, b) => parseInt(a.date) - parseInt(b.date)).map((event, idx) => (
                  <li key={event.id} className="flex items-start gap-3 bg-white/80 dark:bg-[#232b39]/80 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow text-left">
                    <span className="font-bold text-[#ffe066] text-base sm:text-lg min-w-[2em]">{idx + 1}.</span>
                    <div className="flex-1">
                      <span className="block text-[#232b39] dark:text-[#ffe066] font-semibold text-sm sm:text-base">{event.date}: {event.title}</span>
                      <span className="block text-gray-700 dark:text-gray-200 text-xs sm:text-sm">{event.description}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        
        <Reorder.Group
          axis="y"
          values={events}
          onReorder={setEvents}
          className="space-y-4 mb-8"
        >
          {events.map((event) => (
            <Reorder.Item
              key={event.id}
              value={event}
              className={`bg-[#232b39] rounded-xl shadow-lg p-6 cursor-move border-2 transition-all duration-200
                ${showResults
                  ? event.id === constitutionalEvents[events.indexOf(event)].id
                    ? 'border-l-4 border-[#f5e1a0]'
                    : 'border-l-4 border-red-500'
                  : 'border-[#232b39] hover:border-[#f5e1a0]'}
              `}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  {/* <h3 className="text-xl font-bold text-[#f5e1a0] mb-2">{event.date}</h3> */}
                  <h4 className="text-lg font-semibold text-white mb-2">{event.title}</h4>
                  <p className="text-gray-400">{event.description}</p>
                </div>
                {!gameOver && (
                  <div className="ml-4 text-[#f5e1a0]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        {!gameOver ? (
          <button
            onClick={checkOrder}
            className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all"
          >
            Check Order
          </button>
        ) : (
          <button
            onClick={startGame}
            className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default TimelineChallenge; 