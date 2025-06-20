import React, { useState } from 'react';

const GOLD = '#f5e1a0';
const PRIMARY_BG = 'bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]';
const CARD_BG = 'bg-black/40 backdrop-blur-md';
const CARD_BORDER = 'border border-[#f5e1a0]/20';
const CARD_RADIUS = 'rounded-2xl';
const CARD_SHADOW = 'shadow-lg';
const FONT_SERIF = 'font-serif';

// Game data (scenes, articles, etc.)
const articles: Record<string, { title: string; text: string }> = {
  '21A': {
    title: 'Article 21A - Right to Education',
    text: 'Every child between the ages of 6-14 has the fundamental right to free and compulsory education. This means no school can deny admission based on economic status, and the state must provide quality education facilities.'
  },
  '14': {
    title: 'Article 14 - Right to Equality',
    text: 'The State shall not deny to any person equality before the law or equal protection of laws. This ensures that all citizens, regardless of their background, are treated equally by the legal system.'
  },
  '19': {
    title: 'Article 19 - Freedom of Speech',
    text: 'All citizens have the right to freedom of speech and expression, freedom to assemble peacefully, freedom to form associations, and freedom to practice any profession or business.'
  },
  '32': {
    title: 'Article 32 - Right to Constitutional Remedies',
    text: "Called the 'Heart of the Constitution' by Dr. Ambedkar, this article allows citizens to directly approach the Supreme Court when their fundamental rights are violated."
  }
};

const scenes = [
  {
    speaker: 'Aarav',
    text: `Welcome to my story! I'm Aarav, and I've just moved from my village in Rajasthan to this big city in Maharashtra. Back home, we celebrated the Constitution like a festival. But here... things are different. Are you ready to help me discover the power of our Constitutional rights?`,
    background: 'village-bg',
    choices: [
      { text: '🏛️ "Yes! Let\'s learn about our Constitutional rights together!"', points: 10, next: 1 },
      { text: '📚 "Tell me more about the Constitution first"', points: 5, next: 2 },
      { text: '🤔 "I\'m not sure... what challenges will we face?"', points: 3, next: 3 }
    ],
    tip: '💡 <strong>Did you know?</strong><br>Article 21A guarantees free education to all children aged 6-14!'
  },
  {
    speaker: 'Aarav',
    text: `Perfect! That's the spirit our Constitution needs! You know, the Constitution isn't just a book of laws - it's our shield and sword. Every article is a promise our nation made to us. Let me show you something that shocked me on my first day here...`,
    background: 'city-bg',
    choices: [
      { text: '🏃‍♂️ "What did you see? Let\'s investigate!"', points: 15, next: 4 },
      { text: '📖 "First, tell me which Constitutional articles are most important"', points: 10, next: 2 }
    ],
    tip: '💡 <strong>Fun Fact:</strong><br>India\'s Constitution is the longest written constitution in the world!'
  },
  {
    speaker: 'Aarav',
    text: `Great question! Our Constitution has 395 articles, but the most powerful ones are called Fundamental Rights - Articles 12 to 35. They protect our equality, freedom, and dignity. Think of them as superpowers every Indian citizen has!`,
    background: 'village-bg',
    choices: [
      { text: '⚖️ "Tell me about equality rights!"', points: 8, next: 1, article: '14' },
      { text: '🗣️ "What about freedom of speech?"', points: 8, next: 1, article: '19' },
      { text: '🎯 "I\'m ready for the real challenge now!"', points: 12, next: 4 }
    ],
    tip: '💡 <strong>Constitutional Wisdom:</strong><br>Fundamental Rights cannot be taken away by any government!'
  },
  {
    speaker: 'Aarav',
    text: `I understand your hesitation. The challenges are real - we'll face discrimination, corruption, and people who abuse power. But that's exactly why we need the Constitution! Every challenge we overcome makes our democracy stronger.`,
    background: 'city-bg',
    choices: [
      { text: '💪 "You\'re right! Let\'s face these challenges together!"', points: 12, next: 4 },
      { text: '🛡️ "How does the Constitution protect us from powerful people?"', points: 8, next: 1, article: '32' }
    ],
    tip: '💡 <strong>Remember:</strong><br>Article 32 is called the \'Heart of the Constitution\' - it lets us approach courts directly!'
  },
  {
    speaker: 'Aarav',
    text: `Here's what I saw: street children, around 8-10 years old, being turned away from the local school. The guard said they were 'too dirty' and would 'disturb other students.' My heart broke. But then I remembered something powerful...`,
    background: 'school-bg',
    choices: [
      { text: '📚 "Article 21A - Right to Education! Every child deserves school!"', points: 20, next: 0, article: '21A' },
      { text: '⚖️ "This is discrimination! Article 14 says everyone is equal!"', points: 15, next: 0, article: '14' },
      { text: '😢 "This is so unfair! What can we do about it?"', points: 5, next: 0 }
    ],
    tip: '💡 <strong>Real Power:</strong><br>Constitutional rights aren\'t just theory - they create real legal obligations!'
  }
  // ... (You can expand with more scenes as needed)
];

