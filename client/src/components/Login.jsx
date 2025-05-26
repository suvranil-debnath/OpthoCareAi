import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB7do_r0UQX6aPsgi5og0aVW0MOnbnrwWg",
  authDomain: "opthocareai.firebaseapp.com",
  projectId: "opthocareai",
  storageBucket: "opthocareai.firebasestorage.app",
  messagingSenderId: "1022851624519",
  appId: "1:1022851624519:web:6eac4b136a25b0aff38b62"
};

// Initialize Firebase app once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userData = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    return userData;
  } catch (error) {
    console.error('Google Sign-In Failed:', error);
    throw error;
  }
};
