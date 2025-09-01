import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Challenge } from '@/types';

interface ChallengeState {
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChallengeState = {
  activeChallenges: [],
  completedChallenges: [],
  dailyChallenges: [],
  weeklyChallenges: [],
  isLoading: false,
  error: null,
};

export const challengeSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setActiveChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.activeChallenges = action.payload;
    },
    completeChallenge: (state, action: PayloadAction<string>) => {
      const challengeIndex = state.activeChallenges.findIndex(c => c.id === action.payload);
      if (challengeIndex !== -1) {
        const challenge = state.activeChallenges[challengeIndex];
        state.completedChallenges.push(challenge);
        state.activeChallenges.splice(challengeIndex, 1);
      }
    },
    setDailyChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.dailyChallenges = action.payload;
    },
    setWeeklyChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.weeklyChallenges = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setActiveChallenges, 
  completeChallenge, 
  setDailyChallenges,
  setWeeklyChallenges,
  setLoading,
  setError 
} = challengeSlice.actions;