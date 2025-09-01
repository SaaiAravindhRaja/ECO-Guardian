import { useState, useEffect } from 'react';
import { PermissionService } from '@/utils/permissions';

interface PermissionStatus {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: false,
    camera: false,
    mediaLibrary: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const status = await PermissionService.checkPermissionStatus();
      setPermissions(status);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      const status = await PermissionService.requestAllPermissions();
      setPermissions(status);
      return status;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return permissions;
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const granted = await PermissionService.requestLocationPermission();
    setPermissions(prev => ({ ...prev, location: granted }));
    return granted;
  };

  const requestCameraPermission = async () => {
    const granted = await PermissionService.requestCameraPermission();
    setPermissions(prev => ({ ...prev, camera: granted }));
    return granted;
  };

  const requestMediaLibraryPermission = async () => {
    const granted = await PermissionService.requestMediaLibraryPermission();
    setPermissions(prev => ({ ...prev, mediaLibrary: granted }));
    return granted;
  };

  return {
    permissions,
    isLoading,
    checkPermissions,
    requestPermissions,
    requestLocationPermission,
    requestCameraPermission,
    requestMediaLibraryPermission,
  };
}