// src/components/auth/ensureUserDoc.ts
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export type UserStatus = 'acheteur' | 'vendeur';

type EnsureOpts = {
  marketingOptIn?: boolean;
  status?: UserStatus; // Optional user status
};

/**
 * Create or update user document in Firestore
 * - First time: sets documents: [], status, createdAt, updatedAt
 * - Later updates: only safe fields + updatedAt (does not overwrite documents/status/createdAt)
 */
export async function ensureUserDoc(user: User, opts?: EnsureOpts) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  // Fields that can always be updated
  const baseUpdatable = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    role: 'user',
    ...(typeof opts?.marketingOptIn !== 'undefined'
      ? { marketingOptIn: !!opts.marketingOptIn }
      : {}),
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    // Create new user document on first login
    await setDoc(ref, {
      ...baseUpdatable,
      documents: [],
      status: opts?.status ?? 'acheteur', // Default: acheteur
      createdAt: serverTimestamp(),
    });
  } else {
    // Merge update without overwriting important fields
    await setDoc(ref, baseUpdatable, { merge: true });
  }
}
