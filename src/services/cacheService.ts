import { config, getCacheTtl } from '../config';
import { log } from '../utils/logger';

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
    const expires = new Date(Date.now() + cacheTtl);

    this.cache.set(cacheKey, {
      data,
      expires: expires.getTime(),
    });
    log({ 
      level: 'INFO', 
      message: `Cache set for '${cacheKey}' with TTL of ${cacheTtl} ms`, 
      context: 'cacheService',
      customAttributes: {
        cacheCategory,
        cacheType,
        cacheTtl,
        expiresAt: expires.toISOString(),
        dataLength: JSON.stringify(data).length
      } 
    });
  }

  get(cacheCategory: string, cacheType: string): CacheResponse<any> {
    const cacheKey = `${cacheCategory}_${cacheType}`;
    const entry = this.cache.get(cacheKey);
    if (!entry) {
      log({ 
        level: 'INFO', 
        message: `${cacheKey}: Cache MISS - no entry found`, 
        context: 'cacheService',
        customAttributes: { cacheCategory, cacheType }
      });
      return { data: null, expired: true };
    }

    const cacheStatus: string = Date.now() > entry.expires ? "EXPIRED" : "HIT";
    const expiresAt: string = new Date(entry.expires).toISOString();
    log({ 
      level: 'INFO', 
      message: `${cacheKey}: Cache ${cacheStatus}`, 
      context: 'cacheService',
      customAttributes: {
        cacheCategory,
        cacheType,
        expiresAt,
        dataLength: JSON.stringify(entry.data).length
      }
    });

    return { 
      data: entry.data, 
      expired: Date.now() > entry.expires
    };
  }

  clear(cacheKey: string): void {
    this.cache.delete(cacheKey);
  }

  getSummary(): Record<string, { expiresAt: string; dataLength: number } | null> {
    var summary: Record<string, { expiresAt: string; dataLength: number } | null> = {};
    for (const [key, entry] of this.cache.entries()) {
      summary[key] = {
        expiresAt: new Date(entry.expires).toISOString(),
        dataLength: JSON.stringify(entry.data).length
      };
    }
    return summary;
  }
}

export const cacheService = new CacheService();