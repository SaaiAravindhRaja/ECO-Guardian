import { Creature, EnvironmentalSnapshot } from '@/types';
import { EnvironmentalDataService } from './EnvironmentalDataService';
import { CreatureService } from './CreatureService';
import { LocationService } from './LocationService';

export class CreatureCollectionManager {
  private env = new EnvironmentalDataService();
  private creatureService = new CreatureService();
  private locationService = new LocationService();

  async enrichAndCollect(creatureId: string, userId: string): Promise<Creature | null> {
    try {
      const snapshot = await this.env.getCurrentEnvironmentalData();
      // Persist via service (service also attaches snapshot, but we attach optimistically here if needed)
      await this.creatureService.collectCreature(creatureId, userId);
      // Return updated creature from collection
      const creatures = await this.creatureService.getUserCreatures(userId);
      const collected = creatures.find(c => c.id === creatureId) || null;
      if (collected) {
        collected.collectionSnapshot = snapshot as EnvironmentalSnapshot;
      }
      return collected;
    } catch (error) {
      console.error('Error collecting creature with enrichment:', error);
      return null;
    }
  }
}


