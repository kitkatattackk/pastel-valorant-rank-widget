import type { ValorantStats } from "@/types";
import {
  HALLOWEEN_COLORS,
  PASTEL_PALETTES,
  type PastelColors,
  type PastelPaletteId,
  type PastelTheme,
} from "@/lib/pastel-palettes";
import { HalloweenBarFx, HalloweenDecor, HalloweenHeist, PumpkinIcon } from "@/components/HalloweenDecor";
import { parseRank } from "@/lib/valorant-ranks";

interface Props {
  stats: ValorantStats;
  palette?: PastelPaletteId;
  theme?: PastelTheme;
}

const text = "rgb(254, 254, 254)";
const mutedText = "rgba(254, 254, 254, 0.78)";

export function PastelRankWidget({ stats, palette = "rose", theme = "default" }: Props) {
  const halloween = theme === "halloween";
  const colors: PastelColors = halloween ? HALLOWEEN_COLORS : PASTEL_PALETTES[palette];
  const { rankTier, rr, rrToNext, kd, wins, losses } = stats;
  const rank = parseRank(rankTier);
  const progress = rank.capped ? 100 : Math.min(100, (rr / rrToNext) * 100);
  const winrate = Math.round((wins / Math.max(1, wins + losses)) * 100);

  return (
    <div
      style={{
        width: 420,
        color: text,
        ...(halloween ? ({ "--foreground": "rgb(247 239 228)" } as React.CSSProperties) : null),
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "fit-content",
          minWidth: 214,
          margin: "0 auto -11px",
          padding: "7px 24px 9px",
          borderRadius: 999,
          background: colors.border,
          color: text,
          textAlign: "center",
          fontSize: 18,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: 0,
          boxShadow: `0 10px 28px ${colors.shadow}`,
          position: "relative",
          zIndex: 2,
        }}
      >
        {halloween ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            CURRENT RANK
            <PumpkinIcon className="hw-pill-pumpkin" />
          </span>
        ) : (
          "CURRENT RANK ♥"
        )}
      </div>

      <div
        style={{
          borderRadius: 23,
          border: `6px solid ${colors.border}`,
          background: colors.surface,
          // A drop shadow follows the rounded card silhouette without creating
          // a solid rectangular band under the browser source.
          filter: `drop-shadow(0 9px 16px ${colors.shadow})`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 18% 30%, ${colors.surfaceGlow} 0%, ${colors.surfaceWash} 34%, transparent 62%)`,
          }}
        />
        {halloween && <HalloweenDecor size="md" />}

        <div
          style={{
            position: "relative",
            display: "grid",
            // Keep the rank emblem centered in the full left panel, not in an
            // inset cell created by the card padding.
            gridTemplateColumns: "130px 1fr",
            alignItems: "center",
            gap: 4,
            padding: "15px 22px 14px 0",
          }}
        >
          <div
            style={{
              width: 130,
              height: 96,
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              className={halloween ? "hw-float" : undefined}
              style={{
                width: 92,
                height: 92,
                display: "grid",
                placeItems: "center",
                position: "relative",
                transform: halloween ? undefined : "translateX(-4px)",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 7,
                  borderRadius: 999,
                  background: rank.accent,
                  filter: "blur(22px)",
                  opacity: 0.46,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 20,
                  borderRadius: 999,
                  background: "rgba(254, 254, 254, 0.38)",
                  filter: "blur(12px)",
                  opacity: 0.36,
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  color: rank.accent,
                  fontSize: 9,
                  lineHeight: 1,
                  textShadow: `0 0 8px ${rank.accent}`,
                }}
              >
                ✦
              </span>
              {halloween ? <HalloweenHeist size="md"><img
                src={rank.icon}
                alt={`${rank.label} rank emblem`}
                width={76}
                height={76}
                loading="lazy"
                style={{
                  width: 76,
                  height: 76,
                  objectFit: "contain",
                  position: "relative",
                  filter: [
                    `drop-shadow(0 0 4px ${rank.accent})`,
                    `drop-shadow(0 0 10px ${rank.accent})`,
                    "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.28))",
                  ].join(" "),
                }}
              /></HalloweenHeist> : (<img
                src={rank.icon}
                alt={`${rank.label} rank emblem`}
                width={76}
                height={76}
                loading="lazy"
                style={{
                  width: 76,
                  height: 76,
                  objectFit: "contain",
                  position: "relative",
                  filter: [
                    `drop-shadow(0 0 4px ${rank.accent})`,
                    `drop-shadow(0 0 10px ${rank.accent})`,
                    "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.28))",
                  ].join(" "),
                }}
              />)}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                color: text,
                fontSize: 30,
                fontWeight: 950,
                lineHeight: 1,
                letterSpacing: 0,
                textShadow: "0 2px 0 rgba(0, 0, 0, 0.08)",
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {rank.label.toUpperCase()}
              </span>
              <span style={{ flexShrink: 0, fontSize: 28 }}>{halloween ? <PumpkinIcon className="hw-title-pumpkin" /> : "✦"}</span>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  height: 12,
                  borderRadius: 999,
                  background: colors.track,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    overflow: "hidden",
                    borderRadius: 999,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "-48%",
                      width: "46%",
                      transform: "skewX(-14deg)",
                      background:
                        "linear-gradient(90deg, transparent, rgba(254, 254, 254, 0.36), rgba(254, 254, 254, 0.18), transparent)",
                      animation: "artemisaTrackShimmer 2.6s linear infinite",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: halloween ? "linear-gradient(90deg, #ff8a1f, #ffb347)" : text,
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1,
                    animation: "artemisaProgressFill 900ms ease-out both",
                  }}
                >
                  {halloween && <HalloweenBarFx />}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "-50%",
                      width: "42%",
                      transform: "skewX(-14deg)",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.72), transparent)",
                      opacity: 0.65,
                      animation: "artemisaProgressShimmer 2.4s linear infinite",
                    }}
                  />
                </div>
                <style>
                  {`
                    .hw-pill-pumpkin { width: 18px; height: 18px; color: #ff8a1f; }
                    .hw-title-pumpkin { width: 28px; height: 28px; display: block; color: #ff8a1f; }
                    @keyframes artemisaProgressFill {
                      from { width: 0%; }
                    }

                    @keyframes artemisaProgressShimmer {
                      from { left: -50%; }
                      to { left: 110%; }
                    }

                    @keyframes artemisaTrackShimmer {
                      from { left: -48%; }
                      to { left: 112%; }
                    }
                  `}
                </style>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  fontVariantNumeric: "tabular-nums",
                  color: text,
                }}
              >
                {rank.capped ? "MAX" : `${rr}/${rrToNext}`}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: `4px solid ${colors.border}`,
            background: colors.stats,
          }}
        >
          <Stat
            label={kd == null ? "GAMES" : "K/D"}
            value={kd == null ? wins + losses : kd.toFixed(2)}
            colors={colors}
          />
          <Stat label="W/L" value={`${wins}/${losses}`} colors={colors} />
          <Stat label="WR" value={`${winrate}%`} colors={colors} />
        </div>
      </div>
    </div>
  );
}

// Keep the private client route stable while the design is also offered as a
// standalone product.
export const ArtemisaWidget = PastelRankWidget;

function Stat({
  label,
  value,
  colors,
}: {
  label: string;
  value: React.ReactNode;
  colors: PastelColors;
}) {
  return (
    <div
      style={{
        padding: "10px 8px 12px",
        textAlign: "center",
        borderLeft: label === "K/D" || label === "GAMES" ? "0" : `3px solid ${colors.border}`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          marginRight: 6,
          color: mutedText,
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: text,
          fontSize: 20,
          fontWeight: 950,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
