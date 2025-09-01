import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { COLORS } from '@/utils/constants';

interface EnvironmentalWidgetProps {
  onPress?: () => void;
}

export function EnvironmentalWidget({ onPress }: EnvironmentalWidgetProps) {
  const { data, isLoading, getEnvironmentalMessage } = useEnvironmentalData();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading environmental data...</Text>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return COLORS.success;
    if (aqi <= 100) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>🌍 Environmental Status</Text>
        <Text style={styles.timestamp}>
          {data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <View style={styles.dataRow}>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Air Quality</Text>
          <Text style={[styles.dataValue, { color: getAirQualityColor(data.airQuality) }]}>
            {data.airQuality} PSI
          </Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Temperature</Text>
          <Text style={styles.dataValue}>{data.temperature}°C</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>UV Index</Text>
          <Text style={styles.dataValue}>{data.uvIndex}</Text>
        </View>
      </View>

      <Text style={styles.message}>{getEnvironmentalMessage()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});