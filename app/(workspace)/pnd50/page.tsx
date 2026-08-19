"use client";

import { pnd50Lines } from "@/lib/close";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { Amount } from "@/components/Amount";
import { T, pnd } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function Pnd50Page() {
  const {
    provision, fileChecks, lang, certs, snapshotPnd50, pnd50Snaps, certifyReturn, certified,
    isCfo, mappingLocked, locked, adjustments, whtUnmatched,
  } = useStore();
  const p = provision;
  const done = Object.values(fileChecks).filter(Boolean).length;
  const ready = fileChecks.a && fileChecks.b && fileChecks.c && fileChecks.d;
  const whtNote = `${certs.filter((c) => c.matched).length} of ${certs.length} certificates matched`;
  const fields = pnd50Lines(p, whtNote);
  const [cur, prev] = pnd50Snaps;

  const checks = [
    ["a", fileChecks.a, "All adjustments approved or documented exceptions", "รายการปรับปรุงอนุมัติครบหรือมีข้อยกเว้นเป็นลายลักษณ์อักษร", `${adjustments.filter((a) => a.status !== "Approved" && a.status !== "Query").length} open`],
    ["b", fileChecks.b, "Mapping locked for FY2026", "การจับคู่ผังบัญชีถูกล็อกสำหรับปี 2569", mappingLocked ? "Locked" : "Open"],
    ["c", fileChecks.c, "WHT certificates matched", "จับคู่หนังสือรับรองภาษีหัก ณ ที่จ่าย", whtUnmatched ? `Open ${F(whtUnmatched)}` : "Matched"],
    ["d", fileChecks.d, "CFO certification of the return", "CFO รับรองแบบ", certified ? "Certified" : "Pending"],
    ["e", fileChecks.e, "Period lock after filing pack generated", "ล็อกงวดหลังสร้างชุดยื่นแบบ", locked && pnd50Snaps.length ? "Locked + pack" : "Incomplete"],
  ] as const;

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Annual return · 150 days after year-end"
        kickerTh="แบบแสดงรายการประจำปี · ภายใน 150 วันนับแต่วันสิ้นรอบบัญชี"
        titleEn="PND50 computation & filing package"
        titleTh="ภ.ง.ด.50 การคำนวณและชุดยื่นแบบ"
        subEn="Fields are posted by CIT24-CALC from the live ledger, loss schedule and matched WHT credits."
        subTh="ช่องถูกบันทึกโดย CIT24-CALC จากทะเบียนสด ตารางขาดทุน และเครดิตหัก ณ ที่จ่ายที่จับคู่แล้ว"
        actions={
          <>
            <button className="btn btn-secondary" onClick={certifyReturn} disabled={!isCfo || certified}>
              {certified ? <T en="Certified" th="รับรองแล้ว" /> : <T en="CFO certify" th="CFO รับรอง" />}
            </button>
            <button className="btn btn-primary" disabled={!ready} onClick={snapshotPnd50}>
              <T en="Generate filing package" th="สร้างชุดยื่นแบบ" />
            </button>
          </>
        }
      />

      <div className="split-wide" style={{ borderTop: "2px solid var(--color-divider)" }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Return field mapping" th="การจับคู่ช่องในแบบ" /></h5>
          <p className="text-muted" style={{ fontSize: 12, marginBottom: 12 }}>
            <T en="Click an amount for one-click traceability. Direct e-filing is deferred until the Revenue Department interface is formally validated." th="คลิกจำนวนเพื่อตรวจสอบย้อนกลับ การยื่นอิเล็กทรอนิกส์โดยตรงจะเพิ่มเมื่อตรวจสอบส่วนต่อประสานกรมสรรพากรแล้ว" />
          </p>
          <table className="table">
            <thead><tr><th><T en="PND50 field" th="ช่อง ภ.ง.ด.50" /></th><th><T en="Source" th="แหล่ง" /></th><th className="num">THB</th></tr></thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.field} className="clickable">
                  <td style={{ fontWeight: 600 }}>{pnd(lang, f.field)}</td>
                  <td style={{ fontSize: 12 }} className="text-muted">{pnd(lang, f.src)}</td>
                  <td className="num" style={{ fontWeight: 800 }}>
                    {f.field.includes("taxable") || f.field.includes("tax at 20%") || f.field.includes("accounting")
                      ? <Amount n={f.amount} audit={p.audit} />
                      : F(f.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
            <T en="Tax computation memorandum: accounting profit" th="บันทึกการคำนวณภาษี: กำไรทางบัญชี" /> {F(p.accountingProfit)} <T en="reconciled to taxable profit" th="กระทบยอดเป็นกำไรทางภาษี" /> <Amount n={p.taxableProfit} audit={p.audit} /> <T en="under sections 65, 65 bis and 65 ter. Engine CIT24-CALC 2026.2. AI did not calculate this return." th="ตามมาตรา 65, 65 ทวิ และ 65 ตรี เครื่อง CIT24-CALC 2026.2 AI ไม่ได้คำนวณแบบนี้" />
          </div>
          {cur && prev && (
            <div style={{ marginTop: 20 }}>
              <h5 className="sec-h"><T en="Version comparison" th="เปรียบเทียบเวอร์ชัน" /> · v{cur.v} vs v{prev.v}</h5>
              <table className="table">
                <thead><tr><th /><th className="num">v{prev.v}</th><th className="num">v{cur.v}</th><th className="num">Δ</th></tr></thead>
                <tbody>
                  {([
                    ["Taxable profit", prev.taxableProfit, cur.taxableProfit],
                    ["Current tax", prev.currentTax, cur.currentTax],
                    ["WHT credit", prev.whtCredit, cur.whtCredit],
                    ["Payable", prev.payable, cur.payable],
                  ] as const).map(([l, a, b]) => (
                    <tr key={l}>
                      <td>{l}</td>
                      <td className="num">{F(a)}</td>
                      <td className="num">{F(b)}</td>
                      <td className="num" style={{ fontWeight: 800 }}>{F(b - a, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h"><T en="Completeness checklist" th="รายการตรวจสอบความครบถ้วน" /> · {done}/5</h5>
            <div className="bar-track" style={{ marginBottom: 12 }}><div className="bar-fill" style={{ width: `${done / 5 * 100}%` }} /></div>
            {checks.map(([k, on, en, th, meta]) => (
              <div key={k} className="radio" style={{ padding: "8px 0", borderBottom: "1px solid var(--color-divider)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span className={on ? "tag tag-neutral" : "tag tag-outline"}>{on ? "OK" : "Open"}</span>
                <span style={{ fontSize: 13 }}>
                  <T en={en} th={th} />
                  <div className="text-muted" style={{ fontSize: 11 }}>{meta}</div>
                </span>
              </div>
            ))}
          </div>
          <div>
            <h5 className="sec-h"><T en="Submission package" th="ชุดยื่นแบบ" /></h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
              <li><T en="Tax computation memorandum (TH/EN)" th="บันทึกการคำนวณภาษี (ไทย/อังกฤษ)" /></li>
              <li><T en="Adjustment register with versions" th="ทะเบียนรายการพร้อมเวอร์ชัน" /></li>
              <li><T en="Evidence index and hashes" th="ดัชนีหลักฐานและแฮช" /></li>
              <li><T en="Journal-entry file" th="ไฟล์รายการบัญชี" /></li>
              <li><T en="PND51-to-PND50 true-up" th="กระทบยอด ภ.ง.ด.51 กับ ภ.ง.ด.50" /></li>
            </ul>
            {pnd50Snaps.length > 0 && (
              <div className="text-muted" style={{ fontSize: 12, marginTop: 10 }}>
                {pnd50Snaps.length} snapshot{pnd50Snaps.length === 1 ? "" : "s"} · latest v{pnd50Snaps[0].v} · {pnd50Snaps[0].when}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
