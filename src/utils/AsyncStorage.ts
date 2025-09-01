import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // App-specific methods
  static async setOnboardingCompleted(): Promise<void> {
    await this.setItem('onboarding_completed', true);
  }

  static async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>('onboarding_completed');
    return completed === true;
  }

  static async cacheCreatureData(creatures: any[]): Promise<void> {
    await this.setItem('cached_creatures', creatures);
  }

  static async getCachedCreatureData(): Promise<any[] | null> {
    return await this.getItem<any[]>('cached_creatures');
  }

  static async cacheUserProgress(progress: any): Promise<void> {
    await this.setItem('user_progress', progress);
  }

  static async getCachedUserProgress(): Promise<any | null> {
    return await this.getItem<any>('user_progress');
  }
}