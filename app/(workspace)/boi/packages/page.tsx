"use client";

import { BOI_CERTS } from "@/lib/boi";
import { TAX_RATE } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function BoiPacksPage() {
  const { boiPnl, flash } = useStore();
  const tax = Math.round(boiPnl.taxable.NON * TAX_RATE);

  return (
    <BoiGate>
      <PageHead
        kickerEn="One dataset · two compliance sides"
        kickerTh="ชุดข้อมูลเดียว · สองฝั่งการปฏิบัติ"
        titleEn="BOI e-Tax and RD annex"
        titleTh="e-Tax BOI และเอกสารแนบสรรพากร"
        subEn="BOI currently requires the CIT exemption application through e-Tax, generally within 120 days of year-end. The RD PND50 BOI attachment is per certificate. CIT24 produces both from the same segregation."
        subTh="BOI ให้ยื่นขอใช้สิทธิยกเว้นผ่าน e-Tax โดยทั่วไปภายใน 120 วันหลังสิ้นรอบ เอกสารแนบ ภ.ง.ด.50 เป็นรายบัตร CIT24 สร้างทั้งสองจากชุดแยกบัญชีเดียวกัน"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => flash("BOI e-Tax workpaper pack drafted — CIT exemption application · project P&L · capacity recon · allocation memo")}><T en="Draft BOI pack" th="ร่างชุด BOI" /></button>
            <button className="btn btn-primary" onClick={() => flash("PND50 BOI annex drafted — one attachment per certificate")}><T en="Draft RD annex" th="ร่างเอกสารแนบสรรพากร" /></button>
          </>
        }
      />
      <BoiNav />

      <div className="grid-2" style={{ marginTop: 8 }}>
        <div className="panel">
          <div className="panel-head"><h4>BOI e-Tax</h4><span className="tag tag-accent">120 days</span></div>
          <div className="panel-body">
            {["CIT exemption application", "Project P&L by certificate", "Revenue reconciliation", "Cost allocation memo", "Production / capacity reconciliation", "Certificate conditions", "Audit support file"].map((x) => (
              <div key={x} className="wf-row"><span>{x}</span><span className="tag tag-neutral">Ready</span></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4>Revenue Department</h4><span className="tag tag-accent">PND50</span></div>
          <div className="panel-body">
            {["PND50 computation", "BOI attachment per certificate", "Taxable / exempt reconciliation", "BOI vs Non-BOI P&L", "Tax adjustments by project", "BOI loss schedule"].map((x) => (
              <div key={x} className="wf-row"><span>{x}</span><span className="tag tag-neutral">Ready</span></div>
            ))}
            <div className="wf-row"><span><T en="Non-BOI current tax" th="ภาษีงวดปัจจุบันนอก BOI" /></span><span className="num" style={{ fontWeight: 800 }}>{F(tax)}</span></div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table" style={{ marginTop: 16 }}>
        <thead><tr><th>Cert</th><th><T en="Holiday" th="ยกเว้น" /></th><th className="num"><T en="Exempt profit" th="กำไรยกเว้น" /></th><th className="num"><T en="Taxable" th="ต้องเสียภาษี" /></th></tr></thead>
        <tbody>
          {BOI_CERTS.map((c) => (
            <tr key={c.id}>
              <td>{c.id} · {c.certNo}</td>
              <td>{c.holidayFrom} – {c.holidayTo}</td>
              <td className="num">{F(boiPnl.exemption[c.id])}</td>
              <td className="num">—</td>
            </tr>
          ))}
          <tr style={{ background: "var(--color-surface)" }}>
            <td style={{ fontWeight: 800 }}>Non-BOI</td>
            <td>—</td>
            <td className="num">—</td>
            <td className="num" style={{ fontWeight: 800 }}>{F(boiPnl.taxable.NON)}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </BoiGate>
  );
}
