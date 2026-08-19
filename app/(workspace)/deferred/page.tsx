"use client";

import { ENACTED_RATES, UNUSED_CREDITS } from "@/lib/tas12";
import { useStore } from "@/lib/store";
import { PageHead, statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";
import Link from "next/link";

export default function DeferredPage() {
  const {
    provision, reversals, claimReversal, canMutate, dtRate, setDtRate,
    recoverabilityConfirmed, confirmRecoverability, isCfo, tas12Enabled, setTas12Enabled, readOnly, lawMode,
  } = useStore();
  const t = provision.tas12;
  const rec = t.recoverability;
  const locked = readOnly || !canMutate;
  const deep = lawMode === "complex";

  return (
    <div>
      <PageHead
        kickerEn="TAS 12 engine · carrying amount vs tax base"
        kickerTh="เครื่องยนต์ ต.บ. 12 · มูลค่าตามบัญชีกับฐานภาษี"
        kickerZh="TAS 12 引擎 · 账面价值与计税基础"
        kickerJa="TAS 12エンジン · 帳簿価額と税務基準"
        titleEn="Deferred tax"
        titleTh="ภาษีเงินได้รอการตัดบัญชี"
        titleZh="递延所得税"
        titleJa="繰延税金"
        subEn={deep
          ? "Toggle TAS 12 deferred tax on to book live DTA/DTL. Off leaves current tax, PND50 and ETR unchanged. ETR is always current tax ÷ PBT."
          : "Compliance bar: current tax still works. Full DTA/DTL register, recoverability memo, unused FTC and Pillar Two exception live in Complex mode. ETR is always current tax ÷ PBT."}
        subTh="เปิดภาษีรอตัดบัญชีตาม ต.บ. 12 เพื่อบันทึก DTA/DTL สด ปิดแล้วภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยน ETR คือภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษีเสมอ"
        actions={
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="text-muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <T en="TAS 12 deferred tax" th="ภาษีรอตัดบัญชี ต.บ. 12" />
              </div>
              <div className="seg">
                <label className="seg-opt">
                  <input type="radio" name="tas12" checked={tas12Enabled} disabled={locked} onChange={() => setTas12Enabled(true)} />
                  <span><T en="On" th="เปิด" /></span>
                </label>
                <label className="seg-opt">
                  <input type="radio" name="tas12" checked={!tas12Enabled} disabled={locked} onChange={() => setTas12Enabled(false)} />
                  <span><T en="Off" th="ปิด" /></span>
                </label>
              </div>
            </div>
            {tas12Enabled && deep && (
              <>
                <div className="seg">
                  <label className="seg-opt"><input type="radio" name="dtr" checked={dtRate === 0.2} onChange={() => setDtRate(0.2)} /><span>20%</span></label>
                  <label className="seg-opt"><input type="radio" name="dtr" checked={dtRate === 0.15} onChange={() => setDtRate(0.15)} /><span>15% SME</span></label>
                </div>
                <button className="btn btn-primary" onClick={confirmRecoverability} disabled={!isCfo || recoverabilityConfirmed}>
                  {recoverabilityConfirmed ? <T en="Recoverability signed" th="ลงนามความสามารถในการใช้แล้ว" /> : <T en="CFO sign recoverability" th="CFO ลงนามความสามารถในการใช้" />}
                </button>
              </>
            )}
          </>
        }
      />

      {!tas12Enabled && (
        <div className="callout" style={{ marginTop: 16 }}>
          <strong><T en="TAS 12 deferred tax is off." th="ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิดอยู่" /></strong>{" "}
          {deep
            ? <T en="No DTA/DTL movement, deferred tax expense, or TAS 12 tax-expense journal is booked. Current tax, PND50 and ETR (current tax ÷ PBT) are unchanged." th="ไม่บันทึกการเคลื่อนไหว DTA/DTL ค่าใช้จ่ายภาษีรอตัดบัญชี หรือรายการบัญชีค่าใช้จ่ายภาษีตาม ต.บ. 12 ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยน" />
            : <T en="Compliance default. Current tax, PND50 and ETR are unchanged. Switch to Complex (or turn TAS 12 on) for the full deferred-tax engine." th="ค่าเริ่มต้นของเกณฑ์ขั้นต่ำ ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยน สลับเป็นครบทุกกฎหมายหรือเปิด ต.บ. 12 เพื่อเครื่องภาษีรอตัดบัญชีเต็ม" />}
        </div>
      )}

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(5, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="DTA recognised" th="DTA ที่รับรู้" /></div><div className="stat-val" style={{ fontSize: 24, color: "var(--color-accent)" }}>{F(t.dtaRecognised)}</div><div className="stat-hint">{tas12Enabled ? `${pct(t.rate, 0)} · TAS 12` : "Off"}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="DTL recognised" th="DTL ที่รับรู้" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.dtlRecognised)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Unrecognised" th="ไม่รับรู้" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.unrecognisedDta + t.unrecognisedDtl)}</div><div className="stat-hint"><T en="Outside basis + exception" th="ฐานภายนอก + ข้อยกเว้น" /></div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Deferred tax expense" th="ค่าใช้จ่ายภาษีรอตัดบัญชี" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.dtExpense)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Income tax expense" th="ค่าใช้จ่ายภาษีรวม" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.taxExpense)}</div><div className="stat-hint">{tas12Enabled ? <T en="Current + deferred · not used in ETR" th="ปัจจุบัน + รอตัด · ไม่ใช้ใน ETR" /> : <T en="Current tax only · ETR unchanged" th="ภาษีงวดปัจจุบันเท่านั้น · ETR ไม่เปลี่ยน" />}</div></div>
      </div>

      {tas12Enabled ? (
      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Temporary-difference movement" th="ตารางเคลื่อนไหวผลต่างชั่วคราว" /></h5>
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th><T en="Position" th="รายการ" /></th>
                <th>P/T</th>
                <th className="num"><T en="Opening" th="ยกมา" /></th>
                <th className="num"><T en="Addition" th="เพิ่ม" /></th>
                <th className="num"><T en="Reversal" th="กลับ" /></th>
                <th className="num"><T en="Closing TD" th="ยกไป" /></th>
                <th className="num">DT</th>
                <th><T en="When" th="เมื่อ" /></th>
              </tr>
            </thead>
            <tbody>
              {t.lines.filter((l) => l.origin === "temporary").map((l) => (
                <tr key={l.id} style={{ background: l.kind === "DTL" ? "color-mix(in srgb, var(--color-accent) 6%, transparent)" : undefined }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.name}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{l.gl} · {l.exception ?? l.kind}</div>
                  </td>
                  <td><span className={l.kind === "DTA" ? "tag tag-accent" : "tag tag-outline"}>{l.kind}</span></td>
                  <td className="num">{F(l.open)}</td>
                  <td className="num">{F(l.add, true)}</td>
                  <td className="num">{F(l.rev, true)}</td>
                  <td className="num" style={{ fontWeight: 800 }}>{F(l.close)}</td>
                  <td className="num">{F(l.recognised || (l.exception ? 0 : l.dtClose))}</td>
                  <td style={{ fontSize: 12 }}>{l.when}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <div style={{ fontWeight: 600 }}><T en="Tax-loss carry-forward" th="ผลขาดทุนยกไป" /></div>
                  <div className="text-muted" style={{ fontSize: 11 }}>s.65 FIFO</div>
                </td>
                <td><span className="tag tag-accent">DTA</span></td>
                <td className="num">{F(t.lossOpen)}</td>
                <td className="num">—</td>
                <td className="num">{F(-t.lossUtilised, true)}</td>
                <td className="num" style={{ fontWeight: 800 }}>{F(t.lossClose)}</td>
                <td className="num">{F(t.lossDtClose, true)}</td>
                <td style={{ fontSize: 12 }}>FY2026 expiry</td>
              </tr>
              {UNUSED_CREDITS.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{c.source}</div>
                  </td>
                  <td><span className="tag tag-accent">DTA</span></td>
                  <td className="num">{F(c.amount)}</td>
                  <td className="num">—</td>
                  <td className="num">—</td>
                  <td className="num" style={{ fontWeight: 800 }}>{F(c.amount)}</td>
                  <td className="num">{F(t.creditDt)}</td>
                  <td style={{ fontSize: 12 }}>{c.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Tax-base register" th="ทะเบียนฐานภาษี" /></h5>
          <div className="table-wrap">
            <table className="table">
            <thead>
              <tr>
                <th><T en="Item" th="รายการ" /></th>
                <th className="num"><T en="Carrying amount" th="มูลค่าตามบัญชี" /></th>
                <th className="num"><T en="Tax base" th="ฐานภาษี" /></th>
                <th className="num"><T en="Temporary difference" th="ผลต่างชั่วคราว" /></th>
                <th><T en="Kind" th="ประเภท" /></th>
                <th className="num"><T en="Recognised" th="รับรู้" /></th>
                <th className="num"><T en="Unrecognised" th="ไม่รับรู้" /></th>
              </tr>
            </thead>
            <tbody>
              {t.lines.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.name}</td>
                  <td className="num">{l.id === "TB-PPE" ? "—" : F(l.carrying)}</td>
                  <td className="num">{l.id === "TB-PPE" ? F(l.taxBase) : F(l.taxBase, true)}</td>
                  <td className="num">{F(l.close)}</td>
                  <td>{l.kind}{l.exception ? ` · ${l.exception}` : ""}</td>
                  <td className="num">{F(l.recognised, true)}</td>
                  <td className="num">{F(l.unrecognised, true)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ fontWeight: 800 }}><T en="Tax-loss carry-forward" th="ผลขาดทุนยกไป" /></td>
                <td className="num">—</td>
                <td className="num">{F(t.lossClose, true)}</td>
                <td className="num">{F(t.lossClose, true)}</td>
                <td>DTA · loss</td>
                <td className="num">{F(t.lossDtClose, true)}</td>
                <td className="num">—</td>
              </tr>
              {deep && UNUSED_CREDITS.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 800 }}>{c.name}</td>
                  <td className="num">—</td>
                  <td className="num">{F(c.amount)}</td>
                  <td className="num">—</td>
                  <td>DTA · credit</td>
                  <td className="num">{F(t.creditDt)}</td>
                  <td className="num">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
        <aside className="col-aside">
          <h5 className="sec-h" style={{ color: "var(--color-accent)" }}><T en="Enacted rates" th="อัตราที่ประกาศใช้" /></h5>
          {(deep ? ENACTED_RATES : ENACTED_RATES.filter((r) => r.id !== "p2-15")).map((r) => (
            <div key={r.id} className="wf-row" style={{ fontSize: 12 }}>
              <span>{r.en}<div className="text-muted">{r.status}</div></span>
              <span className="num">{pct(r.rate, 0)}{r.appliesToDt && dtRate === r.rate ? " · DT" : ""}</span>
            </div>
          ))}
          <div className="callout" style={{ fontSize: 12, marginTop: 8 }}>
            <T en="Current tax stays at 20% (PND50). The 15% control restates DTA/DTL only." th="ภาษีงวดปัจจุบันคง 20% (ภ.ง.ด.50) ปุ่ม 15% ปรับ DTA/DTL เท่านั้น" />
          </div>

          {deep && (
            <>
          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="DTA recoverability" th="ความสามารถในการใช้ DTA" /></h5>
          <div className="wf-row"><span><T en="Forecast PBT × 5 years" th="กำไรพยากรณ์ × 5 ปี" /></span><span className="num">{F(rec.supportable)}</span></div>
          <div className="wf-row"><span><T en="Deductible TDs needed" th="ผลต่างที่ต้องใช้กำไร" /></span><span className="num">{F(rec.needed)}</span></div>
          <div className="wf-row"><span><T en="Valuation allowance" th="ค่าเผื่อ" /></span><span className="num">{F(rec.allowance, true)}</span></div>
          <p className="text-muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>{rec.conclusion}</p>
          <span className={statusCls(recoverabilityConfirmed ? "Approved" : "In review")}>{recoverabilityConfirmed ? "CFO signed" : "Unsigned"}</span>

          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="Exceptions (not recognised)" th="ข้อยกเว้น (ไม่รับรู้)" /></h5>
          {t.exceptions.map((e) => (
            <p key={e.id} className="text-muted" style={{ fontSize: 12, lineHeight: 1.45 }}>{e.en}</p>
          ))}
          <p className="text-muted" style={{ fontSize: 12 }}>{t.utp}</p>
          <p className="text-muted" style={{ fontSize: 12 }}><T en="OCI deferred tax this period: nil." th="ภาษีรอตัดบัญชีผ่านกำไรขาดทุนเบ็ดเสร็จอื่น: ไม่มี" /></p>
            </>
          )}

          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="Reversal Guardian" th="ผู้เฝ้าระวังการกลับรายการ" /></h5>
          {reversals.map((r) => (
            <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                <span className={statusCls(r.status)}>{r.status}</span>
              </div>
              <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{r.note}</div>
              {r.status === "Action needed" && (
                <button className="btn btn-ghost" style={{ paddingLeft: 0 }} disabled={!canMutate} onClick={() => claimReversal(r.id)}><T en="Claim deduction" th="ขอหักรายจ่าย" /> →</button>
              )}
            </div>
          ))}
          <Link href="/disclosure" className="btn btn-secondary btn-block" style={{ marginTop: 12 }}><T en="TAS 12 disclosure note" th="หมายเหตุ ต.บ. 12" /></Link>
        </aside>
      </div>
      ) : (
      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Not booked while TAS 12 is off" th="ไม่บันทึกขณะปิด ต.บ. 12" /></h5>
          <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.55 }}>
            <T en="Temporary-difference movement, the tax-base register, recoverability and the 15% DT restatement stay on this screen only when TAS 12 deferred tax is on." th="ตารางเคลื่อนไหวผลต่างชั่วคราว ทะเบียนฐานภาษี ความสามารถในการใช้ และอัตรา 15% แสดงเมื่อเปิดภาษีรอตัดบัญชีตาม ต.บ. 12 เท่านั้น" />
          </p>
        </section>
        <aside className="col-aside">
          <h5 className="sec-h"><T en="Still in force" th="ยังใช้ได้" /></h5>
          {deep ? (
            <>
              <p className="text-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>{t.pillarTwo.exception}</p>
              <p className="text-muted" style={{ fontSize: 12 }}>{t.utp}</p>
            </>
          ) : (
            <p className="text-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              <T en="Current tax, PND50 and ETR continue. Open Complex mode for recoverability, unused FTC, outside-basis, TFRIC 23 and the Pillar Two exception." th="ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ยังทำงาน เปิดโหมดครบทุกกฎหมายเพื่อความสามารถในการใช้ เครดิตที่ยังไม่ใช้ ฐานภายนอก TFRIC 23 และข้อยกเว้นเสาหลักสอง" />
            </p>
          )}
          <h5 className="sec-h" style={{ marginTop: 18 }}><T en="Reversal Guardian" th="ผู้เฝ้าระวังการกลับรายการ" /></h5>
          {reversals.map((r) => (
            <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                <span className={statusCls(r.status)}>{r.status}</span>
              </div>
              <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{r.note}</div>
            </div>
          ))}
        </aside>
      </div>
      )}
    </div>
  );
}
