import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredProfile = (userId: string) => {
  try {
    const saved = localStorage.getItem(`user_profile_${userId}`);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedProfile = getStoredProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          name: storedProfile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'admin', // Default role for demo, typically fetched from Firestore claims
          avatar: storedProfile.avatar,
          phone: storedProfile.phone,
          joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          isActive: true,
          lastActive: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          leadsAssigned: 0,
          leadsConverted: 0,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const storedProfile = getStoredProfile(firebaseUser.uid);
      setUser({
        id: firebaseUser.uid,
        name: storedProfile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: 'admin',
        avatar: storedProfile.avatar,
        phone: storedProfile.phone,
        joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        isActive: true,
        lastActive: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        leadsAssigned: 0,
        leadsConverted: 0,
      });
      return true;
    } catch (e: any) {
      console.error("Firebase Login failed. Falling back to local mock authentication.", e);
      // Fallback for local development when Firebase is unreachable
      const fallbackId = 'mock-local-user-id';
      const storedProfile = getStoredProfile(fallbackId);
      setUser({
        id: fallbackId,
        name: storedProfile.name || email.split('@')[0] || 'Local User',
        email: email,
        role: 'admin',
        avatar: storedProfile.avatar,
        phone: storedProfile.phone,
        joinedAt: new Date().toISOString(),
        isActive: true,
        lastActive: new Date().toISOString(),
        leadsAssigned: 0,
        leadsConverted: 0,
      });
      return true;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const storedProfile = getStoredProfile(firebaseUser.uid);
      setUser({
        id: firebaseUser.uid,
        name: storedProfile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: 'admin',
        avatar: storedProfile.avatar,
        phone: storedProfile.phone,
        joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        isActive: true,
        lastActive: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        leadsAssigned: 0,
        leadsConverted: 0,
      });
      return true;
    } catch (e: any) {
      console.error('Google sign-in failed', e);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        const firebaseUser = userCredential.user;
        const storedProfile = getStoredProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          name: storedProfile.name || name,
          email: firebaseUser.email || '',
          role: 'admin',
          avatar: storedProfile.avatar,
          phone: storedProfile.phone,
          joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          isActive: true,
          lastActive: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          leadsAssigned: 0,
          leadsConverted: 0,
        });
      }
      return true;
    } catch (e) {
      console.error("Signup failed", e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const updateProfileData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(`user_profile_${user.id}`, JSON.stringify({
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        name: updatedUser.name
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout, signup, switchRole, updateProfile: updateProfileData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
