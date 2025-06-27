export interface BattlePlayer {
  uid: string;
  displayName: string;
  score: number;
  answers: (number | null)[];
  ready: boolean;
}

export interface BattleQuestion {
  question: string;
  options: string[];
  answer: string;
  [key: string]: any;
}

export interface BattleData {
  id: string;
  createdBy: string;
  players: {
    user1: BattlePlayer;
    user2?: BattlePlayer;
  };
  questions: BattleQuestion[];
  currentQuestion: number;
  timer: number;
  status: 'waiting' | 'in-progress' | 'finished';
  winner: string | null;
  createdAt: any;
} 