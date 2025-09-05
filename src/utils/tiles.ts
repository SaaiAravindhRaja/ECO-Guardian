export function getTileUrl(z: number, x: number, y: number): string {
  const template = process.env.EXPO_PUBLIC_ONEMAP_TILE_URL || process.env.ONEMAP_TILE_URL || '';
  // Example template: https://{s}.onemap.sg/tiles/{z}/{x}/{y}.png?apikey={key}
  const subdomains = ['a', 'b', 'c'];
  const s = subdomains[(x + y + z) % subdomains.length];
  const apiKey = process.env.EXPO_PUBLIC_ONEMAP_API_KEY || process.env.ONEMAP_API_KEY || '';
  if (!template) {
    // Fallback to a placeholder tile (transparent image) to avoid crashes
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }
  return template
    .replace('{s}', s)
    .replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y))
    .replace('{key}', apiKey);
}


