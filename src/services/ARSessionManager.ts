import { Platform } from 'react-native';
import type { ARSessionConfig, ARTrackingState } from '@/types';

export class ARSessionManager {
  private trackingState: ARTrackingState = 'not_available';
  private initialized = false;
  private config: ARSessionConfig | null = null;

  init(config?: Partial<ARSessionConfig>) {
    const platform = Platform.OS === 'android' ? 'arcore' : 'arkit';
    this.config = {
      platform,
      enablePlaneDetection: true,
      enableLightEstimation: true,
      worldAlignment: 'gravity',
      modelCacheLimit: 8,
      ...config,
    } as ARSessionConfig;
    this.initialized = true;
    this.trackingState = 'limited_initializing';
  }

  getTrackingState(): ARTrackingState {
    return this.trackingState;
  }

  setTrackingState(state: ARTrackingState) {
    this.trackingState = state;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getConfig(): ARSessionConfig | null {
    return this.config;
  }
}


