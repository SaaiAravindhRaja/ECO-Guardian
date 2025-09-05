import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { ref, get, set, child } from 'firebase/database';
import { database } from './FirebaseService';
import type { Creature, EcoLocation, Location } from '@/types';
import { tileIdFor, haversineDistanceMeters, geohashNeighbors } from '@/lib/geo';
import { OfflineQueueService } from './OfflineQueueService';

type GetSpawnsByTilesArg = { tiles: string[]; userId: string };
type CheckinArg = { ecoLocation: EcoLocation; userLocation: Location; userId: string };

const offlineQueue = new OfflineQueueService();

const firebaseBaseQuery: BaseQueryFn<
  { type: string; args: any },
  unknown,
  unknown
> = async ({ type, args }) => {
  try {
    switch (type) {
      case 'getSpawnsByTiles': {
        const { tiles, userId } = args as GetSpawnsByTilesArg;
        const spawnsRef = ref(database, `spawned_creatures/${userId}`);
        const snap = await get(spawnsRef);
        if (!snap.exists()) return { data: [] };
        const all: Record<string, Creature> = snap.val();
        const list = Object.values(all).map((c: any) => ({
          ...c,
          collectedAt: c?.collectedAt ? new Date(c.collectedAt) : new Date(),
        })) as Creature[];
        const inTiles = list.filter((c) => {
          const t7 = c.tileIdP7 || tileIdFor(c.spawnLocation.latitude, c.spawnLocation.longitude, 7);
          return tiles.includes(t7);
        });
        return { data: inTiles };
      }
      case 'postCheckin': {
        const { ecoLocation, userLocation, userId } = args as CheckinArg;
        const distance = haversineDistanceMeters(
          userLocation.latitude,
          userLocation.longitude,
          ecoLocation.coordinates.lat,
          ecoLocation.coordinates.lng
        );
        if (distance > 50) {
          return { error: { status: 400, data: { message: 'Not eligible (>50m)' } } as any };
        }
        const id = `chk_${Date.now()}`;
        const checkinRef = child(ref(database, `checkins/${userId}`), id);
        const payload = {
          id,
          ecoLocationId: ecoLocation.id,
          at: new Date().toISOString(),
          userLocation,
          tileIdP8: tileIdFor(userLocation.latitude, userLocation.longitude, 8),
        };
        offlineQueue.enqueue(async () => {
          await set(checkinRef, payload);
        });
        return { data: { success: true, id } };
      }
      default:
        return { error: { status: 400, data: { message: 'Unknown operation' } } as any };
    }
  } catch (error) {
    return { error: { status: 500, data: error } as any };
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: firebaseBaseQuery,
  tagTypes: ['Spawns'],
  endpoints: (builder) => ({
    getSpawnsByTiles: builder.query<Creature[], GetSpawnsByTilesArg>({
      query: (args) => ({ type: 'getSpawnsByTiles', args }),
      providesTags: (result, _err, arg) =>
        (arg.tiles || []).map((t) => ({ type: 'Spawns' as const, id: t })),
    }),
    postCheckin: builder.mutation<{ success: boolean; id: string }, CheckinArg>({
      query: (args) => ({ type: 'postCheckin', args }),
      invalidatesTags: (_res, _err, arg) => {
        const around = [arg.userLocation].map((l) => tileIdFor(l.latitude, l.longitude, 7));
        return around.map((t) => ({ type: 'Spawns' as const, id: t }));
      },
    }),
  }),
});

export const { useGetSpawnsByTilesQuery, usePostCheckinMutation } = api;


