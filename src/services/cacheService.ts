import { config, getCacheTtl } from '../config';

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export interface CacheResponse<T> {
  data: T | null;
  expired: boolean;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTtlMs: number = config.cache?.defaultTtlMs ?? 5 * 60 * 1000;

  set(cacheCategory: string, cacheType: string, data: any): void {

    const cacheTtl = getCacheTtl(cacheCategory, cacheType);
    const cacheKey = `${cacheCategory}_${cacheType}`;

    this.cache.set(cacheKey, {
      data,
      expires: Date.now() + cacheTtl,
    });
    console.log(`Cache set for "${cacheKey}" with TTL of ${cacheTtl} ms (expires at ${new Date(Date.now() + cacheTtl).toISOString()})`);
  }

  get(cacheCategory: string, cacheType: string): CacheResponse<any> {
    const cacheKey = `${cacheCategory}_${cacheType}`;
    const entry = this.cache.get(cacheKey);
    if (!entry) {
      console.log(`${cacheKey}: Cache MISS - no entry found`);
      return { data: null, expired: true };
    }

    const cacheStatus: string = Date.now() > entry.expires ? "EXPIRED" : "HIT";
    const expiresAt: string = new Date(entry.expires).toISOString();
    const now: string = new Date().toISOString();
    console.log(`${cacheKey}: Cache ${cacheStatus} expires at ${expiresAt}, current time is ${now}`);

    return { 
      data: entry.data, 
      expired: Date.now() > entry.expires
    };
  }

  clear(cacheKey: string): void {
    this.cache.delete(cacheKey);
  }

}

export const cacheService = new CacheService();