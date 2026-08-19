"use client";

import { useState } from "react";
import Link from "next/link";
import { traceAdjustment } from "@/lib/engine";
import { currentTaxEtrRecon } from "@/lib/tas12";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { Amount } from "@/components/Amount";
import { T, pnd } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function ProvisionPage() {
  const { flash, lang, provision: p, adjustments, whtUnmatched, tas12Enabled, setTas12Enabled, canMutate, readOnly, lawMode, boiEnabled, boiPnl } = useStore();
  const [basis, setBasis] = useState<"h1" | "fy">("fy");
  const taxable = basis === "h1" ? 35900000 : p.taxableProfit;
  const tax = basis === "h1" ? 7180000 : p.currentTax;
  const etr = basis === "h1" ? "21.38%" : `${(p.etr * 100).toFixed(2)}%`;

  const adds = adjustments.filter((a) => a.adjAmt > 0);
  const deds = adjustments.filter((a) => a.adjAmt < 0);
  const etrRecon = currentTaxEtrRecon(adjustments, p.currentTax);
  const t = p.tas12;
  const jeDr = t.journal.reduce((s, r) => s + r.dr, 0);
  const jeCr = t.journal.reduce((s, r) => s + r.cr, 0);

  return (
    <div className="provision-page">
      <FlowBar />
      {boiEnabled && (
        <div className="callout" style={{ marginBottom: 12 }}>
          <strong>BOI</strong>{" "}
          <T en={`Module on. Non-BOI taxable ${F(boiPnl.taxable.NON)} feeds company CIT after certificate exemption. Tax adjustments are allocated by project, not dumped at company level.`} th={`โมดูลเปิด กำไรทางภาษีนอก BOI ${F(boiPnl.taxable.NON)} ส่งเข้าภาษีบริษัทหลังยกเว้นรายบัตร รายการปรับปรุงปันตามโครงการ ไม่กองที่บริษัท`} />
          {" "}<Link href="/boi/pnl"><T en="Open BOI P&L" th="เปิดกำไร BOI" /> →</Link>
        </div>
      )}
      <PageHead
        kickerEn="Continuous close · provision"
        kickerTh="ปิดภาษีต่อเนื่อง · ประมาณการภาษี"
        titleEn="Current tax provision"
        titleTh="ภาษีเงินได้งวดปัจจุบัน"
        subEn={basis === "h1" ? "Six months to 30 Jun 2026, actual GL — the basis for the section 67 bis (2) method" : (lawMode === "compliance" ? "Current-tax provision at the compliance bar. TAS 12 deferred is off unless you turn it on. ETR = current tax ÷ PBT." : "Full year to 31 Dec 2026: actual to 31 Jul plus approved forecast — the continuous-close position")}
        subTh={basis === "h1" ? "หกเดือนถึง 30 มิ.ย. 2569 จากบัญชีจริง — ฐานสำหรับวิธีมาตรา 67 ทวิ (2)" : "ทั้งปีถึง 31 ธ.ค. 2569: จริงถึง 31 ก.ค. บวกประมาณการที่อนุมัติ — ตำแหน่งปิดภาษีต่อเนื่อง"}
        actions={
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="text-muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <T en="TAS 12 deferred tax" th="ภาษีรอตัดบัญชี ต.บ. 12" />
              </div>
              <div className="seg">
                <label className="seg-opt">
                  <input type="radio" name="tas12p" checked={tas12Enabled} disabled={readOnly || !canMutate} onChange={() => setTas12Enabled(true)} />
                  <span><T en="On" th="เปิด" /></span>
                </label>
                <label className="seg-opt">
                  <input type="radio" name="tas12p" checked={!tas12Enabled} disabled={readOnly || !canMutate} onChange={() => setTas12Enabled(false)} />
                  <span><T en="Off" th="ปิด" /></span>
                </label>
              </div>
            </div>
            <div className="seg">
              <label className="seg-opt"><input type="radio" name="basis" checked={basis === "h1"} onChange={() => setBasis("h1")} /><span>H1 2026 actual</span></label>
              <label className="seg-opt"><input type="radio" name="basis" checked={basis === "fy"} onChange={() => setBasis("fy")} /><span>FY2026 position</span></label>
            </div>
            <button className="btn btn-primary" onClick={() => flash("Journal entry CIT24-JE-2026-07 drafted — awaiting CFO approval before posting")}><T en="Post journal entry" th="บันทึกรายการบัญชี" /></button>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="Taxable profit" th="กำไรสุทธิทางภาษี" /></div><div className="stat-val" style={{ fontSize: 26 }}><Amount n={taxable} audit={p.audit} /></div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Current tax at 20%" th="ภาษีงวดปัจจุบัน 20%" /></div><div className="stat-val" style={{ fontSize: 26, color: "var(--color-accent)" }}><Amount n={tax} audit={p.audit} /></div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Effective tax rate" th="อัตราภาษีที่แท้จริง" /></div><div className="stat-val" style={{ fontSize: 26 }}>{etr}</div><div className="stat-hint"><T en="Statutory 20% · gap from permanent items" th="อัตราตามกฎหมาย 20% · ผลต่างจากรายการถาวร" /></div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Tax payable after credits" th="ภาษีที่ต้องชำระหลังหักเครดิต" /></div><div className="stat-val" style={{ fontSize: 26 }}>{F(p.payable)}</div><div className="stat-hint"><T en="Due with PND50 · 30 May 2027" th="ชำระพร้อม ภ.ง.ด.50 · 30 พ.ค. 2570" /></div></div>
      </div>

      <div className="split-wide">
        <section className="col-pad border-r btt-detail">
          <div className="btt-head">
            <h5 className="sec-h" style={{ margin: 0 }}><T en="Book-to-tax reconciliation" th="การกระทบยอดกำไรทางบัญชีเป็นกำไรทางภาษี" /></h5>
            <span style={{ fontSize: 11, color: "var(--color-accent)" }}><T en="Every line is clickable — trace to GL, evidence and law" th="คลิกได้ทุกบรรทัด — ย้อนกลับถึงบัญชี หลักฐาน และกฎหมาย" /></span>
          </div>
          <div className="table-wrap">
          <table className="table">
            <thead><tr><th style={{ width: "52%" }}><T en="Computation line" th="รายการคำนวณ" /></th><th><T en="Basis" th="ฐาน" /></th><th className="num">THB</th></tr></thead>
            <tbody>
              <tr><td style={{ fontWeight: 800 }}><T en="Accounting profit before tax" th="กำไรก่อนภาษีทางบัญชี" /></td><td style={{ fontSize: 12 }}>Audited TB / July management accounts</td><td className="num" style={{ fontWeight: 800 }}>{F(p.accountingProfit)}</td></tr>
              <tr><td colSpan={3} style={{ paddingTop: 14, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", borderBottom: 0 }}><T en="Add back — sections 65 bis / 65 ter" th="บวกกลับ — มาตรา 65 ทวิ / 65 ตรี" /></td></tr>
              {adds.map((a) => (
                <tr key={a.id} className="clickable">
                  <td>{a.name}</td>
                  <td style={{ fontSize: 12 }}>{a.sec} · {a.id}</td>
                  <td className="num"><Amount n={a.adjAmt} audit={traceAdjustment(a)} /></td>
                </tr>
              ))}
              <tr><td style={{ fontWeight: 800 }}><T en="Total add-backs" th="รวมรายการบวกกลับ" /></td><td /><td className="num" style={{ fontWeight: 800 }}>{F(p.addBacks)}</td></tr>
              <tr><td colSpan={3} style={{ paddingTop: 14, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", borderBottom: 0 }}><T en="Deduct" th="หักออก" /></td></tr>
              {deds.map((a) => (
                <tr key={a.id} className="clickable">
                  <td>{a.name}</td>
                  <td style={{ fontSize: 12 }}>{a.origin} · {a.id}</td>
                  <td className="num" style={{ color: "var(--color-accent-700)" }}><Amount n={a.adjAmt} audit={traceAdjustment(a)} /></td>
                </tr>
              ))}
              <tr><td style={{ fontWeight: 800 }}><T en="Total deductions" th="รวมรายการหัก" zh="调减合计" ja="減算合計" /></td><td /><td className="num" style={{ fontWeight: 800 }}>{F(p.deductions)}</td></tr>
              <tr><td style={{ fontWeight: 800 }}><T en="Adjusted profit" th="กำไรหลังปรับปรุง" /></td><td /><td className="num" style={{ fontWeight: 800 }}>{F(p.adjustedProfit)}</td></tr>
              <tr><td><T en="Tax losses carried forward and utilised" th="ผลขาดทุนยกมาที่ใช้ประโยชน์" /></td><td style={{ fontSize: 12 }}><T en="FY2021 loss · expires FY2026 · 5-year limit" th="ขาดทุนปี 2564 · สิ้นอายุปี 2569" /></td><td className="num" style={{ color: "var(--color-accent-700)" }}>({F(p.losses)})</td></tr>
              <tr style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}><td style={{ fontWeight: 800 }}><T en="Taxable profit" th="กำไรสุทธิทางภาษี" /></td><td /><td className="num" style={{ fontWeight: 800 }}><Amount n={p.taxableProfit} audit={p.audit} /></td></tr>
              <tr><td style={{ fontWeight: 800 }}><T en="Corporate income tax at 20%" th="ภาษีเงินได้นิติบุคคล 20%" /></td><td style={{ fontSize: 12 }}><T en="Standard rate · non-BOI · not SME" th="อัตราปกติ · ไม่ใช่ BOI · ไม่ใช่ SME" /></td><td className="num" style={{ fontWeight: 800 }}><Amount n={p.currentTax} audit={p.audit} /></td></tr>
              <tr><td><T en="PND51 payment credit (forecast)" th="เครดิตภาษีจาก ภ.ง.ด.51 (ประมาณการ)" /></td><td style={{ fontSize: 12 }}><T en="Half-year payment due 31 Aug 2026" th="ชำระครึ่งปี ครบกำหนด 31 ส.ค. 2569" /></td><td className="num" style={{ color: "var(--color-accent-700)" }}>({F(p.pnd51Credit)})</td></tr>
              <tr><td><T en="Withholding-tax credits" th="เครดิตภาษีหัก ณ ที่จ่าย" /></td><td style={{ fontSize: 12 }}><T en="39 of 41 certificates matched" th="จับคู่หนังสือรับรอง 39 จาก 41 ฉบับ" /></td><td className="num" style={{ color: "var(--color-accent-700)" }}>({F(p.whtCredit)})</td></tr>
              <tr style={{ background: "var(--color-surface)" }}><td style={{ fontWeight: 800 }}><T en="Tax payable" th="ภาษีที่ต้องชำระ" /></td><td /><td className="num" style={{ fontWeight: 800 }}>{F(p.payable)}</td></tr>
            </tbody>
          </table>
          </div>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h"><T en="Effective tax rate reconciliation" th="การกระทบยอดอัตราภาษีที่แท้จริง" /></h5>
            <div className="table-wrap">
              <table className="table" style={{ fontSize: 13 }}>
              <tbody>
                <tr><td><T en="Tax at statutory 20%" th="ภาษีตามอัตรากฎหมาย 20%" /></td><td className="num">{F(etrRecon.statutory)}</td></tr>
                <tr><td><T en="Permanent differences × 20%" th="ผลต่างถาวร × 20%" /></td><td className="num">{F(etrRecon.permTax)}</td></tr>
                <tr><td><T en="Exempt income" th="รายได้ยกเว้น" /></td><td className="num">{F(etrRecon.exempt)}</td></tr>
                {lawMode === "complex" && (
                  <tr><td><T en="Non-deductible TP adjustment" th="ปรับปรุงราคาโอนที่หักไม่ได้" /></td><td className="num">{F(etrRecon.tp)}</td></tr>
                )}
                <tr><td><T en="Other permanent add-backs" th="รายการถาวรอื่น" /></td><td className="num">{F(lawMode === "complex" ? etrRecon.otherP : etrRecon.otherP + etrRecon.tp)}</td></tr>
                <tr style={{ background: "var(--color-surface)" }}><td style={{ fontWeight: 800 }}><T en="Current tax" th="ภาษีงวดปัจจุบัน" /></td><td className="num" style={{ fontWeight: 800 }}>{F(p.currentTax)}</td></tr>
                <tr><td style={{ fontWeight: 800 }}>ETR</td><td className="num" style={{ fontWeight: 800 }}>{(p.etr * 100).toFixed(2)}%</td></tr>
              </tbody>
            </table>
            </div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 6 }}><T en="ETR = current tax ÷ PBT. Deferred tax is not in this rate." th="ETR = ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี ไม่รวมภาษีรอตัดบัญชี" /></div>
          </div>
          <div>
            <h5 className="sec-h"><T en="Journal entry — draft" th="รายการบัญชี — ฉบับร่าง" /></h5>
            <div className="table-wrap">
              <table className="table" style={{ fontSize: 12 }}>
              <thead><tr><th><T en="Account" th="บัญชี" /></th><th className="num">Dr</th><th className="num">Cr</th></tr></thead>
              <tbody>
                {t.journal.map((r) => (
                  <tr key={r.account}>
                    <td>{r.account.includes("PND") ? pnd(lang, r.account) : r.account}</td>
                    <td className="num">{r.dr ? F(r.dr) : ""}</td>
                    <td className="num">{r.cr ? F(r.cr) : ""}</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--color-surface)" }}>
                  <td style={{ fontWeight: 800 }}>{Math.abs(jeDr - jeCr) < 2 ? "Balanced" : "Out of balance"}</td>
                  <td className="num" style={{ fontWeight: 800 }}>{F(jeDr)}</td>
                  <td className="num" style={{ fontWeight: 800 }}>{F(jeCr)}</td>
                </tr>
              </tbody>
            </table>
            </div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 6 }}>
              {tas12Enabled
                ? <T en={`Income tax expense ${F(t.taxExpense)} = current ${F(p.currentTax)} + deferred ${F(t.dtExpense)}. ETR uses current tax only.`} th={`ค่าใช้จ่ายภาษี ${F(t.taxExpense)} = ปัจจุบัน ${F(p.currentTax)} + รอตัดบัญชี ${F(t.dtExpense)} ETR ใช้ภาษีงวดปัจจุบันเท่านั้น`} />
                : <T en="TAS 12 deferred tax is off. Journal is current tax only. ETR is still current tax ÷ PBT." th="ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิดอยู่ รายการบัญชีเป็นภาษีงวดปัจจุบันเท่านั้น ETR ยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี" />}
            </div>
          </div>
          <div>
            <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Three-way reconciliation" th="การกระทบยอดสามทาง" /></h5>
            <div className="table-wrap">
              <table className="table" style={{ fontSize: 12 }}>
              <thead><tr><th><T en="Source" th="แหล่ง" /></th><th className="num">THB</th><th className="num">Δ</th></tr></thead>
              <tbody>
                <tr><td><T en="Provision (this workpaper)" th="ประมาณการภาษี" /></td><td className="num">{F(p.currentTax)}</td><td className="num">—</td></tr>
                <tr><td><T en="PND50 computation" th="การคำนวณ ภ.ง.ด.50" /></td><td className="num">{F(p.currentTax)}</td><td className="num">—</td></tr>
                <tr><td><T en="Ledger & journal entries" th="บัญชีและรายการบันทึก" /></td><td className="num">{F(p.currentTax)}</td><td className="num">—</td></tr>
                <tr><td><T en="Payments & credits evidence" th="หลักฐานการชำระและเครดิต" /></td><td className="num">{F(p.pnd51Credit + p.whtCredit)}</td><td className="num" style={{ color: "var(--color-signal)", fontWeight: 800 }}>{F(whtUnmatched, true)}</td></tr>
              </tbody>
            </table>
            </div>
            <div className="text-muted" style={{ fontSize: 11, lineHeight: 1.55, marginTop: 8 }}><T en="Difference of THB 86,400 traced to 2 withholding-tax certificates not yet received from customers." th="ผลต่าง 86,400 บาท มาจากหนังสือรับรองภาษีหัก ณ ที่จ่าย 2 ฉบับที่ยังไม่ได้รับจากลูกค้า" /></div>
            <Link href="/evidence" className="btn btn-secondary btn-block"><T en="Request the 2 certificates" th="ขอหนังสือรับรอง 2 ฉบับ" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
