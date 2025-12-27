// lib/teams.ts

export const TEAM_DATA: Record<number, { name: string; short_name: string; code: number }> = {
  1: { name: "Arsenal", short_name: "ARS", code: 3 },
  2: { name: "Aston Villa", short_name: "AVL", code: 7 },
  3: { name: "Burnley", short_name: "BUR", code: 90 },
  4: { name: "Bournemouth", short_name: "BOU", code: 91 },
  5: { name: "Brentford", short_name: "BRE", code: 94 },
  6: { name: "Brighton", short_name: "BHA", code: 36 },
  7: { name: "Chelsea", short_name: "CHE", code: 8 },
  8: { name: "Crystal Palace", short_name: "CRY", code: 31 },
  9: { name: "Everton", short_name: "EVE", code: 11 },
  10: { name: "Fulham", short_name: "FUL", code: 54 },
  11: { name: "Leeds", short_name: "LEE", code: 2 },
  12: { name: "Liverpool", short_name: "LIV", code: 14 },
  13: { name: "Man City", short_name: "MCI", code: 43 },
  14: { name: "Man Utd", short_name: "MUN", code: 1 },
  15: { name: "Newcastle", short_name: "NEW", code: 4 },
  16: { name: "Nott'm Forest", short_name: "NFO", code: 17 },
  17: { name: "Sunderland", short_name: "SUN", code: 56 },
  18: { name: "Spurs", short_name: "TOT", code: 6 },
  19: { name: "West Ham", short_name: "WHU", code: 21 },
  20: { name: "Wolves", short_name: "WOL", code: 39 },
};

// ฟังก์ชันดึง URL โลโก้ (SVG)
export const getTeamLogo = (teamId: number) => {
  const team = TEAM_DATA[teamId];
  return team 
    ? `https://resources.premierleague.com/premierleague/badges/t${team.code}.svg`
    : '/placeholder-logo.png'; // กรณีไม่พบข้อมูล
};

// ฟังก์ชันดึงชื่อทีม
export const getTeamName = (teamId: number, type: 'full' | 'short' = 'full') => {
  const team = TEAM_DATA[teamId];
  if (!team) return 'Unknown';
  return type === 'full' ? team.name : team.short_name;
};