"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const config_1 = require("../config");
class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTtlMs = config_1.config.cache?.defaultTtlMs ?? 5 * 60 * 1000;
    }
    set(key, data, ttlMs) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    get(key, ttlMs) {
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
    clear(key) {
        this.cache.delete(key);
    }
}
exports.cacheService = new CacheService();
//# sourceMappingURL=cacheService.js.map