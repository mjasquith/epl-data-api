import { config } from '../config';
import { getTeamName } from '../constants/teams';
import { Match, MatchFetchResponse, MatchStatus, MatchType } from '../types/fixture';
import { log } from '../utils/logger';

const BASE_URL = 'https://api.football-data.org/v4';
const MATCHES_ENDPOINT = '/competitions/PL/matches';

const QUERY_PARAMS: Record<MatchType, string> = {
  fixtures: 'status=SCHEDULED,POSTPONED,SUSPENDED',
  results: 'status=IN_PLAY,PAUSED,FINISHED',
  live: 'status=IN_PLAY,PAUSED',
  all: '', // No status filter, fetch all matches
};

async function fetchMatches(matchType: MatchType): Promise<MatchFetchResponse> {
  const url = `${BASE_URL}${MATCHES_ENDPOINT}?${QUERY_PARAMS[matchType]}`;

  try {
    log({ 
      level: 'INFO', 
      message: `Fetching '${matchType}' from upstream API: ${url}`, 
      context: 'upstreamApiService',
      customAttributes: { matchType, url }
    });
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': config.footballDataApiToken,
      },
    });

    if (!response.ok) {
      log({ 
        level: 'ERROR', 
        message: `Upstream API error: ${response.status} ${response.statusText}`, 
        context: 'upstreamApiService',
        customAttributes: { matchType, url, status: response.status, statusText: response.statusText }
      });
      throw new Error(`Upstream API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    log({ 
      level: 'INFO', 
      message: `Successfully fetched '${matchType}' from upstream API`, 
      context: 'upstreamApiService',
      customAttributes: { matchType, url, length: data.length }
    });

    const upstreamMatches: UpstreamMatch[] = data.matches ?? [];

    // Build mapped matches, sorting each round by date to ensure deterministic index order
    const mappedMatches: Match[] = mutateUpstreamMatchesToSortedMatchArray(upstreamMatches);
    return { success: true, data: mappedMatches };

  } catch (err) {
    return { success: false, data: [], error: err instanceof Error ? err : new Error(String(err)) };
  }
}

interface UpstreamMatch {
  id: number;
  utcDate: string;
  matchday: number;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
  status: string;
  score?: { fullTime: { home: number | null; away: number | null } };
}

function mutateUpstreamMatchesToSortedMatchArray(upstreamMatches: UpstreamMatch[]): Match[] {
  // Group matches by round (matchday) and compute matchNumber per spec:
  // matchNumber = (roundNumber * 10) + n  where n is 1-based index within the round.
  const byRound = new Map<number, UpstreamMatch[]>();
  for (const m of upstreamMatches) {
    const round = m.matchday ?? 0;
    const arr = byRound.get(round) ?? [];
    arr.push(m);
    byRound.set(round, arr);
  }

  // Build mapped matches, sorting each round by date to ensure deterministic index order
  const mappedMatches: Match[] = [];
  const rounds = Array.from(byRound.keys()).sort((a, b) => a - b);
  for (const roundNumber of rounds) {
    const matchesInRound = byRound.get(roundNumber) ?? [];
    matchesInRound.sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );
    matchesInRound.forEach((m, idx) => {
      const indexInRound = idx + 1;
      const computedMatchNumber = (roundNumber - 1) * 10 + indexInRound;
      mappedMatches.push(mapMatchToFixture(m, computedMatchNumber));
    });
  }

  return mappedMatches;

}

function mapMatchToFixture(match: UpstreamMatch, matchNumberOverride?: number): Match {
  const round = match.matchday ?? 0;
  const matchNumber = matchNumberOverride ?? (match.id);

  return {
    matchNumber,
    roundNumber: round,
    dateUtc: match.utcDate,
    homeTeam: getTeamName(match.homeTeam.tla),
    awayTeam: getTeamName(match.awayTeam.tla),
    status: mapStatus(match.status),
    homeTeamScore: match.score?.fullTime?.home ?? undefined,
    awayTeamScore: match.score?.fullTime?.away ?? undefined,
  };
}

function mapStatus(
  upstreamStatus: string
): MatchStatus {
  switch (upstreamStatus) {
    case 'SCHEDULED':
    case 'SUSPENDED':
      return 'Scheduled';
    case 'IN_PLAY':
    case 'PAUSED':
      return 'Live';
    case 'FINISHED':
      return 'Complete';
    case 'POSTPONED':
      return 'Postponed';
    default:
      return 'Scheduled';
  }
}

export { fetchMatches };
