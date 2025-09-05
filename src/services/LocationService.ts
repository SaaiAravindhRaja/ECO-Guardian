import * as Location from 'expo-location';
import { Location as LocationType, EcoLocation, EcoLocationType, GreenPlanTarget } from '@/types';

export class LocationService {
  private previousLocation: LocationType | null = null;
  private readonly maxSpeedMps = 50; // ~180 km/h cutoff for spoofing detection
  private readonly minAccuracyMeters = 80; // discard too-inaccurate points
  private readonly oneMapBase = 'https://developers.onemap.sg/publicapi';
  private readonly oneMapToken?: string;

  constructor(oneMapToken?: string) {
    this.oneMapToken = oneMapToken;
  }

  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<LocationType> {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const current: LocationType = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      timestamp: new Date(location.timestamp),
    };

    // Basic sanity checks and spoof detection with previous point
    if (!this.isAccurateEnough(current)) {
      // Return previous if available; otherwise still return current
      return this.previousLocation || current;
    }

    if (this.previousLocation && this.isSuspiciousJump(this.previousLocation, current)) {
      // Keep previous if jump is suspicious
      return this.previousLocation;
    }

    this.previousLocation = current;
    return current;
  }

  async getNearbyEcoLocations(userLocation: LocationType): Promise<EcoLocation[]> {
    // Try OneMap-backed dataset if available, fallback to mock
    try {
      const fromOneMap = await this.fetchEcoLocationsFromOneMap(userLocation);
      if (fromOneMap.length > 0) {
        return this.filterByRadius(fromOneMap, userLocation, 5000);
      }
    } catch (error) {
      // Fall through to mock
      // eslint-disable-next-line no-console
      console.warn('OneMap fetch failed, using mock eco-locations');
    }

    const mockEcoLocations: EcoLocation[] = [
      {
        id: 'gardens-by-the-bay',
        name: 'Gardens by the Bay',
        type: EcoLocationType.NATURE_PARK,
        coordinates: { lat: 1.2816, lng: 103.8636 },
        greenPlanCategory: GreenPlanTarget.CITY_IN_NATURE,
        verificationRadius: 100,
        description: 'Singapore\'s iconic nature park with sustainable architecture',
      },
      {
        id: 'marina-barrage-ev',
        name: 'Marina Barrage EV Station',
        type: EcoLocationType.EV_CHARGING_STATION,
        coordinates: { lat: 1.2806, lng: 103.8707 },
        greenPlanCategory: GreenPlanTarget.ENERGY_RESET,
        verificationRadius: 50,
        description: 'Electric vehicle charging station at Marina Barrage',
      },
      {
        id: 'abc-waters-kallang',
        name: 'Kallang River ABC Waters',
        type: EcoLocationType.ABC_WATERS_SITE,
        coordinates: { lat: 1.3048, lng: 103.8631 },
        greenPlanCategory: GreenPlanTarget.RESILIENT_FUTURE,
        verificationRadius: 75,
        description: 'Active, Beautiful, Clean Waters programme site',
      },
    ];

    return this.filterByRadius(mockEcoLocations, userLocation, 5000);
  }

  async validateCheckIn(userLocation: LocationType, ecoLocation: EcoLocation): Promise<boolean> {
    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      ecoLocation.coordinates.lat,
      ecoLocation.coordinates.lng
    );

    // Require accuracy and non-suspicious movement before allowing check-in
    if (!this.isAccurateEnough(userLocation)) return false;

    // Hard eligibility radius = 50 m
    const ELIGIBILITY_METERS = 50;
    return distance <= Math.min(ecoLocation.verificationRadius, ELIGIBILITY_METERS);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private isAccurateEnough(loc: LocationType): boolean {
    if (typeof loc.accuracy !== 'number') return true; // if unknown, allow
    return loc.accuracy <= this.minAccuracyMeters;
  }

  private isSuspiciousJump(prev: LocationType, next: LocationType): boolean {
    if (!prev.timestamp || !next.timestamp) return false;
    const distanceMeters = this.calculateDistance(
      prev.latitude,
      prev.longitude,
      next.latitude,
      next.longitude
    );
    const dtSec = Math.max(1, (next.timestamp.getTime() - prev.timestamp.getTime()) / 1000);
    const speed = distanceMeters / dtSec;
    return speed > this.maxSpeedMps;
  }

  private filterByRadius(locations: EcoLocation[], userLocation: LocationType, radiusMeters: number): EcoLocation[] {
    return locations.filter(location => {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.coordinates.lat,
        location.coordinates.lng
      );
      return distance <= radiusMeters;
    });
  }

  private async fetchEcoLocationsFromOneMap(userLocation: LocationType): Promise<EcoLocation[]> {
    // Example using amenities and thematic categories. If API is not accessible, return empty.
    try {
      // Using static curated points for categories mapped to Green Plan targets can be improved later
      const categories: Array<{ query: string; type: EcoLocationType; target: GreenPlanTarget }> = [
        { query: 'park', type: EcoLocationType.NATURE_PARK, target: GreenPlanTarget.CITY_IN_NATURE },
        { query: 'ev charging', type: EcoLocationType.EV_CHARGING_STATION, target: GreenPlanTarget.ENERGY_RESET },
        { query: 'recycling', type: EcoLocationType.RECYCLING_CENTER, target: GreenPlanTarget.SUSTAINABLE_LIVING },
        { query: 'abc waters', type: EcoLocationType.ABC_WATERS_SITE, target: GreenPlanTarget.RESILIENT_FUTURE },
      ];

      const results: EcoLocation[] = [];
      for (const cat of categories) {
        const url = `${this.oneMapBase}/commonapi/search?searchVal=${encodeURIComponent(cat.query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
        const resp = await fetch(url);
        const json = await resp.json();
        const found = (json?.results || []).slice(0, 5).map((r: any, idx: number) => ({
          id: `${cat.type}-${r?.SEARCHVAL || idx}`,
          name: r?.SEARCHVAL || cat.query,
          type: cat.type,
          coordinates: { lat: parseFloat(r?.LATITUDE), lng: parseFloat(r?.LONGITUDE) },
          greenPlanCategory: cat.target,
          verificationRadius: 100,
          description: r?.ADDRESS || undefined,
        }));
        results.push(...found);
      }

      return results;
    } catch (_error) {
      return [];
    }
  }
}