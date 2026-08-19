"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLIENTS, FEED } from "@/lib/model";
import { Amount } from "@/components/Amount";
import { FlowBar } from "@/components/FlowBar";
import { PageHead, riskCls } from "@/components/PageHead";
import { T, pnd } from "@/lib/i18n";
import { F } from "@/lib/format";
import { useStore } from "@/lib/store";
import { LawAlertBanner } from "@/components/LawReview";

export default function OverviewPage() {
  const { mode, ask, lang, provision: p, reversals, lawMode } = useStore();
  const router = useRouter();

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn={mode === "advisor" ? "Advisory workspace · Kanit & Partners" : "Corporate mode · continuous close"}
        kickerTh={mode === "advisor" ? "พื้นที่ที่ปรึกษา · กนิษฐ์และหุ้นส่วน" : "โหมดองค์กร · ปิดภาษีต่อเนื่อง"}
        titleEn="Tax close"
        titleTh="ปิดภาษี"
        subEn={lawMode === "compliance"
          ? "Compliance bar: taxable profit, material add-backs, PND51/50, WHT, RD 145, current tax. ETR = current tax ÷ PBT. TAS 12 deferred is off unless you turn it on."
          : "Upload once. CIT24 builds the provision, PND51, PND50 and remembers every position for next year."}
        subTh={lawMode === "compliance"
          ? "เกณฑ์ขั้นต่ำ: กำไรสุทธิ บวกกลับสาระสำคัญ ภ.ง.ด.51/50 เครดิต ณ ที่จ่าย พ.ร.ฎ. 145 ภาษีงวดปัจจุบัน ETR = ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี ต.บ. 12 รอตัดบัญชีปิดอยู่จนกว่าจะเปิด"
          : "นำเข้าครั้งเดียว CIT24 สร้างประมาณการ ภ.ง.ด.51 ภ.ง.ด.50 และจำทุกจุดยืนไว้สำหรับปีหน้า"}
        actions={
          <>
            <Link href="/review" className="btn btn-secondary"><T en="Review queue" th="คิวสอบทาน" /></Link>
            <Link href="/pnd51" className="btn btn-primary"><T en="Open PND51 simulator" th="เปิดแบบจำลอง ภ.ง.ด.51" /></Link>
          </>
        }
      />

      <LawAlertBanner />

      <div className="callout" style={{ margin: "16px 0 0" }}>
        <strong><T en="Deterministic engine CIT24-CALC 2026.2." th="เครื่องคำนวณ CIT24-CALC 2026.2" /></strong>{" "}
        <T en="Current tax" th="ภาษีงวดปัจจุบัน" /> <Amount n={p.currentTax} audit={p.audit} /> ·{" "}
        <T en="taxable profit" th="กำไรทางภาษี" /> <Amount n={p.taxableProfit} audit={p.audit} />.{" "}
        {lawMode === "compliance"
          ? <T en="Compliance mode — acceptable filing bar. Switch to Complex for full TAS 12, Pillar Two and corpus history." th="โหมดเกณฑ์ขั้นต่ำ — สลับเป็นครบทุกกฎหมายเพื่อ ต.บ. 12 เต็ม เสาหลักสอง และประวัติคลังกฎหมาย" />
          : <T en="AI proposed detections. Humans approved. The LLM did not calculate these figures." th="AI เสนอรายการ คนอนุมัติ โมเดลภาษาไม่ได้คำนวณตัวเลขเหล่านี้" />}
      </div>

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 0, borderTop: "2px solid var(--color-divider)" }}>
        {[
          { l: "Taxable profit", lth: "กำไรสุทธิทางภาษี", v: p.taxableProfit, audit: true },
          { l: "Current tax 20%", lth: "ภาษีงวดปัจจุบัน 20%", v: p.currentTax, hot: true, audit: true },
          { l: "Tax payable", lth: "ภาษีที่ต้องชำระ", v: p.payable },
          { l: "ETR", lth: "อัตราภาษีที่แท้จริง", v: null, txt: `${(p.etr * 100).toFixed(2)}%` },
        ].map((k) => (
          <div key={k.l} className="stat-cell">
            <div className="stat-label"><T en={k.l} th={k.lth} /></div>
            <div className="stat-val" style={k.hot ? { color: "var(--color-accent)" } : undefined}>
              {k.txt ?? (k.audit ? <Amount n={k.v!} audit={p.audit} /> : F(k.v!))}
            </div>
          </div>
        ))}
      </div>

      <div className="split-main" style={{ marginTop: 8 }}>
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Close workflow" th="ขั้นตอนปิดภาษี" /></h5>
          <div className="dt-flow" style={{ marginBottom: 24 }}>
            {[
              ["/data", "1. Ingest", "1. นำเข้า", "TB · GL · evidence"],
              ["/ledger", "2. Adjust", "2. ปรับปรุง", "14 items · versioned"],
              ["/provision", "3. Provision", "3. ประมาณการ", F(p.currentTax)],
              ["/pnd51", "4. PND51", "4. ภ.ง.ด.51", "Due in 13 days"],
            ].map(([href, en, th, meta]) => (
              <Link key={href} href={href} className="dt-flow-step">
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", fontWeight: 700 }}><T en={en} th={th} /></div>
                <div style={{ marginTop: 6, fontSize: 13 }}>{meta}</div>
              </Link>
            ))}
          </div>
          <h5 className="sec-h"><T en="Group / client positions" th="สถานะกลุ่ม / ลูกค้า" /></h5>
          <table className="table">
            <thead>
              <tr>
                <th><T en="Entity" th="กิจการ" /></th>
                <th><T en="Stage" th="ขั้นตอน" /></th>
                <th className="num"><T en="Tax" th="ภาษี" /></th>
                <th><T en="Next" th="ถัดไป" /></th>
              </tr>
            </thead>
            <tbody>
              {(mode === "advisor" ? CLIENTS : CLIENTS.slice(0, 1)).map((c) => (
                <tr key={c.id} className="clickable" onClick={() => router.push("/ledger")}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{c.nameTh}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="bar-mini"><span style={{ width: `${c.pct}%` }} /></div>
                      <span style={{ fontSize: 11 }}>{c.stage}</span>
                    </div>
                  </td>
                  <td className="num">{c.tax ? F(c.tax) : "—"}</td>
                  <td style={{ fontSize: 12 }}>{pnd(lang, c.next)}<span style={{ color: c.days <= 14 ? "var(--color-signal)" : "inherit", fontWeight: 800 }}> · {c.days}d</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Reversal Guardian" th="ผู้เฝ้าระวังการกลับรายการ" /></h5>
            <div style={{ borderTop: "2px solid var(--color-divider)" }}>
              {reversals.map((r) => (
                <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-divider)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                    <span className={r.status === "Action needed" ? "tag tag-outline" : r.status === "Scheduled" ? "tag tag-accent" : "tag tag-neutral"}>{r.status}</span>
                  </div>
                  <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{r.note}</div>
                </div>
              ))}
            </div>
            <Link href="/deferred" className="btn btn-ghost" style={{ paddingLeft: 0, marginTop: 8 }}><T en="Review reversals" th="ตรวจการกลับรายการ" /> →</Link>
          </div>
          <div>
            <h5 className="sec-h"><T en="AI evidence engine" th="เครื่องมือ AI ด้านหลักฐาน" /></h5>
            <div style={{ borderTop: "2px solid var(--color-divider)", fontSize: 12 }}>
              {FEED.map((fd) => (
                <button key={fd.text} onClick={() => ask(fd.text)} style={{ display: "flex", gap: 8, width: "100%", textAlign: "left", padding: "9px 0", border: 0, borderBottom: "1px solid var(--color-divider)", background: "transparent", cursor: "pointer", font: "inherit", color: "inherit" }}>
                  <div style={{ width: 4, flex: "none", background: fd.color }} />
                  <div>
                    <div>{fd.text}</div>
                    <div className="text-muted" style={{ fontSize: 10, marginTop: 2 }}>{fd.meta}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-muted" style={{ fontSize: 10, lineHeight: 1.5, marginTop: 8 }}>
              <T en="AI proposes and explains. The deterministic rule engine calculates. Nothing posts without human approval." th="AI เสนอและอธิบาย เครื่องคำนวณกฎเป็นผู้คำนวณ ไม่มีการบันทึกใดเกิดขึ้นโดยไม่มีการอนุมัติจากคน" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
