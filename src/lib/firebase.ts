import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

let isSigningIn = false;

export const signInWithGoogle = async () => {
  if (isSigningIn) return;
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/cancelled-popup-request') {
      console.warn('Sign-in popup request was cancelled due to a concurrent request.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.info('Sign-in popup was closed by the user.');
    } else {
      console.error('Firebase Auth Error:', error.message);
      throw error;
    }
  } finally {
    isSigningIn = false;
  }
};

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