const ConstitutionChronicles: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [constitutionalPoints, setConstitutionalPoints] = useState(0);
  const [showArticle, setShowArticle] = useState(false);
  const [articleKey, setArticleKey] = useState<keyof typeof articles | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scene = scenes[currentScene];

  const handleChoice = (choiceIdx: number) => {
    const choice = scene.choices[choiceIdx];
    setConstitutionalPoints(points => points + (choice.points || 0));
    if (choice.article) {
      setArticleKey(choice.article as keyof typeof articles);
      setShowArticle(true);
    } else if (choice.next !== undefined) {
      setCurrentScene(choice.next);
    }
    // Add badge/game complete logic as needed
  };

  const closeArticle = () => {
    setShowArticle(false);
    if (articleKey) {
      // After showing article, go to next scene (use the first matching choice)
      const choice = scene.choices.find(c => c.article === articleKey);
      if (choice && choice.next !== undefined) {
        setCurrentScene(choice.next);
      }
      setArticleKey(null);
    }
  };

  // Progress bar calculation
  const progress = Math.min(100, Math.round((currentScene / (scenes.length - 1)) * 100));

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${PRIMARY_BG} py-8 px-2`}>
      <div className={`w-full max-w-4xl min-h-[80vh] flex flex-col ${CARD_BG} ${CARD_BORDER} ${CARD_RADIUS} ${CARD_SHADOW} relative`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5e1a0]/20 bg-white/5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            {/* LexIQ-style logo: gold quill and parchment */}
            <span className="inline-block align-middle">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="28" height="18" rx="6" fill="#f5e1a0" stroke="#bfa77a" strokeWidth="2"/>
                <rect x="8" y="12" width="8" height="12" rx="3" fill="#fffbe6" stroke="#e2d8c0" strokeWidth="1"/>
                <rect x="20" y="12" width="8" height="12" rx="3" fill="#fffbe6" stroke="#e2d8c0" strokeWidth="1"/>
                <path d="M12 16 Q18 20 24 16" stroke="#bfa77a" strokeWidth="1.2" fill="none"/>
                <path d="M12 20 Q18 24 24 20" stroke="#bfa77a" strokeWidth="1.2" fill="none"/>
                <g>
                  <rect x="25" y="25" width="7" height="2" rx="1" fill="#C19A6B"/>
                  <rect x="29" y="26" width="2" height="6" rx="1" fill="#C19A6B"/>
                  <ellipse cx="30" cy="32" rx="2" ry="1.5" fill="#C19A6B" fillOpacity="0.7"/>
                </g>
              </svg>
            </span>
            <span className={`text-xl font-bold ${FONT_SERIF} text-[#f5e1a0] drop-shadow`}>The Constitution Chronicles</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-[${GOLD}] mb-1">Constitutional Champion Progress</span>
            <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-2 rounded-full transition-all duration-500" style={{ background: GOLD, width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Scene Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6 md:p-10">
            <div className={`absolute inset-0 z-0 ${scene.background === 'village-bg' ? 'bg-gradient-to-b from-[#232b39] to-[#1a2233]' : scene.background === 'city-bg' ? 'bg-gradient-to-b from-[#232b39] to-[#181e26]' : 'bg-gradient-to-b from-[#f5e1a0]/30 to-[#232b39]'}`}></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="character aarav mb-4" style={{ position: 'relative', width: 100, height: 160 }}>
                {/* Simple avatar illustration */}
                <div style={{ width: 100, height: 120, background: `linear-gradient(180deg, #8B4513 0%, #DEB887 40%, #4169E1 60%, #000080 100%)`, borderRadius: '60px 60px 10px 10px', position: 'absolute', bottom: 0 }} />
                <div style={{ width: 60, height: 60, background: '#DEB887', borderRadius: '50%', border: '3px solid #654321', position: 'absolute', top: 0, left: 20 }} />
                <div style={{ width: 40, height: 20, background: '#000', borderRadius: '30px 30px 0 0', position: 'absolute', top: 30, left: 30 }} />
              </div>
              <div className="constitution-corner bg-[#f5e1a0]/10 border border-[#f5e1a0]/30 rounded-lg px-4 py-2 text-[${GOLD}] text-xs font-serif shadow" dangerouslySetInnerHTML={{ __html: scene.tip }} />
            </div>
          </div>
          {/* Dialogue Area */}
          <div className="flex-1 flex flex-col justify-center bg-black/60 p-6 md:p-10 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
            <div className="mb-2 text-[${GOLD}] font-bold text-lg font-serif drop-shadow">{scene.speaker}</div>
            <div className="mb-6 text-white text-base font-serif" style={{ lineHeight: 1.7 }}>{scene.text}</div>
            <div className="flex flex-col gap-3">
              {scene.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#f5e1a0]/80 to-[#e2d8c0]/80 text-[#232b39] font-semibold rounded-lg shadow hover:scale-[1.03] hover:bg-[#f5e1a0] transition-all text-left border border-[#f5e1a0]/40"
                  onClick={() => handleChoice(idx)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Score Display */}
        <div className="absolute top-4 right-4 bg-[#f5e1a0]/90 text-[#232b39] px-4 py-2 rounded-full font-bold text-sm shadow border border-[#f5e1a0]/40 z-20">
          Constitutional Points: {constitutionalPoints}
        </div>
        {/* Article Popup */}
        {showArticle && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeArticle} />
            <div className="relative bg-gradient-to-br from-[#f5e1a0] to-[#e2d8c0] border-4 border-[#232b39] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center z-10">
              <div className="text-2xl font-bold text-[#232b39] mb-2 font-serif">{articleKey && articles[articleKey].title}</div>
              <div className="text-[#232b39] text-base font-serif mb-6">{articleKey && articles[articleKey].text}</div>
              <button className="px-6 py-2 bg-[#232b39] text-[#f5e1a0] rounded-lg font-bold shadow hover:bg-[#181e26] transition-all" onClick={closeArticle}>Continue Journey</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstitutionChronicles; 