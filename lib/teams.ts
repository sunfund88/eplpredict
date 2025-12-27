// lib/teams.ts

export const TEAM_MAP: Record<number, { name: string, short: string, code: number }> = {
  1: { name: "Arsenal", short: "ARS", code: 3 },
  2: { name: "Aston Villa", short: "AVL", code: 7 },
  3: { name: "Burnley", short: "BUR", code: 90 },
  4: { name: "Bournemouth", short: "BOU", code: 91 },
  5: { name: "Brentford", short: "BRE", code: 94 },
  6: { name: "Brighton", short: "BHA", code: 36 },
  7: { name: "Chelsea", short: "CHE", code: 8 },
  8: { name: "Crystal Palace", short: "CRY", code: 31 },
  9: { name: "Everton", short: "EVE", code: 11 },
  10: { name: "Fulham", short: "FUL", code: 54 },
  11: { name: "Leeds", short: "LEE", code: 2 },
  12: { name: "Liverpool", short: "LIV", code: 14 },
  13: { name: "Man City", short: "MCI", code: 43 },
  14: { name: "Man Utd", short: "MUN", code: 1 },
  15: { name: "Newcastle", short: "NEW", code: 4 },
  16: { name: "Nott'm Forest", short: "NFO", code: 17 },
  17: { name: "Sunderland", short: "SUN", code: 56 },
  18: { name: "Spurs", short: "TOT", code: 6 },
  19: { name: "West Ham", short: "WHU", code: 21 },
  20: { name: "Wolves", short: "WOL", code: 39 },
};

// ดึงชื่อทีมจาก ID
export const getTeamName = (id: number) => TEAM_MAP[id]?.name || "Unknown";

// ดึงชื่อย่อจาก ID
export const getTeamShortName = (id: number) => TEAM_MAP[id]?.short || "UNK";

// ดึง URL โลโก้จาก ID (โดยใช้ code ภายใน)
export const getTeamLogo = (id: number) => {
  const code = TEAM_MAP[id]?.code;
  return code 
    ? `https://resources.premierleague.com/premierleague/badges/t${code}.svg`
    : `https://resources.premierleague.com/premierleague/badges/tdefault.png`;
};