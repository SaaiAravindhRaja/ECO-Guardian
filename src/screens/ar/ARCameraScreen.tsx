import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ARCreatureView } from '@/components/ARCreatureView';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { LocationService } from '@/services/LocationService';
import { CreatureService } from '@/services/CreatureService';
import { CreatureSpawnManager } from '@/services/CreatureSpawnManager';
import { spawnCreature, collectCreature } from '@/store/slices/creatureSlice';
import { setCurrentLocation } from '@/store/slices/locationSlice';

const { width, height } = Dimensions.get('window');

export function ARCameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const dispatch = useDispatch();
  const { currentLocation } = useSelector((state: RootState) => state.location);
  const { spawnedCreatures } = useSelector((state: RootState) => state.creatures);
  const { user } = useSelector((state: RootState) => state.auth);

  const locationService = new LocationService();
  const creatureService = new CreatureService();
  const spawnManager = new CreatureSpawnManager();

  useEffect(() => {
    requestPermissions();
    getCurrentLocation();
  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const locationPermission = await locationService.requestPermissions();
    
    setHasPermission(
      cameraPermission.status === 'granted' && locationPermission
    );
  };

  const getCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      dispatch(setCurrentLocation(location));
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleScanForCreatures = async () => {
    if (!currentLocation || !user) return;

    setIsScanning(true);
    try {
      const nearbyLocations = await locationService.getNearbyEcoLocations(currentLocation);
      
      for (const ecoLocation of nearbyLocations) {
        const isNearby = await locationService.validateCheckIn(currentLocation, ecoLocation);
        if (!isNearby) continue;

        const creature = await spawnManager.trySpawnForEcoLocation(
          ecoLocation.type,
          currentLocation,
          user.uid
        );
        if (creature) {
          dispatch(spawnCreature(creature));
          Alert.alert('Creature Found!', `A ${creature.type} has appeared! Tap to collect it.`);
          break;
        }
      }
    } catch (error) {
      console.error('Error scanning for creatures:', error);
      Alert.alert('Error', 'Failed to scan for creatures');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCollectCreature = async (creatureId: string) => {
    if (!user) return;

    try {
      await creatureService.collectCreature(creatureId, user.uid);
      dispatch(collectCreature(creatureId));
      Alert.alert('Success!', 'Creature collected successfully!');
    } catch (error) {
      console.error('Error collecting creature:', error);
      Alert.alert('Error', 'Failed to collect creature');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera and location permissions are required to use AR features
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}>
        <ARCreatureView
          creatures={spawnedCreatures}
          onCreatureTap={handleCollectCreature}
        />
        {/* AR Overlay */}
        <View style={styles.overlay}>
          {/* Spawned creatures would be rendered here */}
          {spawnedCreatures.map((creature) => (
            <TouchableOpacity
              key={creature.id}
              style={[styles.creatureMarker, { 
                left: width * 0.5 - 25, 
                top: height * 0.5 - 25 
              }]}
              onPress={() => handleCollectCreature(creature.id)}
            >
              <Text style={styles.creatureEmoji}>
                {creature.type === 'greenie' ? '🌱' : 
                 creature.type === 'sparkie' ? '⚡' :
                 creature.type === 'binities' ? '♻️' : '💧'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* UI Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
            onPress={handleScanForCreatures}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan for Creatures'}
            </Text>
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.infoText}>
              Creatures found: {spawnedCreatures.length}
            </Text>
            {currentLocation && (
              <Text style={styles.locationText}>
                Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#7ED321',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  scanButtonActive: {
    backgroundColor: '#5BA91A',
  },
  scanButtonText: {
    color: '#1B4332',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    backgroundColor: 'rgba(27, 67, 50, 0.8)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#7ED321',
    fontSize: 14,
    fontWeight: '500',
  },
  locationText: {
    color: '#A8D5BA',
    fontSize: 12,
    marginTop: 4,
  },
  creatureMarker: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(126, 211, 33, 0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7ED321',
  },
  creatureEmoji: {
    fontSize: 24,
  },
  message: {
    color: '#A8D5BA',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#7ED321',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#1B4332',
    fontSize: 16,
    fontWeight: '600',
  },
});