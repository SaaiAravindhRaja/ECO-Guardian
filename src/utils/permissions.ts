import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export class PermissionService {
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'ECO-Guardian needs location access to find nearby eco-locations and spawn creatures. Please enable location permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'ECO-Guardian needs camera access for AR creature collection features. Please enable camera permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: () => Camera.requestCameraPermissionsAsync() },
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  static async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Media Library Permission Required',
          'ECO-Guardian needs access to your photo library to save creature photos. Please enable media library permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: () => MediaLibrary.requestPermissionsAsync() },
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  }

  static async requestAllPermissions(): Promise<{
    location: boolean;
    camera: boolean;
    mediaLibrary: boolean;
  }> {
    const [location, camera, mediaLibrary] = await Promise.all([
      this.requestLocationPermission(),
      this.requestCameraPermission(),
      this.requestMediaLibraryPermission(),
    ]);

    return { location, camera, mediaLibrary };
  }

  static async checkPermissionStatus(): Promise<{
    location: boolean;
    camera: boolean;
    mediaLibrary: boolean;
  }> {
    try {
      const [locationStatus, cameraStatus, mediaStatus] = await Promise.all([
        Location.getForegroundPermissionsAsync(),
        Camera.getCameraPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

      return {
        location: locationStatus.status === 'granted',
        camera: cameraStatus.status === 'granted',
        mediaLibrary: mediaStatus.status === 'granted',
      };
    } catch (error) {
      console.error('Error checking permission status:', error);
      return {
        location: false,
        camera: false,
        mediaLibrary: false,
      };
    }
  }
}