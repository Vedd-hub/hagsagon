export interface LexIQWord {
  id?: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
} 