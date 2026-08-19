"use client";

import { BOI_CERTS, BOI_LINES, capacityAlert } from "@/lib/boi";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function BoiRevenuePage() {
  const sales = BOI_LINES.filter((l) => l.side === "revenue");
  return (
    <BoiGate>
      <PageHead
        kickerEn="Invoice → SKU → product → certificate → eligibility"
        kickerTh="ใบแจ้งหนี้ → SKU → สินค้า → บัตร → คุณสมบัติ"
        titleEn="Revenue qualification"
        titleTh="คุณสมบัติรายได้ BOI"
        subEn="Promoted products within approved capacity (and certain permitted by-products) are BOI revenue. Over-capacity production is flagged before the exemption is claimed on the PND50 attachment."
        subTh="สินค้าที่ส่งเสริมในกำลังการผลิตที่อนุมัติ (และผลพลอยได้ที่อนุญาต) เป็นรายได้ BOI ผลิตเกินกำลังถูกตั้งธงก่อนอ้างยกเว้นในเอกสารแนบ ภ.ง.ด.50"
      />
      <BoiNav />
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th>SKU / GL</th>
            <th><T en="Product" th="สินค้า" /></th>
            <th>Cert</th>
            <th><T en="Treatment" th="การปฏิบัติ" /></th>
            <th className="num">THB</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.gl}</td>
              <td>{s.name}</td>
              <td>{s.bucket}</td>
              <td>{s.taxTreat}</td>
              <td className="num">{F(s.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {BOI_CERTS.map((c) => {
        const a = capacityAlert(c);
        return (
          <div key={c.id} className="panel" style={{ marginTop: 16 }}>
            <div className="panel-head"><h4>{c.id} · {c.product}</h4></div>
            <div className="panel-body">
              <div className="wf-row"><span><T en="Approved capacity" th="กำลังการผลิตที่อนุมัติ" /></span><span>{c.capacityUnits.toLocaleString("en-US")} units</span></div>
              <div className="wf-row"><span><T en="Actual production" th="ผลิตจริง" /></span><span>{c.actualUnits.toLocaleString("en-US")}</span></div>
              <div className="wf-row"><span><T en="Sales volume" th="ปริมาณขาย" /></span><span>{c.salesUnits.toLocaleString("en-US")}</span></div>
              {a
                ? <div className="callout" style={{ marginTop: 10 }}>⚠ <T en={`Exceeds capacity by ${a.over.toLocaleString("en-US")} units. Review whether ${F(a.extraRev)} stays eligible.`} th={`เกินกำลัง ${a.over.toLocaleString("en-US")} หน่วย ทบทวนว่า ${F(a.extraRev)} ยังเข้าข่ายหรือไม่`} /></div>
                : <div className="text-muted" style={{ fontSize: 13, marginTop: 8 }}><T en="Within certificate capacity." th="อยู่ในกำลังการผลิตตามบัตร" /></div>}
            </div>
          </div>
        );
      })}
    </BoiGate>
  );
}
