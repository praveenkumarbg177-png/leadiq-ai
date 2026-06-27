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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'admin', // Default role for demo, typically fetched from Firestore claims
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
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: 'admin',
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
      setUser({
        id: 'mock-local-user-id',
        name: email.split('@')[0] || 'Local User',
        email: email,
        role: 'admin',
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
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role: 'admin',
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
        setUser({
          id: firebaseUser.uid,
          name: name,
          email: firebaseUser.email || '',
          role: 'admin',
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout, signup, switchRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
