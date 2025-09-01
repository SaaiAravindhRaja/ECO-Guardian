import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './FirebaseService';
import { ARPhoto, SocialPlatform, ShareResult } from '@/types';

export class PhotoService {
  async savePhotoToGallery(uri: string): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission not granted');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('ECO-Guardian', asset, false);
      
      return true;
    } catch (error) {
      console.error('Error saving photo to gallery:', error);
      return false;
    }
  }

  async uploadPhotoToFirebase(uri: string, userId: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filename = `photos/${userId}/${Date.now()}.jpg`;
      const photoRef = ref(storage, filename);
      
      await uploadBytes(photoRef, blob);
      const downloadURL = await getDownloadURL(photoRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo to Firebase:', error);
      throw error;
    }
  }

  async sharePhoto(photo: ARPhoto, platforms: SocialPlatform[]): Promise<ShareResult[]> {
    const results: ShareResult[] = [];

    try {
      // For now, use the generic sharing API
      // In production, you'd integrate with specific platform SDKs
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        return platforms.map(platform => ({
          success: false,
          platform,
          error: 'Sharing not available on this device',
        }));
      }

      for (const platform of platforms) {
        try {
          await Sharing.shareAsync(photo.imageData, {
            mimeType: 'image/jpeg',
            dialogTitle: `Share your ${photo.creature.type} on ${platform}!`,
          });
          
          results.push({
            success: true,
            platform,
          });
        } catch (error) {
          results.push({
            success: false,
            platform,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      return platforms.map(platform => ({
        success: false,
        platform,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }

    return results;
  }

  generateSustainabilityHashtags(creatureType: string): string[] {
    const baseHashtags = [
      '#ECOGuardian',
      '#SustainableSingapore',
      '#GreenPlan2030',
      '#EcoFriendly',
      '#Sustainability',
      '#ClimateAction',
    ];

    const creatureHashtags = {
      greenie: ['#NatureLovers', '#UrbanGardening', '#CityInNature'],
      sparkie: ['#CleanEnergy', '#ElectricVehicles', '#EnergyReset'],
      binities: ['#RecycleRight', '#WasteReduction', '#SustainableLiving'],
      drippies: ['#WaterConservation', '#ABCWaters', '#ResilientFuture'],
    };

    return [
      ...baseHashtags,
      ...(creatureHashtags[creatureType as keyof typeof creatureHashtags] || []),
    ];
  }

  async createARPhoto(
    imageUri: string,
    creature: any,
    location: any,
    userId: string
  ): Promise<ARPhoto> {
    const photo: ARPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageData: imageUri,
      creature,
      location,
      timestamp: new Date(),
      metadata: {
        deviceInfo: 'Mobile Device', // In production, get actual device info
        cameraSettings: 'Auto',
        environmentalData: {
          airQuality: 75,
          temperature: 30,
          humidity: 75,
          uvIndex: 6,
          timestamp: new Date(),
        },
      },
    };

    return photo;
  }
}