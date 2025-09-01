import { EnvironmentalData } from '@/types';

export class EnvironmentalDataService {
  private readonly NEA_API_BASE = 'https://api.data.gov.sg/v1/environment';
  
  async getCurrentEnvironmentalData(): Promise<EnvironmentalData> {
    try {
      // In production, these would be real API calls to NEA
      const mockData: EnvironmentalData = {
        airQuality: this.generateRandomValue(50, 150), // PSI
        temperature: this.generateRandomValue(26, 34), // Celsius
        humidity: this.generateRandomValue(60, 90), // Percentage
        uvIndex: this.generateRandomValue(1, 11), // UV Index
        timestamp: new Date(),
      };

      return mockData;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      // Return default values if API fails
      return {
        airQuality: 75,
        temperature: 30,
        humidity: 75,
        uvIndex: 6,
        timestamp: new Date(),
      };
    }
  }

  async getAirQuality(): Promise<number> {
    try {
      // Mock API call - replace with actual NEA API
      return this.generateRandomValue(50, 150);
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return 75; // Default moderate air quality
    }
  }

  async getWeatherData(): Promise<{ temperature: number; humidity: number }> {
    try {
      // Mock API call - replace with actual NEA API
      return {
        temperature: this.generateRandomValue(26, 34),
        humidity: this.generateRandomValue(60, 90),
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        temperature: 30,
        humidity: 75,
      };
    }
  }

  async getUVIndex(): Promise<number> {
    try {
      // Mock API call - replace with actual NEA API
      return this.generateRandomValue(1, 11);
    } catch (error) {
      console.error('Error fetching UV index:', error);
      return 6; // Default moderate UV
    }
  }

  getEnvironmentalMessage(data: EnvironmentalData): string {
    const { airQuality, temperature, uvIndex } = data;

    if (airQuality > 100) {
      return "Air quality is unhealthy. Consider indoor activities and help reduce emissions!";
    }
    
    if (temperature > 32) {
      return "It's hot today! Stay hydrated and look for shaded eco-locations.";
    }
    
    if (uvIndex > 8) {
      return "High UV levels detected. Perfect time to visit covered nature areas!";
    }
    
    return "Great conditions for eco-exploration! Get out there and collect creatures!";
  }

  shouldBoostCreatureSpawns(data: EnvironmentalData): boolean {
    // Boost spawns during good environmental conditions
    return data.airQuality < 100 && data.temperature < 33 && data.uvIndex < 9;
  }

  private generateRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}