"use client";

import Link from "next/link";
import { PLAYBOOK_ROWS, PLAYBOOK_SAME, PLAYBOOK_STEPS } from "@/lib/playbook";
import { rulesForLawMode, complexRuleCount } from "@/lib/rules";
import { corpusForLawMode, corpusStats } from "@/lib/corpus";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { LawToggle } from "@/components/LawToggle";
import { T } from "@/lib/i18n";

export default function PlaybookPage() {
  const { lawMode, corpus, setLawMode } = useStore();
  const barRules = rulesForLawMode("compliance").length;
  const allRules = rulesForLawMode("complex").length;
  const extraRules = complexRuleCount();
  const barCorp = corpusStats(corpusForLawMode(corpus, "compliance"));
  const allCorp = corpusStats(corpus);

  return (
    <div>
      <PageHead
        kickerEn="Law-depth playbook"
        kickerTh="คู่มือความลึกกฎหมาย"
        kickerZh="法规深度手册"
        kickerJa="法令深度プレイブック"
        titleEn="Compliance vs Complex"
        titleTh="เกณฑ์ขั้นต่ำกับครบทุกกฎหมาย"
        titleZh="合规与完整"
        titleJa="コンプライアンスとコンプレックス"
        subEn="Law depth is not a role. Compliance is the acceptable filing bar. Complex loads every related law. ETR is always current tax ÷ PBT."
        subTh="ความลึกกฎหมายไม่ใช่บทบาท เกณฑ์ขั้นต่ำคือเกณฑ์ยื่นที่ยอมรับได้ โหมดครบโหลดทุกกฎหมายเกี่ยวเนื่อง ETR เป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษีเสมอ"
        actions={
          <>
            <LawToggle />
            <Link href="/settings" className="btn btn-secondary"><T en="Settings" th="ตั้งค่า" /></Link>
          </>
        }
      />

      <div className="callout" style={{ marginTop: 16 }}>
        <strong><T en={`You are in ${lawMode === "compliance" ? "Compliance" : "Complex"}.`} th={`ตอนนี้อยู่โหมด${lawMode === "compliance" ? "เกณฑ์ขั้นต่ำ" : "ครบทุกกฎหมาย"}`} /></strong>{" "}
        <T en={`${barRules} bar rules · ${allRules} in the full pack (${extraRules} Complex-only). Corpus ${barCorp.total} on the bar · ${allCorp.total} in Complex (${allCorp.stale} obsolete / superseded).`} th={`กฎเกณฑ์ยื่น ${barRules} ข้อ · ชุดเต็ม ${allRules} (${extraRules} ข้อเฉพาะโหมดครบ) คลัง ${barCorp.total} ฉบับบนเกณฑ์ยื่น · ${allCorp.total} ในโหมดครบ (ล้าสมัย/ถูกแทนที่ ${allCorp.stale})`} />
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head"><h4><T en="Compliance — acceptable bar" th="เกณฑ์ขั้นต่ำ — เกณฑ์ยื่น" /></h4></div>
          <div className="panel-body" style={{ fontSize: 14, lineHeight: 1.55 }}>
            <T en="File and provision without loading TAS 12 DTL, Pillar Two, BOI segregation or superseded history. s.65 taxable profit, 5-year FIFO losses, material 65 bis/ter, s.67 bis PND51, WHT, PND50, RD 145 if PPE exists." th="ยื่นและตั้งประมาณการโดยไม่โหลด DTL ต.บ. 12 เสาหลักสอง การแยก BOI หรือประวัติที่ถูกแทนที่ ม.65 กำไรสุทธิ ขาดทุน 5 ปี FIFO บวกกลับสาระสำคัญ ม.67 ทวิ ภ.ง.ด.51 เครดิต ณ ที่จ่าย ภ.ง.ด.50 พ.ร.ฎ. 145 ถ้ามีสินทรัพย์ถาวร" />
            <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} disabled={lawMode === "compliance"} onClick={() => setLawMode("compliance")}>
              <T en="Use Compliance" th="ใช้เกณฑ์ขั้นต่ำ" />
            </button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h4><T en="Complex — every related law" th="ครบทุกกฎหมาย — กฎหมายเกี่ยวเนื่องทั้งหมด" /></h4></div>
          <div className="panel-body" style={{ fontSize: 14, lineHeight: 1.55 }}>
            <T en="Full rule pack and corpus. TAS 12 deferred defaults on. GMT24 / TFRIC 23 / TAS 34 / TP GloBE are visible. BOI is a separate module you still turn on. Use when the file is promoted, needs an FS tax note, or a law alert says the bar is not enough." th="คลังกฎและกฎหมายเต็ม ต.บ. 12 รอตัดเปิดเป็นค่าเริ่มต้น เห็น GMT24 / TFRIC 23 / ต.บ. 34 / GloBE จาก TP BOI เป็นโมดูลแยกที่ยังต้องเปิดเอง ใช้เมื่อแฟ้มมีส่งเสริม ต้องการหมายเหตุภาษีในงบ หรือการแจ้งเตือนบอกว่าเกณฑ์ยื่นไม่พอ" />
            <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} disabled={lawMode === "complex"} onClick={() => setLawMode("complex")}>
              <T en="Use Complex" th="ใช้ครบทุกกฎหมาย" />
            </button>
          </div>
        </div>
      </div>

      <h5 className="sec-h" style={{ marginTop: 24 }}><T en="What differs" th="สิ่งที่ต่างกัน" /></h5>
      <div className="table-wrap">
        <table className="table">
        <thead>
          <tr>
            <th><T en="Topic" th="หัวข้อ" /></th>
            <th><T en="Compliance" th="เกณฑ์ขั้นต่ำ" /></th>
            <th><T en="Complex" th="ครบทุกกฎหมาย" /></th>
          </tr>
        </thead>
        <tbody>
          {PLAYBOOK_ROWS.map((r) => (
            <tr key={r.topic.en}>
              <td style={{ fontWeight: 700, width: "18%" }}><T en={r.topic.en} th={r.topic.th} /></td>
              <td style={{ fontSize: 13 }}><T en={r.compliance.en} th={r.compliance.th} /></td>
              <td style={{ fontSize: 13 }}><T en={r.complex.en} th={r.complex.th} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h5 className="sec-h" style={{ marginTop: 24 }}><T en="What does not change" th="สิ่งที่ไม่เปลี่ยน" /></h5>
      <ul style={{ margin: "0 0 8px 18px", fontSize: 14, lineHeight: 1.6 }}>
        {PLAYBOOK_SAME.map((s) => (
          <li key={s.en}><T en={s.en} th={s.th} /></li>
        ))}
      </ul>

      <h5 className="sec-h" style={{ marginTop: 24 }}><T en="How to run a close" th="วิธีปิดภาษี" /></h5>
      <div className="dt-flow" style={{ marginBottom: 20 }}>
        {PLAYBOOK_STEPS.map((s) => (
          <div key={s.n} className="dt-flow-step">
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", fontWeight: 700 }}>{s.n}</div>
            <div style={{ marginTop: 6, fontSize: 13 }}><T en={s.en} th={s.th} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
