// Geo utilities: haversine distance, geohash encode, tile ids, neighbors

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function geohashEncode(lat: number, lon: number, precision: number): string {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';

  let latMin = -90, latMax = 90;
  let lonMin = -180, lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      const lonMid = (lonMin + lonMax) / 2;
      if (lon >= lonMid) {
        idx = idx * 2 + 1;
        lonMin = lonMid;
      } else {
        idx = idx * 2;
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (lat >= latMid) {
        idx = idx * 2 + 1;
        latMin = latMid;
      } else {
        idx = idx * 2;
        latMax = latMid;
      }
    }

    evenBit = !evenBit;
    if (++bit === 5) {
      geohash += BASE32.charAt(idx);
      bit = 0;
      idx = 0;
    }
  }
  return geohash;
}

export function tileIdFor(lat: number, lon: number, precision: 7 | 8): string {
  return geohashEncode(lat, lon, precision);
}

export function geohashNeighbors(hash: string): string[] {
  // Compute neighbors by decoding bbox and offsetting; quick approach via adjacent in cardinal/diagonals
  const [latMin, latMax, lonMin, lonMax] = geohashBoundingBox(hash);
  const latSpan = latMax - latMin;
  const lonSpan = lonMax - lonMin;
  const centerLat = (latMin + latMax) / 2;
  const centerLon = (lonMin + lonMax) / 2;
  const p = hash.length as 7 | 8 | number;
  const points: Array<[number, number]> = [
    [centerLat + latSpan, centerLon],
    [centerLat - latSpan, centerLon],
    [centerLat, centerLon + lonSpan],
    [centerLat, centerLon - lonSpan],
    [centerLat + latSpan, centerLon + lonSpan],
    [centerLat + latSpan, centerLon - lonSpan],
    [centerLat - latSpan, centerLon + lonSpan],
    [centerLat - latSpan, centerLon - lonSpan],
  ];
  const uniq = new Set(points.map(([la, lo]) => geohashEncode(la, lo, p)));
  uniq.delete(hash);
  return Array.from(uniq);
}

export function geohashBoundingBox(hash: string): [number, number, number, number] {
  let evenBit = true;
  let latMin = -90, latMax = 90;
  let lonMin = -180, lonMax = 180;
  for (const ch of hash) {
    const idx = BASE32.indexOf(ch);
    if (idx === -1) throw new Error('Invalid geohash');
    for (let n = 4; n >= 0; n--) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        const lonMid = (lonMin + lonMax) / 2;
        if (bitN === 1) lonMin = lonMid; else lonMax = lonMid;
      } else {
        const latMid = (latMin + latMax) / 2;
        if (bitN === 1) latMin = latMid; else latMax = latMid;
      }
      evenBit = !evenBit;
    }
  }
  return [latMin, latMax, lonMin, lonMax];
}


