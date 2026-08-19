"use client";

import { ROLLFORWARD } from "@/lib/model";
import { dtaRegister } from "@/lib/engine";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function DeferredPage() {
  const { flash, reversals, claimReversal, canMutate, losses } = useStore();
  const reg = dtaRegister();
  const total = reg.reduce((s, r) => s + r.dt, 0);

  return (
    <div>
      <PageHead
        kickerEn="Temporary differences · TAS 12"
        kickerTh="ผลต่างชั่วคราว · มาตรฐานการบัญชีฉบับที่ 12"
        titleEn="Deferred tax"
        titleTh="ภาษีเงินได้รอการตัดบัญชี"
        subEn="Rollforward built from the adjustment ledger — no separate spreadsheet."
        subTh="สร้างตารางเคลื่อนไหวจากทะเบียนรายการปรับปรุงโดยตรง — ไม่ต้องใช้ไฟล์แยก"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => flash("At a 15% SME rate the DTA restates to 2,927,400 — P&L impact THB 975,800")}><T en="Rate-change scenario" th="สถานการณ์เปลี่ยนอัตรา" /></button>
            <button className="btn btn-primary" onClick={() => flash("DTA recognition sent for CFO approval — recoverability memo attached")}><T en="Send DTA recognition for approval" th="ส่งการรับรู้ DTA เพื่ออนุมัติ" /></button>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(3, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="Temporary differences closing" th="ผลต่างชั่วคราวยกไป" /></div><div className="stat-val" style={{ fontSize: 26 }}>{F(reg.reduce((s, r) => s + r.diff, 0))}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Deferred tax asset @ 20%" th="สินทรัพย์ภาษีรอตัดบัญชี 20%" /></div><div className="stat-val" style={{ fontSize: 26, color: "var(--color-accent)" }}>{F(total)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Tax-loss DTA" th="DTA จากผลขาดทุน" /></div><div className="stat-val" style={{ fontSize: 26 }}>{F(losses.reduce((s, y) => s + y.remaining, 0) * 0.2, true)}</div><div className="stat-hint"><T en="Remaining carry-forward × 20%" th="ยอดยกไป × 20%" /></div></div>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Adjustment rollforward" th="ตารางเคลื่อนไหวรายการปรับปรุง" /></h5>
          <table className="table">
            <thead>
              <tr>
                <th><T en="Adjustment" th="รายการ" /></th>
                <th className="num"><T en="Opening" th="ยกมา" /></th>
                <th className="num"><T en="Addition" th="เพิ่มขึ้น" /></th>
                <th className="num"><T en="Reversal" th="กลับรายการ" /></th>
                <th className="num"><T en="Closing" th="ยกไป" /></th>
                <th className="num">DTA</th>
                <th><T en="When" th="เมื่อ" /></th>
              </tr>
            </thead>
            <tbody>
              {ROLLFORWARD.map((r) => {
                const close = r.open + r.add + r.rev;
                return (
                  <tr key={r.name}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{r.nameTh}</div>
                    </td>
                    <td className="num">{F(r.open)}</td>
                    <td className="num">{F(r.add)}</td>
                    <td className="num">{F(r.rev, true)}</td>
                    <td className="num" style={{ fontWeight: 800 }}>{F(close)}</td>
                    <td className="num">{F(Math.round(close * 0.2))}</td>
                    <td style={{ fontSize: 12 }}>{r.when}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h5 className="sec-h" style={{ marginTop: 28 }}><T en="Accounting and tax-base register" th="ทะเบียนฐานบัญชีและฐานภาษี" /></h5>
          <table className="table">
            <thead><tr><th><T en="Item" th="รายการ" /></th><th className="num"><T en="Temporary difference" th="ผลต่างชั่วคราว" /></th><th className="num">DTA</th><th><T en="Kind" th="ประเภท" /></th></tr></thead>
            <tbody>
              {reg.map((r) => (
                <tr key={r.name}><td>{r.name}</td><td className="num">{F(r.diff)}</td><td className="num">{F(r.dt)}</td><td>{r.kind}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Automatic Reversal Guardian" th="ผู้เฝ้าระวังการกลับรายการอัตโนมัติ" /></h5>
            {reversals.map((r) => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-divider)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                  <span className={statusCls(r.status)}>{r.status}</span>
                </div>
                <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{r.note}</div>
                {r.status === "Action needed" && (
                  <button className="btn btn-ghost" style={{ paddingLeft: 0 }} disabled={!canMutate} onClick={() => claimReversal(r.id)}><T en="Claim deduction" th="ขอหักรายจ่าย" /> →</button>
                )}
              </div>
            ))}
          </div>
          <div className="callout" style={{ fontSize: 12 }}>
            <T en="Deferred tax ships with the enterprise release for listed and large corporate clients; the non-BOI SME MVP can defer this module to Phase 2 without changing the ledger." th="โมดูลภาษีรอการตัดบัญชีจะออกพร้อมรุ่นองค์กรสำหรับบริษัทจดทะเบียนและบริษัทขนาดใหญ่ ส่วน MVP สำหรับ SME ที่ไม่ใช่ BOI สามารถเลื่อนไปเฟส 2 ได้โดยไม่ต้องแก้ทะเบียนรายการ" />
          </div>
        </aside>
      </div>
    </div>
  );
}
