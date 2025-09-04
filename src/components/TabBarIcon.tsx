import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}

const iconMap: { [key: string]: string } = {
  'Home': '📷', // Placeholder for AR view; later integrate AR-specific icon
  'Collection': '🐾',
  'Map': '🗺️',
  'Progress': '📈',
  'Profile': '👤',
};

export function TabBarIcon({ name, focused, color, size }: TabBarIconProps) {
  const emoji = iconMap[name] || '📱';
  
  return (
    <Text style={[styles.icon, { fontSize: size, opacity: focused ? 1 : 0.6 }]}>
      {emoji}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});