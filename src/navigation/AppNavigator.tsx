import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Tabs are defined in a dedicated TabNavigator
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AsyncStorageService } from '@/utils/AsyncStorage';
import { PermissionScreen } from '@/components/PermissionScreen';

// Screens
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { TabNavigator } from '@/navigation/TabNavigator';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}


export function AppNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorageService.isOnboardingCompleted();
      setShowOnboarding(!hasCompletedOnboarding);
      
      // Check permissions after onboarding
      if (hasCompletedOnboarding && user) {
        // For logged in users, we'll check permissions in the main app
        setShowPermissions(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorageService.setOnboardingCompleted();
    setShowOnboarding(false);
  };

  const handlePermissionsGranted = () => {
    setShowPermissions(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  if (showOnboarding && !user) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showPermissions && user) {
    return <PermissionScreen onPermissionsGranted={handlePermissionsGranted} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}