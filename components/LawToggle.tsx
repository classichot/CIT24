"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { T } from "@/lib/i18n";
import type { LawMode } from "@/lib/model";

const OPTS: { id: LawMode; en: string; th: string; zh: string; ja: string }[] = [
  { id: "compliance", en: "Compliance", th: "เกณฑ์ขั้นต่ำ", zh: "合规", ja: "コンプライアンス" },
  { id: "complex", en: "Complex", th: "ครบทุกกฎหมาย", zh: "完整", ja: "コンプレックス" },
];

export function LawToggle({ variant = "header" }: { variant?: "header" | "block" }) {
  const { lawMode, setLawMode } = useStore();
  return (
    <div className={`law-toggle law-toggle-${variant}`} role="group" aria-label="Law depth">
      <span className="law-toggle-kicker"><T en="Law depth" th="ความลึกกฎหมาย" zh="法规深度" ja="法令の深さ" /></span>
      <div className="seg">
        {OPTS.map((o) => (
          <label key={o.id} className="seg-opt" title={o.en}>
            <input type="radio" name={`law-${variant}`} checked={lawMode === o.id} onChange={() => setLawMode(o.id)} />
            <span><T en={o.en} th={o.th} zh={o.zh} ja={o.ja} /></span>
          </label>
        ))}
      </div>
      {variant === "block" && (
        <Link href="/playbook" className="text-muted" style={{ fontSize: 11 }}>
          <T en="Playbook — what differs" th="คู่มือ — สิ่งที่ต่างกัน" zh="手册 — 有何不同" ja="プレイブック — 違い" />
        </Link>
      )}
    </div>
  );
}
