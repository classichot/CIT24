"use client";

import Link from "next/link";
import { BOI_CERTS, classifyTotals, incentive } from "@/lib/boi";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiGate } from "@/components/BoiGate";
import { BoiNav } from "@/components/BoiNav";
import { BoiToggle } from "@/components/BoiToggle";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";

export default function BoiDeskPage() {
  const { boiPnl } = useStore();
  const cls = classifyTotals();
  const feeds = boiPnl.taxable.NON;

  return (
    <BoiGate>
      <PageHead
        kickerEn="CIT24 BOI Tax Segregation & Allocation Engine"
        kickerTh="เครื่องปันส่วนและแยกภาษี BOI ของ CIT24"
        titleEn="BOI incentive desk"
        titleTh="โต๊ะสิทธิประโยชน์ BOI"
        subEn="One accounting ledger → certificate-level tax computations. Shared cost is allocated on an approved driver, not blindly on revenue. ETR on the company provision remains current tax ÷ PBT."
        subTh="บัญชีชุดเดียว → คำนวณภาษีรายบัตร ต้นทุนร่วมปันส่วนตามตัวขับที่อนุมัติ ไม่ใช้รายได้พร่ำเพรื่อ ETR ของบริษัทยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี"
        actions={<BoiToggle />}
      />
      <BoiNav />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="Expenses analysed" th="ค่าใช้จ่ายที่วิเคราะห์" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(cls.expense)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Direct BOI" th="ตรง BOI" /></div><div className="stat-val" style={{ fontSize: 24, color: "var(--color-accent)" }}>{F(cls.directBoi)}</div><div className="stat-hint">{pct(cls.autoPct, 0)} direct</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Shared pool" th="ส่วนร่วม" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(cls.shared)}</div><div className="stat-hint">{pct(cls.policyPct, 0)} on approved policies</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Needs review" th="รอสอบทาน" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(cls.review)}</div><div className="stat-hint">{pct(cls.reviewPct, 0)} tax-team</div></div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        {BOI_CERTS.map((c) => {
          const inv = incentive(c);
          const usedPct = c.used / c.cap;
          return (
            <div key={c.id} className="panel">
              <div className="panel-head">
                <h4>{c.id} · {c.certNo}</h4>
                <span className="tag tag-accent">{c.status}</span>
              </div>
              <div className="panel-body">
                <div className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>{c.activity}</div>
                <div className="wf-row"><span><T en="CIT holiday" th="ยกเว้นภาษี" /></span><span>{c.holidayFrom} → {c.holidayTo}</span></div>
                <div className="bar-mini" style={{ width: "100%", margin: "10px 0" }}><span style={{ width: `${Math.min(100, usedPct * 100)}%` }} /></div>
                <div className="wf-row"><span><T en="Exemption cap" th="เพดานยกเว้น" /></span><span className="num">{F(c.cap)}</span></div>
                <div className="wf-row"><span><T en="Used" th="ใช้แล้ว" /></span><span className="num">{F(c.used)}</span></div>
                <div className="wf-row"><span><T en="Remaining" th="คงเหลือ" /></span><span className="num" style={{ fontWeight: 800, color: "var(--color-accent)" }}>{F(inv.remaining)}</span></div>
                <div className="wf-row"><span><T en="Time remaining" th="เวลาที่เหลือ" /></span><span>{Math.floor(inv.months / 12)}y {inv.months % 12}m</span></div>
                <div className="wf-row"><span><T en="Projected unused" th="คาดว่าจะใช้ไม่หมด" /></span><span className="num">{F(inv.unusedRisk)}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <strong><T en="Feeds company CIT" th="ส่งเข้าภาษีบริษัท" /></strong>{" "}
        <T en={`Non-BOI taxable ${F(feeds)} × 20%. BOI-01 and BOI-02 profit is exempt in the holiday. Open Project tax P&L to adopt the figure into the provision workpaper.`} th={`กำไรทางภาษีนอก BOI ${F(feeds)} × 20% กำไร BOI-01 และ BOI-02 ยกเว้นในระยะฮอลิเดย์ เปิดกำไรขาดทุนภาษีโครงการเพื่อใช้ตัวเลขในประมาณการ`} />
        {" "}<Link href="/boi/pnl"><T en="Open P&L" th="เปิดกำไรขาดทุน" /> →</Link>
      </div>
    </BoiGate>
  );
}
