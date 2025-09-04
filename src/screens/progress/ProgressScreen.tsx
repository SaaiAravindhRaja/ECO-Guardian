import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '@/contexts/UserContext';
import { ProgressBar } from '@/components/ProgressBar';

export function ProgressScreen() {
  const { user } = useUser();
  const pointsProgress = Math.min(user.points % 1000, 1000) / 1000; // placeholder logic for leveling

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Progress</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.username}</Text>
        <Text style={styles.label}>Points</Text>
        <Text style={styles.value}>{user.points}</Text>
        <Text style={styles.label}>Streak</Text>
        <Text style={styles.value}>{user.streak} days</Text>
        <View style={styles.progressRow}>
          <Text style={styles.label}>Level Progress</Text>
          <ProgressBar progress={pointsProgress} height={12} />
        </View>
      </View>
      <Text style={styles.hint}>
        This is a placeholder. Integrate Firebase to sync points, streaks, and achievements.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1f17',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    color: '#e6fff2',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#163024',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  label: {
    color: '#9ad1b3',
    fontSize: 12,
  },
  value: {
    color: '#e6fff2',
    fontSize: 16,
    marginBottom: 8,
  },
  progressRow: {
    marginTop: 8,
  },
  hint: {
    color: '#9ad1b3',
    fontSize: 12,
    marginTop: 12,
  },
});


