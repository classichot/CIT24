"use client";

import { PND50_FIELDS } from "@/lib/model";
import { computeProvision, liveAdjustments } from "@/lib/engine";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { Amount } from "@/components/Amount";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function Pnd50Page() {
  const { statusOverride, fileChecks, toggleFc, flash } = useStore();
  const p = computeProvision(liveAdjustments(statusOverride));
  const done = Object.values(fileChecks).filter(Boolean).length;
  const ready = done === 5;

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Annual return · 150 days after year-end"
        kickerTh="แบบแสดงรายการประจำปี · ภายใน 150 วันนับแต่วันสิ้นรอบบัญชี"
        titleEn="ภ.ง.ด.50 computation & filing package"
        titleTh="ภ.ง.ด.50 การคำนวณและชุดยื่นแบบ"
        subEn="FY2026 draft · every field carries its computation line, evidence and approval."
        subTh="ฉบับร่างปี 2569 · ทุกช่องมีรายการคำนวณ หลักฐาน และการอนุมัติกำกับ"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => flash("Version comparison: v3 vs v2 — taxable profit unchanged, WHT credit +86,400 pending certificates")}><T en="Compare versions" th="เปรียบเทียบเวอร์ชัน" /></button>
            <button className="btn btn-primary" disabled={!ready} onClick={() => flash("Filing package built: computation memo, adjustment register, evidence index, JE file")}><T en="Generate filing package" th="สร้างชุดยื่นแบบ" /></button>
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
            <thead><tr><th><T en="ภ.ง.ด.50 field" th="ช่อง ภ.ง.ด.50" /></th><th><T en="Source" th="แหล่ง" /></th><th className="num">THB</th></tr></thead>
            <tbody>
              {PND50_FIELDS.map((f) => (
                <tr key={f.field} className="clickable">
                  <td style={{ fontWeight: 600 }}>{f.field}</td>
                  <td style={{ fontSize: 12 }} className="text-muted">{f.src}</td>
                  <td className="num" style={{ fontWeight: 800 }}>
                    {Math.abs(f.amount) === p.taxableProfit || Math.abs(f.amount) === p.currentTax
                      ? <Amount n={f.amount} audit={p.audit} />
                      : F(f.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
            <T en="Tax computation memorandum: accounting profit 84,500,000 reconciled to taxable profit" th="บันทึกการคำนวณภาษี: กำไรทางบัญชี 84,500,000 กระทบยอดเป็นกำไรทางภาษี" /> <Amount n={p.taxableProfit} audit={p.audit} /> <T en="under sections 65, 65 bis and 65 ter. Engine CIT24-CALC 2026.2. AI did not calculate this return." th="ตามมาตรา 65, 65 ทวิ และ 65 ตรี เครื่อง CIT24-CALC 2026.2 AI ไม่ได้คำนวณแบบนี้" />
          </div>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h"><T en="Completeness checklist" th="รายการตรวจสอบความครบถ้วน" /> · {done}/5</h5>
            <div className="bar-track" style={{ marginBottom: 12 }}><div className="bar-fill" style={{ width: `${done / 5 * 100}%` }} /></div>
            {([
              ["a", "All adjustments approved or documented exceptions", "รายการปรับปรุงอนุมัติครบหรือมีข้อยกเว้นเป็นลายลักษณ์อักษร"],
              ["b", "Mapping locked for FY2026", "การจับคู่ผังบัญชีถูกล็อกสำหรับปี 2569"],
              ["c", "WHT certificates matched (2 still outstanding)", "จับคู่หนังสือรับรองภาษีหัก ณ ที่จ่าย (ค้าง 2 ฉบับ)"],
              ["d", "CFO certification of the return", "CFO รับรองแบบ"],
              ["e", "Period lock after filing pack generated", "ล็อกงวดหลังสร้างชุดยื่นแบบ"],
            ] as const).map(([k, en, th]) => (
              <label key={k} className="radio" style={{ padding: "8px 0", borderBottom: "1px solid var(--color-divider)" }}>
                <input type="checkbox" checked={fileChecks[k]} onChange={() => toggleFc(k)} />
                <span style={{ fontSize: 13 }}><T en={en} th={th} /></span>
              </label>
            ))}
          </div>
          <div>
            <h5 className="sec-h"><T en="Submission package" th="ชุดยื่นแบบ" /></h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
              <li><T en="Tax computation memorandum (TH/EN)" th="บันทึกการคำนวณภาษี (ไทย/อังกฤษ)" /></li>
              <li><T en="Adjustment register with versions" th="ทะเบียนรายการพร้อมเวอร์ชัน" /></li>
              <li><T en="Evidence index and hashes" th="ดัชนีหลักฐานและแฮช" /></li>
              <li><T en="Journal-entry file" th="ไฟล์รายการบัญชี" /></li>
              <li><T en="ภ.ง.ด.51-to-ภ.ง.ด.50 true-up" th="กระทบยอด ภ.ง.ด.51 กับ ภ.ง.ด.50" /></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
