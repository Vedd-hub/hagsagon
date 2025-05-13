export interface Announcement {
  id?: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  publishDate: number;
  expiryDate?: number;
  createdAt: number;
  updatedAt: number;
} 