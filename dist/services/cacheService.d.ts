import { Match } from '../types/fixture';
declare class CacheService {
    private cache;
    private defaultTtlMs;
    set(key: string, data: Match[], ttlMs?: number): void;
    get(key: string, ttlMs?: number): Match[] | null;
    clear(key: string): void;
}
export declare const cacheService: CacheService;
export {};
//# sourceMappingURL=cacheService.d.ts.map