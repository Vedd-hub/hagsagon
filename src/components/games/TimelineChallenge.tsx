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
    title: "Constituent Assembly First Meeting",
    description: "The first meeting of the Constituent Assembly was held on December 9, 1946"
  },
  {
    id: 2,
    date: "1947",
    title: "Independence and Partition",
    description: "India gained independence, and the Constituent Assembly became a sovereign body"
  },
  {
    id: 3,
    date: "1949",
    title: "Constitution Adoption",
    description: "The Constitution was adopted on November 26, 1949"
  },
  {
    id: 4,
    date: "1950",
    title: "Constitution Enforcement",
    description: "The Constitution came into effect on January 26, 1950"
  },
  {
    id: 5,
    date: "1951",
    title: "First Amendment",
    description: "The First Amendment to the Constitution was enacted"
  },
  {
    id: 6,
    date: "1971",
    title: "24th Amendment",
    description: "Parliament's power to amend the Constitution was affirmed"
  },
  {
    id: 7,
    date: "1973",
    title: "Basic Structure Doctrine",
    description: "Kesavananda Bharati case established the Basic Structure doctrine"
  },
  {
    id: 8,
    date: "1976",
    title: "42nd Amendment",
    description: "Major changes including addition of 'Socialist' and 'Secular' to the Preamble"
  }
];

const TimelineChallenge: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bestScore, setBestScore] = useState(0);

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

  const startGame = () => {
    shuffleEvents();
    setGameStarted(true);
    setGameOver(false);
    setShowResults(false);
    setScore(0);
  };

  const checkOrder = () => {
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
          <p className="text-lg text-white/80 mb-4">
            Arrange the constitutional events in chronological order.
          </p>
          <button
            onClick={startGame}
            className="bg-[#f5e1a0] text-[#181e26] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe08a] transition-all"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] px-4 py-10">
      <div className="w-full max-w-2xl bg-white/5 border border-[#f5e1a0]/20 rounded-2xl shadow-xl p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#f5e1a0] mb-4 font-playfair">Timeline Challenge</h2>
        {!gameOver && (
          <p className="text-lg text-white/80 mb-4">
            Drag and drop the events to arrange them in chronological order
          </p>
        )}
        {showResults && (
          <div className="mb-4">
            <p className="text-xl font-bold text-[#f5e1a0]">Your Score: {score}%</p>
            <p className="text-lg text-white/80">Best Score: <span className="text-[#f5e1a0]">{bestScore}%</span></p>
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
                  <h3 className="text-xl font-bold text-[#f5e1a0] mb-2">{event.date}</h3>
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