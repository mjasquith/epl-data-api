export interface Match {
  matchNumber: number;
  roundNumber: number;
  dateUtc: string;
  homeTeam: string;
  awayTeam: string;
  status: 'Scheduled' | 'Live' | 'Complete';
  homeTeamScore?: number;
  awayTeamScore?: number;
}

export type MatchType = 'fixtures' | 'results' | 'all';

export type MatchFetchResponse = {
  success: boolean;
  data: Match[];
  error?: Error;
}