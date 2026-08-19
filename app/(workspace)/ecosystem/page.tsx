"use client";

import { ECOSYSTEM } from "@/lib/model";
import { gmt24CoveredTax } from "@/lib/tas12";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";
import Link from "next/link";

export default function EcosystemPage() {
  const { provision, adjustments, lawMode } = useStore();
  const feed = gmt24CoveredTax({
    currentTax: provision.currentTax,
    dtExpense: provision.dtExpense,
    whtCredit: provision.whtCredit,
    adjs: adjustments,
  });
  const deep = lawMode === "complex";

  return (
    <div>
      <PageHead
        kickerEn="Integrated 24 tax ecosystem"
        kickerTh="ระบบนิเวศภาษี 24"
        titleEn="CIT24 · TP24 · GMT24 · RISK24 · PIT24"
        titleTh="CIT24 · TP24 · GMT24 · RISK24 · PIT24"
        subEn={deep
          ? "CIT24 is the TAS 12 engine. GMT24 is the Pillar Two engine. Covered-tax data is ready to push; Pillar Two DTA/DTL stay blocked."
          : "Compliance bar: CIT24 files Thai CIT. TP24 / GMT24 covered-tax payload and GloBE mapping are in Complex mode."}
        subTh="CIT24 คือเครื่องยนต์ ต.บ. 12 GMT24 คือเครื่องยนต์เสาหลักสอง ข้อมูลภาษีครอบคลุมพร้อมส่ง — ห้ามรับรู้ DTA/DTL จากเสาหลักสอง"
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        {ECOSYSTEM.map((e) => (
          <div key={e.id} className="panel">
            <div className="panel-head"><h4>{e.id}</h4><span className="tag tag-accent">{e.id === "GMT24" ? (deep ? "Covered-tax payload" : "Complex") : e.status}</span></div>
            <div className="panel-body" style={{ fontSize: 14, lineHeight: 1.55 }}>{e.role}</div>
          </div>
        ))}
      </div>

      {deep ? (
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h4><T en="CIT24 → GMT24 covered-tax feed" th="ข้อมูลภาษีครอบคลุม CIT24 → GMT24" /></h4>
          <Link href="/disclosure" className="btn btn-ghost" style={{ padding: 0 }}><T en="Disclosure note" th="หมายเหตุเปิดเผย" /> →</Link>
        </div>
        <div className="panel-body">
          <div className="wf-row"><span>Current tax (Thai CIT)</span><span className="num">{F(feed.currentTaxThai)}</span></div>
          <div className="wf-row"><span>Domestic deferred tax expense</span><span className="num">{F(feed.deferredTaxDomestic)}</span></div>
          <div className="wf-row"><span>Includes Pillar Two deferred?</span><span>{String(feed.deferredIncludesPillarTwo)}</span></div>
          <div className="wf-row"><span>Pillar Two exception</span><span>{String(feed.pillarTwoException)}</span></div>
          <div className="wf-row"><span>Pillar Two current tax (from GMT24)</span><span className="num">{F(feed.pillarTwoCurrentTax, true)}</span></div>
          <div className="wf-row"><span>In scope?</span><span>{String(feed.pillarTwoInScope)}</span></div>
          <div className="wf-row"><span>WHT credit</span><span className="num">{F(feed.whtCredit)}</span></div>
          <div className="wf-row"><span>TP24 permanent add-back</span><span className="num">{F(feed.tp24PermanentAddBack)}</span></div>
          {feed.globeMapping.map((g) => (
            <div key={g.id} className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>{g.id} · {g.globe}</div>
          ))}
          <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>{feed.note}</p>
        </div>
      </div>
      ) : (
      <div className="callout" style={{ marginTop: 20, fontSize: 13 }}>
        <T en="GMT24 covered-tax feed, Pillar Two exception and TP GloBE mapping are Complex-mode depth. Switch Law depth to Complex to open the payload. Current tax is unchanged." th="ข้อมูล GMT24 ข้อยกเว้นเสาหลักสอง และการจับคู่ GloBE จาก TP อยู่ในโหมดครบทุกกฎหมาย สลับความลึกของกฎหมายเพื่อเปิดเพย์โหลด ภาษีงวดปัจจุบันไม่เปลี่ยน" />
      </div>
      )}
    </div>
  );
}
