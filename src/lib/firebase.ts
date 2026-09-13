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
export const OAUTH_CLIENT_ID = firebaseConfig.oAuthClientId;

const provider = new GoogleAuthProvider();
provider.addScope(DRIVE_FILE_SCOPE);
provider.setCustomParameters({
  prompt: 'consent select_account',
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
type AuthCallback = (user: AuthUserProfile, token: string) => void;
type FailureCallback = () => void;
const successListeners: Set<AuthCallback> = new Set();
const failureListeners: Set<FailureCallback> = new Set();

/**
 * Fetch Google User Profile using OAuth2 access token
 */
async function fetchGoogleUserProfile(token: string): Promise<AuthUserProfile> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const info = await res.json();
      return {
        displayName: info.name || info.given_name || 'Google User',
        email: info.email || null,
        photoURL: info.picture || null,
        uid: info.sub || `gsi_${Date.now()}`,
      };
    }
  } catch (e) {
    console.warn('Could not fetch userinfo from Google endpoint:', e);
  }
  return {
    displayName: 'Google Drive User',
    email: null,
    photoURL: null,
    uid: `user_${Date.now()}`,
  };
}

/**
 * Initialize auth state listener. Call this on app load.
 */
export const initAuth = (
  onAuthSuccess?: (user: AuthUserProfile, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (onAuthSuccess) successListeners.add(onAuthSuccess);
  if (onAuthFailure) failureListeners.add(onAuthFailure);

  // If already authenticated in session memory
  if (cachedAccessToken && cachedUserProfile) {
    if (onAuthSuccess) onAuthSuccess(cachedUserProfile, cachedAccessToken);
  }

  // Also listen to Firebase Auth changes
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      if (cachedAccessToken) {
        const profile: AuthUserProfile = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        };
        cachedUserProfile = profile;
        successListeners.forEach((cb) => cb(profile, cachedAccessToken!));
      }
    } else if (!cachedAccessToken && !isSigningIn) {
      cachedUserProfile = null;
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
 * Perform sign in using Google Identity Services (GIS token client).
 * This works natively on mobile Safari, Android Chrome, and all devices without third-party cookie restrictions.
 */
function signInWithGIS(): Promise<{ user: AuthUserProfile; accessToken: string }> {
  return new Promise((resolve, reject) => {
    const google = (window as unknown as { google?: { accounts?: { oauth2?: { initTokenClient: Function } } } })?.google;
    
    if (!google?.accounts?.oauth2?.initTokenClient || !OAUTH_CLIENT_ID) {
      return reject(new Error('GIS_UNAVAILABLE'));
    }

    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: `${DRIVE_FILE_SCOPE} https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
        prompt: 'select_account',
        callback: async (response: { access_token?: string; error?: string; error_description?: string }) => {
          if (response.error) {
            console.error('Google GSI OAuth Error:', response.error, response.error_description);
            return reject(new Error(response.error_description || response.error));
          }
          if (!response.access_token) {
            return reject(new Error('No access token received from Google Identity Services.'));
          }

          const token = response.access_token;
          const profile = await fetchGoogleUserProfile(token);
          cachedAccessToken = token;
          cachedUserProfile = profile;
          successListeners.forEach((cb) => cb(profile, token));
          resolve({ user: profile, accessToken: token });
        },
        error_callback: (err: unknown) => {
          console.error('GSI client initiation error:', err);
          reject(err);
        },
      });

      // Request token with popup dialog
      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Trigger Google Sign In with Drive access scope.
 * Tries Google Identity Services (GIS) first (ideal for mobile and modern browsers),
 * and seamlessly falls back to Firebase Auth popup.
 */
export const googleSignIn = async (): Promise<{ user: AuthUserProfile; accessToken: string } | null> => {
  if (isSigningIn) {
    console.warn('Sign-in already in progress');
    return null;
  }

  isSigningIn = true;
  try {
    // 1. Try Google Identity Services (GSI) - works seamlessly across mobile, iOS Safari, Android, and desktop
    try {
      const gisResult = await signInWithGIS();
      return gisResult;
    } catch (gisError: unknown) {
      const msg = gisError instanceof Error ? gisError.message : String(gisError);
      // If user deliberately closed popup, don't fall back, just rethrow
      if (msg.includes('user_cancel') || msg.includes('popup_closed_by_user')) {
        throw new Error('Sign-in was cancelled or the popup was closed.');
      }
      console.log('GSI not available or returned error, falling back to Firebase Auth:', msg);
    }

    // 2. Fallback: Firebase Auth signInWithPopup
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from credentials');
    }

    cachedAccessToken = credential.accessToken;
    const profile: AuthUserProfile = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    };
    cachedUserProfile = profile;
    successListeners.forEach((cb) => cb(profile, cachedAccessToken!));
    return { user: profile, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    console.error('Google Sign-in Error:', error);
    const errObj = error as { code?: string; message?: string };
    if (errObj.code === 'auth/popup-blocked' || errObj.message?.includes('popup')) {
      throw new Error('Login popup was blocked by your browser. Please tap "Allow Popups" or enable popups for this site.');
    }
    if (errObj.code === 'auth/popup-closed-by-user' || errObj.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in popup was closed before completing authorization.');
    }
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
