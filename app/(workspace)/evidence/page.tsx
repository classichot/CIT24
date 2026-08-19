"use client";

import { useState } from "react";
import { REQUESTS } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function EvidencePage() {
  const { shareOpen, setShareOpen, flash } = useStore();
  const [sel, setSel] = useState("RD-2026-118");
  const req = REQUESTS.find((r) => r.id === sel) ?? REQUESTS[0];

  return (
    <div>
      <PageHead
        kickerEn="Audit defence mode · evidence room"
        kickerTh="โหมดต่อสู้คดี · ห้องหลักฐาน"
        titleEn="Audit defence"
        titleTh="แฟ้มต่อสู้คดีตรวจสอบ"
        subEn="Adjustment-by-adjustment defence file, legal support and controlled external sharing."
        subTh="แฟ้มต่อสู้รายรายการ ฐานกฎหมาย และการแบ่งปันภายนอกแบบควบคุม"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setShareOpen(true)}><T en="Controlled share" th="แบ่งปันแบบควบคุม" /></button>
            <button className="btn btn-primary" onClick={() => flash("Defence file exported — watermarked PDF + evidence index, downloads monitored")}><T en="Export defence file" th="ส่งออกแฟ้มหลักฐาน" /></button>
          </>
        }
      />

      <div className="split-wide" style={{ borderTop: "2px solid var(--color-divider)" }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Revenue Department request tracker" th="ติดตามคำขอกรมสรรพากร" /></h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Received" th="ได้รับ" /></th>
                <th><T en="Due" th="ครบกำหนด" /></th>
                <th><T en="Topic" th="หัวข้อ" /></th>
                <th><T en="Owner" th="ผู้รับผิดชอบ" /></th>
                <th><T en="Status" th="สถานะ" /></th>
              </tr>
            </thead>
            <tbody>
              {REQUESTS.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setSel(r.id)} style={{ background: r.id === sel ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined }}>
                  <td style={{ fontWeight: 800, fontSize: 12 }}>{r.id}</td>
                  <td style={{ fontSize: 12 }}>{r.recd}</td>
                  <td style={{ fontSize: 12 }}>{r.due}</td>
                  <td>{r.topic}</td>
                  <td style={{ fontSize: 12 }}>{r.owner}</td>
                  <td><span className={statusCls(r.status)}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>{req.id}</div>
          <h4 style={{ margin: "6px 0 4px" }}>{req.topic}</h4>
          <div className="text-muted" style={{ fontSize: 12 }}>{req.status} · due {req.due} · {req.owner}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
            <T
              en="Provide the calculation of the deductible ceiling, the invoices supporting the claimed amount, and the business purpose of each item above THB 500,000."
              th="โปรดแสดงการคำนวณเพดานที่หักได้ ใบกำกับภาษีที่สนับสนุนจำนวนที่ขอหัก และวัตถุประสงค์ทางธุรกิจของแต่ละรายการที่เกิน 500,000 บาท"
            />
          </p>
          <div className="callout" style={{ fontSize: 13, lineHeight: 1.65 }}>
            <T
              en="The company applied the ceiling in section 65 ter (4) at 0.3% of gross revenue of THB 1,240,000,000, giving a deductible limit of THB 3,720,000. Entertainment expenditure of THB 6,420,000 was recorded in account 6210-00; the excess of THB 2,700,000 was added back as a permanent difference in the FY2026 computation (ADJ-2026-0041, approved 21 July 2026). Supporting tax invoices, attendee records and the business-purpose memorandum are indexed at exhibits E-01 to E-14."
              th="บริษัทใช้เพดานตามมาตรา 65 ตรี (4) ที่ร้อยละ 0.3 ของรายได้รวม 1,240,000,000 บาท คิดเป็นวงเงินที่หักได้ 3,720,000 บาท ค่ารับรองที่บันทึกในบัญชี 6210-00 จำนวน 6,420,000 บาท ส่วนที่เกิน 2,700,000 บาท ได้บวกกลับเป็นผลต่างถาวรในการคำนวณปี 2569 (ADJ-2026-0041 อนุมัติ 21 ก.ค. 2569) เอกสารใบกำกับภาษี บันทึกผู้เข้าร่วม และบันทึกวัตถุประสงค์ทางธุรกิจ จัดเรียงไว้ที่เอกสารแนบ E-01 ถึง E-14"
            />
          </div>
          <div className="text-muted" style={{ fontSize: 11 }}>
            <T en="AI drafted this response from the ledger. A reviewer must confirm the legal position before it leaves CIT24. I cannot submit it to the Revenue Department." th="AI ร่างคำตอบนี้จากทะเบียนรายการ ผู้สอบทานต้องยืนยันจุดยืนทางกฎหมายก่อนออกจาก CIT24 ไม่สามารถยื่นต่อกรมสรรพากรได้เอง" />
          </div>
        </aside>
      </div>

      {shareOpen && (
        <div className="drawer-shell" onClick={() => setShareOpen(false)}>
          <div className="drawer-panel" style={{ width: "min(520px, 100%)" }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-head"><h4><T en="Controlled external share" th="การแบ่งปันภายนอกแบบควบคุม" /></h4></div>
            <div className="panel-body">
              <p className="text-muted" style={{ fontSize: 13 }}>
                <T en="The recipient sees only the exhibits attached to RD-2026-118. Every open and download is logged against the request." th="ผู้รับจะเห็นเฉพาะเอกสารที่แนบกับคำขอ RD-2026-118 การเปิดและดาวน์โหลดทุกครั้งจะถูกบันทึกไว้กับคำขอนั้น" />
              </p>
              <div className="field"><label><T en="Recipient email" th="อีเมลผู้รับ" /></label><input className="input" defaultValue="audit.partner@sgv.co.th" /></div>
              <div className="field"><label><T en="Link expiry" th="วันหมดอายุลิงก์" /></label><input className="input" defaultValue="25 Aug 2026" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => setShareOpen(false)}><T en="Cancel" th="ยกเลิก" /></button>
                <button className="btn btn-primary" onClick={() => { setShareOpen(false); flash("Share link issued — expires 25 Aug 2026, watermarked, downloads monitored"); }}><T en="Issue link" th="ออกลิงก์" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
