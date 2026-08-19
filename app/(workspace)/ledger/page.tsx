"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { DOCS, GL_DETAIL } from "@/lib/model";
import { liveAdjustments, traceAdjustment } from "@/lib/engine";
import { useStore } from "@/lib/store";
import { PageHead, ptCls, riskColor, statusCls } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { Amount } from "@/components/Amount";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function LedgerPage() {
  const { statusOverride, setStatus, flash, lang, ask } = useStore();
  const [filter, setFilter] = useState<"all" | "P" | "T" | "rev" | "query">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("ADJ-2026-0041");

  const all = liveAdjustments(statusOverride);
  const rows = useMemo(() => all.filter((r) => {
    const okF = filter === "all" ? true : filter === "rev" ? r.adjAmt < 0 : filter === "query" ? r.status === "Query" : r.pt === filter;
    const qq = q.toLowerCase();
    const okQ = !qq || (r.name + r.nameTh + r.id + r.gl + r.sec).toLowerCase().includes(qq);
    return okF && okQ;
  }), [all, filter, q]);

  const addb = rows.filter((r) => r.adjAmt > 0).reduce((s, r) => s + r.adjAmt, 0);
  const dedu = rows.filter((r) => r.adjAmt < 0).reduce((s, r) => s + r.adjAmt, 0);
  const row = all.find((r) => r.id === sel) ?? all[0];

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Control centre · every figure is traceable"
        kickerTh="ศูนย์ควบคุม · ทุกจำนวนตรวจสอบย้อนกลับได้"
        titleEn="Tax Adjustment Ledger"
        titleTh="ทะเบียนรายการปรับปรุงภาษี"
        subEn={`FY2026 · showing ${rows.length} of ${all.length} adjustments · approved records are versioned, never overwritten`}
        subTh={`ปี 2569 · แสดง ${rows.length} จาก ${all.length} รายการ · รายการที่อนุมัติจะถูกเก็บเป็นเวอร์ชัน ไม่ถูกเขียนทับ`}
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => flash("FY2025 ledger imported — 12 positions linked into Corporate Tax Memory")}><T en="Import prior year" th="นำเข้าข้อมูลปีก่อน" /></button>
            <button className="btn btn-primary" onClick={() => flash("New adjustment draft created — engine will not post until approved")}><T en="New adjustment" th="สร้างรายการใหม่" /></button>
          </>
        }
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid var(--color-divider)", flexWrap: "wrap" }}>
        <div className="seg">
          {([["all", "All", "ทั้งหมด"], ["P", "Permanent", "ถาวร"], ["T", "Temporary", "ชั่วคราว"], ["rev", "Reversals", "กลับรายการ"], ["query", "Open queries", "ข้อสอบถาม"]] as const).map(([k, en, th]) => (
            <label key={k} className="seg-opt">
              <input type="radio" name="lf" checked={filter === k} onChange={() => setFilter(k)} />
              <T en={en} th={th} />
            </label>
          ))}
        </div>
        <input className="input" style={{ maxWidth: 280 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search account, section, adjustment…" />
        <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}>
          <div><div className="stat-label"><T en="Add-backs" th="บวกกลับ" /></div><div style={{ fontWeight: 800 }}>{F(addb)}</div></div>
          <div><div className="stat-label"><T en="Deductions" th="หักออก" /></div><div style={{ fontWeight: 800, color: "var(--color-accent-700)" }}>{F(dedu)}</div></div>
          <div><div className="stat-label"><T en="Net · tax at 20%" th="สุทธิ · ภาษี 20%" /></div><div style={{ fontWeight: 800 }}>{F(addb + dedu)} · {F(Math.round((addb + dedu) * 0.2))}</div></div>
        </div>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 96 }}>ID</th>
                <th><T en="Adjustment" th="รายการปรับปรุง" /></th>
                <th>GL</th>
                <th className="num"><T en="Accounting" th="ทางบัญชี" /></th>
                <th className="num"><T en="Add / (deduct)" th="บวก / (หัก)" /></th>
                <th>P/T</th>
                <th><T en="Origin" th="ที่มา" /></th>
                <th className="num"><T en="Conf." th="ความเชื่อมั่น" /></th>
                <th><T en="Status" th="สถานะ" /></th>
                <th style={{ width: 34 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((lr) => (
                <tr key={lr.id} className="clickable" onClick={() => setSel(lr.id)} style={{ background: lr.id === sel ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}>
                  <td style={{ fontSize: 11, fontWeight: 800 }}>{lr.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="risk-dot" style={{ background: riskColor(lr.risk) }} />
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{lang === "th" ? lr.nameTh : lr.name}</div>
                    </div>
                    <div className="text-muted" style={{ fontSize: 11, paddingLeft: 12 }}>{lr.sec}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{lr.gl}</td>
                  <td className="num">{F(lr.acctAmt)}</td>
                  <td className="num" style={{ fontWeight: 800, color: lr.adjAmt < 0 ? "var(--color-accent-700)" : "inherit" }}>
                    <Amount n={lr.adjAmt} audit={traceAdjustment(lr)} />
                  </td>
                  <td><span className={ptCls(lr.pt)}>{lr.pt}</span></td>
                  <td style={{ fontSize: 11 }}>{lr.origin}</td>
                  <td className="num" style={{ fontSize: 12 }}>{lr.conf === 1 ? "—" : lr.conf.toFixed(2)}</td>
                  <td><span className={statusCls(lr.status)}>{lr.status}</span></td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: 2 }} onClick={(e) => { e.stopPropagation(); setSel(lr.id); }} aria-label="Trace">
                      <ChevronRight size={16} color="var(--color-accent)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside" style={{ position: "sticky", top: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>{row.id}</div>
            <span className={statusCls(row.status)}>{row.status}</span>
            <span className={ptCls(row.pt)}>{row.pt === "P" ? "Permanent" : "Temporary"}</span>
          </div>
          <h4 style={{ margin: "6px 0 2px" }}>{lang === "th" ? row.nameTh : row.name}</h4>
          <div className="text-muted" style={{ fontSize: 12 }}>{row.sec} · GL {row.gl} · {row.origin}</div>
          <div style={{ marginTop: 14, background: "var(--color-surface)", padding: "2px 12px" }}>
            {[
              ["Accounting amount", "จำนวนทางบัญชี", F(row.acctAmt)],
              ["Add-back / (deduction)", "บวกกลับ / (หัก)", F(row.adjAmt)],
              ["Tax at 20%", "ภาษี 20%", F(Math.round(row.adjAmt * 0.2))],
            ].map(([en, th, v]) => (
              <div key={en} className="wf-row"><span className="text-muted"><T en={en} th={th} /></span><span className="num">{v}</span></div>
            ))}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, marginTop: 14 }}>{lang === "th" ? row.factsTh : row.facts}</p>
          <p style={{ fontSize: 13, lineHeight: 1.55 }}>{lang === "th" ? row.treatmentTh : row.treatment}</p>
          {row.priorYear && <div className="callout" style={{ fontSize: 12 }}><T en="Corporate Tax Memory" th="ความจำภาษี" /> · {row.priorYear}</div>}
          <div style={{ fontSize: 12, marginTop: 8 }}>
            <div className="text-muted"><T en="Source GL" th="บัญชีต้นทาง" /></div>
            {(GL_DETAIL[row.id] ?? [["Aggregated from " + row.gl, F(row.acctAmt)]]).map((g) => (
              <div key={g[0]} className="wf-row"><span>{g[0]}</span><span>{g[1]}</span></div>
            ))}
          </div>
          <div className="text-muted" style={{ fontSize: 12 }}>{(DOCS[row.id] ?? ["EVIDENCE pack", "OCR TH/EN"])[0]} · {(DOCS[row.id] ?? ["", ""])[1]}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => { setStatus(row.id, "Approved"); flash(`${row.id} approved — version 2 written, prior version retained`); }}><T en="Approve" th="อนุมัติ" /></button>
            <button className="btn btn-secondary" onClick={() => { setStatus(row.id, "Query"); flash(`Review query raised on ${row.id} — evidence requested from client`); }}><T en="Raise query" th="ตั้งข้อสอบถาม" /></button>
            <button className="btn btn-ghost" onClick={() => ask(`Explain ${row.id}`)}><T en="Ask CIT24" th="ถาม CIT24" /></button>
          </div>
        </aside>
      </div>
    </div>
  );
}
