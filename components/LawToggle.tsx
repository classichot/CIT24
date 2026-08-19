"use client";

import { useStore } from "@/lib/store";
import { T } from "@/lib/i18n";
import type { LawMode } from "@/lib/model";

const OPTS: { id: LawMode; en: string; th: string; zh: string; ja: string }[] = [
  { id: "compliance", en: "Compliance", th: "เกณฑ์ขั้นต่ำ", zh: "合规", ja: "コンプライアンス" },
  { id: "complex", en: "Complex", th: "ครบทุกกฎหมาย", zh: "完整", ja: "コンプレックス" },
];

export function LawToggle() {
  const { lawMode, setLawMode } = useStore();
  return (
    <div className="seg" role="group" aria-label="Law depth">
      {OPTS.map((o) => (
        <label key={o.id} className="seg-opt" title={o.en}>
          <input type="radio" name="law" checked={lawMode === o.id} onChange={() => setLawMode(o.id)} />
          <span><T en={o.en} th={o.th} zh={o.zh} ja={o.ja} /></span>
        </label>
      ))}
    </div>
  );
}
