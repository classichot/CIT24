"use client";

import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function CopilotPage() {
  const { ask, setCopilotOpen } = useStore();
  const qs = [
    ["Why is entertainment added back?", "ทำไมค่ารับรองถูกบวกกลับ?"],
    ["Will ภ.ง.ด.51 attract a surcharge?", "ภ.ง.ด.51 จะมีเงินเพิ่มหรือไม่?"],
    ["Which reversals are due this year?", "รายการกลับรายการใดถึงกำหนดปีนี้?"],
    ["Explain the TP24 management-fee adjustment", "อธิบายรายการปรับปรุงค่าบริหารจาก TP24"],
    ["What changed from last year?", "ปีนี้ต่างจากปีก่อนอย่างไร?"],
  ];
  return (
    <div>
      <PageHead
        kickerEn="AI assists interpretation · the engine remains the calculation authority"
        kickerTh="AI ช่วยตีความ · เครื่องคำนวณยังเป็นผู้มีอำนาจคำนวณ"
        titleEn="Ask CIT24"
        titleTh="ถาม CIT24"
        subEn="Classify, extract, detect, draft notes and explain in Thai or English. Never change an approved adjustment, pick a legal position, post a journal, submit a return, change a rule, or delete evidence."
        subTh="จำแนก สกัด ตรวจพบ ร่างบันทึก และอธิบายเป็นไทยหรืออังกฤษ ห้ามแก้รายการที่อนุมัติ เลือกจุดยืนทางกฎหมาย บันทึกบัญชี ยื่นแบบ เปลี่ยนกฎ หรือลบหลักฐาน"
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        {qs.map(([en, th]) => (
          <button key={en} className="panel" style={{ textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit" }} onClick={() => { setCopilotOpen(true); ask(en); }}>
            <div className="panel-body">
              <h4 style={{ margin: 0 }}><T en={en} th={th} /></h4>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
