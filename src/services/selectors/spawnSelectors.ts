import type { Creature, Location } from '@/types';
import { haversineDistanceMeters } from '@/lib/geo';

export type SpawnCluster = {
  tileIdP7: string;
  count: number;
  center: { lat: number; lng: number };
  items: Creature[];
};

export function clusterByTile(spawns: Creature[]): SpawnCluster[] {
  const groups: Record<string, Creature[]> = {};
  for (const s of spawns) {
    const key = s.tileIdP7 || 'unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return Object.entries(groups).map(([tileIdP7, items]) => {
    const lat = items.reduce((a, c) => a + c.spawnLocation.latitude, 0) / items.length;
    const lng = items.reduce((a, c) => a + c.spawnLocation.longitude, 0) / items.length;
    return { tileIdP7, count: items.length, center: { lat, lng }, items };
  });
}

export function isSpawnEligible(user: Location, spawn: Creature): boolean {
  const d = haversineDistanceMeters(
    user.latitude,
    user.longitude,
    spawn.spawnLocation.latitude,
    spawn.spawnLocation.longitude
  );
  return d <= 50;
}


