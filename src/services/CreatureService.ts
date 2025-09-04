import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './FirebaseService';
import { 
  Creature, 
  CreatureType, 
  RarityLevel, 
  GreenPlanTarget, 
  EcoLocationType,
  Location 
} from '@/types';

export class CreatureService {
  async spawnCreatureForTarget(
    target: GreenPlanTarget,
    location: Location,
    userId: string
  ): Promise<Creature> {
    const creatureType = this.getCreatureTypeFromTarget(target);
    return this.spawnCreature(this.getEcoLocationFromTarget(target), location, userId);
  }

  async spawnCreature(
    ecoLocationType: EcoLocationType, 
    location: Location, 
    userId: string
  ): Promise<Creature> {
    const creatureType = this.getCreatureTypeFromLocation(ecoLocationType);
    const greenPlanTarget = this.getGreenPlanTargetFromLocation(ecoLocationType);
    
    const creature: Creature = {
      id: this.generateCreatureId(),
      type: creatureType,
      rarity: this.calculateRarity(),
      spawnLocation: location,
      greenPlanTarget,
      evolutionLevel: 1,
      backstory: this.getCreatureBackstory(creatureType),
      visualAssets: this.getCreatureAssets(creatureType),
      collectedAt: new Date() as any,
      experiencePoints: 0,
    };

    // Save spawned creature to Firebase under deterministic id
    const spawnRef = ref(database, `spawned_creatures/${userId}/${creature.id}`);
    await set(spawnRef, {
      ...creature,
      collectedAt: new Date().toISOString(),
    });

    return creature;
  }

  async collectCreature(creatureId: string, userId: string): Promise<void> {
    // Move creature from spawned to collection
    const collectionRef = ref(database, `users/${userId}/creatures/${creatureId}`);
    const spawnRef = ref(database, `spawned_creatures/${userId}/${creatureId}`);
    
    const spawnSnapshot = await get(spawnRef);
    if (spawnSnapshot.exists()) {
      const creature = spawnSnapshot.val();
      await set(collectionRef, creature);
      await set(spawnRef, null); // Remove from spawned
    }
  }

  async getUserCreatures(userId: string): Promise<Creature[]> {
    const creaturesRef = ref(database, `users/${userId}/creatures`);
    const snapshot = await get(creaturesRef);
    
    if (!snapshot.exists()) return [];
    
    const creaturesData = snapshot.val();
    return Object.keys(creaturesData).map(key => {
      const raw = creaturesData[key];
      return {
        ...raw,
        id: key,
        collectedAt: raw?.collectedAt ? new Date(raw.collectedAt) : new Date(),
      } as Creature;
    });
  }

  private getCreatureTypeFromLocation(locationType: EcoLocationType): CreatureType {
    switch (locationType) {
      case EcoLocationType.NATURE_PARK:
      case EcoLocationType.COMMUNITY_GARDEN:
        return CreatureType.GREENIE;
      case EcoLocationType.EV_CHARGING_STATION:
        return CreatureType.SPARKIE;
      case EcoLocationType.RECYCLING_CENTER:
      case EcoLocationType.RECYCLING_BIN:
        return CreatureType.BINITIES;
      case EcoLocationType.ABC_WATERS_SITE:
        return CreatureType.DRIPPIES;
      default:
        return CreatureType.GREENIE;
    }
  }

  private getGreenPlanTargetFromLocation(locationType: EcoLocationType): GreenPlanTarget {
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

  private getCreatureTypeFromTarget(target: GreenPlanTarget): CreatureType {
    switch (target) {
      case GreenPlanTarget.CITY_IN_NATURE:
        return CreatureType.GREENIE;
      case GreenPlanTarget.ENERGY_RESET:
        return CreatureType.SPARKIE;
      case GreenPlanTarget.SUSTAINABLE_LIVING:
        return CreatureType.BINITIES;
      case GreenPlanTarget.RESILIENT_FUTURE:
        return CreatureType.DRIPPIES;
      case GreenPlanTarget.GREEN_ECONOMY:
      default:
        return CreatureType.GREENIE;
    }
  }

  private getEcoLocationFromTarget(target: GreenPlanTarget): EcoLocationType {
    switch (target) {
      case GreenPlanTarget.CITY_IN_NATURE:
        return EcoLocationType.NATURE_PARK;
      case GreenPlanTarget.ENERGY_RESET:
        return EcoLocationType.EV_CHARGING_STATION;
      case GreenPlanTarget.SUSTAINABLE_LIVING:
        return EcoLocationType.RECYCLING_CENTER;
      case GreenPlanTarget.RESILIENT_FUTURE:
        return EcoLocationType.ABC_WATERS_SITE;
      case GreenPlanTarget.GREEN_ECONOMY:
      default:
        return EcoLocationType.NATURE_PARK;
    }
  }

  private calculateRarity(): RarityLevel {
    const rand = Math.random();
    if (rand < 0.5) return RarityLevel.COMMON;
    if (rand < 0.75) return RarityLevel.UNCOMMON;
    if (rand < 0.9) return RarityLevel.RARE;
    if (rand < 0.98) return RarityLevel.EPIC;
    return RarityLevel.LEGENDARY;
  }

  private getCreatureBackstory(type: CreatureType): string {
    const backstories = {
      [CreatureType.GREENIE]: 'Born from the lush gardens of Singapore, Greenie embodies the spirit of urban nature and biodiversity.',
      [CreatureType.SPARKIE]: 'Energized by clean electricity, Sparkie represents Singapore\'s commitment to renewable energy.',
      [CreatureType.BINITIES]: 'A champion of waste reduction, Binities transforms recycling into a joyful adventure.',
      [CreatureType.DRIPPIES]: 'Guardian of Singapore\'s precious water resources, Drippies ensures every drop counts.',
    };
    return backstories[type];
  }

  private getCreatureAssets(type: CreatureType) {
    return {
      modelUrl: `assets/creatures/${type}/model.glb`,
      textureUrl: `assets/creatures/${type}/texture.png`,
      animationUrls: [
        `assets/creatures/${type}/idle.anim`,
        `assets/creatures/${type}/happy.anim`,
      ],
      thumbnailUrl: `assets/creatures/${type}/thumbnail.png`,
    };
  }

  private generateCreatureId(): string {
    return `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}