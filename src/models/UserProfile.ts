export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  level: number;
  badges: string[];
  lexIQScore: number;
  dailyQuizStreak: number;
  chaptersCompleted: string[];
  gamesPlayed: number;
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
  dailyNotifications?: boolean;
  soundEffects?: boolean;
  profession?: string;
} 