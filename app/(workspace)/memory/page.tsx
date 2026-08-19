"use client";

import { MEMORY } from "@/lib/model";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function MemoryPage() {
  return (
    <div>
      <PageHead
        kickerEn="Killer feature · knowledge that survives staff change"
        kickerTh="จุดเด่น · ความรู้ที่ไม่หายไปเมื่อคนเปลี่ยน"
        titleEn="Corporate Tax Memory"
        titleTh="ความจำภาษีนิติบุคคล"
        subEn="How the account was treated, why it was adjusted, which evidence supported it, who approved it, whether it should reverse, and whether treatment changed."
        subTh="บัญชีถูกปฏิบัติอย่างไร เหตุใดจึงปรับปรุง หลักฐานใดรองรับ ใครอนุมัติ ควรกลับรายการหรือไม่ และการปฏิบัติเปลี่ยนจากปีก่อนหรือไม่"
      />
      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th><T en="Account" th="บัญชี" /></th>
            <th>FY2025</th>
            <th>FY2026</th>
            <th><T en="Changed?" th="เปลี่ยน?" /></th>
          </tr>
        </thead>
        <tbody>
          {MEMORY.map((m) => (
            <tr key={m.account}>
              <td style={{ fontWeight: 600 }}>{m.account}</td>
              <td style={{ fontSize: 13 }}>{m.fy2025}</td>
              <td style={{ fontSize: 13 }}>{m.fy2026}</td>
              <td>{m.changed ? <span className="tag tag-outline"><T en="Changed" th="เปลี่ยน" /></span> : <span className="tag tag-neutral"><T en="Consistent" th="สอดคล้อง" /></span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="callout" style={{ marginTop: 20, fontSize: 13 }}>
        <T en="This eliminates repeated annual tax work and reduces loss of knowledge when employees or advisers change." th="ลดงานภาษีที่ทำซ้ำทุกปี และลดการสูญเสียความรู้เมื่อพนักงานหรือที่ปรึกษาเปลี่ยน" />
      </div>
    </div>
  );
}
