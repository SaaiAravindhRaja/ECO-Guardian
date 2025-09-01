import React, { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '@/services/FirebaseService';
import { setUser, clearAuth, setLoading } from '@/store/slices/authSlice';
import { AuthService } from '@/services/AuthService';

interface AuthContextType {
  authService: AuthService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const authService = new AuthService();

  useEffect(() => {
    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
        }));
      } else {
        dispatch(clearAuth());
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ authService }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}