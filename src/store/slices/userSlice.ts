import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, Achievement, SustainabilityStats } from '@/types';

interface UserState {
  profile: UserProfile | null;
  achievements: Achievement[];
  sustainabilityStats: SustainabilityStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  achievements: [],
  sustainabilityStats: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updatePoints: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.totalPoints += action.payload;
      }
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.achievements.push(action.payload);
    },
    updateSustainabilityStats: (state, action: PayloadAction<Partial<SustainabilityStats>>) => {
      if (state.sustainabilityStats) {
        state.sustainabilityStats = { ...state.sustainabilityStats, ...action.payload };
      }
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
  setProfile, 
  updatePoints, 
  addAchievement,
  updateSustainabilityStats,
  setLoading,
  setError 
} = userSlice.actions;