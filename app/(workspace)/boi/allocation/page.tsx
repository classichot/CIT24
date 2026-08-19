"use client";

import { ALLOC_POLICIES, AI_ALLOCS, BOI_LINES, DRIVER_DEFAULTS, classifyTotals } from "@/lib/boi";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";

export default function BoiAllocPage() {
  const { rentDriver, setRentDriver, approveBoiRec, approvedBoiRecs, scenario, canMutate } = useStore();
  const cls = classifyTotals();
  const recs = AI_ALLOCS.map((r) => ({ ...r, status: approvedBoiRecs.includes(r.id) ? "approved" as const : r.status }));

  return (
    <BoiGate>
      <PageHead
        kickerEn="Allocation Policy Center · CIT24 BOI Allocation AI"
        kickerTh="ศูนย์นโยบายปันส่วน · AI ปันส่วน BOI"
        titleEn="Shared cost allocation"
        titleTh="การปันส่วนต้นทุนร่วม"
        subEn="Direct identification first. Then a specific economic driver. Revenue ratio is the fallback — RD 0706/152 — not the default. Method, calculation, source, evidence, approver, date and version are stored for the RD audit."
        subTh="ระบุตรงก่อน แล้วใช้ตัวขับทางเศรษฐกิจที่เหมาะสม สัดส่วนรายได้เป็นทางเลือกสุดท้าย — หนังสือ 0706/152 — ไม่ใช่ค่าเริ่มต้น เก็บวิธี คำนวณ แหล่ง หลักฐานผู้อนุมัติ วันที่ และเวอร์ชัน"
      />
      <BoiNav />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label">Direct BOI</div><div className="stat-val" style={{ fontSize: 22 }}>{F(cls.directBoi)}</div></div>
        <div className="stat-cell"><div className="stat-label">Direct Non-BOI</div><div className="stat-val" style={{ fontSize: 22 }}>{F(cls.directNon)}</div></div>
        <div className="stat-cell"><div className="stat-label">Shared</div><div className="stat-val" style={{ fontSize: 22 }}>{F(cls.shared)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Tax-team review" th="รอสอบทาน" /></div><div className="stat-val" style={{ fontSize: 22 }}>{F(cls.review)}</div></div>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Policy center" th="ศูนย์นโยบาย" /></h5>
          {ALLOC_POLICIES.map((p) => (
            <div key={p.id} className="panel" style={{ marginBottom: 12 }}>
              <div className="panel-head">
                <h4>{p.expense}</h4>
                <span className="tag tag-accent">{p.id}</span>
              </div>
              <div className="panel-body">
                <div className="wf-row"><span><T en="Driver" th="ตัวขับ" /></span><span>{p.driverLabel}</span></div>
                <div className="wf-row"><span><T en="Evidence" th="หลักฐาน" /></span><span>{p.evidence}</span></div>
                <div className="wf-row"><span><T en="Approved" th="อนุมัติ" /></span><span>{p.approvedBy} · {p.approvedOn} · {p.version}</span></div>
                {p.weights.map((w) => (
                  <div key={w.bucket} className="wf-row"><span>{w.bucket} · {w.qty.toLocaleString("en-US")}</span><span className="num">{pct(w.pct, 1)}</span></div>
                ))}
              </div>
            </div>
          ))}

          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="Recommended default drivers (configurable)" th="ตัวขับแนะนำ (ตั้งค่าได้)" /></h5>
          <div className="table-wrap">
            <table className="table">
            <thead><tr><th><T en="Expense" th="รายจ่าย" /></th><th><T en="Default driver" th="ตัวขับ" /></th></tr></thead>
            <tbody>
              {DRIVER_DEFAULTS.map((d) => (
                <tr key={d.expense}><td>{d.expense}</td><td>{d.note}</td></tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h"><T en="Allocation AI (propose only)" th="AI ปันส่วน (เสนออย่างเดียว)" /></h5>
            {recs.map((r) => (
              <div key={r.id} className="panel" style={{ marginBottom: 12 }}>
                <div className="panel-head"><h4 style={{ fontSize: 13 }}>{r.title}</h4><span className="tag tag-accent">{Math.round(r.confidence * 100)}%</span></div>
                <div className="panel-body" style={{ fontSize: 13 }}>
                  <p>{r.reason}</p>
                  {r.splits.map((s) => <div key={s.bucket} className="wf-row"><span>{s.bucket}</span><span>{pct(s.pct, 1)}</span></div>)}
                  <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} disabled={!canMutate || r.status === "approved"} onClick={() => approveBoiRec(r.id)}>
                    {r.status === "approved" ? <T en="Approved" th="อนุมัติแล้ว" /> : <T en="Human approves" th="คนอนุมัติ" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h5 className="sec-h"><T en="Scenario — factory rent THB 10m" th="สถานการณ์ — ค่าเช่า 10 ล้าน" /></h5>
            <div className="seg" style={{ marginBottom: 10 }}>
              <label className="seg-opt"><input type="radio" name="drv" checked={rentDriver === "floor-area"} onChange={() => setRentDriver("floor-area")} /><span>Floor area</span></label>
              <label className="seg-opt"><input type="radio" name="drv" checked={rentDriver === "revenue"} onChange={() => setRentDriver("revenue")} /><span>Revenue</span></label>
            </div>
            <div className="wf-row"><span>Floor-area CIT</span><span className="num">{F(scenario.areaTax)}</span></div>
            <div className="wf-row"><span>Revenue CIT</span><span className="num">{F(scenario.revTax)}</span></div>
            <div className="wf-row"><span><T en="Difference" th="ผลต่าง" /></span><span className="num" style={{ fontWeight: 800 }}>{F(scenario.diff)}</span></div>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}><T en="What happens to CIT if the allocation basis changes. Computation + justification + evidence + scenario — not a silent revenue split." th="ถ้าเปลี่ยนฐานปันส่วน ภาษีเปลี่ยนเท่าใด คำนวณ + เหตุผล + หลักฐาน + สถานการณ์ ไม่ใช่การปันด้วยรายได้เงียบๆ" /></p>
          </div>
          <div>
            <h5 className="sec-h"><T en="Ledger tags" th="แท็กในบัญชี" /></h5>
            <div className="table-wrap">
              <table className="table" style={{ fontSize: 12 }}>
              <thead><tr><th>GL</th><th>BOI</th><th>Kind</th></tr></thead>
              <tbody>
                {BOI_LINES.filter((l) => l.amount).slice(0, 12).map((l) => (
                  <tr key={l.id}><td>{l.gl}</td><td>{l.bucket}</td><td>{l.kind}</td></tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </aside>
      </div>
    </BoiGate>
  );
}
