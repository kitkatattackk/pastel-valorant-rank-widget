// Halloween theme: always-on ambient motion.
// Everything here is decorative (pointer-events: none) and loops cleanly for
// long stream sessions. Honors prefers-reduced-motion.
import { useId } from "react";

export type HalloweenSize = "lg" | "md" | "sm" | "xs";

const CREEPSTER_URL = "https://fonts.googleapis.com/css2?family=Creepster&display=block";

const BAT_PATH =
  "M12 7c-.9-1.6-2.3-2.2-3.4-1.6.4.6.4 1.4-.2 1.9C7.3 6.3 5.2 6 3.5 6.9 2.1 7.6 1 9 0 11c1.4-.8 2.7-.9 3.8-.3.2-1 1-1.6 2-1.4-.2.9.2 1.7 1 2.1.4-.9 1.4-1.3 2.3-.9.6.3 1 .9 1.1 1.5.4-.4.7-.4 1.1 0 .1-.6.5-1.2 1.1-1.5.9-.4 1.9 0 2.3.9.8-.4 1.2-1.2 1-2.1 1-.2 1.8.4 2 1.4 1.1-.6 2.4-.5 3.8.3-1-2-2.1-3.4-3.5-4.1-1.7-.9-3.8-.6-4.9.4-.6-.5-.6-1.3-.2-1.9-1.1-.6-2.5 0-3.4 1.6z";
type GhostMood = "sly" | "scared";

const GHOST_TINTS = {
  lavender: { light: "#ffffff", mid: "#ebe3fb", shade: "#c3b1e6", ink: "#5b4683" },
  toxic: { light: "#f7fff0", mid: "#d9f7c6", shade: "#98d97a", ink: "#2f5a22" },
} as const;

/**
 * Illustrated ghost: outlined sheet with an uneven hem and tail wisp, shaded
 * volume, stubby arms, and a face that matches the moment.
 */
