import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { creatureSlice } from './slices/creatureSlice';
import { locationSlice } from './slices/locationSlice';
import { challengeSlice } from './slices/challengeSlice';
import { userSlice } from './slices/userSlice';
import { arSlice } from './slices/arSlice';
import { api } from '@/services/api';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    creatures: creatureSlice.reducer,
    location: locationSlice.reducer,
    challenges: challengeSlice.reducer,
    user: userSlice.reducer,
    ar: arSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;