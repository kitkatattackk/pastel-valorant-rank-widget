import { useEffect, useLayoutEffect, useState } from "react";
import { PastelRankWidget } from "@/components/PastelRankWidget";
import type { ValorantStats } from "@/types";
import { fetchPlayerStats } from "@/lib/valorant-api";
import { parsePastelPalette, parsePastelTheme } from "@/lib/pastel-palettes";

const NATURAL_SIZE = { width: 420, height: 170 };
const OUTPUT_SCALE = 4;
const PADDING_X = 34;
const PADDING_TOP = 34;
const PADDING_BOTTOM = 72;

const SOURCE_SIZE = {
  width: (NATURAL_SIZE.width + PADDING_X * 2) * OUTPUT_SCALE,
  height: (NATURAL_SIZE.height + PADDING_TOP + PADDING_BOTTOM) * OUTPUT_SCALE,
};

export function PastelWidgetPage() {
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id")?.trim() ?? "";
  const platform = query.get("platform") === "console" ? "console" : "pc";
  const palette = parsePastelPalette(query.get("palette"));
  const theme = parsePastelTheme(query.get("theme"));
  const [stats, setStats] = useState<ValorantStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setApiKey(new URLSearchParams(window.location.hash.slice(1)).get("api_key")?.trim() ?? "");
  }, []);

  useLayoutEffect(() => {
    const sourceStyles = [
      "background: transparent",
      "margin: 0",
      "padding: 0",
      "overflow: hidden",
      `width: ${SOURCE_SIZE.width}px`,
      `height: ${SOURCE_SIZE.height}px`,
    ].join(";");
    document.documentElement.style.cssText = sourceStyles;
    document.body.style.cssText = sourceStyles;
    return () => {
      document.documentElement.style.cssText = "";
      document.body.style.cssText = "";
    };
  }, []);

  useEffect(() => {
    if (!id || !apiKey) return;
    async function load() {
      try {
        setStats(await fetchPlayerStats(id, platform, apiKey));
        setError(null);
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load");
      }
    }
    load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, [apiKey, id, platform]);

  const message = !id
    ? "Add your Riot ID to the widget URL."
    : !apiKey
      ? "Add your HenrikDev API key through the setup page."
      : error;

  if (message) {
    return <p style={{ color: "#62485c", fontFamily: "sans-serif", fontSize: 14, margin: 12 }}>{message}</p>;
  }
  if (!stats) return null;

  return (
    <div style={{ width: SOURCE_SIZE.width, height: SOURCE_SIZE.height, overflow: "visible", position: "relative" }}>
      <div
        style={{
          width: NATURAL_SIZE.width,
          height: NATURAL_SIZE.height,
          position: "absolute",
          left: PADDING_X * OUTPUT_SCALE,
          top: PADDING_TOP * OUTPUT_SCALE,
          transform: `scale(${OUTPUT_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <PastelRankWidget stats={stats} palette={palette} theme={theme} />
      </div>
    </div>
  );
}
