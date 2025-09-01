import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { setProfile } from '@/store/slices/userSlice';
import { clearAuth } from '@/store/slices/authSlice';
import { AuthService } from '@/services/AuthService';

export function ProfileScreen() {
  const dispatch = useDispatch();
  const { authService } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, achievements, sustainabilityStats } = useSelector(
    (state: RootState) => state.user
  );
  const { collection } = useSelector((state: RootState) => state.creatures);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const authService = new AuthService();
      const userProfile = await authService.getUserProfile(user.uid);
      if (userProfile) {
        dispatch(setProfile(userProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              dispatch(clearAuth());
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const AchievementBadge = ({ title, icon }: { title: string; icon: string }) => (
    <View style={styles.achievementBadge}>
      <Text style={styles.achievementIcon}>{icon}</Text>
      <Text style={styles.achievementTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Creatures Collected"
            value={collection.length}
            icon="🐾"
          />
          <StatCard
            title="Eco Points"
            value={profile?.totalPoints || 0}
            icon="⭐"
          />
          <StatCard
            title="Sustainability Streak"
            value={`${sustainabilityStats?.sustainabilityStreak || 0} days`}
            icon="🔥"
          />
          <StatCard
            title="Level"
            value={profile?.level || 1}
            icon="🏆"
          />
        </View>
      </View>

      {/* Environmental Impact */}
      <View style={styles.impactContainer}>
        <Text style={styles.sectionTitle}>Environmental Impact</Text>
        <View style={styles.impactGrid}>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>🌱</Text>
            <Text style={styles.impactValue}>
              {sustainabilityStats?.co2Saved || 0} kg
            </Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>💧</Text>
            <Text style={styles.impactValue}>
              {sustainabilityStats?.waterSaved || 0} L
            </Text>
            <Text style={styles.impactLabel}>Water Saved</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>♻️</Text>
            <Text style={styles.impactValue}>
              {sustainabilityStats?.wasteRecycled || 0} kg
            </Text>
            <Text style={styles.impactLabel}>Waste Recycled</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.length > 0 ? (
            achievements.slice(0, 3).map((achievement, index) => (
              <AchievementBadge
                key={index}
                title={achievement.title}
                icon="🏅"
              />
            ))
          ) : (
            <Text style={styles.noAchievements}>
              Complete challenges to earn achievements!
            </Text>
          )}
        </View>
      </View>

      {/* Green Plan Progress */}
      <View style={styles.greenPlanContainer}>
        <Text style={styles.sectionTitle}>Green Plan 2030 Progress</Text>
        <View style={styles.greenPlanGrid}>
          <View style={styles.greenPlanCard}>
            <Text style={styles.greenPlanIcon}>🌳</Text>
            <Text style={styles.greenPlanTitle}>City in Nature</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>
          <View style={styles.greenPlanCard}>
            <Text style={styles.greenPlanIcon}>⚡</Text>
            <Text style={styles.greenPlanTitle}>Energy Reset</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '30%' }]} />
            </View>
          </View>
          <View style={styles.greenPlanCard}>
            <Text style={styles.greenPlanIcon}>♻️</Text>
            <Text style={styles.greenPlanTitle}>Sustainable Living</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B4332',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7ED321',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#A8D5BA',
  },
  signOutButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 16,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#A8D5BA',
    textAlign: 'center',
  },
  impactContainer: {
    padding: 20,
    paddingTop: 0,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactCard: {
    flex: 1,
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  impactIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 10,
    color: '#A8D5BA',
    textAlign: 'center',
  },
  achievementsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  achievementsList: {
    gap: 8,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D5A27',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  noAchievements: {
    fontSize: 14,
    color: '#A8D5BA',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  greenPlanContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  greenPlanGrid: {
    gap: 12,
  },
  greenPlanCard: {
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  greenPlanIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  greenPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#4A7C59',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7ED321',
    borderRadius: 3,
  },
});