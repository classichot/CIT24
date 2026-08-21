"use client";

import Link from "next/link";
import { QUEUE } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function ReviewPage() {
  const {
    materiality, setMateriality, locked, toggleLock, notes, addNote, log, adjustments, setStatus,
    canMutate, isCfo, actor, certified, certifyReturn, mappingLocked, fileChecks, readOnly,
  } = useStore();
  const queue = QUEUE.filter((q) => q.amt === 0 || q.amt >= materiality);
  const openAdjs = adjustments.filter((a) => a.status !== "Approved");

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Prepare / review / approve"
        kickerTh="จัดทำ / สอบทาน / อนุมัติ"
        titleEn="Review & approval"
        titleTh="การสอบทานและอนุมัติ"
        subEn={`${actor.name} · ${actor.role}${readOnly ? " · read-only" : ""}${locked ? " · period locked" : ""}`}
        subTh={`${actor.name} · ${actor.role}${readOnly ? " · อ่านอย่างเดียว" : ""}${locked ? " · ล็อกงวดแล้ว" : ""}`}
        actions={
          <>
            <Link href="/host" className="btn btn-secondary"><T en="Host desk" th="โต๊ะโฮสต์" /></Link>
            <button className="btn btn-secondary" onClick={toggleLock}>{locked ? <T en="Reopen period" th="เปิดงวดใหม่" /> : <T en="Lock FY2026" th="ล็อกปี 2569" />}</button>
            <button className="btn btn-primary" onClick={() => addNote()} disabled={readOnly}><T en="Add review note" th="เพิ่มบันทึกสอบทาน" /></button>
          </>
        }
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "2px solid var(--color-divider)", flexWrap: "wrap" }}>
        <div>
          <div className="stat-label"><T en="Materiality" th="นัยสำคัญ" /></div>
          <strong>{F(materiality)}</strong>
        </div>
        <input className="range" style={{ maxWidth: 280 }} type="range" min={0} max={2000000} step={50000} value={materiality} onChange={(e) => setMateriality(parseFloat(e.target.value))} />
        <span className="text-muted" style={{ fontSize: 12 }}>{queue.length} of {QUEUE.length} items at or above threshold</span>
        <span className={locked ? "tag tag-accent" : "tag tag-outline"}>{locked ? <T en="Period locked" th="ล็อกงวดแล้ว" /> : <T en="Period open" th="งวดยังเปิด" />}</span>
        <span className={certified ? "tag tag-neutral" : "tag tag-outline"}>{certified ? <T en="Return certified" th="รับรองแบบแล้ว" /> : <T en="Uncertified" th="ยังไม่รับรอง" />}</span>
      </div>

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="Open adjustments" th="รายการยังไม่ปิด" /></div><div className="stat-val" style={{ fontSize: 22 }}>{openAdjs.length}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Mapping" th="การจับคู่" /></div><div className="stat-val" style={{ fontSize: 22 }}>{mappingLocked ? <T en="Locked" th="ล็อก" /> : <T en="Open" th="เปิด" />}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="PND50 completeness" th="ความครบถ้วน ภ.ง.ด.50" /></div><div className="stat-val" style={{ fontSize: 22 }}>{Object.values(fileChecks).filter(Boolean).length}/5</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Audit events" th="เหตุการณ์ในบันทึก" /></div><div className="stat-val" style={{ fontSize: 22 }}>{log.length}</div></div>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Adjustment sign-off" th="ลงนามรายการปรับปรุง" /></h5>
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Item" th="รายการ" /></th>
                <th className="num">THB</th>
                <th><T en="Status" th="สถานะ" /></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {openAdjs.filter((a) => Math.abs(a.adjAmt) >= materiality || a.status === "Query").map((a) => (
                <tr key={a.id}>
                  <td className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{a.id}</td>
                  <td style={{ fontSize: 13 }}>{a.name}</td>
                  <td className="num">{F(a.adjAmt)}</td>
                  <td><span className={statusCls(a.status)}>{a.status}</span></td>
                  <td>
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: "4px 8px" }} disabled={!canMutate} onClick={() => setStatus(a.id, "Approved")}><T en="Approve" th="อนุมัติ" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Reviewer workload" th="ภาระงานผู้สอบทาน" /></h5>
          <div className="table-wrap">
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
          </div>
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
            <h5 className="sec-h"><T en="Append-only activity log" th="บันทึกกิจกรรมแบบเพิ่มได้อย่างเดียว" /></h5>
            <div className="text-muted" style={{ fontSize: 11, marginBottom: 8 }}>
              <T en="Each row hashes the previous hash + actor + action. Rows cannot be edited." th="แต่ละแถวแฮชค่าแฮชก่อนหน้า + ผู้กระทำ + การกระทำ แก้แถวไม่ได้" />
            </div>
            {log.map((l) => (
              <div key={l.hash + l.when} className="stack-row" style={{ fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{l.who}</span>
                  <span className="mono text-muted">{l.hash}</span>
                </div>
                <div>{l.what}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>{l.when} · prev {l.prev}</div>
              </div>
            ))}
          </div>
          <div className="callout" style={{ fontSize: 12 }}>
            <T en="Approved records are never overwritten. Status changes write a new version. Period lock blocks further posting. Return certification is a CFO-only control." th="รายการที่อนุมัติแล้วจะไม่ถูกเขียนทับ การเปลี่ยนสถานะสร้างเวอร์ชันใหม่ การล็อกงวดห้ามบันทึกเพิ่ม การรับรองแบบเป็นสิทธิ์ CFO เท่านั้น" />
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={certifyReturn} disabled={!isCfo || certified}>{certified ? <T en="Certified" th="รับรองแล้ว" /> : <T en="CFO certify return" th="CFO รับรองแบบ" />}</button>
              <Link href="/pnd50" className="btn btn-secondary"><T en="Open PND50" th="เปิด ภ.ง.ด.50" /></Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
