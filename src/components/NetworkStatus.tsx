import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '@/utils/constants';

export function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = Boolean(state.isConnected && state.isInternetReachable);
      
      if (connected !== isConnected) {
        setIsConnected(connected);
        setShowStatus(true);
        
        // Hide status after 3 seconds if connected
        if (connected) {
          setTimeout(() => setShowStatus(false), 3000);
        }
      }
    });

    return unsubscribe;
  }, [isConnected]);

  if (!showStatus) return null;

  return (
    <View style={[styles.container, isConnected ? styles.connected : styles.disconnected]}>
      <Text style={styles.text}>
        {isConnected ? '✅ Back online' : '❌ No internet connection'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  connected: {
    backgroundColor: COLORS.success,
  },
  disconnected: {
    backgroundColor: COLORS.error,
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});