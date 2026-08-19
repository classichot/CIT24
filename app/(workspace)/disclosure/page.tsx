"use client";

import { tas12NoteLines, gmt24CoveredTax, UNUSED_CREDITS, ENACTED_RATES } from "@/lib/tas12";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F, pct } from "@/lib/format";
import { ACCOUNTING_PROFIT } from "@/lib/model";

export default function DisclosurePage() {
  const { provision, adjustments, lang, tas12Enabled, setTas12Enabled, canMutate, readOnly, lawMode } = useStore();
  const t = provision.tas12;
  const note = tas12NoteLines(t, provision.currentTax);
  const feed = gmt24CoveredTax({ currentTax: provision.currentTax, dtExpense: t.dtExpense, whtCredit: provision.whtCredit, adjs: adjustments });
  const deep = lawMode === "complex";

  return (
    <div>
      <PageHead
        kickerEn="TAS 12 note · financial statements"
        kickerTh="หมายเหตุ ต.บ. 12 · งบการเงิน"
        kickerZh="TAS 12 附注"
        kickerJa="TAS 12注記"
        titleEn="Income-tax disclosure"
        titleTh="การเปิดเผยภาษีเงินได้"
        titleZh="所得税披露"
        titleJa="法人税の注記"
        subEn={deep
          ? "Major components of tax expense, recognised and unrecognised deferred tax, unused losses and credits, rate reconciling items, and Pillar Two current tax as a separate line. ETR on Current tax remains current tax ÷ PBT."
          : "Compliance disclosure: current tax and ETR (current tax ÷ PBT). Deferred lines are nil while TAS 12 is off. Pillar Two / GMT24 live in Complex mode."}
        subTh="องค์ประกอบของค่าใช้จ่ายภาษี ภาษีรอตัดบัญชีที่รับรู้และไม่รับรู้ ผลขาดทุนและเครดิตที่ยังไม่ใช้ รายการกระทบยอดอัตรา และภาษีเสาหลักสองแยกบรรทัด"
        actions={
          <div className="seg">
            <label className="seg-opt">
              <input type="radio" name="tas12d" checked={tas12Enabled} disabled={readOnly || !canMutate} onChange={() => setTas12Enabled(true)} />
              <span><T en="TAS 12 on" th="ต.บ. 12 เปิด" /></span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="tas12d" checked={!tas12Enabled} disabled={readOnly || !canMutate} onChange={() => setTas12Enabled(false)} />
              <span><T en="TAS 12 off" th="ต.บ. 12 ปิด" /></span>
            </label>
          </div>
        }
      />

      {!tas12Enabled && (
        <div className="callout" style={{ marginTop: 16 }}>
          {deep
            ? <T en="TAS 12 deferred tax is off. Disclosure below shows current tax only; deferred lines are nil. GMT24 still receives the Pillar Two exception with deferred covered-tax of 0." th="ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิดอยู่ หมายเหตุด้านล่างแสดงภาษีงวดปัจจุบันเท่านั้น บรรทัดรอตัดบัญชีเป็นศูนย์ GMT24 ยังได้รับข้อยกเว้นเสาหลักสองพร้อมภาษีรอตัดบัญชี 0" />
            : <T en="TAS 12 deferred tax is off (Compliance default). Disclosure shows current tax only. ETR is current tax ÷ PBT." th="ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิด (ค่าเริ่มต้นเกณฑ์ขั้นต่ำ) หมายเหตุแสดงภาษีงวดปัจจุบันเท่านั้น ETR คือภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี" />}
        </div>
      )}

      <div className="stat-row" style={{ gridTemplateColumns: deep ? "repeat(4, 1fr)" : "repeat(3, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell"><div className="stat-label"><T en="Current tax" th="ภาษีงวดปัจจุบัน" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(provision.currentTax)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Deferred tax" th="ภาษีรอตัดบัญชี" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.dtExpense)}</div></div>
        <div className="stat-cell"><div className="stat-label"><T en="Tax expense" th="ค่าใช้จ่ายภาษี" /></div><div className="stat-val" style={{ fontSize: 24, color: "var(--color-accent)" }}>{F(t.taxExpense)}</div></div>
        {deep && (
          <div className="stat-cell"><div className="stat-label"><T en="Pillar Two current tax" th="ภาษีเสาหลักสอง" /></div><div className="stat-val" style={{ fontSize: 24 }}>{F(t.pillarTwo.currentTax, true)}</div><div className="stat-hint"><T en="Separate line · no P2 DTA/DTL" th="แยกบรรทัด · ไม่มี DTA/DTL จาก P2" /></div></div>
        )}
      </div>

      <div className="split-wide">
        <section className="col-pad border-r">
          <h5 className="sec-h"><T en="Major components of income-tax expense" th="องค์ประกอบหลักของค่าใช้จ่ายภาษีเงินได้" /></h5>
          <table className="table">
            <thead><tr><th><T en="Component" th="รายการ" /></th><th className="num">THB</th></tr></thead>
            <tbody>
              {note.filter((n) => deep || !/Pillar Two/.test(n.en)).map((n) => (
                <tr key={n.en} style={{ fontWeight: n.en === "Income tax expense" ? 800 : 500 }}>
                  <td>{lang === "th" ? n.th : n.en}</td>
                  <td className="num">{F(n.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Recognised deferred tax by origin" th="ภาษีรอตัดบัญชีที่รับรู้ตามที่มา" /></h5>
          {tas12Enabled ? (
          <table className="table">
            <thead>
              <tr>
                <th><T en="Origin" th="ที่มา" /></th>
                <th className="num">DTA</th>
                <th className="num">DTL</th>
              </tr>
            </thead>
            <tbody>
              {t.lines.filter((l) => !l.exception).map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td className="num">{l.kind === "DTA" ? F(l.recognised, true) : "—"}</td>
                  <td className="num">{l.kind === "DTL" ? F(l.recognised, true) : "—"}</td>
                </tr>
              ))}
              <tr>
                <td><T en="Unused tax losses" th="ผลขาดทุนที่ยังไม่ใช้" /></td>
                <td className="num">{F(t.lossDtClose, true)}</td>
                <td className="num">—</td>
              </tr>
              <tr>
                <td><T en="Unused tax credits" th="เครดิตภาษีที่ยังไม่ใช้" /></td>
                <td className="num">{F(t.creditDt, true)}</td>
                <td className="num">—</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 800 }}><T en="Recognised" th="รับรู้" /></td>
                <td className="num" style={{ fontWeight: 800 }}>{F(t.dtaRecognised)}</td>
                <td className="num" style={{ fontWeight: 800 }}>{F(t.dtlRecognised)}</td>
              </tr>
            </tbody>
          </table>
          ) : (
            <p className="text-muted" style={{ fontSize: 13 }}><T en="Deferred-tax balances are not booked while TAS 12 deferred tax is off." th="ไม่บันทึกยอดภาษีรอตัดบัญชีขณะปิด ต.บ. 12" /></p>
          )}

          {tas12Enabled && deep && (
            <>
          <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Unrecognised deferred tax" th="ภาษีรอตัดบัญชีที่ไม่รับรู้" /></h5>
          <table className="table">
            <thead><tr><th><T en="Reason" th="เหตุผล" /></th><th className="num">THB</th></tr></thead>
            <tbody>
              {t.lines.filter((l) => l.unrecognised).map((l) => (
                <tr key={l.id}><td>{l.name} · {l.exception ?? "allowance"}</td><td className="num">{F(l.unrecognised)}</td></tr>
              ))}
              <tr><td><T en="Pillar Two (mandatory exception)" th="เสาหลักสอง (ข้อยกเว้นบังคับ)" /></td><td className="num">{F(t.pillarTwo.hypotheticalDtBlocked, true)}</td></tr>
            </tbody>
          </table>
            </>
          )}

          <h5 className="sec-h" style={{ marginTop: 24 }}><T en="Unused losses and credits — expiry" th="ผลขาดทุนและเครดิตที่ยังไม่ใช้ — วันหมดอายุ" /></h5>
          <table className="table">
            <thead><tr><th>ID</th><th><T en="Item" th="รายการ" /></th><th className="num"><T en="Amount" th="จำนวน" /></th><th><T en="Expires" th="หมดอายุ" /></th></tr></thead>
            <tbody>
              <tr><td>LOSS-21</td><td><T en="Tax loss FY2021 (utilised this year)" th="ขาดทุนปี 2564 (ใช้ปีนี้)" /></td><td className="num">{F(t.lossUtilised)}</td><td>FY2026</td></tr>
              {deep && UNUSED_CREDITS.map((c) => (
                <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td className="num">{F(c.amount)}</td><td>{c.expires}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="col-aside">
          <h5 className="sec-h"><T en="Rate applied" th="อัตราที่ใช้" /></h5>
          {(deep ? ENACTED_RATES : ENACTED_RATES.filter((r) => r.id !== "p2-15")).map((r) => (
            <div key={r.id} className="wf-row" style={{ fontSize: 12 }}>
              <span>{r.en}</span>
              <span>{pct(r.rate, 0)}</span>
            </div>
          ))}
          <div className="wf-row"><span>PBT</span><span className="num">{F(ACCOUNTING_PROFIT)}</span></div>
          <div className="wf-row"><span><T en="Current-tax ETR (unchanged identity)" th="ETR ภาษีงวดปัจจุบัน (ไม่เปลี่ยนสูตร)" /></span><span className="num">{(provision.etr * 100).toFixed(2)}%</span></div>

          {deep && (
            <>
          <h5 className="sec-h" style={{ marginTop: 16 }}><T en="Pillar Two / GMT24" th="เสาหลักสอง / GMT24" /></h5>
          <p style={{ fontSize: 13, lineHeight: 1.55 }}>{t.pillarTwo.exposure}</p>
          <p className="text-muted" style={{ fontSize: 12 }}>{t.pillarTwo.exception}</p>
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", background: "var(--color-surface)", padding: 12, marginTop: 8 }}>
            {JSON.stringify(feed, null, 2)}
          </pre>

          <h5 className="sec-h" style={{ marginTop: 16 }}><T en="Other TAS 12 matters" th="เรื่องอื่นตาม ต.บ. 12" /></h5>
          <p className="text-muted" style={{ fontSize: 12, lineHeight: 1.5 }}>{t.utp}</p>
          <p className="text-muted" style={{ fontSize: 12 }}><T en="Deferred tax in OCI: nil. No goodwill. No initial-recognition items this period." th="ภาษีรอตัดบัญชีใน OCI: ไม่มี ไม่มีค่าความนิยม ไม่มีรายการรับรู้ครั้งแรกในปีนี้" /></p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
