import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { BattleData } from './types';
import BattleAvatar from './BattleAvatar';

interface Props {
  battle: BattleData;
  currentUser: any;
}

const BattleQuiz = ({ battle, currentUser }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(battle.timer);
  const [showNext, setShowNext] = useState(false);

  const userKey = battle.players.user1.uid === currentUser.uid ? 'user1' : 'user2';
  const opponentKey = userKey === 'user1' ? 'user2' : 'user1';
  const question = battle.questions[battle.currentQuestion];
  const user = battle.players[userKey];
  const opponent = battle.players[opponentKey];

  // Timer logic
  useEffect(() => {
    if (battle.status !== 'in-progress') return;
    if (timer <= 0) {
      handleAnswer(null);
      return;
    }
    const interval = setInterval(() => setTimer((t: number) => t - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timer, battle.status]);

  // Reset timer on question change
  useEffect(() => {
    setTimer(battle.timer);
    setSelected(null);
    setShowNext(false);
  }, [battle.currentQuestion, battle.timer]);

  // Handle answer
  const handleAnswer = async (optionIdx: number | null) => {
    if (!user) return;
    setSelected(optionIdx);
    setShowNext(true);
    const answers = [...(user.answers || []), optionIdx];
    let score = user.score;
    if (optionIdx !== null && question.options[optionIdx] === question.answer) {
      score += 10 + timer; // 10 points + time bonus
    }
    await updateDoc(doc(db, 'battles', battle.id), {
      [`players.${userKey}.answers`]: answers,
      [`players.${userKey}.score`]: score
    });
    // If both answered, go to next question or finish
    const oppAnswers = (opponent?.answers || []);
    if (answers.length === battle.questions.length && oppAnswers.length === battle.questions.length) {
      await updateDoc(doc(db, 'battles', battle.id), { status: 'finished' });
    } else if (answers.length > battle.currentQuestion && oppAnswers.length > battle.currentQuestion) {
      await updateDoc(doc(db, 'battles', battle.id), { currentQuestion: battle.currentQuestion + 1 });
    }
  };

  // Show opponent's answer status
  const oppAnswered = (opponent?.answers || []).length > battle.currentQuestion;

  if (!user) return <div>Player not found.</div>;

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-6 bg-white/10 rounded-lg border border-[#f5e1a0]/40 text-center mt-6 sm:mt-10 relative shadow-xl animate-battle-glow">
      {/* Avatars and VS banner */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-2">
        <BattleAvatar name={user.displayName} highlight size="responsive" />
        <span className="text-2xl font-extrabold text-[#ffe066] drop-shadow">VS</span>
        {opponent && <BattleAvatar name={opponent.displayName} size="responsive" />}
      </div>
      {/* Mascot and header */}
      <div className="flex items-center justify-center gap-1 md:gap-2 mb-2">
        <span className="text-2xl">⚔️</span>
        <h2 className="text-base md:text-xl font-bold text-[#f5e1a0]">Question {battle.currentQuestion + 1} / {battle.questions.length}</h2>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-[#232b39]/40 rounded-full mb-4 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#ffe066] to-[#f5e1a0] transition-all duration-500" style={{ width: `${((battle.currentQuestion+1)/battle.questions.length)*100}%` }} />
      </div>
      <div className="mb-2 text-white text-base md:text-lg">{question.question}</div>
      <div className="mb-4 text-gray-400 text-sm md:text-base">Time left: {timer}s</div>
      <div className="grid grid-cols-1 gap-2 md:gap-3 mb-4">
        {question.options.map((opt: string, idx: number) => (
          <button
            key={idx}
            className={`w-full px-4 py-2 md:py-3 rounded-lg border text-white transition-colors text-sm md:text-base
              ${selected === idx ? 'bg-[#f5e1a0] text-[#232b39]' : 'bg-black/30 border-[#f5e1a0]/10 hover:bg-[#f5e1a0]/10'}
              ${selected !== null && idx !== selected ? 'opacity-60' : ''}
            `}
            disabled={selected !== null}
            onClick={() => handleAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mb-2 text-sm text-gray-400">
        {oppAnswered ? "Opponent has answered" : "Waiting for opponent..."}
      </div>
      {showNext && <div className="text-green-500 font-bold">Answer submitted!</div>}
      {/* Animated border/glow style */}
      <style>{`
        @keyframes battle-glow {
          0% { box-shadow: 0 0 16px 2px #ffe06644, 0 0 0 0 #f5e1a044; }
          50% { box-shadow: 0 0 32px 8px #ffe06688, 0 0 0 8px #f5e1a044; }
          100% { box-shadow: 0 0 16px 2px #ffe06644, 0 0 0 0 #f5e1a044; }
        }
        .animate-battle-glow { animation: battle-glow 2.5s infinite alternate; }
      `}</style>
    </div>
  );
};

export default BattleQuiz; 