"use client";

import { CLIENTS } from "@/lib/model";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { T } from "@/lib/i18n";

export default function EntityPage() {
  const { clientId } = useStore();
  const c = CLIENTS.find((x) => x.id === clientId) ?? CLIENTS[0];

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
              ["Rate profile", "อัตราภาษี", c.rateProfile === "sme" ? "SME" : c.rateProfile === "listed" ? "Listed / financial" : "Normal 20%"],
              ["ภ.ง.ด.51 method", "วิธี ภ.ง.ด.51", c.pnd51Method === "67bis2" ? "s.67 bis (2) actual six-month" : "s.67 bis (1) estimated annual"],
              ["BOI", "BOI", c.boi ? "Promoted project on file" : "Non-BOI · MVP profile"],
              ["Functional currency", "สกุลเงินหลัก", "THB"],
              ["Filing ภ.ง.ด.51", "ยื่น ภ.ง.ด.51", "Within 2 months after first six months"],
              ["Filing ภ.ง.ด.50", "ยื่น ภ.ง.ด.50", "Within 150 days after year-end"],
            ].map(([en, th, v]) => (
              <div key={en} className="wf-row"><span><T en={en} th={th} /></span><span>{v}</span></div>
            ))}
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
            <div className="wf-row"><span><T en="Tax-loss FY2021 (expires FY2026)" th="ผลขาดทุนปี 2564 (หมดอายุปี 2569)" /></span><span>12,000,000</span></div>
            <div className="wf-row"><span><T en="WHT receivable opening" th="ลูกหนี้ภาษีหัก ณ ที่จ่ายยกมา" /></span><span>412,800</span></div>
            <div className="wf-row"><span><T en="Prior ภ.ง.ด.50 taxable profit" th="กำไรทางภาษี ภ.ง.ด.50 ปีก่อน" /></span><span>63,180,000</span></div>
            <div className="wf-row"><span><T en="Related parties (TP24)" th="กิจการที่เกี่ยวข้อง (TP24)" /></span><span>4 counterparties</span></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4><T en="Deadlines" th="กำหนดเวลา" /></h4></div>
          <div className="panel-body">
            <div className="wf-row"><span>ภ.ง.ด.51</span><span style={{ color: "var(--color-signal)", fontWeight: 800 }}>31 Aug 2026 · 13 days</span></div>
            <div className="wf-row"><span>ภ.ง.ด.50</span><span>30 May 2027</span></div>
            <div className="wf-row"><span><T en="Period lock" th="ล็อกงวด" /></span><span>Open · continuous close to 31 Jul</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
