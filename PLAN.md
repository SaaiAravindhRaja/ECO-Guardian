## ECO-Guardian — Implementation Plan (Milestone 1)

### Repo audit (current state)
- **Stack**: React Native 0.73 + Expo 50, React 18, React Navigation 6 (stack + bottom tabs), Redux Toolkit (slices). No RTK Query yet.
- **AR/Camera**: `react-native-vision-camera` present; AR wrappers via `react-native-arcore` (Android) and `react-native-arkit` (iOS) with a graceful 2D overlay fallback in `ARCreatureView`.
- **Backend**: Firebase modular SDK v9. `services/FirebaseService.ts` initializes App/Auth/Realtime Database/Storage/Functions using `EXPO_PUBLIC_*` env vars. Existing domain services use RTDB:
  - `AuthService` writes `users/{uid}` profile
  - `CreatureService` writes `spawned_creatures/{uid}/{creatureId}` and moves to `users/{uid}/creatures/{creatureId}` upon collect
  - `CreatureSpawnManager` applies cooldowns and environmental boosts
  - `OfflineQueueService` provides eventual consistency
- **Location & Env**: `LocationService` wraps `expo-location` and fetches eco POIs (OneMap search fallback + mock). `EnvironmentalDataService` pulls NEA endpoints with caching + fallback.
- **Navigation/Screens**: Tabs wired: AR Camera, Map, Collection, Progress, Profile. `MapScreen` lists eco-locations as cards (no map tiles yet).
- **State**: Redux Toolkit slices for `auth`, `location`, `creatures`, `challenges`, `user`, `ar`.
- **Tests**: Unit tests for AR, spawn rarity distribution, offline queue.

### Gaps vs spec
- RTK Query not integrated (keep current services; plan to layer RTK Query later with minimal surface changes).
- Tiles/geohash utilities missing; no tile-based spawn indexing or 50 m eligibility pre-check in UI.
- No OneMap base map rendering yet; Map view is list-only.
- Docs missing (PLAN/SCHEMA/TILES) and `.env.example` not present.

### Milestone scope (this PR)
1) Docs and env template:
   - Add PLAN.md, SCHEMA.md, docs/TILES.md, .env.example.
2) Geo/tiles foundation:
   - Add `src/lib/geo` with haversine, geohash encoder, `tileIdFor(lat,lng,p7|p8)`, neighbors.
   - Unit tests for geo and 50 m eligibility.
3) Wiring & small UX:
   - Enforce 50 m eligibility in `LocationService.validateCheckIn`.
   - Compute/store `tileIdP7` and `tileIdP8` on creature spawns for future clustering/indexes.
   - `MapScreen`: pre-check eligibility; show inline status and disable button when not eligible.

4) Map view and clustering:
   - OneMap tiles via env-driven template helper `getTileUrl` with subdomain rotation.
   - Cluster markers by `tileIdP7`, show counts; render user 50 m ring; eligible vs ineligible marker styles.

5) Auth bootstrap:
   - On auth state change, initialize `/users/{uid}` profile in RTDB if missing.

6) RTK Query endpoints:
   - `getSpawnsByTiles` and `postCheckin` using RTDB + offline queue.

Out of scope for this PR (queued next):
- OneMap raster/xyz tiles rendering and clustered markers.
- RTK Query endpoints and offline queue integration across features.
- Callable validations and server-side spawn validation.

### Follow-up milestones
M2: OneMap map view with clustering; RTK Query for spawns, collection, challenges; offline queue banner/screen.
M3: AR camera collect flow integrated with spawn manager + RTDB writes; photo/share (Storage) MVP.
M4: Challenges list/detail/progress; profile stats and leaderboards.
M5: Evolution/Breeding hooks; community basics; env-driven spawn rate tuning.

### Risks & mitigations
- OneMap API quotas/availability: cache and graceful fallbacks already present.
- Geolocation accuracy: hard 50 m rule plus accuracy threshold; spoof detection heuristic in place.
- AR support variance: 2D fallback maintained.


