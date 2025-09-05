import { haversineDistanceMeters, geohashEncode, tileIdFor, geohashNeighbors } from '@/lib/geo';

describe('geo utils', () => {
  it('computes reasonable haversine distances', () => {
    const sgMerlion = { lat: 1.2868, lon: 103.8545 };
    const marinaBaySands = { lat: 1.2834, lon: 103.8607 };
    const d = haversineDistanceMeters(sgMerlion.lat, sgMerlion.lon, marinaBaySands.lat, marinaBaySands.lon);
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(1000);
  });

  it('encodes geohash with desired precision and neighbors', () => {
    const gh7 = geohashEncode(1.29027, 103.851959, 7);
    const gh8 = tileIdFor(1.29027, 103.851959, 8);
    expect(gh7.length).toBe(7);
    expect(gh8.length).toBe(8);
    const neigh = geohashNeighbors(gh8);
    expect(neigh.length).toBeGreaterThanOrEqual(8);
    expect(neigh).not.toContain(gh8);
  });
});


