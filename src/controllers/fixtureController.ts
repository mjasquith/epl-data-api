import { NextFunction, Request, Response } from 'express';
import { CacheResponse, cacheService } from '../services/cacheService';
import { fetchMatches } from '../services/upstreamApiService';
import { Match, MatchFetchResponse, MatchType } from '../types/fixture';
import { log } from '../utils/logger';

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

  log({
    level: 'WARN', 
    message: `Failed to fetch ${matchType} from upstream API: ${fetchedMatches.error}`, 
    context: 'fixtureController', 
    customAttributes: { matchType, error: fetchedMatches.error } 
  });

  if (cached && cached.data) {
    log({ 
      level: 'INFO', 
      message: `Using expired cache data for matches_${matchType} due to upstream API failure`, 
      context: 'fixtureController', 
      customAttributes: { matchType } 
    });
    return cached.data;
  }

  return [];
}

async function getFixtures(
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

async function getResults(
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

async function getLiveMatches(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const liveMatches = await getData('live');
    res.json(liveMatches);
  } catch (err) {
    _next(err);
  }
}

async function getAllMatches(
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

export { getFixtures, getResults, getLiveMatches, getAllMatches };