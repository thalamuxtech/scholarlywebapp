import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA7K2-uii2ZAfk-eKyBKl6RCruTROdRFxs',
  authDomain: 'scholarly-echo.firebaseapp.com',
  projectId: 'scholarly-echo',
  storageBucket: 'scholarly-echo.firebasestorage.app',
  messagingSenderId: '539995167420',
  appId: '1:539995167420:web:e268b594007bca3d558eb9',
  measurementId: 'G-4ZJL7K6PQB',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, storage, analytics };
