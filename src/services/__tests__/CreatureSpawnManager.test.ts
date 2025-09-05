import { CreatureSpawnManager } from '@/services/CreatureSpawnManager';

// NOTE: This is a lightweight statistical sanity check rather than a strict test

describe('CreatureSpawnManager rarity distribution', () => {
  it('boosts rarity distribution under favorable conditions', async () => {
    const mgr = new CreatureSpawnManager();
    // Monkey patch internal rollRarity exposure via prototype method
    const baseCounts: Record<string, number> = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
    const boostCounts: Record<string, number> = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };

    // @ts-ignore - access private for test only
    const rollBase = mgr['rollRarity'].bind(mgr, false);
    // @ts-ignore - access private for test only
    const rollBoost = mgr['rollRarity'].bind(mgr, true);

    const samples = 5000;
    for (let i = 0; i < samples; i++) {
      baseCounts[rollBase()]++;
      boostCounts[rollBoost()]++;
    }

    // Expect fewer commons and more higher tiers under boost
    expect(boostCounts.common).toBeLessThan(baseCounts.common);
    expect(boostCounts.rare + boostCounts.epic + boostCounts.legendary)
      .toBeGreaterThan(baseCounts.rare + baseCounts.epic + baseCounts.legendary);
  });
});
