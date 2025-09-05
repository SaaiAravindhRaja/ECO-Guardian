import { Creature, RarityLevel } from '@/types';

export class CollectionAnalyticsService {
  rarityBreakdown(collection: Creature[]): Record<RarityLevel, number> {
    const counts: Record<RarityLevel, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    } as any;
    collection.forEach(c => {
      counts[c.rarity] = (counts[c.rarity] || 0) + 1;
    });
    return counts;
  }

  averageLevel(collection: Creature[]): number {
    if (collection.length === 0) return 0;
    const sum = collection.reduce((a, c) => a + (c.evolutionLevel || 1), 0);
    return parseFloat((sum / collection.length).toFixed(2));
  }
}


