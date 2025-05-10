import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// User interface
export interface User {
  email: string;
  displayName?: string;
  uid: string;
}

// Login user
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Save login attempt to database
    await saveLoginActivity(userCredential.user.uid, email);
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Register new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save user data to Firestore
    await saveUserData(userCredential.user.uid, {
      email,
      displayName: displayName || '',
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