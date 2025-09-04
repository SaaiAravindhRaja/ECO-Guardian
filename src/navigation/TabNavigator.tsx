import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ARCameraScreen } from '@/screens/ar/ARCameraScreen';
import { CreatureCollectionScreen } from '@/screens/creatures/CreatureCollectionScreen';
import { MapScreen } from '@/screens/map/MapScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';
import { TabBarIcon } from '@/components/TabBarIcon';
import { COLORS } from '@/utils/constants';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
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
        name="Home" 
        component={ARCameraScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Home" focused={focused} color={color} size={size} />
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
        name="Collection" 
        component={CreatureCollectionScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Collection" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name="Progress" focused={focused} color={color} size={size} />
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


