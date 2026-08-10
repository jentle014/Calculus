import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUserProfileDoc,
  getStoredUserProfile,
  saveUserProfileLocally
} from '../services/userService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isOffline: boolean;
  register: (email: string, pass: string, name: string, dept: string, school: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(getStoredUserProfile());
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userProf = await fetchUserProfileDoc(currentUser.uid);
        if (userProf) {
          setProfile(userProf);
        } else {
          const localProf = getStoredUserProfile();
          if (localProf && localProf.uid === currentUser.uid) {
            setProfile(localProf);
          } else {
            const fallbackProf: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || 'Calculus Scholar',
              department: 'Mathematics & Science',
              school: 'University Campus'
            };
            setProfile(fallbackProf);
            saveUserProfileLocally(fallbackProf);
          }
        }
      } else {
        // Strictly valid Firebase Auth: if no Firebase user is authenticated, user and profile are null
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, pass: string, name: string, dept: string, school: string) => {
    setLoading(true);
    try {
      const { user: newUser, profile: newProfile } = await registerUser(email, pass, name, dept, school);
      setUser(newUser);
      setProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, profile: loggedInProfile } = await loginUser(email, pass);
      setUser(loggedInUser);
      setProfile(loggedInProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const { loginWithGoogle } = await import('../services/userService');
      const { user: googleUser, profile: googleProfile } = await loginWithGoogle();
      setUser(googleUser);
      setProfile(googleProfile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const updated = await fetchUserProfileDoc(user.uid);
      if (updated) setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isOffline,
        register,
        login,
        loginGoogle,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
