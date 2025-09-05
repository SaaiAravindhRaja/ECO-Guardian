import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Creature, CreatureType, RarityLevel } from '@/types';

interface CreatureState {
  collection: Creature[];
  activeCreatures: Creature[];
  spawnedCreatures: Creature[];
  isLoading: boolean;
  error: string | null;
  lastSpawnedAt?: string;
  offlineQueueSize?: number;
}

const initialState: CreatureState = {
  collection: [],
  activeCreatures: [],
  spawnedCreatures: [],
  isLoading: false,
  error: null,
  lastSpawnedAt: undefined,
  offlineQueueSize: 0,
};

export const creatureSlice = createSlice({
  name: 'creatures',
  initialState,
  reducers: {
    addToCollection: (state, action: PayloadAction<Creature>) => {
      state.collection.push(action.payload);
    },
    spawnCreature: (state, action: PayloadAction<Creature>) => {
      state.spawnedCreatures.push(action.payload);
      state.lastSpawnedAt = new Date().toISOString();
    },
    collectCreature: (state, action: PayloadAction<string>) => {
      const creatureIndex = state.spawnedCreatures.findIndex(c => c.id === action.payload);
      if (creatureIndex !== -1) {
        const creature = state.spawnedCreatures[creatureIndex];
        state.collection.push(creature);
        state.spawnedCreatures.splice(creatureIndex, 1);
      }
    },
    clearSpawnedCreatures: (state) => {
      state.spawnedCreatures = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setOfflineQueueSize: (state, action: PayloadAction<number>) => {
      state.offlineQueueSize = action.payload;
    },
  },
});

export const { 
  addToCollection, 
  spawnCreature, 
  collectCreature, 
  clearSpawnedCreatures,
  setLoading,
  setError,
  setOfflineQueueSize
} = creatureSlice.actions;