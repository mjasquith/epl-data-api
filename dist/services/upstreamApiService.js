"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMatches = fetchMatches;
const config_1 = require("../config");
const cacheService_1 = require("./cacheService");
const BASE_URL = 'https://api.football-data.org/v4';
const MATCHES_ENDPOINT = '/competitions/PL/matches';
const QUERY_PARAMS = {
    fixtures: 'status=SCHEDULED,POSTPONED,SUSPENDED',
    results: 'status=LIVE,FINISHED',
};
async function fetchMatches(matchType) {
    const cacheKey = `matches_${matchType}`;
    const url = `${BASE_URL}${MATCHES_ENDPOINT}?${QUERY_PARAMS[matchType]}`;
    const cacheTtl = config_1.config.cache?.matches?.[matchType];
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Auth-Token': config_1.config.footballDataApiToken,
            },
        });
        if (!response.ok) {
            throw new Error(`Upstream API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const matches = data.matches.map(mapMatchToFixture);
        // Cache successful response with configured TTL
        cacheService_1.cacheService.set(cacheKey, matches, cacheTtl);
        return matches;
    }
    catch (err) {
        // Fall back to cached data on error
        const cached = cacheService_1.cacheService.get(cacheKey, cacheTtl);
        if (cached) {
            console.warn(`Upstream API error, returning cached ${matchType} data`, err);
            return cached;
        }
        throw err;
    }
}
function mapMatchToFixture(match) {
    return {
        matchNumber: match.id,
        roundNumber: match.matchday,
        dateUtc: match.utcDate,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        status: mapStatus(match.status),
        homeTeamScore: match.score?.fullTime?.home ?? undefined,
        awayTeamScore: match.score?.fullTime?.away ?? undefined,
    };
}
function mapStatus(upstreamStatus) {
    switch (upstreamStatus) {
        case 'SCHEDULED':
        case 'POSTPONED':
        case 'SUSPENDED':
            return 'Scheduled';
        case 'IN_PLAY':
            return 'Live';
        case 'FINISHED':
            return 'Complete';
        default:
            return 'Scheduled';
    }
}
//# sourceMappingURL=upstreamApiService.js.map