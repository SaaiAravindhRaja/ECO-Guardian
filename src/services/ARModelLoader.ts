import { AssetCacheService } from './AssetCacheService';

export class ARModelLoader {
  private cache = new AssetCacheService<ArrayBuffer>(60 * 60 * 1000);

  async loadModel(url: string): Promise<ArrayBuffer> {
    const cached = this.cache.get(url);
    if (cached) return cached;
    const resp = await fetch(url);
    const buf = await resp.arrayBuffer();
    this.cache.set(url, buf);
    return buf;
  }
}


