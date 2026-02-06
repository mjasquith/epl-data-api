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
export type Fixture = Match;
//# sourceMappingURL=fixture.d.ts.map