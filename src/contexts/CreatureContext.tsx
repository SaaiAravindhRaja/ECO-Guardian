import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { mockCreatures, MockCreature } from '@/utils/mockData';

interface CreatureContextValue {
  creatures: MockCreature[];
  addCreature: (c: MockCreature) => void;
  removeCreature: (id: string) => void;
}

const CreatureContext = createContext<CreatureContextValue | undefined>(undefined);

export function CreatureProvider({ children }: { children: ReactNode }) {
  const [creatures, setCreatures] = useState<MockCreature[]>(mockCreatures);

  const value = useMemo<CreatureContextValue>(() => ({
    creatures,
    addCreature: (c: MockCreature) => setCreatures(prev => [...prev, c]),
    removeCreature: (id: string) => setCreatures(prev => prev.filter(c => c.id !== id)),
  }), [creatures]);

  return (
    <CreatureContext.Provider value={value}>
      {children}
    </CreatureContext.Provider>
  );
}

export function useCreatures(): CreatureContextValue {
  const ctx = useContext(CreatureContext);
  if (!ctx) throw new Error('useCreatures must be used within a CreatureProvider');
  return ctx;
}


