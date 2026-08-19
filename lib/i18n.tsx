"use client";

import { useStore } from "@/lib/store";
import type { Lang } from "@/lib/model";
import type { ReactNode } from "react";

export type Copy = { en: string; th: string; zh?: string; ja?: string };

export function pick(lang: Lang, o: Copy): string {
  if (lang === "th") return o.th;
  if (lang === "zh") return o.zh ?? o.en;
  if (lang === "ja") return o.ja ?? o.en;
  return o.en;
}

export function T({ en, th, zh, ja }: { en: ReactNode; th: ReactNode; zh?: ReactNode; ja?: ReactNode }) {
  const { lang } = useStore();
  if (lang === "th") return <>{th}</>;
  if (lang === "zh") return <>{zh ?? en}</>;
  if (lang === "ja") return <>{ja ?? en}</>;
  return <>{en}</>;
}

export function tx(lang: Lang, en: string, th: string, zh?: string, ja?: string) {
  return pick(lang, { en, th, zh, ja });
}

/** PND in en/zh/ja; ภ.ง.ด. in Thai. */
export function pnd(lang: Lang, label: string) {
  return lang === "th" ? label.replaceAll("PND", "ภ.ง.ด.") : label.replaceAll("ภ.ง.ด.", "PND");
}

export function adjName(lang: Lang, a: { name: string; nameTh: string }) {
  return lang === "th" ? a.nameTh : a.name;
}
