import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, UserRole } from '@cedo/shared';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (fbUser) {
          const tokenResult = await fbUser.getIdTokenResult();
          const role = (tokenResult.claims.role as UserRole) || 'recepcion';

          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario Clínico',
            role,
            active: true,
            createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
            lastLogin: fbUser.metadata.lastSignInTime || new Date().toISOString()
          });
        } else {
          setUser(null);
        }
      } catch (err: any) {
        console.error('Error al obtener perfil de usuario:', err);
        setError(err.message || 'Error al procesar sesión');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await cred.user.getIdTokenResult();
      const role = (tokenResult.claims.role as UserRole) || 'recepcion';

      setUser({
        id: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Usuario Clínico',
        role,
        active: true,
        createdAt: cred.user.metadata.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
