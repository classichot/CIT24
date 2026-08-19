"use client";

import { useStore } from "@/lib/store";

export function LangToggle() {
  const { lang, setLang } = useStore();
  return (
    <div className="seg" role="group" aria-label="Language">
      <label className="seg-opt">
        <input type="radio" name="lang" checked={lang === "en"} onChange={() => setLang("en")} />
        <span>EN</span>
      </label>
      <label className="seg-opt">
        <input type="radio" name="lang" checked={lang === "th"} onChange={() => setLang("th")} />
        <span>ไทย</span>
      </label>
    </div>
  );
}
