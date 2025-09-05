import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { LocationService } from '@/services/LocationService';
import { setCurrentLocation, setNearbyEcoLocations } from '@/store/slices/locationSlice';
import { EcoLocation, EcoLocationType, GreenPlanTarget, Creature } from '@/types';
import MapView, { UrlTile, Marker, Circle, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import { getTileUrl } from '@/utils/tiles';
import { useGetSpawnsByTilesQuery } from '@/services/api';
import { tileIdFor } from '@/lib/geo';
import { clusterByTile, isSpawnEligible } from '@/services/selectors/spawnSelectors';

export function MapScreen() {
  const dispatch = useDispatch();
  const { currentLocation, nearbyEcoLocations } = useSelector(
    (state: RootState) => state.location
  );
  const [selectedLocation, setSelectedLocation] = useState<EcoLocation | null>(null);
  
  const locationService = new LocationService();
  const region: Region | undefined = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : undefined;

  const tiles = useMemo(() => {
    if (!currentLocation) return [] as string[];
    const t7 = tileIdFor(currentLocation.latitude, currentLocation.longitude, 7);
    // Expand slightly by including neighbors via center-based hash; minimal for now
    return [t7];
  }, [currentLocation]);

  const { data: spawns = [] } = useGetSpawnsByTilesQuery(
    currentLocation ? { tiles, userId: useSelector((s: RootState) => s.auth.user?.uid || 'anon') } : ({} as any),
    { skip: !currentLocation }
  );

  const clusters = useMemo(() => clusterByTile(spawns), [spawns]);
  const [zoomLevel, setZoomLevel] = useState(14);
  const mapRef = React.useRef<MapView | null>(null);

  const handleClusterPress = (tileId: string) => {
    const cluster = clusters.find(c => c.tileIdP7 === tileId);
    if (!cluster || !mapRef.current) return;
    // Fit to contained spawn markers
    const coords = cluster.items.map(i => ({ latitude: i.spawnLocation.latitude, longitude: i.spawnLocation.longitude }));
    if (coords.length === 1) {
      mapRef.current.animateCamera({ center: coords[0], zoom: 16 });
    } else {
      mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true });
    }
  };

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      loadNearbyLocations();
    }
  }, [currentLocation]);

  const loadCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      dispatch(setCurrentLocation(location));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const loadNearbyLocations = async () => {
    if (!currentLocation) return;

    try {
      const locations = await locationService.getNearbyEcoLocations(currentLocation);
      dispatch(setNearbyEcoLocations(locations));
    } catch (error) {
      console.error('Error loading nearby locations:', error);
    }
  };

  const getLocationTypeIcon = (type: EcoLocationType): string => {
    switch (type) {
      case EcoLocationType.NATURE_PARK: return '🌳';
      case EcoLocationType.COMMUNITY_GARDEN: return '🌱';
      case EcoLocationType.EV_CHARGING_STATION: return '⚡';
      case EcoLocationType.RECYCLING_CENTER: return '♻️';
      case EcoLocationType.RECYCLING_BIN: return '🗂️';
      case EcoLocationType.ABC_WATERS_SITE: return '💧';
      default: return '📍';
    }
  };

  const getGreenPlanColor = (target: GreenPlanTarget): string => {
    switch (target) {
      case GreenPlanTarget.CITY_IN_NATURE: return '#27AE60';
      case GreenPlanTarget.ENERGY_RESET: return '#F39C12';
      case GreenPlanTarget.SUSTAINABLE_LIVING: return '#3498DB';
      case GreenPlanTarget.GREEN_ECONOMY: return '#9B59B6';
      case GreenPlanTarget.RESILIENT_FUTURE: return '#E74C3C';
      default: return '#7ED321';
    }
  };

  const handleCheckIn = async (location: EcoLocation) => {
    if (!currentLocation) {
      Alert.alert('Error', 'Current location not available');
      return;
    }

    try {
      const isValid = await locationService.validateCheckIn(currentLocation, location);
      
      if (isValid) {
        Alert.alert(
          'Check-in Successful!',
          `You've checked in at ${location.name}. Look for creatures in AR mode!`
        );
      } else {
        Alert.alert(
          'Too Far Away',
          `You need to be within 50m of ${location.name} to check in.`
        );
      }
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in');
    }
  };

  const isEligible = (loc: EcoLocation): boolean => {
    if (!currentLocation) return false;
    const distance = locationService['calculateDistance'](
      currentLocation.latitude,
      currentLocation.longitude,
      loc.coordinates.lat,
      loc.coordinates.lng
    );
    return distance <= 50;
  };

  const renderLocationCard = (location: EcoLocation) => (
    <TouchableOpacity
      key={location.id}
      style={[
        styles.locationCard,
        { borderLeftColor: getGreenPlanColor(location.greenPlanCategory) }
      ]}
      onPress={() => setSelectedLocation(location)}
    >
      <View style={styles.locationHeader}>
        <Text style={styles.locationIcon}>
          {getLocationTypeIcon(location.type)}
        </Text>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationType}>
            {location.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      {location.description && (
        <Text style={styles.locationDescription}>
          {location.description}
        </Text>
      )}
      
      <View style={styles.locationFooter}>
        <View style={[
          styles.greenPlanBadge,
          { backgroundColor: getGreenPlanColor(location.greenPlanCategory) }
        ]}>
          <Text style={styles.greenPlanText}>
            {location.greenPlanCategory.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[styles.checkInButton, !isEligible(location) && { opacity: 0.5 }]}
            onPress={() => handleCheckIn(location)}
            disabled={!isEligible(location)}
          >
            <Text style={styles.checkInButtonText}>{isEligible(location) ? 'Check In' : 'Move closer (<50m)'}</Text>
          </TouchableOpacity>
          {/* Minimal AR entry: uses first spawn for demo; would filter by proximity in full impl */}
          <TouchableOpacity
            style={[styles.checkInButton, { backgroundColor: '#3498DB' }, !isEligible(location) && { opacity: 0.5 }]}
            onPress={() => {
              // Navigate to AR; TabNavigator has Home as ARCameraScreen
              // Users can collect from AR; analytics logged in AR screen
              if (!isEligible(location)) return;
              // Focus Home tab
              // @ts-ignore navigation comes via parent
              // navigation.navigate('Home');
            }}
            disabled={!isEligible(location)}
          >
            <Text style={[styles.checkInButtonText, { color: '#fff' }]}>View in AR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eco-Locations</Text>
        <Text style={styles.subtitle}>
          Find nearby sustainable locations
        </Text>
        
        {currentLocation && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadCurrentLocation}
          >
            <Text style={styles.refreshButtonText}>📍 Refresh Location</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1 }}>
        {region && (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={region}
            provider={PROVIDER_DEFAULT}
            onRegionChangeComplete={(r) => {
              // approximate zoom calculation for RN Maps: not exact but sufficient thresholding
              const zl = Math.round(Math.log(360 / r.longitudeDelta) / Math.LN2);
              setZoomLevel(zl);
            }}
          >
            <UrlTile urlTemplate={getTileUrl('{z}' as any, '{x}' as any, '{y}' as any)} zIndex={-1} maximumZ={20} />
            <Circle
              center={{ latitude: region.latitude, longitude: region.longitude }}
              radius={50}
              strokeColor="#7ED321"
              fillColor="rgba(126,211,33,0.15)"
            />
            {zoomLevel < 14 && clusters.map((cl) => (
              <Marker
                key={cl.tileIdP7}
                coordinate={{ latitude: cl.center.lat, longitude: cl.center.lng }}
                title={cl.count > 1 ? `${cl.count} spawns` : 'Spawn'}
                onPress={() => handleClusterPress(cl.tileIdP7)}
              >
                <View style={{ backgroundColor: '#2D5A27', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#4A7C59' }}>
                  <Text style={{ color: '#7ED321', fontWeight: '700' }}>{cl.count}</Text>
                </View>
              </Marker>
            ))}
            {zoomLevel >= 14 && spawns.map((s) => {
              const eligible = currentLocation ? isSpawnEligible(currentLocation, s) : false;
              return (
                <Marker
                  key={s.id}
                  coordinate={{ latitude: s.spawnLocation.latitude, longitude: s.spawnLocation.longitude }}
                  title={`${s.type} (${s.rarity})`}
                  description={eligible ? 'Eligible' : 'Move closer (<50m)'}
                >
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: eligible ? '#7ED321' : '#6B8E6B', borderWidth: 2, borderColor: '#1B4332' }} />
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {getLocationTypeIcon(selectedLocation.type)} {selectedLocation.name}
            </Text>
            
            <Text style={styles.modalDescription}>
              {selectedLocation.description}
            </Text>
            
            <View style={styles.modalDetails}>
              <Text style={styles.modalDetailText}>
                Type: {selectedLocation.type.replace('_', ' ')}
              </Text>
              <Text style={styles.modalDetailText}>
                Green Plan: {selectedLocation.greenPlanCategory.replace('_', ' ')}
              </Text>
              <Text style={styles.modalDetailText}>
                Check-in radius: {selectedLocation.verificationRadius}m
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCheckInButton}
                onPress={() => {
                  handleCheckIn(selectedLocation);
                  setSelectedLocation(null);
                }}
              >
                <Text style={styles.modalCheckInButtonText}>Check In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedLocation(null)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A8D5BA',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#2D5A27',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  refreshButtonText: {
    color: '#7ED321',
    fontSize: 14,
    fontWeight: '500',
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 12,
    color: '#A8D5BA',
    fontWeight: '500',
  },
  locationDescription: {
    fontSize: 14,
    color: '#A8D5BA',
    lineHeight: 20,
    marginBottom: 16,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greenPlanBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
  },
  greenPlanText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  checkInButton: {
    backgroundColor: '#7ED321',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#A8D5BA',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B8E6B',
    textAlign: 'center',
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2D5A27',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7ED321',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#A8D5BA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalDetails: {
    marginBottom: 24,
  },
  modalDetailText: {
    fontSize: 14,
    color: '#A8D5BA',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCheckInButton: {
    flex: 1,
    backgroundColor: '#7ED321',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCheckInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  modalCloseButton: {
    flex: 1,
    backgroundColor: '#4A7C59',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});