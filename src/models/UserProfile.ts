export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  level: number;
  badges: string[];
  lexIQScore: number;
  dailyQuizStreak: number;
  lastQuizDate?: number; // Timestamp of last quiz completion
  streakFreezeUsed?: boolean; // Whether streak freeze has been used
  longestStreak?: number; // Longest streak achieved
  chaptersCompleted: string[];
  gamesPlayed: number;
  games?: {
    [gameId: string]: any;
  };
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
  dailyNotifications?: boolean;
  soundEffects?: boolean;
  profession?: string;
  quizzes?: {
    [quizId: string]: {
      currentQuestion: number;
      answers: number[];
      score: number;
      finished: boolean;
    };
  };
  photoURL?: string; // URL to the user's profile picture
} 