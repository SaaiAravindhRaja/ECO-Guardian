## Firebase Realtime Database Schema (Client-Facing)

Paths use lowercase, hyphen-free keys. Timestamps are ISO strings. Security rules should validate ownership and basic shapes.

- `/users/{uid}`: User profile
  - `displayName: string`
  - `email: string`
  - `createdAt: ISO`
  - `level: number`
  - `totalPoints: number`
  - `achievements: { [id]: Achievement }`
  - `sustainabilityStats`: counters and `locationVisits: { [id]: { ecoLocationId, visitedAt } }`
  - `preferences`: booleans
  - `creatures: { [creatureId]: Creature }`

- `/spawned_creatures/{uid}/{creatureId}`: Pending spawns for user (eligible to collect)
  - Creature fields below plus: `tileIdP7: string`, `tileIdP8: string`

- `/leaderboards/{category}/{uid}`: denormalized user ranks
  - `{ score: number, displayName: string, avatar?: string }`

- `/shares/{shareId}`: AR photo share metadata
  - `{ uid, imagePath, hashtags: string[], createdAt }`

- `/challenges/{challengeId}`: challenge catalog
  - `{ title, description, type, greenPlanTarget, requirements[], rewards[], duration, isActive, startDate, endDate }`

- `/challenge_progress/{uid}/{challengeId}`
  - `{ progress: number, acceptedAt: ISO, completedAt?: ISO }`

- `/envSnapshots/{uid}/{creatureId}` (optional cache)
  - snapshot captured at collection time for audit

Creature:
```
{
  type: 'greenie'|'sparkie'|'binities'|'drippies',
  rarity: 'common'|'uncommon'|'rare'|'epic'|'legendary',
  spawnLocation: { latitude, longitude, accuracy?, timestamp? },
  greenPlanTarget: 'city_in_nature'|'energy_reset'|'sustainable_living'|'green_economy'|'resilient_future',
  evolutionLevel: number,
  backstory: string,
  visualAssets: { modelUrl, textureUrl, animationUrls[], thumbnailUrl },
  collectedAt: ISO,
  experiencePoints: number,
  collectionSnapshot?: { airQuality, temperature, humidity, uvIndex, timestamp, source },
  tileIdP7?: string,
  tileIdP8?: string
}
```

Indexes (suggested):
- `/leaderboards/{category}` by `score` descending
- `/users/{uid}/creatures` by `collectedAt`

Security notes:
- Users can read their own `/users/{uid}` subtree and `/spawned_creatures/{uid}`.
- Writes to `/spawned_creatures/{uid}` and `/users/{uid}/creatures` must be by the owner uid.
- Server should enforce global spawn rules if callable functions are added; for now, client writes include tile IDs and location used for eligibility.


