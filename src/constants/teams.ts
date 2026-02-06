export const TEAM_NAME_MAP: Record<string, string> = {
  ARS: 'Arsenal',
  AVL: 'Aston Villa',
  CHE: 'Chelsea',
  EVE: 'Everton',
  FUL: 'Fulham',
  LIV: 'Liverpool',
  MCI: 'Man City',
  MUN: 'Man Utd',
  NEW: 'Newcastle',
  SUN: 'Sunderland',
  TOT: 'Spurs',
  WOL: 'Wolves',
  BUR: 'Burnley',
  LEE: 'Leeds',
  NOT: "Nott'm Forest",
  CRY: 'Crystal Palace',
  BHA: 'Brighton',
  BRE: 'Brentford',
  WHU: 'West Ham',
  BOU: 'Bournemouth',
};

export function getTeamName(tla: string): string {
  return TEAM_NAME_MAP[tla] || tla;
}