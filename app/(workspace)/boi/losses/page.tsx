"use client";

import { BOI_LOSSES } from "@/lib/boi";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function BoiLossPage() {
  return (
    <BoiGate>
      <PageHead
        kickerEn="BOI loss ledger — not the company s.65 bucket"
        kickerTh="ทะเบียนขาดทุน BOI — ไม่ใช่ถัง ม.65 ของบริษัท"
        titleEn="BOI losses"
        titleTh="ผลขาดทุน BOI"
        subEn="Qualifying losses in the holiday may be used after the exemption period, generally within a five-year window. They are never mixed into ordinary company tax-loss FIFO until the post-exemption rules are met."
        subTh="ขาดทุนที่มีคุณสมบัติในระยะยกเว้นอาจใช้หลังฮอลิเดย์ โดยทั่วไปในกรอบ 5 ปี ห้ามผสมเข้า FIFO ขาดทุนบริษัทจนกว่าจะเข้าเงื่อนไขหลังยกเว้น"
      />
      <BoiNav />
      <div className="callout" style={{ marginTop: 8 }}>
        ⚠ <T en="BOI-01 FY2024 remaining THB 18.4m — post-exemption window expires 31 Dec 2027 (about 16 months from this close)." th="BOI-01 ปี 2567 คงเหลือ 18.4 ล้าน — กรอบหลังยกเว้นหมด 31 ธ.ค. 2570 (ราว 16 เดือนจากงวดนี้)" />
      </div>
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Cert</th>
            <th>FY</th>
            <th><T en="Window" th="กรอบ" /></th>
            <th className="num"><T en="Origin" th="เกิด" /></th>
            <th className="num"><T en="Used" th="ใช้" /></th>
            <th className="num"><T en="Remaining" th="คงเหลือ" /></th>
            <th><T en="Expires" th="หมดอายุ" /></th>
          </tr>
        </thead>
        <tbody>
          {BOI_LOSSES.map((y) => (
            <tr key={`${y.cert}-${y.fy}`}>
              <td>{y.cert}</td>
              <td>{y.fy}</td>
              <td>{y.window}</td>
              <td className="num">{F(y.origin, true)}</td>
              <td className="num">{F(y.utilised, true)}</td>
              <td className="num" style={{ fontWeight: 800 }}>{F(y.remaining, true)}</td>
              <td>{y.expires}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </BoiGate>
  );
}
