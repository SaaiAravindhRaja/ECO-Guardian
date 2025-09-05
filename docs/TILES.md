## Tiles and Geohash

### Geohash precision
- Use geohash precision p7 for clustering (approx ~150 m cell in SG).
- Use geohash precision p8 for eligibility buckets (approx ~38 m cell). Eligibility rule is 50 m; p8 narrows candidate checks to neighbors.

### Eligibility rule
- A spawn is eligible for collection when the user is within 50 meters of the spawn point and the reported accuracy is within 80 m.
- Client performs a haversine distance pre-check; optional server callable may revalidate.

### Tile helpers
- `tileIdFor(lat, lng, p)` returns geohash string at precision p (7 or 8).
- `neighborHashes(ghash)` returns 8 adjacent cell hashes, used to expand searches along boundaries.

### OneMap tile template
- Default template to configure via env (documented only, code keeps OSM fallback):
  - `https://{s}.onemap.sg/tiles/Default/{z}/{x}/{y}.png?apikey={key}`
  - Subdomains: `a,b,c`

### Spawn indexing
- Each spawned creature stores `tileIdP7` and `tileIdP8` for querying and clustering.
- For map clustering: query by `tileIdP7` range and aggregate.
- For eligibility: restrict candidate spawns to user `tileIdP8` plus neighbors, then haversine within 50 m.


