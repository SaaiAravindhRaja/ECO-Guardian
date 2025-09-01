import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addAchievement } from '@/store/slices/userSlice';
import { Achievement, AchievementCategory } from '@/types';
import { GameLogic } from '@/utils/gameLogic';
import { AnalyticsService } from '@/services/AnalyticsService';

export function useAchievements() {
  const dispatch = useDispatch();
  const { profile, achievements } = useSelector((state: RootState) => state.user);
  const { collection } = useSelector((state: RootState) => state.creatures);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    checkForNewAchievements();
  }, [collection.length, profile?.totalPoints]);

  const checkForNewAchievements = () => {
    if (!profile) return;

    const currentStats = {
      creaturesCollected: collection.length,
      totalPoints: profile.totalPoints,
      challengesCompleted: profile.sustainabilityStats?.challengesCompleted || 0,
      sustainabilityStreak: profile.sustainabilityStats?.sustainabilityStreak || 0,
    };

    // Check each achievement type
    checkCreatureAchievements(currentStats.creaturesCollected);
    checkPointsAchievements(currentStats.totalPoints);
    checkStreakAchievements(currentStats.sustainabilityStreak);
    checkChallengeAchievements(currentStats.challengesCompleted);
  };

  const checkCreatureAchievements = (count: number) => {
    const milestones = [
      { count: 1, title: 'First Friend', description: 'Collect your first creature' },
      { count: 5, title: 'Creature Collector', description: 'Collect 5 creatures' },
      { count: 10, title: 'Nature Guardian', description: 'Collect 10 creatures' },
      { count: 25, title: 'Eco Champion', description: 'Collect 25 creatures' },
      { count: 50, title: 'Master Collector', description: 'Collect 50 creatures' },
      { count: 100, title: 'Legendary Guardian', description: 'Collect 100 creatures' },
    ];

    milestones.forEach(milestone => {
      if (count >= milestone.count && !hasAchievement(`creatures_${milestone.count}`)) {
        unlockAchievement({
          id: `creatures_${milestone.count}`,
          title: milestone.title,
          description: milestone.description,
          iconUrl: '🐾',
          unlockedAt: new Date(),
          category: AchievementCategory.COLLECTION,
        });
      }
    });
  };

  const checkPointsAchievements = (points: number) => {
    const milestones = [
      { points: 100, title: 'Getting Started', description: 'Earn your first 100 points' },
      { points: 500, title: 'Point Collector', description: 'Earn 500 points' },
      { points: 1000, title: 'Eco Warrior', description: 'Earn 1,000 points' },
      { points: 5000, title: 'Sustainability Hero', description: 'Earn 5,000 points' },
      { points: 10000, title: 'Green Legend', description: 'Earn 10,000 points' },
    ];

    milestones.forEach(milestone => {
      if (points >= milestone.points && !hasAchievement(`points_${milestone.points}`)) {
        unlockAchievement({
          id: `points_${milestone.points}`,
          title: milestone.title,
          description: milestone.description,
          iconUrl: '⭐',
          unlockedAt: new Date(),
          category: AchievementCategory.SUSTAINABILITY,
        });
      }
    });
  };

  const checkStreakAchievements = (streak: number) => {
    const milestones = [
      { streak: 3, title: 'Streak Starter', description: 'Maintain a 3-day streak' },
      { streak: 7, title: 'Week Warrior', description: 'Maintain a 7-day streak' },
      { streak: 14, title: 'Fortnight Fighter', description: 'Maintain a 14-day streak' },
      { streak: 30, title: 'Monthly Master', description: 'Maintain a 30-day streak' },
      { streak: 100, title: 'Century Streak', description: 'Maintain a 100-day streak' },
    ];

    milestones.forEach(milestone => {
      if (streak >= milestone.streak && !hasAchievement(`streak_${milestone.streak}`)) {
        unlockAchievement({
          id: `streak_${milestone.streak}`,
          title: milestone.title,
          description: milestone.description,
          iconUrl: '🔥',
          unlockedAt: new Date(),
          category: AchievementCategory.SUSTAINABILITY,
        });
      }
    });
  };

  const checkChallengeAchievements = (completed: number) => {
    const milestones = [
      { count: 1, title: 'Challenge Accepted', description: 'Complete your first challenge' },
      { count: 5, title: 'Challenge Crusher', description: 'Complete 5 challenges' },
      { count: 10, title: 'Challenge Champion', description: 'Complete 10 challenges' },
      { count: 25, title: 'Challenge Master', description: 'Complete 25 challenges' },
      { count: 50, title: 'Challenge Legend', description: 'Complete 50 challenges' },
    ];

    milestones.forEach(milestone => {
      if (completed >= milestone.count && !hasAchievement(`challenges_${milestone.count}`)) {
        unlockAchievement({
          id: `challenges_${milestone.count}`,
          title: milestone.title,
          description: milestone.description,
          iconUrl: '🏆',
          unlockedAt: new Date(),
          category: AchievementCategory.SUSTAINABILITY,
        });
      }
    });
  };

  const hasAchievement = (achievementId: string): boolean => {
    return achievements.some(achievement => achievement.id === achievementId);
  };

  const unlockAchievement = (achievement: Achievement) => {
    dispatch(addAchievement(achievement));
    setNewAchievement(achievement);
    
    // Track analytics
    analytics.trackAchievementUnlocked(achievement.id, achievement.category);
    
    // Auto-hide after showing
    setTimeout(() => {
      setNewAchievement(null);
    }, 100);
  };

  const hideAchievementToast = () => {
    setNewAchievement(null);
  };

  return {
    achievements,
    newAchievement,
    hideAchievementToast,
    checkForNewAchievements,
  };
}