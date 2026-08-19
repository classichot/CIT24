"use client";

import { BOI_CERTS, capacityAlert } from "@/lib/boi";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function BoiCertsPage() {
  const { extractBoiCert, certExtracted, flash } = useStore();

  return (
    <BoiGate>
      <PageHead
        kickerEn="BOI Digital Certificate Profile"
        kickerTh="โปรไฟล์บัตรส่งเสริมดิจิทัล"
        titleEn="Certificates"
        titleTh="บัตรส่งเสริม"
        subEn="Each PND50 BOI attachment is per promotion certificate. Upload the card — CIT24 extracts number, activity, capacity, location, holiday and cap. AI proposes; a human confirms."
        subTh="เอกสารแนบ ภ.ง.ด.50 เป็นรายบัตร อัปโหลดบัตร — CIT24 สกัดเลข กิจการ กำลังการผลิต สถานที่ ฮอลิเดย์ และเพดาน AI เสนอ คนยืนยัน"
        actions={
          <button className="btn btn-primary" onClick={() => { extractBoiCert(); }}>
            <T en={certExtracted ? "Certificate extracted" : "AI-read BOI certificate"} th={certExtracted ? "สกัดบัตรแล้ว" : "AI อ่านบัตร BOI"} />
          </button>
        }
      />
      <BoiNav />

      <div className="panel" style={{ marginTop: 8 }}>
        <div className="panel-head"><h4><T en="Reader" th="เครื่องอ่าน" /></h4></div>
        <div className="panel-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
          <T en="Drop the BOI promotion certificate (PDF). CIT24 reads certificate number, promoted activity, product, capacity, approved location, first-revenue date, CIT holiday, exemption cap, 50% reduction period, conditions and amendments. No manual setup for the profile — humans still approve the extract." th="วางไฟล์บัตรส่งเสริม (PDF) CIT24 อ่านเลขบัตร กิจการ สินค้า กำลังการผลิต สถานที่ วันมีรายได้แรก ระยะยกเว้น เพดาน ระยะลด 50% เงื่อนไข และฉบับแก้ไข ไม่ต้องตั้งโปรไฟล์มือ — คนยังต้องอนุมัติผลสกัด" />
          <div style={{ marginTop: 12 }}>
            <input type="file" accept=".pdf,.png,.jpg" onChange={() => flash("Queued for OCR — demo extract uses the two cards already on file")} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        {BOI_CERTS.map((c) => {
          const cap = capacityAlert(c);
          return (
            <div key={c.id} className="panel">
              <div className="panel-head"><h4>{c.id}</h4><span className="tag tag-neutral">{c.certNo}</span></div>
              <div className="panel-body">
                {[
                  ["Activity", "กิจการ", c.activity],
                  ["Product", "สินค้า", c.product],
                  ["Location", "สถานที่", c.location],
                  ["First revenue", "รายได้แรก", c.firstRevenue],
                  ["Holiday", "ยกเว้น", `${c.holidayFrom} – ${c.holidayTo}`],
                  ["Cap", "เพดาน", F(c.cap)],
                ].map(([en, th, v]) => (
                  <div key={en} className="wf-row"><span><T en={en} th={th} /></span><span>{v}</span></div>
                ))}
                {c.conditions.map((x) => <div key={x} className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>· {x}</div>)}
                {cap && (
                  <div className="callout" style={{ marginTop: 12 }}>
                    ⚠ <T en={`Production exceeds certificate capacity by ${cap.over.toLocaleString("en-US")} units. Review whether ${F(cap.extraRev)} remains eligible for exemption.`} th={`ผลิตเกินกำลังการผลิตในบัตร ${cap.over.toLocaleString("en-US")} หน่วย ต้องทบทวนว่า ${F(cap.extraRev)} ยังเข้าข่ายยกเว้นหรือไม่`} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </BoiGate>
  );
}
