import { BattleData } from './types';
import Confetti from './Confetti';

interface Props {
  battle: BattleData;
  currentUser: any;
}

const BattleResult = ({ battle, currentUser }: Props) => {
  const userKey = battle.players.user1.uid === currentUser.uid ? 'user1' : 'user2';
  const opponentKey = userKey === 'user1' ? 'user2' : 'user1';
  const user = battle.players[userKey];
  const opponent = battle.players[opponentKey];
  const userScore = user ? user.score : 0;
  const oppScore = opponent ? opponent.score : 0;
  const isWinner = userScore > oppScore;
  const isDraw = userScore === oppScore;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2">
      {(isWinner || isDraw) && <Confetti />}
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">{isWinner ? '🏆' : isDraw ? '🎉' : '😢'} Battle Result</h2>
      <div className="mb-2 text-base md:text-xl">
        {isDraw
          ? "It's a Draw!"
          : isWinner
            ? <span>🏆 You Win! <span className="ml-2 text-yellow-400">Battle Winner</span></span>
            : "You Lose!"}
      </div>
      <div className="mb-4 space-y-1">
        <div>Your Score: <span className="font-bold">{userScore}</span></div>
        <div>Opponent Score: <span className="font-bold">{oppScore}</span></div>
      </div>
      <button className="btn-primary w-full max-w-xs mb-2 text-base md:text-xl" onClick={() => window.location.reload()}>Rematch</button>
      <button className="btn-primary w-full max-w-xs text-base md:text-xl" onClick={() => window.location.href = '/'}>Exit</button>
    </div>
  );
};

export default BattleResult; 