import { firestoreService } from './index';
import { auth } from '../firebase/config';
import { UserProfile } from '../models/UserProfile';
import { getUserData } from './auth.service';

// Admin email for role assignment
const ADMIN_EMAIL = 'vedtheadmin@gmail.com';

export class UserService {
  private readonly COLLECTION_NAME = 'users';

  /**
   * Check if current user is admin
   */
  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('UserService: No authenticated user found');
        return false;
      }
      
      console.log('UserService: Checking admin status for user:', currentUser.uid, 'Email:', currentUser.email);
      
      // Check if user has the admin email
      const hasAdminEmail = currentUser.email === ADMIN_EMAIL;
      console.log('UserService: Has admin email?', hasAdminEmail);
      
      // Get user profile
      let userProfile: UserProfile | null = null;
      try {
        userProfile = await this.getUserProfile(currentUser.uid);
        console.log('UserService: Fetched user profile:', userProfile);
      } catch (error) {
        console.error('UserService: Error fetching user profile:', error);
        // If we can't get the profile but user has admin email, still grant access
        return hasAdminEmail;
      }
      
      // If no profile exists, create one
      if (!userProfile) {
        console.log('UserService: No user profile found, creating one...');
        try {
          await this.createUserProfile({});
          console.log('UserService: Created new user profile');
          return hasAdminEmail;
        } catch (error) {
          console.error('UserService: Error creating user profile:', error);
          return hasAdminEmail; // Fallback to email check
        }
      }
      
      // Check admin status
      const isAdmin = userProfile.role === 'admin' || hasAdminEmail;
      console.log('UserService: User is admin?', isAdmin, '(Role:', userProfile.role, ', Admin email:', hasAdminEmail, ')');
      
      // If user has admin email but not admin role, update their role
      if (hasAdminEmail && userProfile.role !== 'admin') {
        console.log('UserService: Updating user role to admin');
        try {
          await this.updateUserProfile(currentUser.uid, { role: 'admin' });
          console.log('UserService: Successfully updated user role to admin');
          return true;
        } catch (error) {
          console.error('UserService: Failed to update user role:', error);
          // Still return true if they have the admin email
          return hasAdminEmail;
        }
      }
      
      return isAdmin;
    } catch (error) {
      console.error('UserService: Unexpected error in isCurrentUserAdmin:', error);
      return false; // Default to most secure option
    }
  }

  /**
   * Get user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      console.log(`UserService: Fetching profile for user ${uid}`);
      const doc = await firestoreService.getDoc<UserProfile>(this.COLLECTION_NAME, uid);
      console.log('UserService: Fetched profile:', doc);
      return doc;
    } catch (error) {
      console.error('UserService: Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Create a new user profile
   */
  async createUserProfile(userData: Partial<UserProfile>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      const error = 'No authenticated user found';
      console.error('UserService:', error);
      throw new Error(error);
    }
    
    console.log('UserService: Creating user profile for:', currentUser.email);
    const isAdmin = currentUser.email === ADMIN_EMAIL;
    console.log('UserService: Is admin email?', isAdmin);
    
    // Get user data from auth service to get the username if available
    const authUserData = await getUserData(currentUser.uid);
    
    const now = Date.now();
    const newUser: UserProfile = {
      uid: currentUser.uid,
      username: userData.username || authUserData?.username || currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
      email: currentUser.email || '',
      role: isAdmin ? 'admin' : 'user',
      level: userData.level || 1,
      badges: userData.badges || [],
      lexIQScore: userData.lexIQScore || 0,
      dailyQuizStreak: userData.dailyQuizStreak || 0,
      chaptersCompleted: userData.chaptersCompleted || [],
      gamesPlayed: userData.gamesPlayed || 0,
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
      dailyNotifications: userData.dailyNotifications ?? true,
      soundEffects: userData.soundEffects ?? true,
      profession: userData.profession || ''
    };
    
    console.log('UserService: New user data:', newUser);
    
    try {
      await firestoreService.update(this.COLLECTION_NAME, currentUser.uid, newUser);
      console.log('UserService: Successfully created/updated user profile');
      return currentUser.uid;
    } catch (error) {
      console.error('UserService: Error creating/updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      console.log(`UserService: Updating profile for user ${uid} with:`, updates);
      await firestoreService.update(this.COLLECTION_NAME, uid, {
        ...updates,
        updatedAt: Date.now()
      });
      console.log('UserService: Successfully updated user profile');
    } catch (error) {
      console.error('UserService: Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile(uid: string): Promise<void> {
    try {
      console.log(`UserService: Deleting profile for user ${uid}`);
      await firestoreService.delete(this.COLLECTION_NAME, uid);
      console.log('UserService: Successfully deleted user profile');
    } catch (error) {
      console.error('UserService: Error deleting user profile:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      console.log('UserService: Fetching all users');
      const users = await firestoreService.getAll<UserProfile>(this.COLLECTION_NAME);
      console.log('UserService: Fetched users:', users);
      return users;
    } catch (error) {
      console.error('UserService: Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Increment user level
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