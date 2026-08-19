"use client";

import { useState } from "react";
import { RULES } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, riskCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function RulesPage() {
  const { impactRan, runImpact } = useStore();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("RULE-65T-04");
  const rows = RULES.filter((r) => !q || (r.id + r.name + r.sec).toLowerCase().includes(q.toLowerCase()));
  const rule = RULES.find((r) => r.id === sel) ?? RULES[0];

  return (
    <div>
      <PageHead
        kickerEn="Versioned Thai CIT rule library"
        kickerTh="คลังกฎภาษีนิติบุคคลที่ระบุเวอร์ชัน"
        titleEn="Rule library & Tax Law Impact Engine"
        titleTh="คลังกฎและเครื่องมือผลกระทบกฎหมายภาษี"
        subEn="Section 65 ter is a library of prohibited and restricted expenses — not a single generic non-deductible rule."
        subTh="มาตรา 65 ตรี เป็นคลังรายจ่ายต้องห้ามและจำกัด — ไม่ใช่กฎ “รายจ่ายที่หักไม่ได้” ก้อนเดียว"
        actions={<button className="btn btn-primary" onClick={runImpact}><T en="Run impact engine" th="รันเครื่องมือผลกระทบ" /></button>}
      />

      <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--color-divider)" }}>
        <input className="input" style={{ maxWidth: 360 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rule id, section, name…" />
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Rule" th="กฎ" /></th>
                <th><T en="Section" th="มาตรา" /></th>
                <th>Ver</th>
                <th><T en="Effective" th="มีผล" /></th>
                <th><T en="Risk" th="ความเสี่ยง" /></th>
                <th className="num"><T en="Clients" th="ลูกค้า" /></th>
                <th><T en="Tests" th="ทดสอบ" /></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setSel(r.id)} style={{ background: r.id === sel ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}>
                  <td style={{ fontSize: 11, fontWeight: 800 }}>{r.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</td>
                  <td style={{ fontSize: 12 }}>{r.sec}</td>
                  <td>{r.version}</td>
                  <td style={{ fontSize: 12 }}>{r.effective}</td>
                  <td><span className={riskCls(r.risk)}>{r.risk}</span></td>
                  <td className="num">{r.clients}</td>
                  <td style={{ fontSize: 12 }}>{r.tests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--color-accent)" }}>{rule.id} · {rule.version}</div>
          <h4 style={{ margin: "6px 0 4px" }}>{rule.name}</h4>
          <div className="text-muted" style={{ fontSize: 12 }}>{rule.sec} · effective {rule.effective}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>{rule.logic}</p>
          <div className="wf-row"><span><T en="Required evidence" th="หลักฐานที่ต้องมี" /></span><span style={{ textAlign: "right", maxWidth: "55%" }}>{rule.evidence}</span></div>
          <div className="wf-row"><span><T en="Test cases" th="กรณีทดสอบ" /></span><span>{rule.tests}</span></div>
          <div className="wf-row"><span><T en="Tax-team approval" th="การอนุมัติของทีมภาษี" /></span><span>Approved · pack 2026.2</span></div>
          <a href={rule.legalUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-block"><T en="Open legal reference" th="เปิดแหล่งกฎหมาย" /></a>
          {impactRan && (
            <div style={{ background: "var(--color-surface)", padding: 12, marginTop: 8 }}>
              <div style={{ fontWeight: 800 }}><T en="Impact · RULE-65T-04 v4 draft" th="ผลกระทบ · RULE-65T-04 v4 ฉบับร่าง" /></div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                <T en="6 entities · 11 adjustments · estimated tax impact THB 1.42m. 2 filed returns require review. Actions: recompute entertainment ceilings, notify reviewers, freeze mapping on 6210-00." th="6 กิจการ · 11 รายการ · ผลกระทบภาษีประมาณ 1.42 ล้านบาท แบบที่ยื่นแล้ว 2 ฉบับต้องทบทวน: คำนวณเพดานค่ารับรองใหม่ แจ้งผู้สอบทาน ล็อกการจับคู่บัญชี 6210-00" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
