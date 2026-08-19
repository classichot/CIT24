"use client";

import { useStore } from "@/lib/store";

const OPTS = [
  { id: "en" as const, label: "EN" },
  { id: "th" as const, label: "ไทย" },
  { id: "zh" as const, label: "中文" },
  { id: "ja" as const, label: "日本語" },
];

export function LangToggle() {
  const { lang, setLang } = useStore();
  return (
    <div className="seg" role="group" aria-label="Language">
      {OPTS.map((o) => (
        <label key={o.id} className="seg-opt">
          <input type="radio" name="lang" checked={lang === o.id} onChange={() => setLang(o.id)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
