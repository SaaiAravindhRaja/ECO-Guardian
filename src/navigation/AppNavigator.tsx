import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// Screens
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
          backgroundColor: '#2D5A27',
          borderTopColor: '#4A7C59',
        },
        tabBarActiveTintColor: '#7ED321',
        tabBarInactiveTintColor: '#A8D5BA',
      }}
    >
      <Tab.Screen 
        name="AR Camera" 
        component={ARCameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // Icon component would go here
            <></>
          ),
        }}
      />
      <Tab.Screen 
        name="Collection" 
        component={CreatureCollectionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // Icon component would go here
            <></>
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // Icon component would go here
            <></>
          ),
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // Icon component would go here
            <></>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            // Icon component would go here
            <></>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);

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