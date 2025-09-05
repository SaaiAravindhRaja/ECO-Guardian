import React, { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth, database } from '@/services/FirebaseService';
import { setUser, clearAuth, setLoading } from '@/store/slices/authSlice';
import { AuthService } from '@/services/AuthService';
import { ref, get, set } from 'firebase/database';

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
        // Bootstrap profile if missing
        const userRef = ref(database, `users/${user.uid}`);
        void get(userRef).then(async (snap) => {
          if (!snap.exists()) {
            await set(userRef, {
              uid: user.uid,
              displayName: user.displayName || 'User',
              email: user.email,
              createdAt: new Date().toISOString(),
              level: 1,
              totalPoints: 0,
              achievements: [],
              sustainabilityStats: {
                totalEcoActions: 0,
                sustainabilityStreak: 0,
                locationVisits: [],
                challengesCompleted: 0,
                co2Saved: 0,
                waterSaved: 0,
                wasteRecycled: 0,
              },
              preferences: {
                notificationsEnabled: true,
                locationSharingEnabled: true,
                socialFeaturesEnabled: true,
                arEffectsEnabled: true,
                soundEnabled: true,
              },
              creatures: {},
            });
          }
        });
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