import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { syncOfflineBankWithImages } from './offlineSyncService';
import { sanitizeErrorText } from '../utils/cleanError';
import { UserProfile, ProgressMap, QuizResult, Question, QuizSettings, ActivationToken } from '../types';

const PROFILE_STORAGE_KEY = 'studySuite_user_profile';
const DEVICE_ACTIVATED_KEY = 'studySuite_device_activated';
export const ADMIN_EMAIL = 'jentlecasper014@gmail.com';

// Device-level activation helper (offline persistent)
export function isDeviceActivated(): boolean {
  try {
    return localStorage.getItem(DEVICE_ACTIVATED_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setDeviceActivated(activated: boolean = true): void {
  try {
    if (activated) {
      localStorage.setItem(DEVICE_ACTIVATED_KEY, 'true');
    } else {
      localStorage.removeItem(DEVICE_ACTIVATED_KEY);
    }
  } catch (e) {
    console.warn('Failed to set device activation:', e);
  }
}

// Check if app is activated on this device or for this user profile
export function isUserActivated(profile: UserProfile | null): boolean {
  if (isDeviceActivated()) return true;
  if (!profile) return false;
  if (profile.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
  if (profile.isActivated) return true;
  if (profile.uid && localStorage.getItem(`studySuite_activated_${profile.uid}`) === 'true') {
    return true;
  }
  return false;
}

// Get profile stored locally
export function getStoredUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const p: UserProfile = JSON.parse(raw);
      if (isDeviceActivated() || (p.uid && localStorage.getItem(`studySuite_activated_${p.uid}`) === 'true')) {
        p.isActivated = true;
      }
      return p;
    }
  } catch (e) {
    console.warn('Failed to parse local user profile:', e);
  }
  return null;
}

// Save profile locally for offline support
export function saveUserProfileLocally(profile: UserProfile | null): void {
  try {
    if (profile) {
      if (profile.isActivated && profile.uid) {
        localStorage.setItem(`studySuite_activated_${profile.uid}`, 'true');
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to save user profile locally:', e);
  }
}

// Register user with Email, Password, Name, Department, and School via Firebase Auth
export async function registerUser(
  email: string,
  pass: string,
  name: string,
  department: string,
  school: string
): Promise<{ user: User; profile: UserProfile }> {
  const cleanEmail = email.trim();
  const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Authentic Firebase user creation
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  const firebaseUser = userCredential.user;

  try {
    await updateProfile(firebaseUser, { displayName: name.trim() });
  } catch (e) {
    console.warn('Could not update Firebase displayName:', e);
  }

  const uid = firebaseUser.uid;

  const profile: UserProfile = {
    uid,
    email: cleanEmail,
    name: name.trim() || 'Calculus Scholar',
    department: department.trim() || 'Mathematics & Science',
    school: school.trim() || 'University Campus',
    isActivated: isAdmin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isAdmin || profile.isActivated) {
    localStorage.setItem(`studySuite_activated_${uid}`, 'true');
  }

  // Save to Firestore users collection
  try {
    await setDoc(doc(db, 'users', uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Firestore user profile document creation skipped or deferred:', e);
  }

  // Cache profile locally
  saveUserProfileLocally(profile);

  return { user: firebaseUser, profile };
}

// Login user with Email & Password via Firebase Auth
export async function loginUser(
  email: string,
  pass: string
): Promise<{ user: User; profile: UserProfile }> {
  const cleanEmail = email.trim();
  const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Authentic Firebase sign in
  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  const firebaseUser = userCredential.user;
  const uid = firebaseUser.uid;

  // Fetch or construct profile
  let profile: UserProfile | null = null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      const activatedInDoc = !!data.isActivated || isAdmin;
      profile = {
        uid,
        email: data.email || firebaseUser.email || cleanEmail,
        name: data.name || firebaseUser.displayName || 'Calculus Scholar',
        department: data.department || 'Mathematics & Science',
        school: data.school || 'University Campus',
        isActivated: activatedInDoc || localStorage.getItem(`studySuite_activated_${uid}`) === 'true',
        activationToken: data.activationToken || undefined,
        activatedAt: data.activatedAt || undefined,
        createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  } catch (e) {
    console.warn('Could not fetch user profile from Firestore online:', e);
  }

  if (!profile) {
    const local = getStoredUserProfile();
    if (local && local.uid === uid) {
      profile = {
        ...local,
        isActivated: local.isActivated || isAdmin || localStorage.getItem(`studySuite_activated_${uid}`) === 'true'
      };
    } else {
      profile = {
        uid,
        email: firebaseUser.email || cleanEmail,
        name: firebaseUser.displayName || cleanEmail.split('@')[0] || 'Calculus Scholar',
        department: 'Mathematics & Science',
        school: 'University Campus',
        isActivated: isAdmin || localStorage.getItem(`studySuite_activated_${uid}`) === 'true',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  if (profile.isActivated) {
    localStorage.setItem(`studySuite_activated_${uid}`, 'true');
  }

  saveUserProfileLocally(profile);
  return { user: firebaseUser, profile };
}

// Sign in with Google via Firebase Auth
export async function loginWithGoogle(): Promise<{ user: User; profile: UserProfile }> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseUser = userCredential.user;
  const uid = firebaseUser.uid;
  const cleanEmail = firebaseUser.email || '';
  const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  let profile = await fetchUserProfileDoc(uid);
  if (!profile) {
    profile = {
      uid,
      email: cleanEmail,
      name: firebaseUser.displayName || 'Calculus Scholar',
      department: 'Mathematics & Science',
      school: 'University Campus',
      isActivated: isAdmin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore user profile document creation skipped or deferred:', e);
    }
  }

  if (profile.isActivated || isAdmin) {
    localStorage.setItem(`studySuite_activated_${uid}`, 'true');
  }
  saveUserProfileLocally(profile);

  return { user: firebaseUser, profile };
}

// Fetch user profile doc
export async function fetchUserProfileDoc(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      const isAdmin = (data.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const profile: UserProfile = {
        uid,
        email: data.email || '',
        name: data.name || 'Calculus Scholar',
        department: data.department || '',
        school: data.school || '',
        isActivated: !!data.isActivated || isAdmin || localStorage.getItem(`studySuite_activated_${uid}`) === 'true',
        activationToken: data.activationToken || undefined,
        activatedAt: data.activatedAt || undefined,
        createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (profile.isActivated) {
        localStorage.setItem(`studySuite_activated_${uid}`, 'true');
      }
      saveUserProfileLocally(profile);
      return profile;
    }
  } catch (e) {
    console.warn('Failed to fetch user profile doc from Firestore:', e);
  }
  return getStoredUserProfile();
}

// Redeem activation token from support
export async function redeemToken(
  tokenCode: string,
  profile: UserProfile | null
): Promise<{ success: boolean; message: string; updatedProfile?: UserProfile }> {
  const codeClean = tokenCode.trim().toUpperCase();
  if (!codeClean) {
    return { success: false, message: 'Please enter a valid activation token.' };
  }

  try {
    const tokensRef = collection(db, 'tokens');
    const q = query(tokensRef, where('code', '==', codeClean), where('isUsed', '==', false));
    const snap = await getDocs(q);

    if (snap.empty) {
      if (isDeviceActivated()) {
        return {
          success: true,
          message: 'This device is already activated and unlocked.'
        };
      }
      return {
        success: false,
        message: 'Invalid or already redeemed activation token. Please contact support to get a new token.'
      };
    }

    const tokenDoc = snap.docs[0];
    const tokenRef = doc(db, 'tokens', tokenDoc.id);

    const nowIso = new Date().toISOString();

    // Mark token as used in Firestore
    await updateDoc(tokenRef, {
      isUsed: true,
      usedByUid: profile?.uid || 'device_user',
      usedByEmail: profile?.email || 'device_user',
      usedAt: serverTimestamp()
    });

    // Mark device as activated persistently in offline local storage
    setDeviceActivated(true);

    // Sync question bank with hints & image diagrams locally for offline use
    let syncDataInfo = null;
    try {
      syncDataInfo = await syncOfflineBankWithImages();
    } catch (syncErr) {
      console.warn('Offline image hint sync warning:', syncErr);
    }

    let updatedProfile: UserProfile | undefined = undefined;

    if (profile && profile.uid) {
      try {
        const userRef = doc(db, 'users', profile.uid);
        await updateDoc(userRef, {
          isActivated: true,
          activationToken: codeClean,
          activatedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (userErr) {
        console.warn('Could not update Firestore user doc during token activation:', userErr);
      }

      updatedProfile = {
        ...profile,
        isActivated: true,
        activationToken: codeClean,
        activatedAt: nowIso
      };

      localStorage.setItem(`studySuite_activated_${profile.uid}`, 'true');
      saveUserProfileLocally(updatedProfile);
    }

    const syncMsg = syncDataInfo
      ? ` Device activated! Synced ${syncDataInfo.questionCount} questions & ${syncDataInfo.imageCount} image hint diagrams locally for offline study.`
      : ' Device activated and saved offline!';

    return {
      success: true,
      message: `Token activated successfully!${syncMsg}`,
      updatedProfile
    };
  } catch (e: any) {
    console.error('Failed to redeem token:', e);

    if (isDeviceActivated()) {
      return {
        success: true,
        message: 'This device is already unlocked and activated.'
      };
    }

    return {
      success: false,
      message: sanitizeErrorText(e.message) || 'Error communicating with activation server. Please check your network or try again.'
    };
  }
}

// Admin: Generate Tokens
export async function generateAdminTokens(count: number = 1): Promise<string[]> {
  const generatedCodes: string[] = [];
  const tokensRef = collection(db, 'tokens');

  for (let i = 0; i < count; i++) {
    const randPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `CALC-${randPart1}-${randPart2}`;

    await addDoc(tokensRef, {
      code,
      isUsed: false,
      createdAt: serverTimestamp()
    });

    generatedCodes.push(code);
  }

  return generatedCodes;
}

// Admin: Fetch all tokens
export async function fetchAllTokens(): Promise<ActivationToken[]> {
  try {
    const tokensRef = collection(db, 'tokens');
    const snap = await getDocs(tokensRef);
    const tokensList: ActivationToken[] = [];
    snap.forEach((d) => {
      const data = d.data();
      tokensList.push({
        id: d.id,
        code: data.code || '',
        isUsed: !!data.isUsed,
        usedByUid: data.usedByUid || undefined,
        usedByEmail: data.usedByEmail || undefined,
        createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
        usedAt: data.usedAt ? String(data.usedAt) : undefined
      });
    });
    return tokensList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    console.error('Failed to fetch tokens:', e);
    return [];
  }
}

// Admin: Activate user directly by email
export async function adminActivateUserByEmail(userEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = userEmail.trim();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', cleanEmail));
    const snap = await getDocs(q);

    if (snap.empty) {
      return { success: false, message: `No user account found with email "${cleanEmail}".` };
    }

    const userDoc = snap.docs[0];
    await updateDoc(doc(db, 'users', userDoc.id), {
      isActivated: true,
      activationToken: 'ADMIN_DIRECT',
      activatedAt: serverTimestamp()
    });

    return { success: true, message: `User "${cleanEmail}" activated successfully!` };
  } catch (e: any) {
    return { success: false, message: sanitizeErrorText(e.message) || 'Error activating user.' };
  }
}

// Logout
export async function logoutUser(): Promise<void> {
  await signOut(auth);
  saveUserProfileLocally(null);
}

// Sync user progress & app state to Firestore
export async function syncUserDataToFirestore(
  uid: string,
  progress: ProgressMap,
  resultsHistory: QuizResult[],
  customQuestions: Question[],
  settings: QuizSettings
): Promise<void> {
  if (!uid) return;
  try {
    const ref = doc(db, 'userProgress', uid);
    await setDoc(ref, {
      uid,
      progress,
      resultsHistory,
      customQuestions,
      settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore progress sync deferred or queued (offline):', e);
  }
}

// Load user progress & app state from Firestore
export async function loadUserDataFromFirestore(uid: string): Promise<{
  progress?: ProgressMap;
  resultsHistory?: QuizResult[];
  customQuestions?: Question[];
  settings?: QuizSettings;
} | null> {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, 'userProgress', uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        progress: data.progress,
        resultsHistory: data.resultsHistory,
        customQuestions: data.customQuestions,
        settings: data.settings
      };
    }
  } catch (e) {
    console.warn('Error loading user data from Firestore:', e);
  }
  return null;
}
