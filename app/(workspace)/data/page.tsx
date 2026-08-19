"use client";

import Link from "next/link";
import { CHECKS } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function DataPage() {
  const { files, addJulyGl, unmapped, mappedCount, acceptMap, ask } = useStore();
  const allMapped = unmapped.length === 0;

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Step 1 · ingestion & mapping"
        kickerTh="ขั้นตอน 1 · นำเข้าและจับคู่ผังบัญชี"
        titleEn="Data & mapping"
        titleTh="ข้อมูลและการจับคู่ผังบัญชี"
        subEn="Trial balance, general ledger and evidence become one validated tax data set."
        subTh="งบทดลอง บัญชีแยกประเภท และเอกสารหลักฐาน รวมเป็นชุดข้อมูลภาษีที่ผ่านการตรวจสอบ"
        actions={
          <>
            <button className="btn btn-secondary" onClick={addJulyGl}><T en="Ingest July GL" th="นำเข้าบัญชีแยกประเภท ก.ค." /></button>
            <Link href="/ledger" className="btn btn-primary"><T en="Continue to ledger" th="ไปยังทะเบียนรายการ" /></Link>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Accounts mapped" th="บัญชีที่จับคู่แล้ว" /></div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <div className="stat-val" style={{ fontSize: 26 }}>{mappedCount}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>/ 428 · {Math.round(mappedCount / 428 * 100)}%</div>
          </div>
          <div className="bar-track" style={{ marginTop: 8 }}><div className="bar-fill" style={{ width: `${mappedCount / 428 * 100}%` }} /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Unmapped accounts" th="บัญชีที่ยังไม่จับคู่" /></div>
          <div className="stat-val" style={{ color: "var(--color-accent)", fontSize: 26 }}>{unmapped.length}</div>
          <div className="stat-hint"><T en="All flagged tax-sensitive" th="ทั้งหมดถูกทำเครื่องหมายว่ามีนัยทางภาษี" /></div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="GL lines ingested" th="รายการที่นำเข้า" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>184,392</div>
          <div className="stat-hint">Jan–Jun 2026 · control totals matched</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Evidence coverage" th="ความครบถ้วนของหลักฐาน" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>94%</div>
          <div className="stat-hint"><T en="of tax-sensitive entries" th="ของรายการที่มีนัยทางภาษี" /></div>
        </div>
      </div>

      <div className="split-wide">
        <div>
          <section className="col-pad border-r" style={{ paddingBottom: 20 }}>
            <h5 className="sec-h"><T en="Ingested sources" th="แหล่งข้อมูลที่นำเข้า" /></h5>
            <div className="dropzone" style={{ marginBottom: 16 }} onClick={addJulyGl}>
              <T en="Drop TB, GL, FAR, WHT certificates, invoices or a prior-year ภ.ง.ด.50. Thai and English OCR. Duplicates are flagged before posting." th="ลากงบทดลอง บัญชีแยกประเภท ทะเบียนสินทรัพย์ หนังสือรับรอง ใบกำกับ หรือ ภ.ง.ด.50 ปีก่อน OCR ไทย/อังกฤษ ไฟล์ซ้ำจะถูกทำเครื่องหมายก่อนบันทึก" />
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "34%" }}><T en="File" th="ไฟล์" /></th>
                  <th><T en="Type" th="ประเภท" /></th>
                  <th><T en="Period" th="รอบ" /></th>
                  <th><T en="Contents" th="เนื้อหา" /></th>
                  <th className="num"><T en="Extraction" th="ความเชื่อมั่น" /></th>
                  <th><T en="Status" th="สถานะ" /></th>
                </tr>
              </thead>
              <tbody>
                {files.map((fl) => (
                  <tr key={fl.name}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{fl.name}</td>
                    <td style={{ fontSize: 12 }}>{fl.kind}</td>
                    <td style={{ fontSize: 12 }}>{fl.period}</td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{fl.size}</td>
                    <td className="num" style={{ color: fl.conf < 0.85 ? "var(--color-accent)" : "inherit" }}>{fl.conf.toFixed(2)}</td>
                    <td><span className={statusCls(fl.status)}>{fl.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section style={{ padding: "4px 0 40px" }}>
            <h5 className="sec-h"><T en="Data-quality controls" th="การควบคุมคุณภาพข้อมูล" /></h5>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}><T en="Control" th="การควบคุม" /></th>
                  <th><T en="Finding" th="ผลการตรวจ" /></th>
                  <th className="num"><T en="Exception (THB)" th="ผลต่าง (บาท)" /></th>
                  <th><T en="Result" th="ผล" /></th>
                </tr>
              </thead>
              <tbody>
                {CHECKS.map((ck) => (
                  <tr key={ck.name}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{ck.name}</td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{ck.detail}</td>
                    <td className="num">{ck.amt ? F(ck.amt) : "—"}</td>
                    <td><span className={statusCls(ck.result)}>{ck.result}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 10, maxWidth: "60ch", lineHeight: 1.6 }}>
              <T en="Nothing posts to the tax computation until every control is passed or a documented exception is accepted by the reviewer." th="ไม่มีข้อมูลใดเข้าสู่การคำนวณภาษีจนกว่าการควบคุมทุกข้อจะผ่าน หรือผู้สอบทานยอมรับข้อยกเว้นที่มีเอกสารรองรับ" />
            </div>
          </section>
        </div>
        <aside className="col-aside">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <h5 className="sec-h" style={{ margin: 0, color: "var(--color-accent)" }}><T en="Mapping assistant" th="ผู้ช่วยจับคู่ผังบัญชี" /></h5>
            <span className="tag tag-neutral">AI</span>
          </div>
          <div className="text-muted" style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 12 }}>
            <T en="Suggestions reuse last year's approved mapping. Accepting writes to mapping history; the tax result is still calculated by the rule engine." th="ข้อเสนอแนะอ้างอิงการจับคู่ที่อนุมัติในปีก่อน การยอมรับจะบันทึกในประวัติ ผลทางภาษียังคำนวณโดยเครื่องกฎ" />
          </div>
          <div style={{ borderTop: "2px solid var(--color-divider)" }}>
            {unmapped.map((u) => (
              <div key={u.code} style={{ padding: "12px 0", borderBottom: "1px solid var(--color-divider)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{u.code}</div>
                  <span className="tag tag-neutral">{u.tag}</span>
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{u.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginTop: 6, background: "var(--color-surface)", padding: "7px 9px" }}>
                  <div style={{ fontSize: 12, flex: 1 }}>{u.suggestion}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, flex: "none" }}>{u.conf.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => acceptMap(u.code)}><T en="Accept" th="ยอมรับ" /></button>
                  <button className="btn btn-secondary" style={{ fontSize: 12, padding: "5px 10px" }}><T en="Change" th="แก้ไข" /></button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => ask(`How should account ${u.code} be mapped?`)}><T en="Ask CIT24" th="ถาม CIT24" /></button>
                </div>
              </div>
            ))}
          </div>
          {allMapped && (
            <div style={{ padding: 16, background: "var(--color-surface)", marginTop: 14 }}>
              <div style={{ fontWeight: 800 }}><T en="Mapping complete — ready to lock" th="จับคู่ครบถ้วน — พร้อมล็อก" /></div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
                <T en="428 of 428 accounts classified. Locking the mapping freezes it for FY2026 and records the approval." th="จับคู่บัญชีครบ 428 บัญชี การล็อกจะตรึงการจับคู่สำหรับปี 2569 และบันทึกการอนุมัติ" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
