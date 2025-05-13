export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  chapterId?: string;
  questions: QuizQuestion[];
  isDaily: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
} 