const HENRIK_BASE = "https://api.henrikdev.xyz";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "X-Henrik-Api-Key",
};

export const config = { runtime: "edge" };

type HenrikResponse<T> = {
  status?: number | string;
  message?: string;
  data: T;
};

type AccountData = {
  region: string;
  puuid?: string;
};

// v3 MMR response shape (used for both PC + console)
type MmrV3Data = {
  current: {
    tier: { id: number; name: string };
    rr: number;
    threshold?: number;
  };
  seasonal?: Array<{
    wins?: number;
    games?: number; // Henrik returns "games", not "number_of_games"
    act?: { id?: string; name?: string; tag?: string };
    competitive_tier?: number;
  }>;
};

type MatchData = {
  players?: {
    all_players?: Array<{
      name?: string;
      puuid?: string;
      tag?: string;
      team?: string;
      stats?: {
        kills?: number;
        deaths?: number;
      };
    }>;
  };
  teams?: Record<string, { has_won?: boolean }>;
};

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const riotId = url.searchParams.get("riotId");
  const platform = url.searchParams.get("platform") === "console" ? "console" : "pc";

  if (!riotId) {
    return new Response("Missing riotId parameter", {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const customerApiKey = request.headers.get("X-Henrik-Api-Key")?.trim();
  const apiKey = customerApiKey || process.env.HENRIK_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return new Response("Add your HenrikDev API key in the setup page", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  try {
    const stats = await fetchStats(riotId, apiKey, platform);
    return Response.json(stats, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load player data";
    return new Response(message, { status: 422, headers: CORS_HEADERS });
  }
}

async function fetchStats(riotId: string, apiKey: string, platform: string) {
  const [name, tag] = riotId.split("#").map((s) => s.trim());
  if (!name || !tag) throw new Error("Invalid Riot ID — use Name#TAG format");

  const enc = (s: string) => encodeURIComponent(s);
  const headers = { Authorization: apiKey };

  // 1. Resolve region + puuid from account endpoint
  //    platform query param tells Henrik to look up the console-linked Riot account
  const accountRes = await fetch(
    `${HENRIK_BASE}/valorant/v2/account/${enc(name)}/${enc(tag)}?platform=${platform}`,
    { headers },
  );
  const accountJson = (await accountRes.json()) as HenrikResponse<AccountData>;
  if (accountRes.status === 401) throw new Error("Henrik API key invalid or missing.");
  if (!accountRes.ok || accountJson.status !== 200) {
    throw new Error(accountJson?.message ?? `Player not found (${accountRes.status})`);
  }
  const region = accountJson.data.region;
  const puuid = accountJson.data.puuid;

  // 2. Rank / RR — v3 endpoint has platform IN the path, supporting both PC and console
  const mmrRes = await fetch(
    `${HENRIK_BASE}/valorant/v3/mmr/${region}/${platform}/${enc(name)}/${enc(tag)}`,
    { headers },
  );
  const mmrJson = (await mmrRes.json()) as HenrikResponse<MmrV3Data>;
  if (!mmrRes.ok || mmrJson.status !== 200) {
    throw new Error(mmrJson?.message ?? `MMR not found (${mmrRes.status})`);
  }
  const current = mmrJson.data.current;
  const rankName = current.tier.name; // e.g. "Platinum 3"
  const rr = current.rr ?? 0;
  const rrToNext = current.threshold ?? 100;

  // 3. Last 10 competitive matches for K/D, W/L, streak
  //    PC uses standard endpoints (no platform param needed — it's the default).
  //    Console needs platform in path or query to get console-linked match history.
  const isConsole = platform === "console";
  const matchUrls = isConsole
    ? puuid
      ? [
          `${HENRIK_BASE}/valorant/v3/by-puuid/matches/${region}/${enc(puuid)}?mode=competitive&size=10&platform=console`,
          `${HENRIK_BASE}/valorant/v3/matches/${region}/console/${enc(name)}/${enc(tag)}?mode=competitive&size=10`,
          `${HENRIK_BASE}/valorant/v3/matches/${region}/${enc(name)}/${enc(tag)}?mode=competitive&size=10&platform=console`,
        ]
      : [
          `${HENRIK_BASE}/valorant/v3/matches/${region}/console/${enc(name)}/${enc(tag)}?mode=competitive&size=10`,
          `${HENRIK_BASE}/valorant/v3/matches/${region}/${enc(name)}/${enc(tag)}?mode=competitive&size=10&platform=console`,
        ]
    : puuid
      ? [
          // PC: PUUID-based, no platform param
          `${HENRIK_BASE}/valorant/v3/by-puuid/matches/${region}/${enc(puuid)}?mode=competitive&size=10`,
          // PC: name/tag, no platform param
          `${HENRIK_BASE}/valorant/v3/matches/${region}/${enc(name)}/${enc(tag)}?mode=competitive&size=10`,
        ]
      : [
          `${HENRIK_BASE}/valorant/v3/matches/${region}/${enc(name)}/${enc(tag)}?mode=competitive&size=10`,
        ];

  let matchData: MatchData[] = [];
  for (const url of matchUrls) {
    const res = await fetch(url, { headers });
    if (!res.ok) continue;
    const json = (await res.json()) as HenrikResponse<MatchData[]>;
    if (json.status === 200 && Array.isArray(json.data) && json.data.length > 0) {
      matchData = json.data;
      break;
    }
  }

  let kills = 0,
    deaths = 0,
    wins = 0,
    losses = 0,
    streak = 0,
    streakClosed = false;

  for (const match of matchData) {
    const player = (match.players?.all_players ?? []).find(
      (p) =>
        (puuid && p.puuid === puuid) ||
        (p.name?.toLowerCase() === name.toLowerCase() &&
          p.tag?.toLowerCase() === tag.toLowerCase()),
    );
    if (!player) continue;

    kills += player.stats?.kills ?? 0;
    deaths += player.stats?.deaths ?? 0;

    const team = player.team?.toLowerCase();
    const won: boolean = team ? (match.teams?.[team]?.has_won ?? false) : false;
    if (won) {
      wins++;
      if (!streakClosed) streak++;
    } else {
      losses++;
      streakClosed = true;
    }
  }

  // If match data had no usable player records (common for console — Henrik returns
  // match stubs but all detail fields are null), fall back to seasonal W/L from MMR v3.
  const hasMatchStats = wins + losses > 0;
  if (!hasMatchStats && mmrJson.data.seasonal && mmrJson.data.seasonal.length > 0) {
    // Use the most recent act entry (last in the array)
    const latestSeason = mmrJson.data.seasonal[mmrJson.data.seasonal.length - 1];
    wins = latestSeason.wins ?? 0;
    const totalGames = latestSeason.games ?? 0;
    losses = Math.max(0, totalGames - wins);
    // streak and K/D are not available from seasonal data
  }

  // K/D: null only for console with no match data (Henrik doesn't index console match details)
  const kd: number | null =
    isConsole && kills === 0 && deaths === 0
      ? null
      : deaths > 0
        ? Math.round((kills / deaths) * 100) / 100
        : kills > 0
          ? kills
          : 0;

  return {
    rankTier: rankName,
    rr,
    rrToNext,
    kd,
    wins,
    losses,
    season: "Competitive",
    streak,
  };
}
