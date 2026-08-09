import type { ValorantStats } from "@/types";

export async function fetchPlayerStats(
  riotId: string,
  platform: "pc" | "console" = "pc",
  apiKey?: string,
): Promise<ValorantStats> {
  const params = new URLSearchParams({ riotId, platform });
  const configuredOrigin = import.meta.env.VITE_PLAYER_API_ORIGIN?.replace(/\/$/, "");
  const apiOrigin = configuredOrigin ?? "";
  const headers = apiKey ? { "X-Henrik-Api-Key": apiKey } : undefined;
  const res = await fetch(`${apiOrigin}/api/player?${params}`, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  return res.json() as Promise<ValorantStats>;
}
