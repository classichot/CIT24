"use client";

import { H1_PROFIT, H1_REVENUE } from "@/lib/model";
import { simulatePnd51 } from "@/lib/engine";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";

export default function Pnd51Page() {
  const { pnd51, setPnd51, evid, toggleEv, flash } = useStore();
  const sim = simulatePnd51(pnd51.g, pnd51.m, pnd51.declared, pnd51.method);
  const decPct = Math.min(100, (pnd51.declared / sim.taxable) * 100);

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Section 67 bis (1) · estimated annual profit"
        kickerTh="มาตรา 67 ทวิ (1) · ประมาณการกำไรสุทธิ"
        titleEn="PND51 penalty-risk simulator"
        titleTh="ภ.ง.ด.51 แบบจำลองความเสี่ยงเงินเพิ่ม"
        subEn="Due 31 Aug 2026 · understating the annual estimate by more than 25% without reasonable cause carries a 20% surcharge on the shortfall."
        subTh="ครบกำหนด 31 ส.ค. 2569 · หากประมาณการกำไรขาดไปเกินร้อยละ 25 โดยไม่มีเหตุอันสมควร จะมีเงินเพิ่มร้อยละ 20 ของภาษีที่ขาด"
        actions={
          <>
            <div className="seg">
              {([["down", "Downside", "กรณีแย่", -8, 4.4], ["base", "Base", "กรณีฐาน", 3, 6.9], ["up", "Upside", "กรณีดี", 18, 8.6]] as const).map(([k, en, th, g, m]) => (
                <label key={k} className="seg-opt">
                  <input type="radio" name="scen" checked={pnd51.scen === k} onChange={() => setPnd51({ scen: k, g, m })} />
                  <T en={en} th={th} />
                </label>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => flash("PND51 estimate submitted for management approval — assumption file attached")}><T en="Submit for approval" th="ส่งขออนุมัติ" /></button>
          </>
        }
      />

      <div className="split-3" style={{ borderTop: "2px solid var(--color-divider)" }}>
        <section style={{ borderRight: "1px solid var(--color-divider)", padding: "20px 22px 40px" }}>
          <h5 className="sec-h"><T en="Forecast assumptions" th="ข้อสมมติในการประมาณการ" /></h5>
          <div className="text-muted" style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 16 }}>
            <T en="H1 2026 is actual from the general ledger. H2 is forecast — move the assumptions and watch the surcharge exposure." th="ครึ่งปีแรกเป็นตัวเลขจริงจากบัญชีแยกประเภท ครึ่งปีหลังเป็นประมาณการ — ปรับข้อสมมติแล้วดูความเสี่ยงเงินเพิ่ม" />
          </div>
          <div style={{ padding: "12px 0", borderTop: "2px solid var(--color-divider)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><label style={{ fontSize: 12 }}><T en="H2 revenue growth vs H1" th="การเติบโตรายได้ครึ่งปีหลัง" /></label><strong>{(pnd51.g > 0 ? "+" : "") + pnd51.g.toFixed(1)}%</strong></div>
            <input className="range" type="range" min={-20} max={30} step={0.5} value={pnd51.g} onChange={(e) => setPnd51({ g: parseFloat(e.target.value), scen: "custom" })} />
          </div>
          <div style={{ padding: "12px 0", borderTop: "1px solid var(--color-divider)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><label style={{ fontSize: 12 }}><T en="H2 profit before tax margin" th="อัตรากำไรก่อนภาษีครึ่งปีหลัง" /></label><strong>{pnd51.m.toFixed(1)}%</strong></div>
            <input className="range" type="range" min={3} max={11} step={0.1} value={pnd51.m} onChange={(e) => setPnd51({ m: parseFloat(e.target.value), scen: "custom" })} />
          </div>
          <div style={{ padding: "12px 0", borderTop: "1px solid var(--color-divider)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><label style={{ fontSize: 12 }}><T en="Declared annual profit estimate" th="ประมาณการกำไรสุทธิที่จะยื่น" /></label><strong>{F(pnd51.declared)}</strong></div>
            <input className="range" type="range" min={50000000} max={115000000} step={500000} value={pnd51.declared} onChange={(e) => setPnd51({ declared: parseFloat(e.target.value) })} />
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "2px solid var(--color-divider)" }}>
            <div className="stat-label" style={{ marginBottom: 8 }}><T en="Fixed inputs from the ledger" th="ข้อมูลคงที่จากทะเบียนรายการ" /></div>
            <div style={{ fontSize: 12 }}>
              <div className="wf-row"><span><T en="H1 actual revenue" th="รายได้จริงครึ่งปีแรก" /></span><span>{F(H1_REVENUE)}</span></div>
              <div className="wf-row"><span><T en="H1 accounting profit" th="กำไรทางบัญชีครึ่งปีแรก" /></span><span>{F(H1_PROFIT)}</span></div>
              <div className="wf-row"><span><T en="Annual tax adjustments" th="รายการปรับปรุงทางภาษีทั้งปี" /></span><span>13,700,000</span></div>
              <div className="wf-row"><span><T en="Tax losses available" th="ผลขาดทุนที่ใช้ได้" /></span><span>12,000,000</span></div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: "var(--color-surface)" }}>
            <div className="stat-label" style={{ color: "var(--color-accent)", marginBottom: 6 }}><T en="Method" th="วิธีคำนวณ" /></div>
            <label className="radio" style={{ marginBottom: 6 }}>
              <input type="radio" name="meth" checked={pnd51.method === "m1"} onChange={() => setPnd51({ method: "m1" })} />
              <span style={{ fontSize: 12, opacity: pnd51.method === "m1" ? 1 : 0.6 }}><T en="67 bis (1) — estimated annual profit" th="67 ทวิ (1) — ประมาณการกำไรทั้งปี" /></span>
            </label>
            <label className="radio">
              <input type="radio" name="meth" checked={pnd51.method === "m2"} onChange={() => setPnd51({ method: "m2" })} />
              <span style={{ fontSize: 12, opacity: pnd51.method === "m2" ? 1 : 0.6 }}><T en="67 bis (2) — actual six-month profit (listed / financial)" th="67 ทวิ (2) — กำไรจริงหกเดือน (บริษัทจดทะเบียน / สถาบันการเงิน)" /></span>
            </label>
            <div className="text-muted" style={{ fontSize: 11, lineHeight: 1.5, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--color-divider)" }}>
              {pnd51.method === "m1"
                ? <T en="Standard companies estimate annual profit and pay one half of the estimated tax. The 25% understatement test below applies." th="บริษัททั่วไปประมาณการกำไรทั้งปีและชำระกึ่งหนึ่ง การทดสอบประมาณการต่ำกว่าร้อยละ 25 ใช้กับวิธีนี้" />
                : <T en="Listed companies, banks and specified financial businesses pay on actual first-six-month profit — THB 47,900,000 taxable, THB 4,790,000 payable. No estimation surcharge arises." th="บริษัทจดทะเบียน ธนาคาร และกิจการการเงินที่กำหนด ชำระจากกำไรจริงหกเดือนแรก — กำไรทางภาษี 47,900,000 ภาษี 4,790,000 ไม่มีเงินเพิ่มจากการประมาณการ" />}
            </div>
          </div>
        </section>

        <section style={{ padding: "20px 26px 40px", borderRight: "1px solid var(--color-divider)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--color-divider)" }}>
            <div style={{ padding: "14px 16px", borderRight: "1px solid var(--color-divider)" }}>
              <div className="stat-label"><T en="Projected annual taxable profit" th="กำไรทางภาษีทั้งปีที่คาดการณ์" /></div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{F(sim.taxable)}</div>
              <div className="stat-hint"><T en="Revenue" th="รายได้" /> {F(H1_REVENUE + sim.h2Rev)} · <T en="accounting profit" th="กำไรบัญชี" /> {F(sim.acct)}</div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div className="stat-label"><T en="Half-year payment on that projection" th="ภาษีครึ่งปีจากประมาณการนั้น" /></div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{F(sim.halfProj)}</div>
              <div className="stat-hint"><T en="Annual tax" th="ภาษีทั้งปี" /> {F(sim.tax)}</div>
            </div>
          </div>

          {pnd51.method === "m1" && (
            <>
              <div style={{ marginTop: 22 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <h5 className="sec-h" style={{ margin: 0 }}><T en="25% understatement test" th="การทดสอบการประมาณการต่ำกว่าร้อยละ 25" /></h5>
                  <span className={sim.breach ? "tag tag-outline" : "tag tag-neutral"}>{sim.breach ? <T en="Surcharge exposure" th="เสี่ยงเงินเพิ่ม" /> : <T en="Within safe harbour" th="อยู่ในเกณฑ์ปลอดภัย" />}</span>
                </div>
                <div style={{ position: "relative", height: 52, marginTop: 26, background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${decPct}%`, background: "color-mix(in srgb, var(--color-accent) 22%, transparent)", borderRight: "2px solid var(--color-accent)" }} />
                  <div style={{ position: "absolute", left: "75%", top: 0, bottom: 0, width: 2, background: "var(--color-text)" }} />
                  <div style={{ position: "absolute", left: "75%", top: -18, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", transform: "translateX(-50%)", whiteSpace: "nowrap" }}><T en="75% floor" th="เพดานขั้นต่ำ 75%" /></div>
                  <div style={{ position: "absolute", left: 8, bottom: 5, fontSize: 11, fontWeight: 800 }}><T en="Declared" th="ที่จะยื่น" /> {F(pnd51.declared)}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--color-divider)", borderTop: 0 }}>
                  {[
                    ["Minimum safe estimate", "ประมาณการขั้นต่ำที่ปลอดภัย", F(sim.floor)],
                    ["Understatement", "ประมาณการต่ำไป", `${sim.shortPct.toFixed(1)}%`],
                    ["Half-year payment declared", "ภาษีครึ่งปีที่จะยื่น", F(sim.halfDec)],
                    ["20% surcharge exposure", "เงินเพิ่มร้อยละ 20", F(sim.surcharge)],
                  ].map(([en, th, v], i) => (
                    <div key={en} style={{ padding: "10px 14px", borderRight: i < 3 ? "1px solid var(--color-divider)" : 0 }}>
                      <div className="stat-label"><T en={en} th={th} /></div>
                      <div style={{ fontWeight: 800, marginTop: 3, color: i === 3 ? "var(--color-signal)" : undefined }}>{v}</div>
                    </div>
                  ))}
                </div>
                {sim.breach ? (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--color-signal)", color: "var(--color-bg)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}><T en="This estimate breaches the 25% threshold" th="ประมาณการนี้ต่ำกว่าเกณฑ์ร้อยละ 25" /></div>
                      <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>
                        <T en="Surcharge of" th="เงินเพิ่ม" /> {F(sim.surcharge)} <T en="would apply unless reasonable cause is documented. Recommended defensible estimate:" th="จะถูกเรียกเก็บ เว้นแต่มีเอกสารแสดงเหตุอันสมควร ประมาณการที่แนะนำ:" /> <strong>{F(sim.recommended)}</strong>
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ marginLeft: "auto", flex: "none", background: "var(--color-bg)", borderColor: "var(--color-bg)" }} onClick={() => { setPnd51({ declared: sim.recommended }); flash("Declared estimate updated — assumption file version 3 created"); }}><T en="Use it" th="ใช้ค่านี้" /></button>
                  </div>
                ) : (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--color-surface)", fontSize: 12, lineHeight: 1.5 }}>
                    <T en="The declared estimate sits above the 75% floor. Keep the assumption file current — a mid-year swing in the forecast can push it below." th="ประมาณการที่จะยื่นอยู่เหนือเพดานขั้นต่ำร้อยละ 75 โปรดปรับปรุงแฟ้มข้อสมมติให้เป็นปัจจุบัน เพราะการเปลี่ยนแปลงระหว่างปีอาจทำให้ต่ำกว่าเกณฑ์" />
                  </div>
                )}
              </div>
              <div style={{ marginTop: 24 }}>
                <h5 className="sec-h"><T en="Sensitivity — understatement % against the declared estimate" th="การวิเคราะห์ความไหว — ร้อยละที่ประมาณการต่ำไป" /></h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th />
                      <th style={{ textAlign: "center" }}><T en="Margin −1.5pt" th="อัตรากำไร −1.5" /></th>
                      <th style={{ textAlign: "center" }}><T en="Margin as set" th="อัตรากำไรตามที่ตั้ง" /></th>
                      <th style={{ textAlign: "center" }}><T en="Margin +1.5pt" th="อัตรากำไร +1.5" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sim.grid.map((row) => (
                      <tr key={row.label}>
                        <td style={{ fontWeight: 600, fontSize: 12 }}>{row.label}</td>
                        {row.cells.map((cell, i) => (
                          <td key={i} style={{ textAlign: "center", fontWeight: 800, background: cell.hot ? "var(--color-signal)" : cell.warn ? "var(--color-signal-200)" : "transparent", color: cell.hot ? "var(--color-bg)" : "inherit" }}>
                            {cell.v.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-muted" style={{ fontSize: 11, marginTop: 8 }}><T en="Cells above 25% are surcharge territory. Red means the declared estimate cannot be defended at that outcome." th="ช่องที่เกินร้อยละ 25 คือพื้นที่เสี่ยงเงินเพิ่ม สีแดงหมายถึงประมาณการที่จะยื่นไม่สามารถชี้แจงได้ในผลลัพธ์นั้น" /></div>
              </div>
            </>
          )}
        </section>

        <aside style={{ padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Reasonable-cause evidence file" th="แฟ้มหลักฐานเหตุอันสมควร" /></h5>
            <div style={{ borderTop: "2px solid var(--color-divider)" }}>
              {([
                ["a", "Board-approved budget", "งบประมาณที่คณะกรรมการอนุมัติ", "FY2026 plan signed 18 Dec 2025", "แผนปี 2569 ลงนาม 18 ธ.ค. 2568"],
                ["b", "H1 management accounts", "งบการเงินภายในครึ่งปีแรก", "Reviewed by the auditor, 24 Jul 2026", "ผู้สอบบัญชีสอบทาน 24 ก.ค. 2569"],
                ["c", "Order-book / seasonality analysis", "การวิเคราะห์คำสั่งซื้อและฤดูกาล", "Missing — needed for the H2 growth assumption", "ยังไม่มี — จำเป็นต่อข้อสมมติการเติบโตครึ่งปีหลัง"],
                ["d", "Management sign-off on assumptions", "การลงนามรับรองข้อสมมติ", "Pending CFO signature", "รอ CFO ลงนาม"],
              ] as const).map(([k, en, th, men, mth]) => (
                <label key={k} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--color-divider)", cursor: "pointer", alignItems: "flex-start" }}>
                  <input type="checkbox" checked={evid[k]} onChange={() => toggleEv(k)} style={{ accentColor: "var(--color-accent)", marginTop: 2 }} />
                  <span style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <strong><T en={en} th={th} /></strong><br />
                    <span className="text-muted"><T en={men} th={mth} /></span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h5 className="sec-h"><T en="Prior-year comparison" th="เปรียบเทียบกับปีก่อน" /></h5>
            <table className="table" style={{ fontSize: 12 }}>
              <tbody>
                <tr><td><T en="FY2025 PND51 estimate" th="ประมาณการ ภ.ง.ด.51 ปี 2568" /></td><td className="num">58,000,000</td></tr>
                <tr><td><T en="FY2025 PND50 actual" th="ผลจริง ภ.ง.ด.50 ปี 2568" /></td><td className="num">63,180,000</td></tr>
                <tr><td><T en="Understatement achieved" th="ประมาณการต่ำไป" /></td><td className="num" style={{ fontWeight: 800 }}>8.2%</td></tr>
                <tr><td><T en="Surcharge incurred" th="เงินเพิ่มที่เกิดขึ้น" /></td><td className="num">—</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h5 className="sec-h"><T en="Form fields" th="ช่องกรอกในแบบ" /></h5>
            <table className="table" style={{ fontSize: 12 }}>
              <tbody>
                <tr><td><T en="PND51" th="ภ.ง.ด.51" /> <T en="item 1 — estimated net profit" th="ข้อ 1 — ประมาณการกำไรสุทธิ" /></td><td className="num" style={{ fontWeight: 600 }}>{F(pnd51.declared)}</td></tr>
                <tr><td><T en="item 2 — tax at 20%" th="ข้อ 2 — ภาษี 20%" /></td><td className="num">{F(sim.declaredTax)}</td></tr>
                <tr><td><T en="item 3 — one half payable" th="ข้อ 3 — ชำระกึ่งหนึ่ง" /></td><td className="num" style={{ fontWeight: 800 }}>{F(sim.halfDec)}</td></tr>
                <tr><td><T en="item 4 — WHT credit" th="ข้อ 4 — เครดิตภาษีหัก ณ ที่จ่าย" /></td><td className="num">1,043,200</td></tr>
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </div>
  );
}
