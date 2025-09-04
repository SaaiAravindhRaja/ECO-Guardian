import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { mockUser, MockUser } from '@/utils/mockData';

interface UserContextValue {
  user: MockUser;
  setUser: (u: MockUser) => void;
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<MockUser>(mockUser);

  const value = useMemo<UserContextValue>(() => ({
    user: userState,
    setUser: setUserState,
    addPoints: (points: number) => setUserState(prev => ({ ...prev, points: prev.points + points })),
    incrementStreak: () => setUserState(prev => ({ ...prev, streak: prev.streak + 1 })),
    resetStreak: () => setUserState(prev => ({ ...prev, streak: 0 })),
  }), [userState]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}


