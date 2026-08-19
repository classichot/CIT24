"use client";

import { ACTIVITY_LOG, QUEUE } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function ReviewPage() {
  const { materiality, setMateriality, locked, toggleLock, notes, addNote } = useStore();
  const queue = QUEUE.filter((q) => q.amt === 0 || q.amt >= materiality);

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Prepare / review / approve"
        kickerTh="จัดทำ / สอบทาน / อนุมัติ"
        titleEn="Review & approval"
        titleTh="การสอบทานและอนุมัติ"
        subEn="Segregation of duties, materiality, period lock and an immutable activity log."
        subTh="การแยกหน้าที่ ระดับนัยสำคัญ การล็อกงวด และบันทึกกิจกรรมที่แก้ไขไม่ได้"
        actions={
          <>
            <button className="btn btn-secondary" onClick={toggleLock}>{locked ? <T en="Reopen period" th="เปิดงวดใหม่" /> : <T en="Lock FY2026" th="ล็อกปี 2569" />}</button>
            <button className="btn btn-primary" onClick={addNote}><T en="Add review note" th="เพิ่มบันทึกสอบทาน" /></button>
          </>
        }
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--color-divider)", flexWrap: "wrap" }}>
        <div>
          <div className="stat-label"><T en="Materiality" th="นัยสำคัญ" /></div>
          <strong>{F(materiality)}</strong>
        </div>
        <input className="range" style={{ maxWidth: 280 }} type="range" min={0} max={2000000} step={50000} value={materiality} onChange={(e) => setMateriality(parseFloat(e.target.value))} />
        <span className="text-muted" style={{ fontSize: 12 }}>{queue.length} of {QUEUE.length} items at or above threshold</span>
        <span className={locked ? "tag tag-accent" : "tag tag-outline"}>{locked ? <T en="Period locked" th="ล็อกงวดแล้ว" /> : <T en="Period open" th="งวดยังเปิด" />}</span>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Reviewer workload" th="ภาระงานผู้สอบทาน" /></h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Item" th="รายการ" /></th>
                <th><T en="Kind" th="ประเภท" /></th>
                <th className="num">THB</th>
                <th><T en="Preparer" th="ผู้จัดทำ" /></th>
                <th><T en="Age" th="อายุ" /></th>
                <th><T en="Status" th="สถานะ" /></th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontSize: 11, fontWeight: 800 }}>{q.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{q.name}</td>
                  <td style={{ fontSize: 12 }}>{q.kind}</td>
                  <td className="num">{q.amt ? F(q.amt) : "—"}</td>
                  <td style={{ fontSize: 12 }}>{q.prep}</td>
                  <td>{q.age}d</td>
                  <td><span className={statusCls(q.status)}>{q.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {notes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h5 className="sec-h"><T en="Review notes" th="บันทึกสอบทาน" /></h5>
              {notes.map((n, i) => (
                <div key={i} className="callout" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{n.who}</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{n.text}</div>
                </div>
              ))}
            </div>
          )}
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h"><T en="Immutable activity log" th="บันทึกกิจกรรมที่แก้ไขไม่ได้" /></h5>
            {ACTIVITY_LOG.map((l) => (
              <div key={l.hash} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-divider)", fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{l.who}</span>
                  <span className="mono text-muted">{l.hash}</span>
                </div>
                <div>{l.what}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>{l.when}</div>
              </div>
            ))}
          </div>
          <div className="callout" style={{ fontSize: 12 }}>
            <T en="Approved records are never overwritten. Any change creates a new version showing old amount, new amount, reason, user, time and tax impact." th="รายการที่อนุมัติแล้วจะไม่ถูกเขียนทับ การเปลี่ยนแปลงใด ๆ จะสร้างเวอร์ชันใหม่ แสดงจำนวนเดิม จำนวนใหม่ เหตุผล ผู้ใช้ เวลา และผลกระทบภาษี" />
          </div>
        </aside>
      </div>
    </div>
  );
}
