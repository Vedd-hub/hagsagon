import { firestoreService } from './index';
import { Chapter } from '../models/Chapter';
import { Quiz } from '../models/Quiz';
import { LexIQWord } from '../models/LexIQWord';
import { Announcement } from '../models/Announcement';
import { userService } from './index';
import { orderBy, where } from 'firebase/firestore';

/**
 * Base service for content operations
 */
class BaseContentService<T> {
  constructor(private collectionName: string) {}

  /**
   * Check if current user is admin before proceeding
   */
  private async checkAdminPermission(): Promise<void> {
    const isAdmin = await userService.isCurrentUserAdmin();
    if (!isAdmin) {
      throw new Error('Permission denied: Admin access required');
    }
  }

  /**
   * Get all content items
   */
  async getAll(includeInactive: boolean = false): Promise<T[]> {
    if (!includeInactive) {
      return firestoreService.query<T>(
        this.collectionName,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
    }
    
    return firestoreService.getAll<T>(this.collectionName);
  }

  /**
   * Get content item by ID
   */
  async getById(id: string): Promise<T | null> {
    return firestoreService.getById<T>(this.collectionName, id);
  }

  /**
   * Add new content item (admin only)
   */
  async add(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    await this.checkAdminPermission();
    
    const now = Date.now();
    const newData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    return firestoreService.add<T>(this.collectionName, newData as any);
  }

  /**
   * Update content item (admin only)
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    await this.checkAdminPermission();
    
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    return firestoreService.update<T>(this.collectionName, id, updateData);
  }

  /**
   * Delete content item (admin only)
   */
  async delete(id: string): Promise<void> {
    await this.checkAdminPermission();
    return firestoreService.delete(this.collectionName, id);
  }

  /**
   * Set active status (admin only)
   */
  async setActiveStatus(id: string, isActive: boolean): Promise<void> {
    await this.checkAdminPermission();
    return firestoreService.update<T>(this.collectionName, id, { 
      isActive, 
      updatedAt: Date.now() 
    } as any);
  }
}

/**
 * Chapter service
 */
export class ChapterService extends BaseContentService<Chapter> {
  constructor() {
    super('chapters');
  }
  
  // Get chapters ordered by their defined order
  async getOrderedChapters(includeInactive: boolean = false): Promise<Chapter[]> {
    const query = includeInactive 
      ? [orderBy('order', 'asc')]
      : [where('isActive', '==', true), orderBy('order', 'asc')];
      
    return firestoreService.query<Chapter>('chapters', ...query);
  }
}

/**
 * Quiz service
 */
export class QuizService extends BaseContentService<Quiz> {
  constructor() {
    super('quizzes');
  }
  
  // Get chapter quizzes
  async getChapterQuizzes(chapterId: string): Promise<Quiz[]> {
    return firestoreService.query<Quiz>(
      'quizzes',
      where('chapterId', '==', chapterId),
      where('isActive', '==', true)
    );
  }
  
  // Get daily quiz
  async getDailyQuiz(): Promise<Quiz | null> {
    const dailyQuizzes = await firestoreService.query<Quiz>(
      'quizzes',
      where('isDaily', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return dailyQuizzes.length > 0 ? dailyQuizzes[0] : null;
  }
}

/**
 * LexIQ service
 */
export class LexIQService extends BaseContentService<LexIQWord> {
  constructor() {
    super('lexiq');
  }
  
  // Get words by difficulty
  async getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<LexIQWord[]> {
    return firestoreService.query<LexIQWord>(
      'lexiq',
      where('difficulty', '==', difficulty),
      where('isActive', '==', true)
    );
  }
}

/**
 * Announcement service
 */
export class AnnouncementService extends BaseContentService<Announcement> {
  constructor() {
    super('announcements');
  }
  
  // Get active announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = Date.now();
    
    // Get announcements that are:
    // 1. Active
    // 2. Published (publishDate <= now)
    // 3. Not expired (no expiryDate or expiryDate > now)
    const activeAnnouncements = await firestoreService.query<Announcement>(
      'announcements',
      where('isActive', '==', true),
      where('publishDate', '<=', now)
    );
    
    // Filter out expired announcements
    return activeAnnouncements.filter(announcement => 
      !announcement.expiryDate || announcement.expiryDate > now
    );
  }
} 