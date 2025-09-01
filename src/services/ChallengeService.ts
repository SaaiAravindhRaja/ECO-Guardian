import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './FirebaseService';
import { Challenge, ChallengeType, GreenPlanTarget, Reward } from '@/types';

export class ChallengeService {
  async getDailyChallenges(): Promise<Challenge[]> {
    // Mock daily challenges - in production, these would be generated server-side
    return [
      {
        id: 'daily-nature-visit',
        title: 'Nature Explorer',
        description: 'Visit any nature park or community garden today',
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
          {
            type: 'creature',
            value: 'common_greenie',
            description: 'Common Greenie spawn chance',
          },
        ],
        duration: { days: 1 },
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        id: 'daily-recycling',
        title: 'Recycling Hero',
        description: 'Check in at a recycling center or bin',
        type: ChallengeType.DAILY,
        greenPlanTarget: GreenPlanTarget.SUSTAINABLE_LIVING,
        requirements: [
          {
            type: 'location_visit',
            target: 1,
            description: 'Visit 1 recycling location',
          },
        ],
        rewards: [
          {
            type: 'points',
            value: 75,
            description: '75 eco points',
          },
        ],
        duration: { days: 1 },
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ];
  }

  async getWeeklyChallenges(): Promise<Challenge[]> {
    return [
      {
        id: 'weekly-green-explorer',
        title: 'Green Explorer',
        description: 'Visit 5 different eco-locations this week',
        type: ChallengeType.WEEKLY,
        greenPlanTarget: GreenPlanTarget.CITY_IN_NATURE,
        requirements: [
          {
            type: 'location_visit',
            target: 5,
            description: 'Visit 5 different eco-locations',
          },
        ],
        rewards: [
          {
            type: 'points',
            value: 500,
            description: '500 eco points',
          },
          {
            type: 'creature',
            value: 'rare_mixed',
            description: 'Rare creature of any type',
          },
        ],
        duration: { days: 7 },
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'weekly-sustainability-streak',
        title: 'Sustainability Streak',
        description: 'Complete daily challenges for 5 consecutive days',
        type: ChallengeType.WEEKLY,
        greenPlanTarget: GreenPlanTarget.SUSTAINABLE_LIVING,
        requirements: [
          {
            type: 'streak_maintain',
            target: 5,
            description: 'Maintain 5-day streak',
          },
        ],
        rewards: [
          {
            type: 'points',
            value: 750,
            description: '750 eco points',
          },
          {
            type: 'evolution_material',
            value: 'nature_essence',
            description: 'Nature Essence for evolution',
          },
        ],
        duration: { days: 7 },
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  async completeChallenge(challengeId: string, userId: string): Promise<Reward[]> {
    try {
      const challengeRef = ref(database, `user_challenges/${userId}/${challengeId}`);
      await set(challengeRef, {
        completedAt: new Date().toISOString(),
        status: 'completed',
      });

      // Return mock rewards - in production, this would calculate actual rewards
      return [
        {
          type: 'points',
          value: 100,
          description: '100 eco points',
        },
      ];
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }

  async getUserChallengeProgress(userId: string, challengeId: string): Promise<number> {
    try {
      const progressRef = ref(database, `user_progress/${userId}/${challengeId}`);
      const snapshot = await get(progressRef);
      
      if (snapshot.exists()) {
        return snapshot.val().progress || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting challenge progress:', error);
      return 0;
    }
  }

  async updateChallengeProgress(
    userId: string, 
    challengeId: string, 
    progress: number
  ): Promise<void> {
    try {
      const progressRef = ref(database, `user_progress/${userId}/${challengeId}`);
      await set(progressRef, {
        progress,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }
}