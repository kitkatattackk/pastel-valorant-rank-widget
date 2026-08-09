export const PASTEL_PALETTES = {
  rose: {
    id: "rose",
    label: "Rose",
    border: "#62485c",
    accent: "#ac7b9e",
    surface: "#d69cc6",
    surfaceGlow: "rgba(255, 231, 248, 0.34)",
    surfaceWash: "rgba(214, 156, 198, 0.18)",
    stats: "rgba(172, 123, 158, 0.34)",
    track: "rgba(98, 72, 92, 0.45)",
    shadow: "rgba(98, 72, 92, 0.34)",
    preview: "#d6b6cc",
    dot: "#8d6881",
  },
  lavender: {
    id: "lavender",
    label: "Lavender",
    border: "#514763",
    accent: "#8e80b4",
    surface: "#c5b7e2",
    surfaceGlow: "rgba(246, 240, 255, 0.4)",
    surfaceWash: "rgba(197, 183, 226, 0.2)",
    stats: "rgba(142, 128, 180, 0.3)",
    track: "rgba(81, 71, 99, 0.42)",
    shadow: "rgba(81, 71, 99, 0.3)",
    preview: "#c9c0e2",
    dot: "#756b91",
  },
  sky: {
    id: "sky",
    label: "Sky",
    border: "#405e69",
    accent: "#78a8b9",
    surface: "#b8dae6",
    surfaceGlow: "rgba(241, 252, 255, 0.42)",
    surfaceWash: "rgba(184, 218, 230, 0.2)",
    stats: "rgba(120, 168, 185, 0.3)",
    track: "rgba(64, 94, 105, 0.42)",
    shadow: "rgba(64, 94, 105, 0.3)",
    preview: "#bdd8e1",
    dot: "#648793",
  },
  mint: {
    id: "mint",
    label: "Mint",
    border: "#46645b",
    accent: "#7eaf9f",
    surface: "#bce0d3",
    surfaceGlow: "rgba(243, 255, 250, 0.42)",
    surfaceWash: "rgba(188, 224, 211, 0.2)",
    stats: "rgba(126, 175, 159, 0.3)",
    track: "rgba(70, 100, 91, 0.42)",
    shadow: "rgba(70, 100, 91, 0.3)",
    preview: "#c2ddd3",
    dot: "#668b7f",
  },
  peach: {
    id: "peach",
    label: "Peach",
    border: "#6a514d",
    accent: "#c58d7d",
    surface: "#efc2b2",
    surfaceGlow: "rgba(255, 248, 240, 0.42)",
    surfaceWash: "rgba(239, 194, 178, 0.2)",
    stats: "rgba(197, 141, 125, 0.3)",
    track: "rgba(106, 81, 77, 0.42)",
    shadow: "rgba(106, 81, 77, 0.3)",
    preview: "#ebc6b9",
    dot: "#997269",
  },
} as const;

export type PastelPaletteId = keyof typeof PASTEL_PALETTES;
export type PastelPalette = (typeof PASTEL_PALETTES)[PastelPaletteId];

export const PASTEL_PALETTE_IDS = Object.keys(PASTEL_PALETTES) as PastelPaletteId[];

export function parsePastelPalette(value: unknown): PastelPaletteId {
  const candidate = String(value ?? "rose") as PastelPaletteId;
  return candidate in PASTEL_PALETTES ? candidate : "rose";
}
