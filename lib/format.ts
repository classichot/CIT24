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
      "--color-bg": "#f4f3f8",
      "--color-surface": "#eceaf2",
      "--color-text": "#1b1924",
      "--color-divider": "color-mix(in srgb, #1b1924 36%, transparent)",
      "--color-accent": "#6D28D9",
      "--color-accent-100": "#F5F3FF",
      "--color-accent-200": "#EDE9FE",
      "--color-accent-300": "#DDD6FE",
      "--color-accent-400": "#C4B5FD",
      "--color-accent-500": "#A78BFA",
      "--color-accent-600": "#5B21B6",
      "--color-accent-700": "#4C1D95",
      "--color-accent-800": "#4C1D95",
      "--color-accent-900": "#2E1065",
      "--color-neutral-100": "#f7f6fa",
      "--color-neutral-200": "#eeebf3",
      "--color-neutral-300": "#d8d4e0",
      "--color-neutral-400": "#b8b3c2",
      "--color-neutral-500": "#918c9b",
      "--color-neutral-600": "#726d7c",
      "--color-neutral-700": "#55515e",
      "--color-neutral-800": "#3a3744",
      "--color-neutral-900": "#24222c",
      "--color-hot": "#9f1239",
      "--color-warn": "#b45309",
      "--color-ok": "#6D28D9",
      "--sig-red": "#b91c1c",
      "--sig-amber": "#b45309",
      "--color-signal": "#b91c1c",
      "--color-signal-200": "color-mix(in oklab, #b91c1c 18%, #f4f3f8)",
      "--color-signal-400": "color-mix(in oklab, #b91c1c 48%, #f4f3f8)",
      "--color-signal-700": "color-mix(in oklab, #b91c1c 72%, #1b1924)",
      "--color-on-accent": "#ffffff",
      "--shadow-md": "0 3px 10px color-mix(in srgb, #1b1924 14%, transparent)",
      "--shadow-lg": "0 12px 32px color-mix(in srgb, #1b1924 20%, transparent)",
    },
  },
  dark: {
    name: "Dark",
    scheme: "dark",
    vars: {
      "--color-bg": "#14121a",
      "--color-surface": "#1c1924",
      "--color-text": "#f4f1fa",
      "--color-divider": "color-mix(in srgb, #f4f1fa 20%, transparent)",
      "--color-accent": "#C4B5FD",
      "--color-accent-100": "#2E1065",
      "--color-accent-200": "#3B0764",
      "--color-accent-300": "#4C1D95",
      "--color-accent-400": "#6D28D9",
      "--color-accent-500": "#A78BFA",
      "--color-accent-600": "#C4B5FD",
      "--color-accent-700": "#DDD6FE",
      "--color-accent-800": "#EDE9FE",
      "--color-accent-900": "#F5F3FF",
      "--color-neutral-100": "#1c1924",
      "--color-neutral-200": "#242030",
      "--color-neutral-300": "#322c40",
      "--color-neutral-400": "#4a4458",
      "--color-neutral-500": "#6e687c",
      "--color-neutral-600": "#9b95a8",
      "--color-neutral-700": "#c4bfce",
      "--color-neutral-800": "#ddd8e6",
      "--color-neutral-900": "#f4f1fa",
      "--color-hot": "#fb7185",
      "--color-warn": "#f59e0b",
      "--color-ok": "#C4B5FD",
      "--sig-red": "#f87171",
      "--sig-amber": "#fbbf24",
      "--color-signal": "#f87171",
      "--color-signal-200": "color-mix(in oklab, #f87171 22%, #14121a)",
      "--color-signal-400": "color-mix(in oklab, #f87171 50%, #14121a)",
      "--color-signal-700": "#fecaca",
      "--color-on-accent": "#14121a",
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
