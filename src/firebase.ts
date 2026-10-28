import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  runTransaction, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const isOffline = errMessage.includes('offline') || (error as any)?.code === 'unavailable';

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isOffline) {
    console.warn('Firestore operating in offline mode: ', errMessage);
  } else {
    console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  }
  return errInfo;
}

// Test Connection on boot
export async function testFirebaseConnection() {
  try {
    const statsDocRef = doc(db, 'stats', 'userCount');
    await getDoc(statsDocRef);
    console.log("Firebase Firestore initialized.");
  } catch (error) {
    console.warn("Firestore connection check - operating with local cache / offline.");
  }
}

// Google Sign In via Popup
export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await registerOrUpdateUserProfile(user);
    }
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

// Logout
export async function logoutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Register or update user profile document + update total user counter
export async function registerOrUpdateUserProfile(user: FirebaseUser) {
  const userDocRef = doc(db, 'users', user.uid);
  const statsDocRef = doc(db, 'stats', 'userCount');
  const nowStr = new Date().toISOString();

  // Cache user locally so offline mode always remembers login
  try {
    localStorage.setItem('nh3_cached_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: nowStr
    }));
  } catch (_) {}

  try {
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      // New user registration
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'مهندس أمونيا متدرب',
        photoURL: user.photoURL || '',
        createdAt: nowStr,
        lastLoginAt: nowStr
      });

      // Increment global user count atomically using transaction or updateDoc
      try {
        await runTransaction(db, async (transaction) => {
          const statsSnap = await transaction.get(statsDocRef);
          if (!statsSnap.exists()) {
            transaction.set(statsDocRef, {
              totalUsers: 1,
              updatedAt: nowStr
            });
          } else {
            const currentCount = statsSnap.data().totalUsers || 0;
            transaction.update(statsDocRef, {
              totalUsers: currentCount + 1,
              updatedAt: nowStr
            });
          }
        });
      } catch (txErr) {
        console.warn("Could not increment user count transaction:", txErr);
      }
    } else {
      // Existing user login update
      await updateDoc(userDocRef, {
        lastLoginAt: nowStr,
        displayName: user.displayName || userSnap.data().displayName || '',
        photoURL: user.photoURL || userSnap.data().photoURL || ''
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

// Real-time Total Users listener
export function listenToUserCount(onCountUpdate: (count: number) => void): () => void {
  const statsDocRef = doc(db, 'stats', 'userCount');
  
  const unsubscribe = onSnapshot(
    statsDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCountUpdate(data.totalUsers || 1);
      } else {
        onCountUpdate(1);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/userCount');
      onCountUpdate(1);
    }
  );

  return unsubscribe;
}

// Auth State Observer
export function observeAuthState(onChange: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await registerOrUpdateUserProfile(user);
      } catch (e) {
        console.warn("Failed updating profile on auth state change:", e);
      }
    }
    onChange(user);
  });
}
