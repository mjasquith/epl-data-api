import { Request, Response, NextFunction } from 'express';
import { fetchMatches } from '../services/upstreamApiService';

export async function getFixtures(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const fixtures = await fetchMatches('fixtures');
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
    const results = await fetchMatches('results');
    res.json(results);
  } catch (err) {
    _next(err);
  }
}