import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ARSessionConfig, ARTrackingState } from '@/types';

interface ARState {
  tracking: ARTrackingState;
  sessionConfig: ARSessionConfig | null;
}

const initialState: ARState = {
  tracking: 'not_available',
  sessionConfig: null,
};

export const arSlice = createSlice({
  name: 'ar',
  initialState,
  reducers: {
    setTracking(state, action: PayloadAction<ARTrackingState>) {
      state.tracking = action.payload;
    },
    setSessionConfig(state, action: PayloadAction<ARSessionConfig>) {
      state.sessionConfig = action.payload;
    },
  },
});

export const { setTracking, setSessionConfig } = arSlice.actions;


