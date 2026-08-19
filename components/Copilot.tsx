"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, BookOpen, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { answerCopilot, SUGGESTIONS, type CopilotMsg } from "@/lib/copilot";
import { simulatePnd51 } from "@/lib/engine";
import { T } from "@/lib/i18n";

export function Copilot() {
  const { copilotOpen, setCopilotOpen, consumeAsk, pendingAsk, provision: p, pnd51 } = useStore();
  const [log, setLog] = useState<CopilotMsg[]>([
    {
      role: "assistant",
      text: "Ask CIT24. I answer from the Tax Adjustment Ledger and the approved Thai CIT rule pack — not from general model memory.\n\nAI proposes and explains. The deterministic engine calculates. I will not change an approved adjustment, pick a legal position, post a journal, submit a return, or change a rule version.",
      cites: [{ label: "CIT24-CALC 2026.2" }],
    },
  ]);
  const [q, setQ] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pendingAsk) return;
    const pending = consumeAsk();
    if (pending) run(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAsk]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [log, copilotOpen]);

  function run(text: string) {
    const t = text.trim();
    if (!t) return;
    const sim = simulatePnd51(pnd51.g, pnd51.m, pnd51.declared, pnd51.method);
    setLog((l) => [...l, { role: "user", text: t }, answerCopilot(t, p, sim)]);
    setQ("");
  }

  if (!copilotOpen) return null;

  return (
    <aside className="copilot open-m no-print">
      <div className="panel-head">
        <div>
          <h5 style={{ margin: 0 }}><T en="Ask CIT24" th="ถาม CIT24" /></h5>
          <div className="text-muted" style={{ fontSize: 11 }}><T en="Grounded copilot · never calculates" th="ผู้ช่วยอ้างอิงหลักฐาน · ไม่คำนวณเอง" /></div>
        </div>
        <button className="icon-btn" onClick={() => setCopilotOpen(false)} aria-label="Close copilot"><X size={16} /></button>
      </div>
      <div className="copilot-log">
        {log.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "user" : "ai"}`}>
            {m.text}
            {m.cites && m.cites.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {m.cites.map((c) =>
                  c.href ? (
                    c.href.startsWith("http") ? (
                      <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="tag tag-outline" style={{ fontSize: 10 }}>
                        <BookOpen size={10} style={{ marginRight: 4 }} />{c.label}
                      </a>
                    ) : (
                      <Link key={c.label} href={c.href} className="tag tag-outline" style={{ fontSize: 10 }}>
                        <BookOpen size={10} style={{ marginRight: 4 }} />{c.label}
                      </Link>
                    )
                  ) : (
                    <span key={c.label} className="tag tag-outline" style={{ fontSize: 10 }}><BookOpen size={10} style={{ marginRight: 4 }} />{c.label}</span>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>
      <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "2px solid var(--color-divider)" }}>
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button key={s} className="tag tag-neutral" style={{ cursor: "pointer", border: 0 }} onClick={() => run(s)}>{s}</button>
        ))}
      </div>
      <form
        className="copilot-compose"
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask from the ledger…" />
          <button className="btn btn-primary" type="submit" aria-label="Send"><ArrowUp size={16} /></button>
        </div>
      </form>
    </aside>
  );
}
