"use client";

import { ENACTED_RATES } from "@/lib/tas12";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { F } from "@/lib/format";
import Link from "next/link";

export default function EntityPage() {
  const { clientId, losses, provision, whtCredit, locked, lawMode, boiEnabled, clients } = useStore();
  const c = clients.find((x) => x.id === clientId) ?? clients[0];
  const deep = lawMode === "complex";

  return (
    <div>
      <PageHead
        kickerEn="Entity and tax profile"
        kickerTh="โปรไฟล์กิจการและภาษี"
        titleEn={c.name}
        titleTh={c.nameTh}
        subEn={`TIN ${c.tin} · HQ · ${c.fyLabel}`}
        subTh={`เลขประจำตัวผู้เสียภาษี ${c.tin} · สำนักงานใหญ่ · ${c.fyLabel}`}
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <div className="panel-head"><h4><T en="Tax profile" th="โปรไฟล์ภาษี" /></h4></div>
          <div className="panel-body">
            {[
              ["Tax ID", "เลขผู้เสียภาษี", c.tin],
              ["Accounting period", "รอบบัญชี", c.fyLabel],
              ["Rate profile", "อัตราภาษี", c.rateProfile === "sme" ? "SME" : c.rateProfile === "listed" ? "Listed / financial" : "Normal 20% · substantively enacted"],
              ["Deferred-tax rate", "อัตราภาษีรอตัดบัญชี", `${Math.round(provision.tas12.rate * 100)}% · TAS 12 (scenario on Deferred tax)`],
              ["Foreign current tax", "ภาษีต่างประเทศงวดปัจจุบัน", "None this period"],
              ...(deep ? [["Pillar Two", "เสาหลักสอง", "Out of scope · no P2 DTA/DTL"] as const] : []),
              ["TAS 12 deferred tax", "ภาษีรอตัดบัญชี ต.บ. 12", provision.tas12.enabled ? "On · live DTA/DTL" : "Off · current tax only"],
              ["PND51 method", "วิธี ภ.ง.ด.51", c.pnd51Method === "67bis2" ? "s.67 bis (2) actual six-month" : "s.67 bis (1) estimated annual"],
              ["Functional currency", "สกุลเงินหลัก", "THB"],
              ["Filing PND51", "ยื่น ภ.ง.ด.51", "Within 2 months after first six months"],
              ["Filing PND50", "ยื่น ภ.ง.ด.50", "Within 150 days after year-end"],
            ].map(([en, th, v]) => (
              <div key={en} className="wf-row"><span><T en={en} th={th} /></span><span>{v}</span></div>
            ))}
            <div className="wf-row">
              <span>BOI</span>
              <span>
                <Link href="/boi">
                  {boiEnabled
                    ? <T en="Module on · open desk" th="โมดูลเปิด · เปิดโต๊ะ" />
                    : <T en="Off — open BOI desk to turn on" th="ปิด — เปิดโต๊ะ BOI เพื่อเปิดโมดูล" />}
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4><T en="Roles" th="บทบาท" /></h4></div>
          <div className="panel-body">
            {[
              ["Data preparer", "ผู้จัดทำข้อมูล", "Somchai W."],
              ["Tax preparer", "ผู้จัดทำภาษี", "Nattaya P."],
              ["Tax reviewer", "ผู้สอบทาน", "Kanit S."],
              ["Approver / CFO", "ผู้อนุมัติ / CFO", "Pornthip R."],
              ["External auditor", "ผู้สอบบัญชี", "SGV Audit · read-only"],
              ["Adviser", "ที่ปรึกษา", "Kanit & Partners"],
            ].map(([en, th, v]) => (
              <div key={en} className="wf-row"><span><T en={en} th={th} /></span><span>{v}</span></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4><T en="Opening balances" th="ยอดยกมา" /></h4></div>
          <div className="panel-body">
            <div className="wf-row"><span><T en="Tax-loss FY2021 (expires FY2026)" th="ผลขาดทุนปี 2564 (หมดอายุปี 2569)" /></span><span>{F(losses.find((y) => y.fy === "FY2021")?.origin ?? 12000000)}</span></div>
            <div className="wf-row"><span><T en="Utilised this year" th="ใช้ในปีนี้" /></span><span>{F(provision.losses)}</span></div>
            <div className="wf-row"><span><T en="WHT receivable (matched)" th="ลูกหนี้ภาษีหัก ณ ที่จ่าย (จับคู่แล้ว)" /></span><span>{F(whtCredit)}</span></div>
            <div className="wf-row"><span><T en="Prior PND50 taxable profit" th="กำไรทางภาษี ภ.ง.ด.50 ปีก่อน" /></span><span>63,180,000</span></div>
            <div className="wf-row"><span><T en="Related parties (TP24)" th="กิจการที่เกี่ยวข้อง (TP24)" /></span><span>4 counterparties</span></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4><T en="Deadlines" th="กำหนดเวลา" /></h4></div>
          <div className="panel-body">
            <div className="wf-row"><span><T en="PND51" th="ภ.ง.ด.51" /></span><span style={{ color: "var(--color-signal)", fontWeight: 800 }}>31 Aug 2026 · 13 days</span></div>
            <div className="wf-row"><span><T en="PND50" th="ภ.ง.ด.50" /></span><span>30 May 2027</span></div>
            <div className="wf-row"><span><T en="Period lock" th="ล็อกงวด" /></span><span>{locked ? "Locked" : "Open · continuous close to 31 Jul"}</span></div>
          </div>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h4><T en="Enacted tax rates (TAS 12)" th="อัตราภาษีที่ประกาศใช้ (ต.บ. 12)" /></h4></div>
        <div className="panel-body">
          <div className="table-wrap">
            <table className="table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th><T en="Rate" th="อัตรา" /></th>
                <th className="num">%</th>
                <th><T en="Enacted" th="ประกาศใช้" /></th>
                <th><T en="Status" th="สถานะ" /></th>
                <th><T en="Deferred tax" th="ภาษีรอตัดบัญชี" /></th>
              </tr>
            </thead>
            <tbody>
              {ENACTED_RATES.filter((r) => deep || r.id !== "p2-15").map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.en}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{r.note}</div>
                  </td>
                  <td className="num">{Math.round(r.rate * 100)}%</td>
                  <td>{r.enacted}</td>
                  <td>{r.status}</td>
                  <td>{r.appliesToDt ? (provision.tas12.enabled && provision.tas12.rate === r.rate ? "Applied this close" : "Available") : "No DTA/DTL"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h4><T en="Tax-loss schedule (FIFO)" th="ตารางผลขาดทุน (ใช้ปีเก่าก่อน)" /></h4>
          <Link href="/losses" className="btn btn-ghost" style={{ padding: 0 }}><T en="Open workpaper" th="เปิดกระดาษทำการ" /> →</Link>
        </div>
        <div className="panel-body">
          {losses.map((y) => (
            <div key={y.fy} className="wf-row">
              <span>{y.fy} · exp {y.expires}</span>
              <span>{F(y.utilised, true)} used · {F(y.remaining, true)} left</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
