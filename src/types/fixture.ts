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

// For backward compatibility (optional)
export type Fixture = Match;