import { db } from '../../firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

// Type definition for optional options when creating/updating user doc
type EnsureOpts = { marketingOptIn?: boolean };

// This function ensures that a user document exists in Firestore
// If the document already exists, it will be merged with new values
// If it doesn't exist, it will be created with the provided defaults
export async function ensureUserDoc(user: User, opts?: EnsureOpts) {
  await setDoc(
    // Reference to the "users" collection with the user's UID as the document ID
    doc(db, 'users', user.uid),
    {
      // Basic user fields
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',

      // Default role assigned to every new user
      role: 'user',

      // Whether the user opted in for marketing (default: false if not provided)
      marketingOptIn: !!opts?.marketingOptIn,

      // Creation timestamp — meaningful only on the very first creation
      createdAt: serverTimestamp(),

      // Updated timestamp — refreshed each time this function is called
      updatedAt: serverTimestamp(),
    },
    {
      // Merge ensures we don't overwrite existing fields unintentionally
      merge: true,
    }
  );
}
