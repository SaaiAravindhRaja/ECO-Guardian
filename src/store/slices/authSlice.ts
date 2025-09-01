import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    uid: string;
    email: string;
    displayName: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;