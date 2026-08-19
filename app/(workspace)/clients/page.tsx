"use client";

import { useRouter } from "next/navigation";
import { CLIENTS, FEED } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead, riskCls } from "@/components/PageHead";
import { T, pnd } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function ClientsPage() {
  const { setClientId, ask, lang } = useStore();
  const router = useRouter();

  return (
    <div>
      <PageHead
        kickerEn="Advisory mode · engagement dashboard"
        kickerTh="โหมดที่ปรึกษา · แดชบอร์ดงานบริการ"
        titleEn="Client portfolio"
        titleTh="พอร์ตลูกค้า"
        subEn="14 clients · 9 open engagements · continuous close through July 2026"
        subTh="ลูกค้า 14 ราย · งาน 9 งาน · ปิดภาษีต่อเนื่องถึงเดือนกรกฎาคม 2569"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => router.push("/review")}><T en="Reviewer workload" th="ภาระงานผู้สอบทาน" /></button>
            <button className="btn btn-primary" onClick={() => router.push("/pnd51")}><T en="Open PND51 simulator" th="เปิดแบบจำลอง ภ.ง.ด.51" /></button>
          </>
        }
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(5, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        {[
          { l: "Filings due ≤ 30 days", lth: "ครบกำหนดยื่นภายใน 30 วัน", v: "4", hint: "2 × PND51 · 2 × PND50", hintTh: "2 × ภ.ง.ด.51 · 2 × ภ.ง.ด.50", hot: true },
          { l: "Adjustments in review", lth: "รายการปรับปรุงรอสอบทาน", v: "23", hint: "6 above materiality" },
          { l: "Evidence requests open", lth: "คำขอเอกสารค้างอยู่", v: "11", hint: "3 overdue with client" },
          { l: "Reversals due FY2026", lth: "รายการกลับรายการปี 2569", v: "7", hint: "THB 4.9m deduction at risk", signal: true },
          { l: "AI detections this month", lth: "การตรวจพบโดย AI เดือนนี้", v: "38", hint: "31 accepted · 5 amended · 2 rejected" },
        ].map((k) => (
          <div key={k.l} className="stat-cell">
            <div className="stat-label"><T en={k.l} th={k.lth} /></div>
            <div className="stat-val" style={k.hot ? { color: "var(--color-accent)" } : undefined}>{k.v}</div>
            <div className="stat-hint" style={k.signal ? { color: "var(--color-signal-700)" } : undefined}><T en={k.hint} th={"hintTh" in k && k.hintTh ? k.hintTh : k.hint} /></div>
          </div>
        ))}
      </div>

      <div className="split-main">
        <section className="col-pad border-r">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
            <h5 className="sec-h" style={{ margin: 0 }}><T en="Engagements" th="งานบริการลูกค้า" /></h5>
            <span className="text-muted" style={{ fontSize: 11 }}><T en="Click a row to open that client's tax close" th="คลิกแถวเพื่อเปิดงานปิดภาษีของลูกค้า" /></span>
          </div>
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}><T en="Client" th="ลูกค้า" /></th>
                <th><T en="Period" th="รอบบัญชี" /></th>
                <th><T en="Stage" th="ขั้นตอน" /></th>
                <th className="num"><T en="Adj." th="รายการ" /></th>
                <th className="num"><T en="Tax position (THB)" th="ภาระภาษี (บาท)" /></th>
                <th><T en="Next filing" th="กำหนดยื่นถัดไป" /></th>
                <th><T en="Risk" th="ความเสี่ยง" /></th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr key={c.id} className="clickable" onClick={() => { setClientId(c.id); router.push("/overview"); }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{c.nameTh}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{c.period}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div className="bar-mini"><span style={{ width: `${c.pct}%` }} /></div>
                      <span style={{ fontSize: 11 }}>{c.stage}</span>
                    </div>
                  </td>
                  <td className="num">{c.adj}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{c.tax ? F(c.tax) : "—"}</td>
                  <td style={{ fontSize: 12 }}>{pnd(lang, c.next)}<span style={{ color: c.days <= 14 ? "var(--color-signal)" : "inherit", fontWeight: 800 }}> · {c.days}d</span></td>
                  <td><span className={riskCls(c.risk)}>{c.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
        <aside className="col-aside">
          <div>
            <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Tax law impact" th="ผลกระทบจากกฎหมายภาษี" /></h5>
            <div style={{ background: "var(--color-surface)", padding: 12 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)" }}>RULE-65T-04 · v4 draft</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}><T en="Entertainment expense limit reinterpreted" th="ตีความใหม่: เพดานค่ารับรอง" /></div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                <T en="6 clients · 11 adjustments · estimated tax impact THB 1.42m. 2 filed returns need review." th="ลูกค้า 6 ราย · 11 รายการ · ผลกระทบภาษีประมาณ 1.42 ล้านบาท · แบบที่ยื่นแล้ว 2 ฉบับต้องทบทวน" />
              </div>
              <button className="btn btn-secondary btn-block" onClick={() => router.push("/rules")} style={{ marginTop: 10 }}><T en="Open impact engine" th="เปิดเครื่องมือวิเคราะห์ผลกระทบ" /></button>
            </div>
          </div>
          <div>
            <h5 className="sec-h"><T en="AI evidence engine" th="เครื่องมือ AI ด้านหลักฐาน" /></h5>
            <div style={{ borderTop: "2px solid var(--color-divider)", fontSize: 12 }}>
              {FEED.map((fd) => (
                <button key={fd.text} className="stack-row" onClick={() => ask(fd.text)}>
                  <div style={{ width: 4, flex: "none", background: fd.color }} />
                  <div>
                    <div>{fd.text}</div>
                    <div className="text-muted" style={{ fontSize: 10, marginTop: 2 }}>{fd.meta}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
