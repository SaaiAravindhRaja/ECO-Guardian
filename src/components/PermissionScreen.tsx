import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePermissions } from '@/hooks/usePermissions';
import { COLORS } from '@/utils/constants';

interface PermissionScreenProps {
  onPermissionsGranted: () => void;
}

export function PermissionScreen({ onPermissionsGranted }: PermissionScreenProps) {
  const { permissions, requestPermissions, isLoading } = usePermissions();

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (granted.location && granted.camera) {
      onPermissionsGranted();
    }
  };

  const allPermissionsGranted = permissions.location && permissions.camera && permissions.mediaLibrary;

  if (allPermissionsGranted) {
    onPermissionsGranted();
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions Required</Text>
      <Text style={styles.subtitle}>
        ECO-Guardian needs these permissions to provide the best experience:
      </Text>

      <View style={styles.permissionsList}>
        <View style={styles.permissionItem}>
          <Text style={styles.permissionIcon}>📍</Text>
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>Location Access</Text>
            <Text style={styles.permissionDescription}>
              Find nearby eco-locations and spawn creatures
            </Text>
          </View>
          <Text style={[styles.permissionStatus, permissions.location && styles.granted]}>
            {permissions.location ? '✅' : '❌'}
          </Text>
        </View>

        <View style={styles.permissionItem}>
          <Text style={styles.permissionIcon}>📷</Text>
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>Camera Access</Text>
            <Text style={styles.permissionDescription}>
              AR creature collection and photo sharing
            </Text>
          </View>
          <Text style={[styles.permissionStatus, permissions.camera && styles.granted]}>
            {permissions.camera ? '✅' : '❌'}
          </Text>
        </View>

        <View style={styles.permissionItem}>
          <Text style={styles.permissionIcon}>🖼️</Text>
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>Photo Library</Text>
            <Text style={styles.permissionDescription}>
              Save and share your creature photos
            </Text>
          </View>
          <Text style={[styles.permissionStatus, permissions.mediaLibrary && styles.granted]}>
            {permissions.mediaLibrary ? '✅' : '❌'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRequestPermissions}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Requesting...' : 'Grant Permissions'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        You can change these permissions later in your device settings.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  permissionsList: {
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  permissionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  permissionStatus: {
    fontSize: 20,
  },
  granted: {
    opacity: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.background,
  },
  note: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});