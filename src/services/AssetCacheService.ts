type CacheEntry<T> = { value: T; expiresAt: number };

export class AssetCacheService<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  constructor(private ttlMs = 30 * 60 * 1000) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
    }

  set(key: string, value: T) {
    this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}


