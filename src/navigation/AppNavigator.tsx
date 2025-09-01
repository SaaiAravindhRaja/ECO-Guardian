import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AsyncStorageService } from '@/utils/AsyncStorage';
import { TabBarIcon } from '@/components/TabBarIcon';
import { PermissionScreen } from '@/components/PermissionScreen';
import { COLORS } from '@/utils/constants';

// Screens
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { ARCameraScreen } from '@/screens/ar/ARCameraScreen';
import { CreatureCollectionScreen } from '@/screens/creatures/CreatureCollectionScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { ChallengesScreen } from '@/screens/challenges/ChallengesScreen';
import { MapScreen } from '@/screens/map/MapScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.accent,
      }}
    >
      <Tab.Screen 
        name="AR Camera" 
        component={ARCameraScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="AR Camera" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Collection" 
        component={CreatureCollectionScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Collection" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Map" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Challenges" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Profile" focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
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
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}