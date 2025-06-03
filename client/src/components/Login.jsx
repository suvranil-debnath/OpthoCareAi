import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7do_r0UQX6aPsgi5og0aVW0MOnbnrwWg",
  authDomain: "opthocareai.firebaseapp.com",
  projectId: "opthocareai",
  storageBucket: "opthocareai.firebasestorage.app",
  messagingSenderId: "1022851624519",
  appId: "1:1022851624519:web:6eac4b136a25b0aff38b62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// Google Sign-In and store user in Realtime Database (only if new)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    };

    const userRef = ref(database, 'Users/' + user.uid);

    // Check if user already exists
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      // New user, initialize their data
      const newUserData = {
        ...userData,
        trail_count: 5,
        Subscriber: false,
      };

      await set(userRef, newUserData);
      return newUserData;
    } else {
      // User already exists, return existing data
      return snapshot.val();
    }
  } catch (error) {
    console.error('Google Sign-In Failed:', error);
    throw error;
  }
};
