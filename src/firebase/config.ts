import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyz66OBEXuhAmAXEkZNKIcNFSFa3ougI4",
  authDomain: "iitm-hackathon-42f92.firebaseapp.com",
  projectId: "iitm-hackathon-42f92",
  storageBucket: "iitm-hackathon-42f92.firebasestorage.app",
  messagingSenderId: "373714989305",
  appId: "1:373714989305:web:77135c1b20a0909618f228",
  measurementId: "G-9MP24QWBNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app; 