function Ghost({
  mood,
  tint = "lavender",
  className,
  style,
}: {
  mood: GhostMood;
  tint?: keyof typeof GHOST_TINTS;
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const c = GHOST_TINTS[tint];
  const body =
    "M24 3.5C14.2 3.4 8.3 10.6 8.1 20.6L7.6 38.4C7.4 42.6 6.3 45.6 4.2 48.6C7.4 49.4 10 48.3 11.9 46.2C12.8 50 15.2 52.3 18.3 52C19.3 49.2 20.9 47.3 23.2 47.1C24.4 50.7 26.9 52.8 30.1 52.1C30.7 49.1 32.3 47.3 34.4 47.2C36.2 50.3 39.6 52.1 43.4 51.3C45.9 50.7 47 48.4 45.9 45.8C44.2 47.3 42.3 47.4 41.2 45.9C40.4 43.6 40.3 40.8 40.3 38.2L40.1 20.4C39.8 10.4 33.7 3.6 24 3.5Z";
  return (
    <svg viewBox="0 0 48 56" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}g`} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.55" stopColor={c.mid} />
          <stop offset="1" stopColor={c.shade} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={body} />
        </clipPath>
      </defs>
      <g className="hw-ghost-sway">
        {/* back arm */}
        <path
          d="M39.5 24.5C43.5 25.3 46.2 28.2 46.4 31.6C46.5 33.4 44.6 34 43.5 32.7C42.4 31 41.2 29.8 39.6 29.2"
          fill={c.mid}
          stroke={c.ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d={body} fill={`url(#${id}g)`} />
        <g clipPath={`url(#${id}c)`}>
          {/* shadow side and hem shading */}
          <path
            d="M33 4C40 9 42.5 18 41.5 30C40.8 40 42 46 46 50L48 56H30C35 44 36.5 22 33 4Z"
            fill={c.shade}
            opacity="0.55"
          />
          <path
            d="M0 44C10 47 18 44.5 24 45.5C31 46.6 38 48 48 44V56H0Z"
            fill={c.shade}
            opacity="0.45"
          />
          {/* rim highlight */}
          <path
            d="M13.5 12C15.5 8.4 18.8 6.5 22.5 6.1"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
        <path d={body} fill="none" stroke={c.ink} strokeWidth="1.6" strokeLinejoin="round" />
        {/* front arm */}
        <path
          d="M9.2 25.8C5.6 26.9 3 29.8 2.9 33.1C2.8 34.9 4.8 35.4 5.8 34C6.8 32.2 8 31 9.4 30.5"
          fill={c.light}
          stroke={c.ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <GhostFace mood={mood} ink={c.ink} />
      </g>
    </svg>
  );
}

function GhostFace({ mood, ink }: { mood: GhostMood; ink: string }) {
  const eye = "#1b1026";
  if (mood === "scared") {
    return (
      <g>
        <g className="hw-ghost-blink">
          <ellipse cx="18.2" cy="20" rx="3.6" ry="4.6" fill={eye} />
          <ellipse cx="29.8" cy="20" rx="3.6" ry="4.6" fill={eye} />
          <circle cx="17.2" cy="18.4" r="1.2" fill="#fff" />
          <circle cx="28.8" cy="18.4" r="1.2" fill="#fff" />
        </g>
        <path
          d="M14.4 15.2l5-2.2M33.6 15.2l-5-2.2"
          stroke={ink}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M24 26.2c-3 0-4.6 2.6-4.3 5.6.3 2.8 2.1 4.6 4.3 4.6s4-1.8 4.3-4.6c.3-3-1.3-5.6-4.3-5.6z"
          fill={eye}
        />
        <path
          d="M21.2 33.4c1.7-1 3.9-1 5.6 0"
          fill="none"
          stroke="#b5475b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    );
  }
  // sly: half-lidded side-eye, raised brow, fanged grin
  return (
    <g>
      <g className="hw-ghost-blink">
        <ellipse cx="18.4" cy="20.4" rx="3.1" ry="3.9" fill={eye} />
        <ellipse cx="30" cy="20.4" rx="3.1" ry="3.9" fill={eye} />
        <circle cx="19.6" cy="19.2" r="1.1" fill="#fff" />
        <circle cx="31.2" cy="19.2" r="1.1" fill="#fff" />
      </g>
      {/* heavy lids */}
      <path
        d="M14.8 19.2c1.4-2.6 5.8-2.8 7.4-.3zM26.4 18.9c1.6-2.5 6-2.3 7.3.4z"
        fill="#ebe3fb"
        stroke={ink}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14.6 14.8l6.2-.6M27 13.2l6.2 1.8"
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="13.6" cy="26" rx="2.4" ry="1.3" fill="#ff9fb4" opacity="0.6" />
      <ellipse cx="34.6" cy="26" rx="2.4" ry="1.3" fill="#ff9fb4" opacity="0.6" />
      <path
        d="M18.6 27c2.6 3.4 8.4 3.6 11.6-.8"
        fill="none"
        stroke={eye}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M26.2 29.1l.9 2.3 1-2.8z"
        fill="#fff"
        stroke={eye}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </g>
  );
}

type AmbientConfig = {
  web: number;
  spider: number | null; // thread length (px), null = no spider
  bats: Array<{ top: number; w: number; dur: number; delay: number }>;
  embers: number;
};

const AMBIENT: Record<HalloweenSize, AmbientConfig> = {
  md: {
    web: 74,
    spider: 22,
    bats: [
      { top: 6, w: 16, dur: 12, delay: -1 },
      { top: 18, w: 11, dur: 15, delay: -8 },
    ],
    embers: 6,
  },
  lg: {
    web: 92,
    spider: 30,
    bats: [
      { top: 8, w: 20, dur: 11, delay: 0 },
      { top: 22, w: 13, dur: 14, delay: -6 },
      { top: 4, w: 10, dur: 17, delay: -11 },
    ],
    embers: 7,
  },
  sm: {
    web: 64,
    spider: 18,
    bats: [
      { top: 5, w: 15, dur: 12, delay: -2 },
      { top: 16, w: 10, dur: 16, delay: -9 },
    ],
    embers: 5,
  },
  xs: {
    web: 40,
    spider: null,
    bats: [{ top: 3, w: 10, dur: 13, delay: -4 }],
    embers: 3,
  },
};

// Fixed pseudo-random spread so every render (and every browser source) matches.
const EMBERS = [
  { x: 12, d: 6.2, delay: 0, s: 3 },
  { x: 71, d: 7.4, delay: -2.1, s: 2 },
  { x: 38, d: 5.6, delay: -4.3, s: 2.5 },
  { x: 88, d: 6.8, delay: -1.2, s: 2 },
  { x: 55, d: 7.9, delay: -5.6, s: 3 },
  { x: 24, d: 6.5, delay: -3.4, s: 2 },
  { x: 64, d: 5.9, delay: -0.7, s: 2.5 },
];

/** Always-on ambient layer. Place it inside the card, before the content. */
export function HalloweenDecor({ size }: { size: HalloweenSize }) {
  const cfg = AMBIENT[size];
  return (
    <div aria-hidden className="hw-ambient pointer-events-none absolute inset-0 overflow-hidden">
      <link rel="stylesheet" href={CREEPSTER_URL} precedence="default" />
      <div className="hw-flicker absolute inset-0" />
      <div className="hw-fog absolute" />
      {EMBERS.slice(0, cfg.embers).map((e, i) => (
        <span
          key={i}
          className="hw-ember absolute"
          style={{
            left: `${e.x}%`,
            width: e.s,
            height: e.s,
            animationDuration: `${e.d}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
      {cfg.bats.map((bat, i) => (
        <div
          key={i}
          className="hw-bat-fly absolute"
          style={{
            top: bat.top,
            animationDuration: `${bat.dur}s`,
            animationDelay: `${bat.delay}s`,
          }}
        >
          <div className="hw-bat-bob" style={{ animationDelay: `${bat.delay}s` }}>
            <svg
              viewBox="0 0 24 13"
              className="hw-bat-flap"
              style={{ width: bat.w, display: "block" }}
            >
              <path d={BAT_PATH} fill="#0b0612" />
            </svg>
          </div>
        </div>
      ))}
      <Cobweb size={cfg.web} />
      {cfg.spider != null && (
        <div className="hw-spider absolute" style={{ right: cfg.web * 0.3, top: 0 }}>
          <span className="hw-thread" style={{ height: cfg.spider }} />
          <svg viewBox="0 0 20 16" style={{ width: size === "lg" ? 12 : 9, display: "block" }}>
            <g stroke="#0b0612" strokeWidth="1.4" strokeLinecap="round">
              <path d="M7 8 2 4M7 9 1 9M7 10l-5 4M13 8l5-4M13 9h6M13 10l5 4" />
            </g>
            <ellipse cx="10" cy="9" rx="4" ry="4.6" fill="#0b0612" />
            <circle cx="8.6" cy="8" r=".8" fill="#ff7a1a" />
            <circle cx="11.4" cy="8" r=".8" fill="#ff7a1a" />
          </svg>
        </div>
      )}
      <style>{HALLOWEEN_CSS}</style>
    </div>
  );
}

function Cobweb({ size }: { size: number }) {
  const spokes = [0, 22.5, 45, 67.5, 90];
  const rings = [0.34, 0.6, 0.86];
  const point = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [100 - r * 100 * Math.cos(a), r * 100 * Math.sin(a)];
  };
  return (
    <svg
      viewBox="0 0 100 100"
      className="hw-web absolute right-0 top-0"
      style={{ width: size, height: size }}
      fill="none"
      stroke="var(--foreground)"
      strokeWidth={1.4}
      strokeLinecap="round"
    >
      {spokes.map((deg) => {
        const [x, y] = point(1, deg);
        return <line key={deg} x1={100} y1={0} x2={x} y2={y} />;
      })}
      {rings.map((r) => (
        <path
          key={r}
          d={spokes
            .slice(1)
            .map((deg, i) => {
              const [x0, y0] = point(r, spokes[i]);
              const [x1, y1] = point(r, deg);
              const [cx, cy] = point(r * 0.86, (spokes[i] + deg) / 2);
              return `${i === 0 ? `M${x0} ${y0}` : ""} Q${cx} ${cy} ${x1} ${y1}`;
            })
            .join(" ")}
        />
      ))}
    </svg>
  );
}

/** Jack-o'-lantern with a flickering candle-lit face. */
export function PumpkinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 6.2c.2-1.6 1-2.7 2.4-3.2"
        fill="none"
        stroke="#6fbf4a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 6.5c-1.2-.9-3.4-1.1-5.3-.2C3.9 7.6 2.6 10.6 3 14c.4 3.5 2.8 6 5.7 6 1.2 0 2.3-.4 3.3-1 1 .6 2.1 1 3.3 1 2.9 0 5.3-2.5 5.7-6 .4-3.4-.9-6.4-3.7-7.7-1.9-.9-4.1-.7-5.3.2z"
        fill="currentColor"
      />
      <path
        className="hw-pumpkin-face"
        d="M8.6 11.4l1.6 1.6-2.2.5zM15.4 11.4l-1.6 1.6 2.2.5zM8.2 15.6c1.2 1 2.4 1.4 3.8 1.4s2.6-.4 3.8-1.4l-1 .2-.9.8-.9-.6-1 .6-1-.6-.9.6-.9-.8z"
        fill="#ffd35c"
      />
      <style>{`
        .hw-pumpkin-face { animation: hwCandle 2.6s steps(1, end) infinite; }
        @keyframes hwCandle {
          0%, 100% { fill: #ffd35c; } 18% { fill: #ffb020; } 22% { fill: #ffe38a; }
          47% { fill: #ffc23d; } 63% { fill: #ff9d1a; } 68% { fill: #ffd35c; } 86% { fill: #ffe9a3; }
        }
        @media (prefers-reduced-motion: reduce) { .hw-pumpkin-face { animation: none; } }
      `}</style>
    </svg>
  );
}

const HEIST: Record<HalloweenSize, { ghost: number; x: number }> = {
  md: { ghost: 40, x: -130 },
  lg: { ghost: 58, x: -190 },
  sm: { ghost: 42, x: -140 },
  xs: { ghost: 32, x: -100 },
};

/**
 * Every ~24s a ghost swoops in, steals the rank emblem off the card, and brings
 * it back a few seconds later. Wrap the RankIcon with it.
 */
export function HalloweenHeist({
  size,
  children,
}: {
  size: HalloweenSize;
  children: React.ReactNode;
}) {
  const { ghost, x } = HEIST[size];
  return (
    <div className="hw-heist relative" style={{ "--hx": `${x}px` } as React.CSSProperties}>
      <div
        aria-hidden
        className="hw-heist-slot absolute inset-0 m-auto flex items-center justify-center rounded-full"
        style={{ width: "70%", height: "70%", fontSize: ghost * 0.5 }}
      >
        ?
      </div>
      <div className="hw-heist-emblem">{children}</div>
      <Ghost
        mood="sly"
        className="hw-heist-ghost absolute"
        style={{ width: ghost, left: "50%", marginLeft: -ghost / 2, top: -ghost * 0.62 }}
      />
    </div>
  );
}

/** Candy-corn stripes that crawl along a filled RR bar. Place inside the fill. */
export function HalloweenBarFx() {
  return (
    <span
      aria-hidden
      className="hw-bar-stripes pointer-events-none absolute inset-0 rounded-full"
    />
  );
}

const HALLOWEEN_CSS = `
/* ---------- ambient ---------- */
.hw-flicker {
  background: radial-gradient(circle at 30% 0%, rgba(255, 140, 40, 0.3), transparent 58%);
  animation: hwFlicker 3.4s steps(1, end) infinite;
}
@keyframes hwFlicker {
  0%, 100% { opacity: .55; } 9% { opacity: .9; } 12% { opacity: .45; } 27% { opacity: .75; }
  41% { opacity: .5; } 44% { opacity: 1; } 58% { opacity: .65; } 73% { opacity: .85; } 88% { opacity: .5; }
}
.hw-fog {
  left: -40%; bottom: -18%; width: 180%; height: 55%;
  background:
    radial-gradient(ellipse 22% 40% at 20% 60%, rgba(200, 180, 235, 0.22), transparent 70%),
    radial-gradient(ellipse 26% 45% at 55% 70%, rgba(200, 180, 235, 0.18), transparent 70%),
    radial-gradient(ellipse 20% 38% at 85% 55%, rgba(200, 180, 235, 0.2), transparent 70%);
  filter: blur(6px);
  animation: hwFog 18s ease-in-out infinite alternate;
}
@keyframes hwFog { from { transform: translateX(0); } to { transform: translateX(22%); } }
.hw-ember {
  bottom: -6px; border-radius: 9999px;
  background: #ffb347; box-shadow: 0 0 6px 1px rgba(255, 140, 40, 0.8);
  animation-name: hwEmber; animation-timing-function: linear; animation-iteration-count: infinite;
}
@keyframes hwEmber {
  0% { transform: translate(0, 0); opacity: 0; }
  12% { opacity: .9; }
  50% { transform: translate(6px, -60px); }
  85% { opacity: .5; }
  100% { transform: translate(-4px, -130px); opacity: 0; }
}
.hw-bat-fly { left: -12%; animation-name: hwBatFly; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes hwBatFly { from { left: -12%; } to { left: 112%; } }
.hw-bat-bob { animation: hwBatBob 1.6s ease-in-out infinite alternate; }
@keyframes hwBatBob { from { transform: translateY(-3px) rotate(-6deg); } to { transform: translateY(4px) rotate(5deg); } }
.hw-bat-flap { transform-origin: 50% 60%; animation: hwFlap .22s ease-in-out infinite alternate; }
@keyframes hwFlap { from { transform: scaleY(1); } to { transform: scaleY(.35); } }
.hw-web { opacity: .2; }
.hw-spider { display: flex; flex-direction: column; align-items: center; transform-origin: top center;
  animation: hwSpider 5.5s ease-in-out infinite; }
.hw-thread { display: block; width: 1px; background: rgba(247, 239, 228, 0.35); }
@keyframes hwSpider {
  0%, 100% { transform: translateY(-40%) rotate(0deg); }
  45% { transform: translateY(0) rotate(4deg); }
  60% { transform: translateY(-8%) rotate(-3deg); }
}
.hw-float { animation: hwFloat 3.6s ease-in-out infinite; }
@keyframes hwFloat { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-4px) rotate(1.5deg); } }
.hw-bar-stripes {
  background: repeating-linear-gradient(115deg, rgba(255, 244, 214, .5) 0 5px, transparent 5px 10px, rgba(255, 255, 255, 0) 10px 14px);
  background-size: 28px 100%;
  mix-blend-mode: soft-light;
  animation: hwStripes 1.2s linear infinite;
}
@keyframes hwStripes { from { background-position: 0 0; } to { background-position: 28px 0; } }

/* ---------- ghost character ---------- */
.hw-ghost-sway { transform-origin: 50% 15%; animation: hwSway 1.5s ease-in-out infinite alternate; }
@keyframes hwSway { from { transform: rotate(-3deg) skewX(2deg); } to { transform: rotate(3deg) skewX(-2deg); } }
.hw-ghost-blink { transform-box: fill-box; transform-origin: center; animation: hwBlink 4.6s infinite; }
@keyframes hwBlink { 0%, 90%, 100% { transform: scaleY(1); } 93% { transform: scaleY(.12); } 96% { transform: scaleY(1); } }

/* ---------- ghost heist (24s loop) ---------- */
.hw-heist-ghost, .hw-heist-emblem, .hw-heist-slot {
  animation-duration: 24s; animation-iteration-count: infinite; animation-delay: -4s;
  animation-timing-function: ease-in-out;
}
.hw-heist-emblem { position: relative; animation-name: hwHeistEmblem; }
.hw-heist-ghost { z-index: 2; opacity: 0; animation-name: hwHeistGhost; filter: drop-shadow(0 0 8px rgba(200, 180, 255, .45)); }
.hw-heist-slot {
  opacity: 0; animation-name: hwHeistSlot;
  border: 1.5px dashed rgba(247, 239, 228, .35); color: rgba(247, 239, 228, .55);
  font-family: 'Creepster', 'Impact', sans-serif;
}
@keyframes hwHeistGhost {
  0%, 56% { transform: translate(var(--hx), -20px); opacity: 0; }
  57% { opacity: .95; }
  61% { transform: translate(0, -6px); }
  63% { transform: translate(0, 5px); }
  64.5% { transform: translate(0, 0); opacity: .95; }
  71% { transform: translate(var(--hx), -24px); opacity: .95; }
  72%, 84% { transform: translate(var(--hx), -24px); opacity: 0; }
  85% { opacity: .95; }
  90% { transform: translate(0, 0); }
  92% { transform: translate(0, 5px); }
  95% { transform: translate(calc(var(--hx) * .5), -30px); opacity: .9; }
  98%, 100% { transform: translate(var(--hx), -40px); opacity: 0; }
}
@keyframes hwHeistEmblem {
  0%, 63% { transform: none; }
  64.5% { transform: translate(0, -5px) rotate(-6deg); }
  71%, 84% { transform: translate(var(--hx), -20px) rotate(-18deg); }
  90% { transform: translate(0, 4px) rotate(8deg); }
  92% { transform: translate(0, 4px) rotate(0); }
  93.5% { transform: translate(0, -3px) scale(1.06); }
  95.5%, 100% { transform: none; }
}
@keyframes hwHeistSlot { 0%, 69% { opacity: 0; } 72%, 87% { opacity: 1; } 90%, 100% { opacity: 0; } }
`;
