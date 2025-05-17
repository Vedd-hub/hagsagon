import { firestoreService } from './index';
import { UserProfile } from '../models/UserProfile';
import { auth } from '../firebase/config';
import { serverTimestamp } from 'firebase/firestore';

// Admin email for role assignment
const ADMIN_EMAIL = 'vedtheadmin@gmail.com';

export class UserService {
  private COLLECTION_NAME = 'users';

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    return this.getUserProfile(currentUser.uid);
  }
  
  /**
   * Check if current user is admin
   */
  async isCurrentUserAdmin(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // Proper role check for production use
    const userProfile = await this.getUserProfile(currentUser.uid);
    return userProfile?.role === 'admin';
  }
  
  /**
   * Get user profile by ID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return firestoreService.getById<UserProfile>(this.COLLECTION_NAME, uid);
  }

  /**
   * Create new user profile
   */
  async createUserProfile(userData: Partial<UserProfile>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user found');
    
    const now = Date.now();
    const newUser: UserProfile = {
      uid: currentUser.uid,
      username: userData.username || currentUser.displayName || '',
      email: currentUser.email || '',
      // Assign admin role only to designated admin emails
      role: currentUser.email === ADMIN_EMAIL ? 'admin' : 'user',
      level: userData.level || 1,
      badges: userData.badges || [],
      lexIQScore: userData.lexIQScore || 0,
      dailyQuizStreak: userData.dailyQuizStreak || 0,
      chaptersCompleted: userData.chaptersCompleted || [],
      gamesPlayed: userData.gamesPlayed || 0,
      lastLogin: now,
      createdAt: now,
      updatedAt: now
    };
    
    // Add user document with custom UID (not auto-generated)
    await firestoreService.update(this.COLLECTION_NAME, currentUser.uid, newUser);
    return currentUser.uid;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    return firestoreService.update(this.COLLECTION_NAME, uid, updateData);
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(uid: string): Promise<void> {
    return this.updateUserProfile(uid, {
      lastLogin: Date.now()
    });
  }

  /**
   * Increment the user's level
   */
  async incrementLevel(uid: string, amount: number = 1): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');
    
    return this.updateUserProfile(uid, {
      level: user.level + amount
    });
  }

  /**
   * Add a badge to user's collection
   */
  async addBadge(uid: string, badge: string): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');
    
    if (!user.badges.includes(badge)) {
      return this.updateUserProfile(uid, {
        badges: [...user.badges, badge]
      });
    }
  }

  /**
   * Update user's LexIQ score
   */
  async updateLexIQScore(uid: string, score: number): Promise<void> {
    return this.updateUserProfile(uid, {
      lexIQScore: score
    });
  }

  /**
   * Increment daily quiz streak
   */
  async incrementDailyQuizStreak(uid: string): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');
    
    return this.updateUserProfile(uid, {
      dailyQuizStreak: user.dailyQuizStreak + 1
    });
  }

  /**
   * Reset daily quiz streak
   */
  async resetDailyQuizStreak(uid: string): Promise<void> {
    return this.updateUserProfile(uid, {
      dailyQuizStreak: 0
    });
  }

  /**
   * Add completed chapter
   */
  async addCompletedChapter(uid: string, chapterId: string): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');
    
    if (!user.chaptersCompleted.includes(chapterId)) {
      return this.updateUserProfile(uid, {
        chaptersCompleted: [...user.chaptersCompleted, chapterId]
      });
    }
  }

  /**
   * Increment games played count
   */
  async incrementGamesPlayed(uid: string): Promise<void> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');
    
    return this.updateUserProfile(uid, {
      gamesPlayed: user.gamesPlayed + 1
    });
  }
} 