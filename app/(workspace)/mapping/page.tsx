"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";
import type { AccountRow } from "@/lib/close";

const TAGS: AccountRow["tag"][] = ["Permanent", "Temporary", "Tax-sensitive", "Related party", "Exempt", "Ordinary"];

export default function MappingPage() {
  const {
    accounts, unmapped, mappedCount, acceptMap, changeMap, mappingLocked, toggleMappingLock,
    mappingHistory, runDetection, detections, acceptDetection, dismissDetection, lang, canMutate,
  } = useStore();

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Step 1 · chart of accounts"
        kickerTh="ขั้นตอน 1 · ผังบัญชี"
        titleEn="Account mapping engine"
        titleTh="เครื่องมือจับคู่ผังบัญชี"
        subEn="Classify each account as ordinary, tax-sensitive, permanent, temporary, related-party or exempt. Locking freezes the map for FY2026."
        subTh="จัดประเภทบัญชีว่าปกติ มีนัยทางภาษี ถาวร ชั่วคราว กิจการที่เกี่ยวข้อง หรือยกเว้น การล็อกจะตรึงผังสำหรับปี 2569"
        actions={
          <>
            <button className="btn btn-secondary" onClick={runDetection} disabled={!canMutate}>
              <T en="Run AI detection" th="ให้ AI ตรวจหารายการ" />
            </button>
            <button className="btn btn-primary" onClick={toggleMappingLock} disabled={!canMutate && !mappingLocked}>
              {mappingLocked ? <T en="Unlock mapping" th="ปลดล็อกการจับคู่" /> : <T en="Lock mapping" th="ล็อกการจับคู่" />}
            </button>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Accounts mapped" th="บัญชีที่จับคู่แล้ว" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{mappedCount}</div>
          <div className="stat-hint">/ 428 · {Math.round(mappedCount / 428 * 100)}%</div>
          <div className="bar-track" style={{ marginTop: 8 }}><div className="bar-fill" style={{ width: `${mappedCount / 428 * 100}%` }} /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Unmapped" th="ยังไม่จับคู่" /></div>
          <div className="stat-val" style={{ fontSize: 26, color: unmapped.length ? "var(--color-accent)" : undefined }}>{unmapped.length}</div>
          <div className="stat-hint"><T en="Tax-sensitive until classified" th="ถือว่ามีนัยทางภาษีจนกว่าจะจัดประเภท" /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Mapping lock" th="ล็อกการจับคู่" /></div>
          <div className="stat-val" style={{ fontSize: 22 }}>{mappingLocked ? <T en="Locked" th="ล็อกแล้ว" /> : <T en="Open" th="เปิด" />}</div>
          <div className="stat-hint"><T en="Required before PND50 completeness" th="จำเป็นก่อนความครบถ้วน ภ.ง.ด.50" /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="AI detections queued" th="รายการที่ AI เสนอ" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{detections.length}</div>
          <div className="stat-hint"><T en="Proposed only — not posted" th="เป็นข้อเสนอเท่านั้น — ยังไม่บันทึก" /></div>
        </div>
      </div>

      {detections.length > 0 && (
        <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
          <strong><T en="AI proposed, engine has not calculated." th="AI เสนอแล้ว เครื่องยังไม่ได้คำนวณ" /></strong>
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            {detections.map((d) => (
              <div key={d.id} style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <span className="mono" style={{ fontWeight: 800 }}>{d.id}</span>
                <span>{lang === "th" ? d.nameTh : d.name}</span>
                <span className="num" style={{ fontWeight: 800 }}>{F(d.adjAmt)}</span>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: "4px 8px" }} onClick={() => acceptDetection(d.id)}><T en="Send to ledger" th="ส่งเข้าทะเบียน" /></button>
                <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => dismissDetection(d.id)}><T en="Dismiss" th="ยกเลิก" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="split-wide" style={{ marginTop: 8 }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Unmapped and unusual" th="ยังไม่จับคู่และผิดปกติ" /></h5>
          {unmapped.length === 0 && (
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}><T en="All flagged accounts are classified." th="บัญชีที่ทำเครื่องหมายถูกจัดประเภทครบแล้ว" /></div>
          )}
          {unmapped.map((u) => (
            <div key={u.code} style={{ padding: "12px 0", borderBottom: "1px solid var(--color-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{u.code}</div>
                  <div style={{ fontSize: 13 }}>{lang === "th" ? u.nameTh : u.name}</div>
                </div>
                <span className="tag tag-neutral">{u.tag}</span>
              </div>
              <div style={{ marginTop: 6, background: "var(--color-surface)", padding: "8px 10px", fontSize: 12 }}>
                {lang === "th" ? u.suggestionTh : u.suggestion} · {u.conf.toFixed(2)} · {u.priorMap}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => acceptMap(u.code)}><T en="Accept" th="ยอมรับ" /></button>
                {TAGS.map((t) => (
                  <button key={t} className="btn btn-secondary" style={{ fontSize: 11, padding: "5px 8px" }} onClick={() => changeMap(u.code, t)}>{t}</button>
                ))}
              </div>
            </div>
          ))}

          <h5 className="sec-h" style={{ marginTop: 28 }}><T en="Mapped accounts (sample + session)" th="บัญชีที่จับคู่แล้ว (ตัวอย่าง + รอบนี้)" /></h5>
          <table className="table">
            <thead>
              <tr>
                <th>GL</th>
                <th><T en="Account" th="บัญชี" /></th>
                <th className="num"><T en="Balance" th="ยอด" /></th>
                <th><T en="Tag" th="ประเภท" /></th>
                <th><T en="Prior year" th="ปีก่อน" /></th>
              </tr>
            </thead>
            <tbody>
              {accounts.filter((a) => a.mapped).map((a) => (
                <tr key={a.code}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 800 }}>{a.code}</td>
                  <td style={{ fontSize: 13 }}>{lang === "th" ? a.nameTh : a.name}</td>
                  <td className="num">{F(a.balance)}</td>
                  <td><span className="tag tag-neutral">{a.tag}</span></td>
                  <td className="text-muted" style={{ fontSize: 12 }}>{a.priorMap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <h5 className="sec-h"><T en="Mapping history" th="ประวัติการจับคู่" /></h5>
          {mappingHistory.length === 0 && <div className="text-muted" style={{ fontSize: 12 }}><T en="Accept or retag an account to write the first history row." th="ยอมรับหรือเปลี่ยนประเภทเพื่อบันทึกประวัติแถวแรก" /></div>}
          {mappingHistory.map((h, i) => (
            <div key={`${h.code}-${i}`} style={{ padding: "8px 0", borderBottom: "1px solid var(--color-divider)", fontSize: 12 }}>
              <div style={{ fontWeight: 600 }}>{h.code} · {h.action}</div>
              <div className="text-muted">{h.who} · {h.when}</div>
            </div>
          ))}
          <Link href="/ledger" className="btn btn-primary btn-block" style={{ marginTop: 16 }}><T en="Continue to ledger" th="ไปยังทะเบียนรายการ" /></Link>
        </aside>
      </div>
    </div>
  );
}
