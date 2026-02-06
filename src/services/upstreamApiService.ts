import { config } from '../config';
import { Match } from '../types/fixture';
import { cacheService } from './cacheService';

const BASE_URL = 'https://api.football-data.org/v4';
const MATCHES_ENDPOINT = '/competitions/PL/matches';

type MatchType = 'fixtures' | 'results';

const QUERY_PARAMS: Record<MatchType, string> = {
  fixtures: 'status=SCHEDULED,POSTPONED,SUSPENDED',
  results: 'status=LIVE,FINISHED',
};

async function fetchMatches(matchType: MatchType): Promise<Match[]> {
  const cacheKey = `matches_${matchType}`;
  const url = `${BASE_URL}${MATCHES_ENDPOINT}?${QUERY_PARAMS[matchType]}`;
  const cacheTtl = config.cache?.matches?.[matchType];

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': config.footballDataApiToken,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Upstream API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const matches = data.matches.map(mapMatchToFixture);

    // Cache successful response with configured TTL
    cacheService.set(cacheKey, matches, cacheTtl);

    return matches;
  } catch (err) {
    // Fall back to cached data on error
    const cached = cacheService.get(cacheKey, cacheTtl);
    if (cached) {
      console.warn(
        `Upstream API error, returning cached ${matchType} data`,
        err
      );
      return cached;
    }

    throw err;
  }
}

interface UpstreamMatch {
  id: number;
  utcDate: string;
  matchday: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  status: string;
  score?: { fullTime: { home: number | null; away: number | null } };
}

function mapMatchToFixture(match: UpstreamMatch): Match {
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

function mapStatus(
  upstreamStatus: string
): 'Scheduled' | 'Live' | 'Complete' {
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

export { fetchMatches };