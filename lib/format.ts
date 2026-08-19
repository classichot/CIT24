export function thb(n: number, compact = false) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (compact) {
    if (abs >= 1_000_000_000) return `${sign}฿${(abs / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${sign}฿${(abs / 1_000_000).toFixed(1)}m`;
  }
  return `${sign}${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function F(v: number, dashZero = false) {
  if (v === 0 && dashZero) return "—";
  const n = Math.round(Math.abs(v)).toLocaleString("en-US");
  return v < 0 ? `(${n})` : n;
}

export function pct(n: number, digits = 1) {
  return `${(n * 100).toFixed(digits)}%`;
}

export function money(n: number) {
  return Math.round(n);
}

export type ThemeKey = "light" | "dark" | "bw";

export const THEMES = {
  light: {
    name: "Light",
    scheme: "light",
    vars: {
      "--color-bg": "#f3f2f2",
      "--color-surface": "#eae9e9",
      "--color-text": "#201e1d",
      "--color-divider": "color-mix(in srgb, #201e1d 40%, transparent)",
      "--color-accent": "#ec3013",
      "--color-accent-100": "#fff2ef",
      "--color-accent-200": "#ffe0d9",
      "--color-accent-300": "#ffc4b8",
      "--color-accent-400": "#ff9783",
      "--color-accent-500": "#ff563c",
      "--color-accent-600": "#dd2b0f",
      "--color-accent-700": "#ae1800",
      "--color-accent-800": "#7c1405",
      "--color-accent-900": "#4d170e",
      "--color-neutral-100": "#f8f4f4",
      "--color-neutral-200": "#eae7e7",
      "--color-neutral-300": "#d7d3d3",
      "--color-neutral-400": "#bab6b6",
      "--color-neutral-500": "#9b9797",
      "--color-neutral-600": "#7d7979",
      "--color-neutral-700": "#605d5d",
      "--color-neutral-800": "#444141",
      "--color-neutral-900": "#2d2b2b",
      "--color-hot": "#ae1800",
      "--color-warn": "#dd2b0f",
      "--color-ok": "#ec3013",
      "--sig-red": "#ec3013",
      "--sig-amber": "#dd2b0f",
      "--color-signal": "#ec3013",
      "--color-signal-200": "color-mix(in oklab, #ec3013 24%, #f3f2f2)",
      "--color-signal-400": "color-mix(in oklab, #ec3013 60%, #f3f2f2)",
      "--color-signal-700": "color-mix(in oklab, #ec3013 70%, #201e1d)",
      "--color-on-accent": "#ffffff",
      "--shadow-md": "0 3px 10px color-mix(in srgb, #2d2b2b 16%, transparent)",
      "--shadow-lg": "0 12px 32px color-mix(in srgb, #2d2b2b 22%, transparent)",
    },
  },
  dark: {
    name: "Dark",
    scheme: "dark",
    vars: {
      "--color-bg": "#141211",
      "--color-surface": "#1c1918",
      "--color-text": "#f3f0ee",
      "--color-divider": "color-mix(in srgb, #f3f0ee 22%, transparent)",
      "--color-accent": "#ff563c",
      "--color-accent-100": "#2a1612",
      "--color-accent-200": "#3a1c16",
      "--color-accent-300": "#5a261c",
      "--color-accent-400": "#ae1800",
      "--color-accent-500": "#ff563c",
      "--color-accent-600": "#ff9783",
      "--color-accent-700": "#ffc4b8",
      "--color-accent-800": "#ffe0d9",
      "--color-accent-900": "#fff2ef",
      "--color-neutral-100": "#1c1918",
      "--color-neutral-200": "#242120",
      "--color-neutral-300": "#322e2c",
      "--color-neutral-400": "#4a4543",
      "--color-neutral-500": "#6e6866",
      "--color-neutral-600": "#9b9593",
      "--color-neutral-700": "#c4bfbc",
      "--color-neutral-800": "#ddd8d5",
      "--color-neutral-900": "#f3f0ee",
      "--color-hot": "#ff9783",
      "--color-warn": "#ff563c",
      "--color-ok": "#ff563c",
      "--sig-red": "#ff563c",
      "--sig-amber": "#ff9783",
      "--color-signal": "#ff563c",
      "--color-signal-200": "color-mix(in oklab, #ff563c 24%, #141211)",
      "--color-signal-400": "color-mix(in oklab, #ff563c 60%, #141211)",
      "--color-signal-700": "#ffc4b8",
      "--color-on-accent": "#141211",
      "--shadow-md": "0 3px 10px color-mix(in srgb, #000 40%, transparent)",
      "--shadow-lg": "0 12px 32px color-mix(in srgb, #000 50%, transparent)",
    },
  },
  bw: {
    name: "B/W",
    scheme: "light",
    vars: {
      "--color-bg": "#ffffff",
      "--color-surface": "#f3f3f3",
      "--color-text": "#111111",
      "--color-divider": "color-mix(in srgb, #111111 22%, transparent)",
      "--color-accent": "#111111",
      "--color-accent-100": "#f2f2f2",
      "--color-accent-200": "#e4e4e4",
      "--color-accent-300": "#c8c8c8",
      "--color-accent-400": "#9a9a9a",
      "--color-accent-500": "#6a6a6a",
      "--color-accent-600": "#2c2c2c",
      "--color-accent-700": "#1a1a1a",
      "--color-accent-800": "#111111",
      "--color-accent-900": "#000000",
      "--color-neutral-100": "#f7f7f7",
      "--color-neutral-200": "#ececec",
      "--color-neutral-300": "#d6d6d6",
      "--color-neutral-400": "#b3b3b3",
      "--color-neutral-500": "#8f8f8f",
      "--color-neutral-600": "#6e6e6e",
      "--color-neutral-700": "#525252",
      "--color-neutral-800": "#333333",
      "--color-neutral-900": "#111111",
      "--color-hot": "#000000",
      "--color-warn": "#6e6e6e",
      "--color-ok": "#111111",
      "--sig-red": "#000000",
      "--sig-amber": "#6e6e6e",
      "--color-signal": "#111111",
      "--color-signal-200": "#ececec",
      "--color-signal-400": "#b3b3b3",
      "--color-signal-700": "#111111",
      "--color-on-accent": "#ffffff",
      "--shadow-md": "0 3px 10px color-mix(in srgb, #111 16%, transparent)",
      "--shadow-lg": "0 12px 32px color-mix(in srgb, #111 22%, transparent)",
    },
  },
} as const;

export function normalizeTheme(v: string | null): ThemeKey {
  if (v === "dark" || v === "bw" || v === "light") return v;
  return "light";
}
