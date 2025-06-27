import { FirestoreService } from './firestore.service';
import { auth } from '../firebase/config';
import { UserProfile } from '../models/UserProfile';
import { getUserData } from './auth.service';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

// Admin email for role assignment
const ADMIN_EMAIL = 'vedtheadmin@gmail.com';

const firestoreService = new FirestoreService();

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
   * Complete a quiz and update streak
   * This is the main method for quiz-based streak logic
   */
  async completeQuiz(uid: string, quizScore: number, quizType: string = 'general'): Promise<{
    streakUpdated: boolean;
    newStreak: number;
    streakBonus: number;
    message: string;
  }> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if user has already completed a quiz today
    const lastQuizDate = user.lastQuizDate ? new Date(user.lastQuizDate) : null;
    const lastQuizToday = lastQuizDate ? 
      new Date(lastQuizDate.getFullYear(), lastQuizDate.getMonth(), lastQuizDate.getDate()).getTime() === today.getTime() : 
      false;

    if (lastQuizToday) {
      // Already completed a quiz today, don't update streak
      return {
        streakUpdated: false,
        newStreak: user.dailyQuizStreak,
        streakBonus: 0,
        message: 'Quiz already completed today!'
      };
    }

    let newStreak = user.dailyQuizStreak;
    let streakBonus = 0;
    let message = '';
    let daysDiff = 0;

    // Check if this is a consecutive day
    if (lastQuizDate) {
      const lastQuizDay = new Date(lastQuizDate.getFullYear(), lastQuizDate.getMonth(), lastQuizDate.getDate());
      daysDiff = Math.floor((today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = user.dailyQuizStreak + 1;
        streakBonus = Math.min(newStreak * 5, 50); // Bonus points based on streak (max 50)
        message = `🔥 Streak continued! Day ${newStreak}`;
      } else if (daysDiff === 2 && user.streakFreezeUsed === false) {
        // Missed one day but has streak freeze - maintain streak
        newStreak = user.dailyQuizStreak;
        streakBonus = Math.min(newStreak * 3, 30); // Reduced bonus for using freeze
        message = `❄️ Streak protected! Day ${newStreak} (freeze used)`;
      } else if (daysDiff > 1) {
        // Missed multiple days - reset streak
        newStreak = 1;
        streakBonus = 5; // Small bonus for starting new streak
        message = '🔄 New streak started!';
      }
    } else {
      // First quiz ever
      newStreak = 1;
      streakBonus = 5;
      message = '🎯 First quiz completed!';
    }

    // Calculate total score with streak bonus
    const totalScore = quizScore + streakBonus;

    // Update user profile
    await this.updateUserProfile(uid, {
      dailyQuizStreak: newStreak,
      lastQuizDate: today.getTime(),
      streakFreezeUsed: daysDiff === 2 ? true : user.streakFreezeUsed,
      lexIQScore: user.lexIQScore + totalScore,
      gamesPlayed: user.gamesPlayed + 1
    });

    return {
      streakUpdated: true,
      newStreak,
      streakBonus,
      message
    };
  }

  /**
   * Use streak freeze to protect streak for one missed day
   */
  async useStreakFreeze(uid: string): Promise<boolean> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');

    if (user.streakFreezeUsed) {
      return false; // Already used
    }

    await this.updateUserProfile(uid, {
      streakFreezeUsed: true
    });

    return true;
  }

  /**
   * Reset streak freeze (can be called daily or weekly)
   */
  async resetStreakFreeze(uid: string): Promise<void> {
    return this.updateUserProfile(uid, {
      streakFreezeUsed: false
    });
  }

  /**
   * Get streak statistics
   */
  async getStreakStats(uid: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    totalQuizzes: number;
    streakFreezeAvailable: boolean;
    nextMilestone: number;
    daysToNextMilestone: number;
  }> {
    const user = await this.getUserProfile(uid);
    if (!user) throw new Error('User not found');

    const milestones = [7, 14, 30, 60, 100];
    const nextMilestone = milestones.find(m => m > user.dailyQuizStreak) || 100;
    const daysToNextMilestone = nextMilestone - user.dailyQuizStreak;

    return {
      currentStreak: user.dailyQuizStreak,
      longestStreak: user.longestStreak || user.dailyQuizStreak,
      totalQuizzes: user.gamesPlayed,
      streakFreezeAvailable: !user.streakFreezeUsed,
      nextMilestone,
      daysToNextMilestone
    };
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

  /**
   * Compress image before upload
   */
  private compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Reduce maximum dimensions for faster upload
        const maxWidth = 300;
        const maxHeight = 300;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.6 // Reduce quality to 60% for faster upload
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Upload a profile picture and update the user's photoURL
   */
  async uploadProfilePicture(uid: string, file: File): Promise<string> {
    try {
      console.log('Starting image upload for user:', uid);
      
      // Check file size before compression
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size too large. Please select an image smaller than 10MB.');
      }
      
      // Compress image first
      console.log('Compressing image...');
      const compressedFile = await this.compressImage(file);
      console.log('Image compressed. Original size:', file.size, 'Compressed size:', compressedFile.size);
      
      const storageRef = ref(storage, `profile_pictures/${uid}`);
      console.log('Uploading to Firebase Storage...');
      await uploadBytes(storageRef, compressedFile);
      
      console.log('Getting download URL...');
      const url = await getDownloadURL(storageRef);
      
      console.log('Updating user profile...');
      await this.updateUserProfile(uid, { photoURL: url });
      
      console.log('Profile picture upload completed successfully');
      return url;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to upload image. Please try again.');
    }
  }
} 