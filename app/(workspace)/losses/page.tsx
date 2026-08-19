"use client";

import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function LossesPage() {
  const { losses, provision } = useStore();
  const utilised = losses.reduce((s, y) => s + y.utilised, 0);
  const remaining = losses.reduce((s, y) => s + y.remaining, 0);

  return (
    <div>
      <PageHead
        kickerEn="Section 65 · five-year carry-forward"
        kickerTh="มาตรา 65 · ยกไปห้าปี"
        titleEn="Tax-loss schedule"
        titleTh="ตารางผลขาดทุนทางภาษี"
        subEn="FIFO utilisation against current-year adjusted profit. FY2021 expires this year — unused remainder would be lost."
        subTh="ใช้ตามลำดับอายุกับกำไรสุทธิหลังปรับปรุงปีนี้ ขาดทุนปี 2564 หมดอายุปีนี้ — ส่วนที่ไม่ได้ใช้จะหมดไป"
      />
      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Adjusted profit" th="กำไรหลังปรับปรุง" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(provision.adjustedProfit)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Utilised this year" th="ใช้ในปีนี้" /></div>
          <div className="stat-val" style={{ fontSize: 26, color: "var(--color-accent)" }}>{F(utilised)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Carried forward" th="ยกไป" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(remaining)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Taxable profit after losses" th="กำไรทางภาษีหลังใช้ขาดทุน" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(provision.taxableProfit)}</div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th><T en="Year of origin" th="ปีที่เกิด" /></th>
            <th className="num"><T en="Origin" th="ยอดเกิด" /></th>
            <th className="num"><T en="Used in prior years" th="ใช้ปีก่อน" /></th>
            <th className="num"><T en="Available" th="คงเหลือยกมา" /></th>
            <th className="num"><T en="Used FY2026" th="ใช้ปี 2569" /></th>
            <th className="num"><T en="Remaining" th="คงเหลือยกไป" /></th>
            <th><T en="Expires" th="หมดอายุ" /></th>
          </tr>
        </thead>
        <tbody>
          {losses.map((y) => (
            <tr key={y.fy} style={{ background: y.utilised ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : undefined }}>
              <td style={{ fontWeight: 700 }}>{y.fy} <span className="text-muted">({y.fyTh})</span></td>
              <td className="num">{F(y.origin, true)}</td>
              <td className="num">{F(y.utilisedPrior, true)}</td>
              <td className="num">{F(y.available, true)}</td>
              <td className="num" style={{ fontWeight: 800 }}>{F(y.utilised, true)}</td>
              <td className="num">{F(y.remaining, true)}</td>
              <td>{y.expires}{y.expires === "FY2026" ? " · this year" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
        <T
          en="CIT24-CALC applies losses oldest-first. The LLM never chooses a utilisation order. Changing an approved add-back recomputes this schedule immediately."
          th="CIT24-CALC ใช้ขาดทุนจากปีเก่าสุดก่อน โมเดลภาษาไม่ได้เลือกลำดับการใช้ การเปลี่ยนรายการบวกกลับที่อนุมัติแล้วจะคำนวณตารางนี้ใหม่ทันที"
        />
      </div>
    </div>
  );
}
