import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// User interface
export interface User {
  email: string;
  displayName?: string;
  username?: string;
  uid: string;
}

// Helper function to check if two dates are consecutive days
const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  // Set both dates to midnight for accurate day comparison
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Get user's current profile from Firestore directly to avoid circular dependency
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const now = new Date();
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      let updates: any = {};
      
      // Check if user has logged in before
      if (userData.lastLogin) {
        const lastLogin = new Date(userData.lastLogin);
        const today = new Date();
        
        // If last login was not today
        if (lastLogin.toDateString() !== today.toDateString()) {
          // Check if it's a consecutive day
          if (isConsecutiveDay(lastLogin, now)) {
            // Increment streak
            updates.dailyQuizStreak = (userData.dailyQuizStreak || 0) + 1;
          } else {
            // Reset streak if not consecutive
            updates.dailyQuizStreak = 1;
          }
        }
      } else {
        // First time login, set initial streak
        updates.dailyQuizStreak = 1;
      }
      
      // Always update last login time
      updates.lastLogin = now.getTime();
      updates.updatedAt = now.getTime();
      
      // Update the user document
      await updateDoc(userRef, updates);
    }
    
    // Save login attempt to database
    await saveLoginActivity(userId, email);
    
    return userCredential;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string,
  username?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save user data to Firestore
    await saveUserData(userCredential.user.uid, {
      email,
      displayName: displayName || '',
      username: username || displayName || email.split('@')[0],
      uid: userCredential.user.uid,
    });
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Save user data to Firestore
export const saveUserData = async (userId: string, userData: User): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, userData);
};

// Save login activity to database
export const saveLoginActivity = async (userId: string, email: string): Promise<void> => {
  const activityRef = doc(db, 'loginActivity', `${userId}_${Date.now()}`);
  await setDoc(activityRef, {
    userId,
    email,
    timestamp: new Date(),
    action: 'login'
  });
};

// Get current user data from Firestore
export const getUserData = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    return null;
  }
}; 