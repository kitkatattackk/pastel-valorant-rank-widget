const CDN = "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04";

export type RankTier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export type RankDivision = 1 | 2 | 3;

export interface ParsedRank {
  tier: RankTier;
  division: RankDivision | null; // Radiant has no divisions
  label: string;                  // e.g. "Gold 2" or "Radiant"
  icon: string;                   // CDN image URL
  /** Browser-safe color string for accent glow / gradient */
  accent: string;
  /** Whether this is a top tier (Radiant) — has no progress to next rank */
  capped: boolean;
}

/** API tier number for each rank base (division 1). Division offset is added in parseRank. */
const TIER_BASE: Record<RankTier, number> = {
  Iron:      3,
  Bronze:    6,
  Silver:    9,
  Gold:      12,
  Platinum:  15,
  Diamond:   18,
  Ascendant: 21,
  Immortal:  24,
  Radiant:   27,
};

const TIER_ACCENT: Record<RankTier, string> = {
  Iron:      "#88909c",
  Bronze:    "#c47b3c",
  Silver:    "#cfd6df",
  Gold:      "#f1c232",
  Platinum:  "#33d4df",
  Diamond:   "#b47cff",
  Ascendant: "#36e0a0",
  Immortal:  "#ff4655",
  Radiant:   "#f7d85b",
};

const TIER_ORDER: RankTier[] = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum",
  "Diamond", "Ascendant", "Immortal", "Radiant",
];

const TIER_LOOKUP: Record<string, RankTier> = TIER_ORDER.reduce(
  (acc, tier) => ({ ...acc, [tier.toLowerCase()]: tier }),
  {} as Record<string, RankTier>,
);

function iconUrl(tier: RankTier, division: RankDivision | null): string {
  const tierNum = division
    ? TIER_BASE[tier] + (division - 1)
    : TIER_BASE[tier];
  return `${CDN}/${tierNum}/largeicon.png`;
}

/**
 * Parse a rank input like "Gold 2", "ascendant3", or "Radiant"
 * into a normalized ParsedRank with the official Valorant icon + accent color.
 * Falls back to Iron 1 for unknown input so the UI never breaks.
 */
export function parseRank(input: string): ParsedRank {
  const cleaned = input.trim().toLowerCase();
  const match = cleaned.match(/^([a-z]+)\s*([1-3])?$/);

  let tier: RankTier = "Iron";
  let division: RankDivision | null = 1;

  if (match) {
    const found = TIER_LOOKUP[match[1]];
    if (found) tier = found;
    if (match[2]) division = Number(match[2]) as RankDivision;
  }

  if (tier === "Radiant") division = null;

  const label = division ? `${tier} ${division}` : tier;
  const capped = tier === "Radiant";

  return {
    tier,
    division,
    label,
    icon: iconUrl(tier, division),
    accent: TIER_ACCENT[tier],
    capped,
  };
}

/** A sortable rank value used to detect a promotion between live refreshes. */
export function getRankValue(input: string): number {
  const rank = parseRank(input);
  return TIER_BASE[rank.tier] + (rank.division ? rank.division - 1 : 0);
}

export const ALL_TIERS = TIER_ORDER;
