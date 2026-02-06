import { Match } from '../types/fixture';
type MatchType = 'fixtures' | 'results';
declare function fetchMatches(matchType: MatchType): Promise<Match[]>;
export { fetchMatches };
//# sourceMappingURL=upstreamApiService.d.ts.map