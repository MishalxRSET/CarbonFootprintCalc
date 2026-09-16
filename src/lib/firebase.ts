import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-carbonfootprintc-6f304aba-5a89-4088-806d-9cd1e865e122");

export const DRIVE_FILE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

// Google Auth Provider configured with Google Drive scope
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope(DRIVE_FILE_SCOPE);
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface AuthUserProfile {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
}

// Memory token cache
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedUserProfile: AuthUserProfile | null = null;

// Global listener callbacks
type AuthCallback = (user: AuthUserProfile, token: string | null) => void;
type FailureCallback = () => void;

const successListeners: Set<AuthCallback> = new Set();
const failureListeners: Set<FailureCallback> = new Set();

/**
 * Initialize auth state listener. Call this on app load.
 */
export const initAuth = (
  onAuthSuccess?: (user: AuthUserProfile, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  if (onAuthSuccess) successListeners.add(onAuthSuccess);
  if (onAuthFailure) failureListeners.add(onAuthFailure);

  // If already authenticated in session memory
  if (cachedUserProfile) {
    if (onAuthSuccess) onAuthSuccess(cachedUserProfile, cachedAccessToken);
  }

  // Also listen to Firebase Auth changes
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const profile: AuthUserProfile = {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      };
      cachedUserProfile = profile;
      successListeners.forEach((cb) => cb(profile, cachedAccessToken));
    } else if (!isSigningIn) {
      cachedUserProfile = null;
      cachedAccessToken = null;
      failureListeners.forEach((cb) => cb());
    }
  });

  return () => {
    if (onAuthSuccess) successListeners.delete(onAuthSuccess);
    if (onAuthFailure) failureListeners.delete(onAuthFailure);
    unsubscribe();
  };
};

/**
 * Request Google Drive access using Firebase Auth popup (uses authorized authDomain handler, avoiding origin mismatch)
 */
export const requestDriveAccess = async (): Promise<string> => {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Drive access token from Google sign-in.');
    }
    const token = credential.accessToken;
    cachedAccessToken = token;

    const profile: AuthUserProfile = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    cachedUserProfile = profile;
    successListeners.forEach((cb) => cb(profile, token));
    return token;
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };
    if (errObj.code === 'auth/popup-closed-by-user' || errObj.code === 'auth/cancelled-popup-request') {
      // User closed the popup window deliberately - not a systemic failure
      throw new Error('AUTH_CANCELLED');
    }
    if (errObj.code === 'auth/popup-blocked' || errObj.message?.toLowerCase().includes('popup')) {
      throw new Error('AUTH_POPUP_BLOCKED');
    }
    console.error('Drive access error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Trigger Google Sign In using Firebase Auth with Drive scope included
 */
export const googleSignIn = async (): Promise<{ user: AuthUserProfile; accessToken: string | null } | null> => {
  if (isSigningIn) {
    return null;
  }

  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;

    const profile: AuthUserProfile = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    cachedUserProfile = profile;
    successListeners.forEach((cb) => cb(profile, cachedAccessToken));
    return { user: profile, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };
    if (errObj.code === 'auth/popup-closed-by-user' || errObj.code === 'auth/cancelled-popup-request') {
      // Benign: User simply closed the popup before completing sign-in
      return null;
    }
    if (errObj.code === 'auth/popup-blocked' || errObj.message?.toLowerCase().includes('popup')) {
      throw new Error('AUTH_POPUP_BLOCKED');
    }
    console.error('Google Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve cached access token in memory
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Explicitly cache access token if updated
 */
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Sign out and clear cached token
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase signout error:', e);
  }
  cachedAccessToken = null;
  cachedUserProfile = null;
  failureListeners.forEach((cb) => cb());
};
