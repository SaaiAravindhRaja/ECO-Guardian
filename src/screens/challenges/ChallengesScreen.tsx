import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Challenge, ChallengeType, GreenPlanTarget } from '@/types';
import { setActiveChallenges, completeChallenge } from '@/store/slices/challengeSlice';

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: 'daily-1',
    title: 'Visit a Nature Park',
    description: 'Check in at any nature park or community garden to spawn a Greenie',
    type: ChallengeType.DAILY,
    greenPlanTarget: GreenPlanTarget.CITY_IN_NATURE,
    requirements: [
      {
        type: 'location_visit',
        target: 1,
        description: 'Visit 1 nature location',
      },
    ],
    rewards: [
      {
        type: 'points',
        value: 100,
        description: '100 eco points',
      },
    ],
    duration: { days: 1 },
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 'weekly-1',
    title: 'Recycling Champion',
    description: 'Visit 3 different recycling locations this week',
    type: ChallengeType.WEEKLY,
    greenPlanTarget: GreenPlanTarget.SUSTAINABLE_LIVING,
    requirements: [
      {
        type: 'location_visit',
        target: 3,
        description: 'Visit 3 recycling locations',
      },
    ],
    rewards: [
      {
        type: 'creature',
        value: 'rare_binities',
        description: 'Rare Binities creature',
      },
    ],
    duration: { days: 7 },
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

export function ChallengesScreen() {
  const dispatch = useDispatch();
  const { activeChallenges, completedChallenges } = useSelector(
    (state: RootState) => state.challenges
  );

  useEffect(() => {
    // Load challenges - in production, this would fetch from Firebase
    dispatch(setActiveChallenges(mockChallenges));
  }, [dispatch]);

  const getChallengeTypeColor = (type: ChallengeType): string => {
    switch (type) {
      case ChallengeType.DAILY: return '#7ED321';
      case ChallengeType.WEEKLY: return '#3498DB';
      case ChallengeType.MONTHLY: return '#9B59B6';
      case ChallengeType.COMMUNITY: return '#E74C3C';
      case ChallengeType.SPECIAL_EVENT: return '#F39C12';
      default: return '#7ED321';
    }
  };

  const getGreenPlanIcon = (target: GreenPlanTarget): string => {
    switch (target) {
      case GreenPlanTarget.CITY_IN_NATURE: return '🌳';
      case GreenPlanTarget.ENERGY_RESET: return '⚡';
      case GreenPlanTarget.SUSTAINABLE_LIVING: return '♻️';
      case GreenPlanTarget.GREEN_ECONOMY: return '💚';
      case GreenPlanTarget.RESILIENT_FUTURE: return '🌍';
      default: return '🌱';
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    dispatch(completeChallenge(challengeId));
  };

  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    const progress = 0.3; // Mock progress - would be calculated from user data
    const isCompleted = completedChallenges.some(c => c.id === item.id);

    return (
      <View style={[styles.challengeCard, isCompleted && styles.completedCard]}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeIcon}>
              {getGreenPlanIcon(item.greenPlanTarget)}
            </Text>
            <View style={styles.challengeDetails}>
              <Text style={styles.challengeTitle}>{item.title}</Text>
              <View style={[
                styles.challengeTypeBadge,
                { backgroundColor: getChallengeTypeColor(item.type) }
              ]}>
                <Text style={styles.challengeTypeText}>
                  {item.type.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.challengeDescription}>{item.description}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {Math.round(progress * 100)}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progress * 100}%` }]} 
            />
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.requirementsContainer}>
          {item.requirements.map((req, index) => (
            <Text key={index} style={styles.requirementText}>
              • {req.description}
            </Text>
          ))}
        </View>

        {/* Rewards */}
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards:</Text>
          {item.rewards.map((reward, index) => (
            <Text key={index} style={styles.rewardText}>
              🎁 {reward.description}
            </Text>
          ))}
        </View>

        {/* Action Button */}
        {!isCompleted && progress >= 1 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteChallenge(item.id)}
          >
            <Text style={styles.completeButtonText}>Claim Reward</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅ Completed</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>
          Complete eco-friendly tasks to earn rewards
        </Text>
      </View>

      <FlatList
        data={activeChallenges}
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active challenges</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new sustainability challenges!
            </Text>
          </View>
        }
      />
    </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7ED321',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A8D5BA',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  challengeCard: {
    backgroundColor: '#2D5A27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4A7C59',
  },
  completedCard: {
    opacity: 0.7,
    borderColor: '#7ED321',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  challengeDetails: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  challengeTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  challengeTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#A8D5BA',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#A8D5BA',
    marginBottom: 8,
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
  requirementsContainer: {
    marginBottom: 16,
  },
  requirementText: {
    fontSize: 14,
    color: '#A8D5BA',
    marginBottom: 4,
  },
  rewardsContainer: {
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7ED321',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#A8D5BA',
    marginBottom: 4,
  },
  completeButton: {
    backgroundColor: '#7ED321',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  completedBadge: {
    alignItems: 'center',
    padding: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7ED321',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#A8D5BA',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B8E6B',
    textAlign: 'center',
  },
});