import * as Location from 'expo-location';
import { Location as LocationType, EcoLocation, EcoLocationType, GreenPlanTarget } from '@/types';

export class LocationService {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<LocationType> {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      timestamp: new Date(location.timestamp),
    };
  }

  async getNearbyEcoLocations(userLocation: LocationType): Promise<EcoLocation[]> {
    // Mock data - in production, this would call OneMap API
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

    // Filter locations within 5km radius
    return mockEcoLocations.filter(location => {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.coordinates.lat,
        location.coordinates.lng
      );
      return distance <= 5000; // 5km radius
    });
  }

  async validateCheckIn(userLocation: LocationType, ecoLocation: EcoLocation): Promise<boolean> {
    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      ecoLocation.coordinates.lat,
      ecoLocation.coordinates.lng
    );

    return distance <= ecoLocation.verificationRadius;
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
}