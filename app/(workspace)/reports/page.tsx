"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

const REPORTS = [
  { href: "/provision", en: "Book-to-tax reconciliation", th: "กระทบยอดกำไรบัญชีเป็นกำไรภาษี" },
  { href: "/ledger", en: "Tax-adjustment register", th: "ทะเบียนรายการปรับปรุงภาษี" },
  { href: "/deferred", en: "Adjustment rollforward", th: "ตารางเคลื่อนไหวรายการ" },
  { href: "/provision", en: "Current-tax provision", th: "ประมาณการภาษีงวดปัจจุบัน" },
  { href: "/deferred", en: "Deferred-tax movement", th: "การเคลื่อนไหวภาษีรอตัดบัญชี" },
  { href: "/provision", en: "ETR reconciliation", th: "กระทบยอดอัตราภาษีที่แท้จริง" },
  { href: "/entity", en: "Tax-loss schedule", th: "ตารางผลขาดทุน" },
  { href: "/data", en: "Fixed-asset tax depreciation", th: "ค่าเสื่อมราคาทางภาษี" },
  { href: "/provision", en: "Withholding-tax credit reconciliation", th: "กระทบยอดเครดิตภาษีหัก ณ ที่จ่าย" },
  { href: "/pnd51", en: "ภ.ง.ด.51 forecast memorandum", th: "บันทึกประมาณการ ภ.ง.ด.51" },
  { href: "/pnd50", en: "ภ.ง.ด.50 tax computation", th: "การคำนวณ ภ.ง.ด.50" },
  { href: "/provision", en: "Journal-entry files", th: "ไฟล์รายการบัญชี" },
  { href: "/evidence", en: "External-auditor package", th: "ชุดเอกสารผู้สอบบัญชี" },
  { href: "/evidence", en: "Revenue Department audit-defence package", th: "ชุดต่อสู้คดีกรมสรรพากร" },
];

export default function ReportsPage() {
  const { flash, lang } = useStore();
  return (
    <div>
      <PageHead
        kickerEn="Thai and English · Excel, PDF and structured data"
        kickerTh="ไทยและอังกฤษ · Excel PDF และข้อมูลโครงสร้าง"
        titleEn="Reports and outputs"
        titleTh="รายงานและผลลัพธ์"
        subEn="Every report is generated from the same ledger. Changing a number here is impossible — change the adjustment, then regenerate."
        subTh="ทุกรายงานสร้างจากทะเบียนเดียวกัน เปลี่ยนตัวเลขที่นี่ไม่ได้ — แก้รายการปรับปรุงแล้วสร้างใหม่"
        actions={<button className="btn btn-primary" onClick={() => flash(`Management dashboard exported · ${lang.toUpperCase()} PDF`)}><T en="Export dashboard PDF" th="ส่งออกแดชบอร์ด PDF" /></button>}
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        {REPORTS.map((r) => (
          <Link key={r.en} href={r.href} className="panel" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="panel-body">
              <div className="card-kicker" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>CIT24</div>
              <h4 style={{ margin: "6px 0 0" }}><T en={r.en} th={r.th} /></h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
