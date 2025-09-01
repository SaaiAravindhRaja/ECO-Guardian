import { Creature, RarityLevel, CreatureType, Location } from '@/types';
import { DEFAULTS } from './constants';

export class GameLogic {
  static calculateCreatureSpawnProbability(
    userLevel: number,
    locationVisits: number,
    environmentalBoost: boolean = false
  ): number {
    let baseProbability = 0.3; // 30% base chance
    
    // Level bonus (up to 20% additional)
    const levelBonus = Math.min(userLevel * 0.02, 0.2);
    
    // Visit frequency bonus (diminishing returns)
    const visitBonus = Math.min(locationVisits * 0.01, 0.1);
    
    // Environmental conditions boost
    const environmentalBonus = environmentalBoost ? 0.15 : 0;
    
    return Math.min(baseProbability + levelBonus + visitBonus + environmentalBonus, 0.8);
  }

  static calculateRarityProbability(userLevel: number, streak: number): RarityLevel {
    const rand = Math.random();
    
    // Base probabilities
    let commonThreshold = 0.6;
    let uncommonThreshold = 0.8;
    let rareThreshold = 0.93;
    let epicThreshold = 0.99;
    
    // Adjust based on user level and streak
    const levelBonus = userLevel * 0.005;
    const streakBonus = Math.min(streak * 0.002, 0.05);
    
    commonThreshold -= (levelBonus + streakBonus);
    uncommonThreshold -= (levelBonus + streakBonus) * 0.5;
    rareThreshold -= (levelBonus + streakBonus) * 0.3;
    epicThreshold -= (levelBonus + streakBonus) * 0.1;
    
    if (rand < commonThreshold) return RarityLevel.COMMON;
    if (rand < uncommonThreshold) return RarityLevel.UNCOMMON;
    if (rand < rareThreshold) return RarityLevel.RARE;
    if (rand < epicThreshold) return RarityLevel.EPIC;
    return RarityLevel.LEGENDARY;
  }

  static calculateExperienceGain(
    rarity: RarityLevel,
    challengeCompleted: boolean = false,
    firstTimeLocation: boolean = false
  ): number {
    const baseExp = {
      [RarityLevel.COMMON]: 50,
      [RarityLevel.UNCOMMON]: 100,
      [RarityLevel.RARE]: 200,
      [RarityLevel.EPIC]: 400,
      [RarityLevel.LEGENDARY]: 800,
    };

    let experience = baseExp[rarity];
    
    if (challengeCompleted) experience *= 1.5;
    if (firstTimeLocation) experience *= 1.2;
    
    return Math.floor(experience);
  }

  static calculateLevelFromExperience(totalExp: number): number {
    let level = 1;
    let expRequired = DEFAULTS.BASE_EXPERIENCE;
    let currentExp = totalExp;
    
    while (currentExp >= expRequired) {
      currentExp -= expRequired;
      level++;
      expRequired = Math.floor(expRequired * DEFAULTS.LEVEL_MULTIPLIER);
    }
    
    return level;
  }

  static calculateDistanceBetweenPoints(
    point1: Location,
    point2: Location
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  static isWithinSpawnRadius(
    userLocation: Location,
    targetLocation: Location,
    radius: number = DEFAULTS.SPAWN_RADIUS
  ): boolean {
    const distance = this.calculateDistanceBetweenPoints(userLocation, targetLocation);
    return distance <= radius;
  }

  static calculateSustainabilityScore(
    totalEcoActions: number,
    streak: number,
    creaturesCollected: number,
    challengesCompleted: number
  ): number {
    const actionScore = totalEcoActions * 10;
    const streakScore = streak * 50;
    const collectionScore = creaturesCollected * 25;
    const challengeScore = challengesCompleted * 100;
    
    return actionScore + streakScore + collectionScore + challengeScore;
  }

  static getEnvironmentalImpactEstimate(
    ecoActions: number,
    creatureType?: CreatureType
  ): { co2Saved: number; waterSaved: number; wasteRecycled: number } {
    // Rough estimates based on typical eco-actions
    const baseImpact = {
      co2Saved: ecoActions * 2.5, // kg CO2
      waterSaved: ecoActions * 10, // liters
      wasteRecycled: ecoActions * 0.5, // kg
    };

    // Creature type multipliers
    const multipliers = {
      [CreatureType.GREENIE]: { co2: 1.5, water: 1.0, waste: 1.0 },
      [CreatureType.SPARKIE]: { co2: 2.0, water: 1.0, waste: 1.0 },
      [CreatureType.BINITIES]: { co2: 1.0, water: 1.0, waste: 2.0 },
      [CreatureType.DRIPPIES]: { co2: 1.0, water: 2.0, waste: 1.0 },
    };

    if (creatureType && multipliers[creatureType]) {
      const mult = multipliers[creatureType];
      return {
        co2Saved: Math.floor(baseImpact.co2Saved * mult.co2),
        waterSaved: Math.floor(baseImpact.waterSaved * mult.water),
        wasteRecycled: Math.floor(baseImpact.wasteRecycled * mult.waste),
      };
    }

    return {
      co2Saved: Math.floor(baseImpact.co2Saved),
      waterSaved: Math.floor(baseImpact.waterSaved),
      wasteRecycled: Math.floor(baseImpact.wasteRecycled),
    };
  }

  static shouldTriggerAchievement(
    type: string,
    currentValue: number,
    previousValue: number
  ): boolean {
    const milestones = {
      creatures_collected: [1, 5, 10, 25, 50, 100],
      challenges_completed: [1, 5, 10, 25, 50],
      sustainability_streak: [3, 7, 14, 30, 60, 100],
      locations_visited: [1, 5, 10, 20, 50],
      total_points: [100, 500, 1000, 5000, 10000],
    };

    const relevantMilestones = milestones[type as keyof typeof milestones] || [];
    
    return relevantMilestones.some(
      milestone => currentValue >= milestone && previousValue < milestone
    );
  }
}