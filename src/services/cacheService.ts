import { Match } from '../types/fixture';
import { config } from '../config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<Match[]>> = new Map();
  private defaultTtlMs: number = config.cache?.defaultTtlMs ?? 5 * 60 * 1000;

  set(key: string, data: Match[], ttlMs?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string, ttlMs?: number): Match[] | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const effectiveTtl = ttlMs ?? this.defaultTtlMs;
    const isExpired = Date.now() - entry.timestamp > effectiveTtl;
    if (isExpired) {
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