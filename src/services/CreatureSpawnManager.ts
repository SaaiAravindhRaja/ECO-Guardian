import { EnvironmentalDataService } from './EnvironmentalDataService';
import { CreatureService } from './CreatureService';
import { LocationService } from './LocationService';
import { EcoLocationType, GreenPlanTarget, Location as AppLocation, RarityLevel } from '@/types';

type CooldownState = Record<string, number>; // key: userId:target, value: epoch ms when available

export class CreatureSpawnManager {
  private environmentalDataService: EnvironmentalDataService;
  private creatureService: CreatureService;
  private locationService: LocationService;
  private cooldowns: CooldownState = {};

  constructor(
    environmentalDataService = new EnvironmentalDataService(),
    creatureService = new CreatureService(),
    locationService = new LocationService()
  ) {
    this.environmentalDataService = environmentalDataService;
    this.creatureService = creatureService;
    this.locationService = locationService;
  }

  async trySpawnForEcoLocation(
    ecoLocationType: EcoLocationType,
    userLocation: AppLocation,
    userId: string
  ) {
    if (!await this.isEligible(userId, ecoLocationType)) return null;
    const snapshot = await this.environmentalDataService.getCurrentEnvironmentalData();
    const boosted = this.shouldBoost(snapshot);
    const rarity = this.rollRarity(boosted);

    // Delegate to CreatureService; it computes type/target by location type
    const creature = await this.creatureService.spawnCreature(
      ecoLocationType,
      userLocation,
      userId
    );

    // Overwrite rarity with our boosted roll (keeps other metadata intact)
    creature.rarity = rarity;

    // set 10-minute cooldown per target per user
    const target = this['getTargetFromLocation'](ecoLocationType);
    this.setCooldown(userId, target, 10 * 60 * 1000);
    return creature;
  }

  private shouldBoost(data: { airQuality: number; temperature: number; uvIndex: number }): boolean {
    return data.airQuality < 100 && data.temperature < 33 && data.uvIndex < 9;
  }

  private rollRarity(boost: boolean): RarityLevel {
    // Base weights
    const weights: Record<RarityLevel, number> = {
      [RarityLevel.COMMON]: 50,
      [RarityLevel.UNCOMMON]: 25,
      [RarityLevel.RARE]: 15,
      [RarityLevel.EPIC]: 8,
      [RarityLevel.LEGENDARY]: 2,
    };
    if (boost) {
      // Shift 10% of COMMON weight into higher tiers proportionally
      const shift = weights[RarityLevel.COMMON] * 0.1;
      weights[RarityLevel.COMMON] -= shift;
      const totalHigh = weights[RarityLevel.UNCOMMON] + weights[RarityLevel.RARE] + weights[RarityLevel.EPIC] + weights[RarityLevel.LEGENDARY];
      for (const r of [RarityLevel.UNCOMMON, RarityLevel.RARE, RarityLevel.EPIC, RarityLevel.LEGENDARY]) {
        weights[r] += (weights[r] / totalHigh) * shift;
      }
    }
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const r of [RarityLevel.COMMON, RarityLevel.UNCOMMON, RarityLevel.RARE, RarityLevel.EPIC, RarityLevel.LEGENDARY]) {
      if (roll < weights[r]) return r;
      roll -= weights[r];
    }
    return RarityLevel.COMMON;
  }

  private isEligible(userId: string, ecoLocationType: EcoLocationType): boolean {
    const target = this['getTargetFromLocation'](ecoLocationType);
    const key = this.cooldownKey(userId, target);
    const now = Date.now();
    return !this.cooldowns[key] || now >= this.cooldowns[key];
  }

  private setCooldown(userId: string, target: GreenPlanTarget, ms: number) {
    const key = this.cooldownKey(userId, target);
    this.cooldowns[key] = Date.now() + ms;
  }

  private cooldownKey(userId: string, target: GreenPlanTarget) {
    return `${userId}:${target}`;
  }

  private getTargetFromLocation(locationType: EcoLocationType): GreenPlanTarget {
    switch (locationType) {
      case EcoLocationType.NATURE_PARK:
      case EcoLocationType.COMMUNITY_GARDEN:
        return GreenPlanTarget.CITY_IN_NATURE;
      case EcoLocationType.EV_CHARGING_STATION:
        return GreenPlanTarget.ENERGY_RESET;
      case EcoLocationType.RECYCLING_CENTER:
      case EcoLocationType.RECYCLING_BIN:
        return GreenPlanTarget.SUSTAINABLE_LIVING;
      case EcoLocationType.ABC_WATERS_SITE:
        return GreenPlanTarget.RESILIENT_FUTURE;
      default:
        return GreenPlanTarget.CITY_IN_NATURE;
    }
  }
}


