import { NextFunction, Request, Response } from 'express';
import { CacheResponse, cacheService } from '../services/cacheService';
import { fetchMatches } from '../services/upstreamApiService';
import { Match, MatchFetchResponse, MatchType } from '../types/fixture';

async function getData(matchType: MatchType): Promise<Match[]> {

  const cached: CacheResponse<Match[]> = cacheService.get("matches", matchType);
  const cacheStatus: string = cached ? (cached.expired ? "EXPIRED" : "HIT") : "MISS";
  if (cacheStatus === "HIT") {
      return cached.data ?? [];
  }

  const fetchedMatches: MatchFetchResponse = await fetchMatches(matchType);
  if (fetchedMatches.success) {
    cacheService.set("matches", matchType, fetchedMatches.data);
    return fetchedMatches.data;
  }

  console.log(`Failed to fetch ${matchType} from upstream API: ${fetchedMatches.error}`);

  if (cached && cached.data) {
    console.log(`Using expired cache data for matches_${matchType} due to upstream API failure`);
    return cached.data;
  }

  return [];
}

export async function getFixtures(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const fixtures = await getData('fixtures');
    res.json(fixtures);
  } catch (err) {
    _next(err);
  }
}

export async function getResults(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const results = await getData('results');
    res.json(results);
  } catch (err) {
    _next(err);
  }
}

export async function getAllMatches(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const results = await getData('all');
    res.json(results);
  } catch (err) {
    _next(err);
  }
}