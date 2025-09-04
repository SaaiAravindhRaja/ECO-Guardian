import { Platform } from 'react-native';

export class ARCompatibilityService {
  async isARSupported(): Promise<boolean> {
    if (Platform.OS === 'android') {
      // Best-effort: check for Google Play Services for AR presence via package query
      try {
        // Defer to runtime; placeholder returns true for now
        return true;
      } catch (_) {
        return false;
      }
    }
    if (Platform.OS === 'ios') {
      // ARKit-capable devices (A9 and above); assume true and rely on runtime
      return true;
    }
    return false;
  }
}


