// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDrkz4xb1MWHUdyBIAkDamIKxPFkOfovHI',
  authDomain: 'fraction-1e079.firebaseapp.com',
  projectId: 'fraction-1e079',
  storageBucket: 'fraction-1e079.firebasestorage.app',
  messagingSenderId: '380330207405',
  appId: '1:380330207405:web:cafaaf38ae592d45293e24',
  measurementId: 'G-X381FDY9YC',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
