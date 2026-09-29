import { useState } from "react";
import { Check, Copy, ExternalLink, Eye, EyeOff, LoaderCircle, Search } from "lucide-react";
import { PastelRankWidget } from "@/components/PastelRankWidget";
import type { ValorantStats } from "@/types";
import { fetchPlayerStats } from "@/lib/valorant-api";
import {
  HALLOWEEN_PREVIEW,
  PASTEL_PALETTES,
  PASTEL_PALETTE_IDS,
  type PastelPaletteId,
  type PastelTheme,
} from "@/lib/pastel-palettes";

const DEMO_STATS: ValorantStats = {
  rankTier: "Gold 2",
  rr: 52,
  rrToNext: 100,
  kd: 0.8,
  wins: 4,
  losses: 6,
  season: "Competitive",
  streak: 0,
};

const SOURCE_SIZE = { width: 1952, height: 1104 };
type Platform = "pc" | "console";

export function PastelConfigPage() {
  const [riotId, setRiotId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [platform, setPlatform] = useState<Platform>("pc");
  const [palette, setPalette] = useState<PastelPaletteId>("rose");
  const [theme, setTheme] = useState<PastelTheme>("default");
  const [stats, setStats] = useState<ValorantStats>(DEMO_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isValidId = riotId.includes("#");
  const hasApiKey = apiKey.trim().length > 0;
  const halloween = theme === "halloween";
  const selectedPalette = halloween
    ? { ...PASTEL_PALETTES[palette], ...HALLOWEEN_PREVIEW }
    : PASTEL_PALETTES[palette];
  const origin =
    typeof window === "undefined"
      ? "https://pastel-valorant-rank-widget.vercel.app"
      : window.location.origin;
  const platformParam = platform === "console" ? "&platform=console" : "";
  const widgetBaseUrl = `${origin}/pastel/widget?palette=${palette}${halloween ? "&theme=halloween" : ""}&id=${encodeURIComponent(riotId)}${platformParam}`;
  const widgetUrl = `${widgetBaseUrl}#api_key=${encodeURIComponent(apiKey.trim())}`;
  const displayedWidgetUrl = hasApiKey ? `${widgetBaseUrl}#api_key=••••••••` : widgetBaseUrl;

  async function loadPlayer(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidId) {
      setError("Use the format Name#TAG");
      return;
    }
    if (!hasApiKey) {
      setError("Add your HenrikDev API key");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setStats(await fetchPlayerStats(riotId, platform, apiKey.trim()));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Player data could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  async function copyWidgetUrl() {
    if (!isValidId) {
      setError("Enter your Riot ID before copying the URL");
      return;
    }
    if (!hasApiKey) {
      setError("Add your HenrikDev API key before copying the URL");
      return;
    }

    try {
      await navigator.clipboard.writeText(widgetUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = widgetUrl;
      textarea.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main
      className="min-h-screen bg-[#f7f2f6] text-[#62485c]"
      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
    >
      <div className="mx-auto grid min-h-screen max-w-[1180px] lg:grid-cols-[0.86fr_1.14fr]">
        <section className="flex flex-col justify-center border-[#d8c4d2] px-6 py-12 sm:px-10 lg:border-r lg:px-14">
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#8d6881]">
              <span className="h-2 w-2 rounded-full bg-[#ac7b9e]" />
              Pastel Rank Overlay
            </div>
            <h1 className="max-w-md text-4xl font-black leading-[1.02] tracking-normal text-[#62485c] sm:text-5xl">
              Build your browser source
            </h1>
          </div>

          <form onSubmit={loadPlayer} className="space-y-7">
            <div>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#7c5b72]">
                  HenrikDev API key
                </span>
                <div className="flex border-b-2 border-[#62485c] pb-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(event) => {
                      setApiKey(event.target.value);
                      setError(null);
                    }}
                    placeholder="Paste your key"
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="HenrikDev API key"
                    className="min-w-0 flex-1 bg-transparent px-1 py-2 text-lg font-extrabold tracking-normal text-[#62485c] outline-none placeholder:text-[#b99aae]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((visible) => !visible)}
                    aria-label={showApiKey ? "Hide API key" : "Show API key"}
                    title={showApiKey ? "Hide API key" : "Show API key"}
                    className="grid h-11 w-11 place-items-center text-[#76566d] transition-colors hover:text-[#62485c]"
                  >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <details className="group mt-3 border-l-2 border-[#ac7b9e] pl-4 text-sm text-[#76566d]">
                <summary className="cursor-pointer font-black text-[#62485c]">
                  Get a free HenrikDev key
                </summary>
                <ol className="mt-3 space-y-2 pl-5 font-bold">
                  <li className="list-decimal">Open the HenrikDev management dashboard.</li>
                  <li className="list-decimal">Choose API Keys from the sidebar.</li>
                  <li className="list-decimal">Complete Generate New Key, then copy the key.</li>
                </ol>
                <a
                  href="https://api.henrikdev.xyz/dashboard/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-black text-[#62485c] underline decoration-[#ac7b9e] decoration-2 underline-offset-4"
                >
                  Open HenrikDev dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-3 text-xs font-bold leading-relaxed text-[#8d6881]">
                  Your key is not stored by this site. It stays in the private # section of your
                  copied OBS URL and is forwarded only when the widget requests your stats.
                </p>
              </details>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#7c5b72]">
                Riot ID
              </span>
              <div className="flex border-b-2 border-[#62485c] pb-2">
                <input
                  value={riotId}
                  onChange={(event) => {
                    setRiotId(event.target.value);
                    setError(null);
                  }}
                  placeholder="Name#TAG"
                  spellCheck={false}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-1 py-2 text-lg font-extrabold tracking-normal text-[#62485c] outline-none placeholder:text-[#b99aae]"
                />
                <button
                  type="submit"
                  disabled={loading || !riotId || !hasApiKey}
                  aria-label="Load player"
                  title="Load player"
                  className="grid h-11 w-11 place-items-center rounded-md bg-[#62485c] text-[#fefefe] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                >
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && (
                <span className="mt-2 block text-sm font-bold text-[#9c3f6f]">{error}</span>
              )}
            </label>

            <fieldset>
              <legend className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#7c5b72]">
                Platform
              </legend>
              <div className="grid grid-cols-2 gap-1 rounded-md bg-[#eadde6] p-1">
                {(["pc", "console"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPlatform(value)}
                    className="rounded px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition-colors"
                    style={{
                      background: platform === value ? "#ac7b9e" : "transparent",
                      color: platform === value ? "#fefefe" : "#76566d",
                    }}
                  >
                    {value === "pc" ? "PC" : "Console"}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#7c5b72]">
                Theme
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(["default", "halloween"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    aria-pressed={theme === value}
                    className="rounded-md border-2 px-3 py-2.5 text-sm font-black transition-colors"
                    style={{
                      borderColor: theme === value ? "#62485c" : "#d8c4d2",
                      background: theme === value ? "#62485c" : "#fffafd",
                      color: theme === value ? "#fefefe" : "#76566d",
                    }}
                  >
                    {value === "default" ? "Pastel" : "🎃 Halloween"}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#7c5b72]">
                Color
              </legend>
              <div className="grid grid-cols-5 gap-2">
                {PASTEL_PALETTE_IDS.map((paletteId) => {
                  const option = PASTEL_PALETTES[paletteId];
                  const selected = palette === paletteId;

                  return (
                    <button
                      key={paletteId}
                      type="button"
                      onClick={() => setPalette(paletteId)}
                      aria-label={`${option.label} palette`}
                      aria-pressed={selected}
                      title={option.label}
                      className="group grid min-w-0 place-items-center gap-2 text-[10px] font-black uppercase tracking-normal text-[#76566d]"
                    >
                      <span
                        className="relative block aspect-square w-full max-w-12 rounded-full border-4 transition-transform group-hover:-translate-y-0.5"
                        style={{
                          background: option.surface,
                          borderColor: option.border,
                          boxShadow: selected
                            ? `0 0 0 3px #f7f2f6, 0 0 0 5px ${option.accent}`
                            : "none",
                        }}
                      >
                        {selected && (
                          <Check className="absolute inset-0 m-auto h-5 w-5 text-[#fefefe]" />
                        )}
                      </span>
                      <span className="max-w-full truncate">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </form>

          <div className="mt-9 border-t border-[#d8c4d2] pt-7">
            <div className="mb-3 grid grid-cols-2 gap-6">
              <SourceDetail label="Browser width" value={SOURCE_SIZE.width} />
              <SourceDetail label="Browser height" value={SOURCE_SIZE.height} />
            </div>
            <div className="flex items-stretch gap-2">
              <input
                readOnly
                value={displayedWidgetUrl}
                aria-label="OBS browser source URL"
                className="min-w-0 flex-1 truncate rounded-md border border-[#d8c4d2] bg-[#fffafd] px-3 text-sm font-bold text-[#8a6a80] outline-none"
              />
              <button
                type="button"
                onClick={copyWidgetUrl}
                disabled={!isValidId || !hasApiKey}
                aria-label="Copy browser source URL"
                title="Copy browser source URL"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#62485c] text-[#fefefe] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </section>

        <section
          className="relative flex min-h-[520px] items-center justify-center overflow-hidden px-5 py-16 transition-colors duration-300 sm:px-12"
          style={{ background: selectedPalette.preview }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `radial-gradient(${selectedPalette.dot} 1px, transparent 1px)`,
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative flex w-full max-w-[560px] flex-col items-center">
            <div className="mb-7 self-start text-xs font-black uppercase tracking-[0.16em] text-[#76566d]">
              Live preview
            </div>
            <div className="flex min-h-[300px] w-full items-center justify-center overflow-auto rounded-md border border-[#b18aa5] bg-[#fffafd]/90 px-6 py-14 shadow-[0_22px_50px_rgba(98,72,92,0.13)]">
              <div className="shrink-0 scale-[0.78] sm:scale-100">
                <PastelRankWidget stats={stats} palette={palette} theme={theme} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SourceDetail({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8d6881]">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black tabular-nums text-[#62485c]">{value}px</div>
    </div>
  );
}
