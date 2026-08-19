"use client";

import { ECOSYSTEM } from "@/lib/model";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function EcosystemPage() {
  return (
    <div>
      <PageHead
        kickerEn="Integrated 24 tax ecosystem"
        kickerTh="ระบบนิเวศภาษี 24"
        titleEn="CIT24 · TP24 · GMT24 · RISK24 · PIT24"
        titleTh="CIT24 · TP24 · GMT24 · RISK24 · PIT24"
        subEn="CIT24 determines Thai taxable profit, TP24 supports related-party pricing, and GMT24 converts the results into Pillar Two calculations."
        subTh="CIT24 กำหนดกำไรสุทธิทางภาษีไทย TP24 รองรับราคาโอนระหว่างกัน และ GMT24 แปลงผลเป็นงานเสาหลักสอง"
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        {ECOSYSTEM.map((e) => (
          <div key={e.id} className="panel">
            <div className="panel-head"><h4>{e.id}</h4><span className="tag tag-accent">{e.status}</span></div>
            <div className="panel-body" style={{ fontSize: 14, lineHeight: 1.55 }}>{e.role}</div>
          </div>
        ))}
      </div>
      <div className="callout" style={{ marginTop: 20, fontSize: 13 }}>
        <T en="Phase 3: full TP24 / GMT24 integration. Direct e-filing only when the Revenue Department interface is formally validated." th="เฟส 3: เชื่อม TP24 / GMT24 เต็มรูปแบบ การยื่นอิเล็กทรอนิกส์โดยตรงเมื่อตรวจสอบส่วนต่อประสานกรมสรรพากรแล้วเท่านั้น" />
      </div>
    </div>
  );
}
