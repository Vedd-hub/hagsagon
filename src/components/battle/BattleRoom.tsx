import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import BattleLobby from './BattleLobby';
import BattleQuiz from './BattleQuiz';
import BattleResult from './BattleResult';
import { BattleData } from './types';
import BattleLayout from './BattleLayout';

const BattleRoom = () => {
  const { roomId } = useParams();
  const [battle, setBattle] = useState<BattleData | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'battles', roomId), (docSnap) => {
      if (docSnap.exists()) setBattle({ id: docSnap.id, ...(docSnap.data() as Omit<BattleData, 'id'>) });
    });
    return () => unsub();
  }, [roomId]);

  // Ensure status transitions to 'in-progress' when both are ready
  useEffect(() => {
    if (
      battle &&
      battle.status === 'waiting' &&
      battle.players.user1.ready &&
      battle.players.user2 && battle.players.user2.ready
    ) {
      // Only the creator (user1) should set the status to avoid race conditions
      if (currentUser && currentUser.uid === battle.players.user1.uid) {
        updateDoc(doc(db, 'battles', battle.id), { status: 'in-progress' });
      }
    }
  }, [battle, currentUser]);

  if (!battle) return (
    <BattleLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {/* 3D Cube Loader */}
        <div className="cube-loader mb-8">
          <div className="cube">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#ffe066] drop-shadow mb-2">Preparing Battle Room...</div>
        <div className="text-gray-300 text-base">Hang tight while we get things ready!</div>
      </div>
      <style>{`
        .cube-loader {
          perspective: 800px;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cube {
          width: 48px;
          height: 48px;
          position: relative;
          transform-style: preserve-3d;
          animation: cube-spin 1.2s infinite linear;
        }
        .cube .face {
          position: absolute;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ffe066 60%, #f5e1a0 100%);
          opacity: 0.95;
          border-radius: 8px;
          box-shadow: 0 2px 12px 0 #232b39cc;
        }
        .cube .front  { transform: rotateY(  0deg) translateZ(24px); }
        .cube .back   { transform: rotateY(180deg) translateZ(24px); }
        .cube .right  { transform: rotateY( 90deg) translateZ(24px); }
        .cube .left   { transform: rotateY(-90deg) translateZ(24px); }
        .cube .top    { transform: rotateX( 90deg) translateZ(24px); }
        .cube .bottom { transform: rotateX(-90deg) translateZ(24px); }
        @keyframes cube-spin {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </BattleLayout>
  );

  // Always show the lobby if battle exists and status is 'waiting'
  if (battle.status === 'waiting') {
    return <BattleLayout><BattleLobby battle={battle} currentUser={currentUser} /></BattleLayout>;
  }

  return (
    <BattleLayout>
      {battle.status === 'in-progress' && <BattleQuiz battle={battle} currentUser={currentUser} />}
      {battle.status === 'finished' && <BattleResult battle={battle} currentUser={currentUser} />}
    </BattleLayout>
  );
};

export default BattleRoom; 