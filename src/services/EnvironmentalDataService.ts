import { EnvironmentalData, EnvironmentalSnapshot } from '@/types';

export class EnvironmentalDataService {
  private readonly NEA_API_BASE = 'https://api.data.gov.sg/v1/environment';
  private cache: { data: EnvironmentalSnapshot | null; expiresAt: number } = {
    data: null,
    expiresAt: 0,
  };
  private readonly ttlMs = 5 * 60 * 1000; // 5 minutes
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }
  
  async getCurrentEnvironmentalData(): Promise<EnvironmentalSnapshot> {
    try {
      const now = Date.now();
      if (this.cache.data && now < this.cache.expiresAt) {
        return this.cache.data;
      }
      // Attempt live NEA fetch; fall back to mock if unavailable
      const snapshot = await this.fetchFromNEA();
      this.cache = { data: snapshot, expiresAt: now + this.ttlMs };
      return snapshot;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      // Return default values if API fails
      const fallback: EnvironmentalSnapshot = {
        airQuality: 75,
        temperature: 30,
        humidity: 75,
        uvIndex: 6,
        timestamp: new Date(),
        source: 'mock',
      };
      this.cache = { data: fallback, expiresAt: Date.now() + this.ttlMs };
      return fallback;
    }
  }

  async getAirQuality(): Promise<number> {
    try {
      const snap = await this.getCurrentEnvironmentalData();
      return snap.airQuality;
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return 75; // Default moderate air quality
    }
  }

  async getWeatherData(): Promise<{ temperature: number; humidity: number }> {
    try {
      const snap = await this.getCurrentEnvironmentalData();
      return { temperature: snap.temperature, humidity: snap.humidity };
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
      const snap = await this.getCurrentEnvironmentalData();
      return snap.uvIndex;
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

  private async fetchFromNEA(): Promise<EnvironmentalSnapshot> {
    try {
      const headers: Record<string, string> = this.apiKey ? { 'api-key': this.apiKey } : {};
      const nowIso = new Date().toISOString().split('T')[0];

      // Fetch PSI (air quality)
      const psiUrl = `${this.NEA_API_BASE}/psi?date=${nowIso}`;
      const psiResp = await fetch(psiUrl, { headers });
      const psiJson = await psiResp.json();
      const airQuality = this.parsePSI(psiJson);

      // Fetch UV index (may require specific endpoint/time)
      const uvUrl = `${this.NEA_API_BASE}/uv-index`;
      const uvResp = await fetch(uvUrl, { headers });
      const uvJson = await uvResp.json();
      const uvIndex = this.parseUV(uvJson);

      // Fetch temperature and humidity
      const tempUrl = `${this.NEA_API_BASE}/air-temperature?date=${nowIso}`;
      const tempResp = await fetch(tempUrl, { headers });
      const tempJson = await tempResp.json();
      const temperature = this.parseScalarLatest(tempJson, 'air-temperature');

      const humUrl = `${this.NEA_API_BASE}/relative-humidity?date=${nowIso}`;
      const humResp = await fetch(humUrl, { headers });
      const humJson = await humResp.json();
      const humidity = this.parseScalarLatest(humJson, 'relative-humidity');

      return {
        airQuality,
        temperature,
        humidity,
        uvIndex,
        timestamp: new Date(),
        source: 'nea_api',
      };
    } catch (error) {
      // Fallback to mock snapshot
      return {
        airQuality: this.generateRandomValue(50, 150),
        temperature: this.generateRandomValue(26, 34),
        humidity: this.generateRandomValue(60, 90),
        uvIndex: this.generateRandomValue(1, 11),
        timestamp: new Date(),
        source: 'mock',
      };
    }
  }

  private parsePSI(json: any): number {
    try {
      const items = json?.items || [];
      const latest = items[items.length - 1];
      const readings = latest?.readings?.psi_twenty_four_hourly;
      // Compute national average
      if (readings) {
        const values = Object.values(readings) as number[];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(avg);
      }
    } catch (_) {}
    return 75;
  }

  private parseUV(json: any): number {
    try {
      const items = json?.items || [];
      const latest = items[items.length - 1];
      const value = latest?.index?.[0]?.value;
      if (typeof value === 'number') return value;
    } catch (_) {}
    return 6;
  }

  private parseScalarLatest(json: any, key: string): number {
    try {
      const items = json?.items || [];
      const latest = items[items.length - 1];
      const readings = latest?.readings?.[key];
      if (readings) {
        const values = Object.values(readings) as number[];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(avg);
      }
    } catch (_) {}
    // Reasonable defaults
    if (key === 'air-temperature') return 30;
    if (key === 'relative-humidity') return 75;
    return 0;
  }
}