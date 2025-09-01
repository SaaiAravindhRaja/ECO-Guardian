import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location, EcoLocation } from '@/types';

interface LocationState {
  currentLocation: Location | null;
  nearbyEcoLocations: EcoLocation[];
  visitedLocations: string[];
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

const initialState: LocationState = {
  currentLocation: null,
  nearbyEcoLocations: [],
  visitedLocations: [],
  isLoading: false,
  error: null,
  permissionGranted: false,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    setNearbyEcoLocations: (state, action: PayloadAction<EcoLocation[]>) => {
      state.nearbyEcoLocations = action.payload;
    },
    addVisitedLocation: (state, action: PayloadAction<string>) => {
      if (!state.visitedLocations.includes(action.payload)) {
        state.visitedLocations.push(action.payload);
      }
    },
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
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
  setCurrentLocation, 
  setNearbyEcoLocations, 
  addVisitedLocation,
  setPermissionGranted,
  setLoading,
  setError 
} = locationSlice.actions;