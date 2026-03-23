export type MatchStatus = 'Scheduled' | 'Live' | 'Complete' | 'Postponed';

export interface Match {
  matchNumber: number;
  roundNumber: number;
  dateUtc: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  homeTeamScore?: number;
  awayTeamScore?: number;
}

export type MatchType = 'fixtures' | 'results' | 'live' | 'all';

export type MatchFetchResponse = {
  success: boolean;
  data: Match[];
  error?: Error;
}