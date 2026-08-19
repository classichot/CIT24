"use client";

import { BOI_BUCKETS, tot } from "@/lib/boi";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";
import Link from "next/link";

export default function BoiPnlPage() {
  const { boiPnl, rentDriver } = useStore();
  const cols = BOI_BUCKETS;
  const rows: { en: string; th: string; row: Record<"BOI-01" | "BOI-02" | "NON", number>; heavy?: boolean }[] = [
    { en: "Revenue", th: "รายได้", row: boiPnl.revenue },
    { en: "Direct cost", th: "ต้นทุนตรง", row: boiPnl.directCost },
    { en: "Direct expense", th: "ค่าใช้จ่ายตรง", row: boiPnl.directExp },
    { en: "Allocated shared expense", th: "ปันส่วนต้นทุนร่วม", row: boiPnl.allocated },
    { en: "Accounting profit", th: "กำไรทางบัญชี", row: boiPnl.accounting, heavy: true },
    { en: "Tax adjustments", th: "รายการปรับปรุงภาษี", row: boiPnl.taxAdj },
    { en: "Tax profit", th: "กำไรทางภาษี", row: boiPnl.taxProfit, heavy: true },
    { en: "BOI exemption", th: "ยกเว้น BOI", row: boiPnl.exemption },
    { en: "Taxable profit", th: "กำไรสุทธิทางภาษี", row: boiPnl.taxable, heavy: true },
  ];

  return (
    <BoiGate>
      <PageHead
        kickerEn="Project-level tax P&L"
        kickerTh="กำไรขาดทุนภาษีรายโครงการ"
        titleEn="BOI tax P&L"
        titleTh="กำไรขาดทุนภาษี BOI"
        subEn={`Rent allocated on ${rentDriver === "floor-area" ? "floor area" : "revenue"}. Tax adjustments are allocated on the same policies as the expense — they are not dumped at company level. Non-BOI taxable feeds company CIT.`}
        subTh={`ค่าเช่าปันด้วย${rentDriver === "floor-area" ? "พื้นที่" : "รายได้"} รายการปรับปรุงภาษีปันตามนโยบายเดียวกับรายจ่าย ไม่กองที่ระดับบริษัท กำไรนอก BOI ส่งเข้าภาษีบริษัท`}
        actions={<Link href="/provision" className="btn btn-primary"><T en="Open company provision" th="เปิดประมาณการบริษัท" /></Link>}
      />
      <BoiNav />
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th />
            {cols.map((c) => <th key={c.id} className="num">{c.id}</th>)}
            <th className="num"><T en="Total" th="รวม" /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.en} style={r.heavy ? { background: "color-mix(in srgb, var(--color-accent) 8%, transparent)" } : undefined}>
              <td style={{ fontWeight: r.heavy ? 800 : 500 }}><T en={r.en} th={r.th} /></td>
              {cols.map((c) => <td key={c.id} className="num" style={{ fontWeight: r.heavy ? 800 : 500 }}>{F(r.en === "Direct cost" || r.en === "Direct expense" || r.en === "Allocated shared expense" || r.en === "BOI exemption" ? -r.row[c.id] : r.row[c.id], r.en === "BOI exemption")}</td>)}
              <td className="num" style={{ fontWeight: 800 }}>{F(r.en === "Direct cost" || r.en === "Direct expense" || r.en === "Allocated shared expense" || r.en === "BOI exemption" ? -tot(r.row) : tot(r.row), r.en === "BOI exemption")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>
        <T en="Architecture: TB/GL → tax mapper → BOI classifier (BOI-01 | BOI-02 | Non-BOI | Shared) → shared allocation → tax adjustments by certificate → revenue qualification → project P&L → incentive / cap / loss → company CIT → PND50 annex + BOI e-Tax." th="สถาปัตย์: TB/GL → จับคู่ภาษี → จำแนก BOI → ปันส่วนร่วม → ปรับปรุงภาษีรายบัตร → คุณสมบัติรายได้ → กำไรโครงการ → สิทธิ/เพดาน/ขาดทุน → ภาษีบริษัท → เอกสารแนบ ภ.ง.ด.50 และ e-Tax" />
      </p>
    </BoiGate>
  );
}
