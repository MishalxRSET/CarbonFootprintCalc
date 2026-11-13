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
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;

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

// Memory token cache. Google OAuth access tokens expire after 60 minutes,
// so treat a cached token as stale a little before that.
const TOKEN_LIFETIME_MS = 55 * 60 * 1000;
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let tokenIssuedAt = 0;
// The account the token was issued for: another tab can switch the signed-in user
let tokenUid: string | null = null;
let cachedUserProfile: AuthUserProfile | null = null;

const cacheAccessToken = (token: string | null, uid: string | null = null) => {
  cachedAccessToken = token;
  tokenUid = token ? uid : null;
  tokenIssuedAt = token ? Date.now() : 0;
};

/** The cached token, only while it is fresh and belongs to `uid` (the signed-in user by default). */
const freshAccessToken = (uid: string | null | undefined = auth.currentUser?.uid): string | null =>
  cachedAccessToken && uid && tokenUid === uid && Date.now() - tokenIssuedAt < TOKEN_LIFETIME_MS
    ? cachedAccessToken
    : null;

/** True when a Drive token can be reused without opening the Google popup. */
export const hasFreshAccessToken = (): boolean => freshAccessToken() !== null;

/**
 * Map Firebase auth failures onto the app's error codes:
 * AUTH_CANCELLED, AUTH_POPUP_BLOCKED, AUTH_UNAUTHORIZED_DOMAIN, AUTH_NETWORK.
 */
const toAuthError = (error: unknown): Error => {
  const { code, message } = (error ?? {}) as { code?: string; message?: string };
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request' || code === 'auth/user-cancelled') {
    return new Error('AUTH_CANCELLED');
  }
  if (code === 'auth/unauthorized-domain') return new Error('AUTH_UNAUTHORIZED_DOMAIN');
  if (code === 'auth/network-request-failed') return new Error('AUTH_NETWORK');
  if (code === 'auth/popup-blocked' || message?.toLowerCase().includes('popup')) return new Error('AUTH_POPUP_BLOCKED');
  return error instanceof Error ? error : new Error(message || 'Google sign-in failed.');
};

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
    if (onAuthSuccess) onAuthSuccess(cachedUserProfile, freshAccessToken(cachedUserProfile.uid));
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
      // A different account signed in (e.g. from another tab): never hand it the previous account's token
      if (tokenUid !== firebaseUser.uid) cacheAccessToken(null);
      successListeners.forEach((cb) => cb(profile, freshAccessToken(profile.uid)));
    } else if (!isSigningIn) {
      cachedUserProfile = null;
      cacheAccessToken(null);
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
 * Request Google Drive access using Firebase Auth popup (uses authorized authDomain handler, avoiding origin mismatch).
 * Reuses the cached token while it is fresh unless `forceRefresh` is set (e.g. to re-ask for a declined Drive scope).
 */
export const requestDriveAccess = async ({ forceRefresh = false }: { forceRefresh?: boolean } = {}): Promise<string> => {
  const fresh = freshAccessToken();
  if (fresh && !forceRefresh) {
    return fresh;
  }

  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Drive access token from Google sign-in.');
    }
    const token = credential.accessToken;
    cacheAccessToken(token, result.user.uid);

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
    const authError = toAuthError(error);
    // A closed popup is a deliberate user choice, not a failure worth logging
    if (authError.message !== 'AUTH_CANCELLED') console.error('Drive access error:', error);
    throw authError;
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
    cacheAccessToken(credential?.accessToken || null, result.user.uid);

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
    const authError = toAuthError(error);
    // Benign: User simply closed the popup before completing sign-in
    if (authError.message === 'AUTH_CANCELLED') return null;
    console.error('Google Sign-in Error:', error);
    throw authError;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve the cached access token while it is still fresh
 */
export const getAccessToken = async (): Promise<string | null> => {
  return freshAccessToken();
};

/**
 * Explicitly cache access token if updated
 */
export const setCachedAccessToken = (token: string | null) => {
  cacheAccessToken(token, auth.currentUser?.uid ?? null);
};

/**
 * Drop the cached token after Google rejects it (expired, revoked or missing the Drive scope)
 */
export const invalidateAccessToken = () => {
  cacheAccessToken(null);
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
  cacheAccessToken(null);
  cachedUserProfile = null;
  failureListeners.forEach((cb) => cb());
};
