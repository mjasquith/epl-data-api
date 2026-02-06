import { Match } from '../types/fixture';
import { config } from '../config';

interface CacheEntry<T> {
  data: T;
  expires: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<Match[]>> = new Map();
  private defaultTtlMs: number = config.cache?.defaultTtlMs ?? 5 * 60 * 1000;

  set(key: string, data: Match[], ttlMs?: number): void {
    const effectiveTtl = ttlMs ?? this.defaultTtlMs;
    this.cache.set(key, {
      data,
      expires: Date.now() + effectiveTtl,
    });
  }

  get(key: string): Match[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key: string): void {
    this.cache.delete(key);
  }
}

export const cacheService = new CacheService();