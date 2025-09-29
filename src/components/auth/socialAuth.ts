import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  type Auth,
} from 'firebase/auth';
import { ensureUserDoc } from './ensureUserDoc';

// Sign in with Google using Firebase Authentication
// - Opens a popup window for Google login
// - Ensures the user document is created/updated in Firestore
export async function signInWithGoogle(auth: Auth, marketingOptIn?: boolean) {
  const provider = new GoogleAuthProvider();

  // Force account selection prompt when signing in
  provider.setCustomParameters({ prompt: 'select_account' });

  // Perform sign-in with popup
  const { user } = await signInWithPopup(auth, provider);

  // Ensure Firestore user doc exists/updates with marketing opt-in preference
  await ensureUserDoc(user, { marketingOptIn });

  return user;
}

// Sign in with Facebook using Firebase Authentication
// - Opens a popup for Facebook login
// - Ensures Firestore user doc is created/updated
export async function signInWithFacebook(auth: Auth, marketingOptIn?: boolean) {
  const provider = new FacebookAuthProvider();

  const { user } = await signInWithPopup(auth, provider);
  await ensureUserDoc(user, { marketingOptIn });

  return user;
}

// Sign in with Apple using Firebase Authentication
// - Opens a popup for Apple login
// - Requests additional scopes: email and name
// - Ensures Firestore user doc is created/updated
export async function signInWithApple(auth: Auth, marketingOptIn?: boolean) {
  const provider = new OAuthProvider('apple.com');

  // Request email and name from Apple account
  provider.addScope('email');
  provider.addScope('name');

  const { user } = await signInWithPopup(auth, provider);
  await ensureUserDoc(user, { marketingOptIn });

  return user;
}
