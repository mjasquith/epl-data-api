import { Request, Response, NextFunction } from 'express';
import { fetchMatches } from '../services/upstreamApiService';
import { Match } from '../types/fixture';

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

export async function getAllMatches(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const [fixtures, results] = await Promise.all([
      fetchMatches('fixtures'),
      fetchMatches('results'),
    ]);

    // combine and dedupe by matchNumber, prefer entries that include scores
    const mergedMap = new Map<number, Match>();

    const combined = [...fixtures, ...results];
    for (const m of combined) {
      const existing = mergedMap.get(m.matchNumber);
      if (!existing) {
        mergedMap.set(m.matchNumber, m);
        continue;
      }

      const existingHasScores =
        existing.homeTeamScore !== undefined || existing.awayTeamScore !== undefined;
      const newHasScores =
        m.homeTeamScore !== undefined || m.awayTeamScore !== undefined;

      // prefer the record that contains scores (results)
      if (newHasScores && !existingHasScores) {
        mergedMap.set(m.matchNumber, m);
      }
      // otherwise keep existing
    }

    const mergedArray = Array.from(mergedMap.values()).sort((a, b) =>
      new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime()
    );

    res.json(mergedArray);
  } catch (err) {
    _next(err);
  }
}