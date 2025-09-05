import { clusterByTile, isSpawnEligible } from '@/services/selectors/spawnSelectors';
import type { Creature, RarityLevel, CreatureType, GreenPlanTarget, Location } from '@/types';

function makeCreature(id: string, lat: number, lng: number, tile: string): Creature {
  return {
    id,
    type: CreatureType.GREENIE,
    rarity: RarityLevel.COMMON,
    spawnLocation: { latitude: lat, longitude: lng },
    greenPlanTarget: GreenPlanTarget.CITY_IN_NATURE,
    evolutionLevel: 1,
    backstory: '',
    visualAssets: { modelUrl: '', textureUrl: '', animationUrls: [], thumbnailUrl: '' },
    collectedAt: new Date(),
    experiencePoints: 0,
    tileIdP7: tile,
    tileIdP8: tile + 'x',
  };
}

describe('spawn selectors', () => {
  it('clusters by tileIdP7', () => {
    const a1 = makeCreature('a1', 1.0, 103.8, 'w21z7y0');
    const a2 = makeCreature('a2', 1.001, 103.801, 'w21z7y0');
    const b1 = makeCreature('b1', 1.02, 103.82, 'w21z7y1');
    const clusters = clusterByTile([a1, a2, b1]);
    const byId = Object.fromEntries(clusters.map(c => [c.tileIdP7, c]));
    expect(byId['w21z7y0'].count).toBe(2);
    expect(byId['w21z7y1'].count).toBe(1);
  });

  it('eligibility within 50 m', () => {
    const user: Location = { latitude: 1.29027, longitude: 103.851959 };
    const near = makeCreature('n', 1.2906, 103.8522, 't');
    const far = makeCreature('f', 1.30027, 103.861959, 't');
    expect(isSpawnEligible(user, near)).toBe(true);
    expect(isSpawnEligible(user, far)).toBe(false);
  });
});


