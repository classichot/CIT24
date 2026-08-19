"use client";

import { useStore } from "@/lib/store";
import type { ReactNode } from "react";

export function T({ en, th }: { en: ReactNode; th: ReactNode }) {
  const { lang } = useStore();
  return <>{lang === "th" ? th : en}</>;
}

export function tx(lang: "en" | "th", en: string, th: string) {
  return lang === "th" ? th : en;
}
