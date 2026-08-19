"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { LangToggle } from "@/components/LangToggle";
import { LawToggle } from "@/components/LawToggle";
import { useStore } from "@/lib/store";
import { ADVISOR_USER, CORPORATE_USER, DEFENCE_USER } from "@/lib/model";
import { T } from "@/lib/i18n";

export default function SettingsPage() {
  const { mode, setMode, flash, lawMode } = useStore();
  const router = useRouter();
  const user = mode === "advisor" ? ADVISOR_USER : mode === "defence" ? DEFENCE_USER : CORPORATE_USER;
  return (
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head"><h4><T en="Role (Corporate / Advisory / Defence)" th="บทบาท (องค์กร / ที่ปรึกษา / ต่อสู้คดี)" /></h4></div>
        <div className="panel-body">
          <div className="seg" style={{ width: "100%", marginBottom: 14, flexWrap: "wrap" }}>
            <label className="seg-opt" style={{ flex: 1 }}>
              <input type="radio" name="mode" checked={mode === "corporate"} onChange={() => { setMode("corporate"); flash("Corporate mode"); router.push("/overview"); }} />
              Corporate
            </label>
            <label className="seg-opt" style={{ flex: 1 }}>
              <input type="radio" name="mode" checked={mode === "advisor"} onChange={() => { setMode("advisor"); flash("Advisor mode"); router.push("/clients"); }} />
              Advisory
            </label>
            <label className="seg-opt" style={{ flex: 1 }}>
              <input type="radio" name="mode" checked={mode === "defence"} onChange={() => { setMode("defence"); flash("Audit defence mode"); router.push("/evidence"); }} />
              Defence
            </label>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>
            <T en="The mode never changes the numbers. Corporate is a single tax close. Advisory is a multi-client portfolio. Audit defence is the evidence room and RD request tracker." th="โหมดไม่เปลี่ยนตัวเลข องค์กรคือปิดภาษีกิจการเดียว ที่ปรึกษาคือพอร์ตหลายลูกค้า ต่อสู้คดีคือห้องหลักฐานและติดตามคำขอกรมสรรพากร" />
          </p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h4><T en="Law depth — Compliance or Complex" th="ความลึกกฎหมาย — เกณฑ์ขั้นต่ำหรือครบทุกกฎหมาย" zh="法规深度 — 合规或完整" ja="法令の深さ — コンプライアンス / コンプレックス" /></h4></div>
        <div className="panel-body">
          <LawToggle />
          <p className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
            {lawMode === "compliance"
              ? <T en="Compliance is the acceptable filing bar: s.65 taxable profit and five-year FIFO losses, material s.65 bis/ter add-backs, s.67 bis PND51, WHT credits, PND50, RD 145 if PPE exists, current-tax provision. ETR = current tax ÷ PBT. TAS 12 deferred defaults off. Switch to Complex for the full TAS 12 register, Pillar Two exception, TFRIC 23, TP GloBE mapping and obsolete-instrument history." th="เกณฑ์ขั้นต่ำคือสิ่งที่ต้องทำเพื่อยื่นและตั้งประมาณการ: ม.65 กำไรสุทธิและขาดทุน 5 ปี FIFO บวกกลับสาระสำคัญ ม.65 ทวิ/ตรี ม.67 ทวิ ภ.ง.ด.51 เครดิต ณ ที่จ่าย ภ.ง.ด.50 พ.ร.ฎ. 145 ถ้ามีสินทรัพย์ถาวร ประมาณการภาษีงวดปัจจุบัน ETR = ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี ต.บ. 12 รอตัดบัญชีปิดเป็นค่าเริ่มต้น" zh="合规是可接受的申报底线。TAS 12 递延默认关闭。ETR = 当期税 ÷ 税前利润。" ja="コンプライアンスは申告の最低バー。TAS 12繰延は既定オフ。ETRは当期税÷税引前利益。" />
              : <T en="Complex includes every related instrument in the corpus: full TAS 12 DTA/DTL, recoverability, unused FTC, outside-basis exception, Pillar Two blocked DTA/DTL, GMT24 feed, TFRIC 23, TAS 34 note, TP24 / s.71 bis, BOI, and superseded history (TFRIC 13 → TFRS 15). TAS 12 deferred defaults on. ETR is still current tax ÷ PBT." th="โหมดครบรวมทุกกฎหมายในคลัง: ต.บ. 12 เต็ม DTA/DTL ความสามารถในการใช้ เครดิตที่ยังไม่ใช้ ข้อยกเว้นฐานภายนอก บล็อกเสาหลักสอง GMT24 TFRIC 23 TAS 34 ราคาโอน ม.71 ทวิ BOI และประวัติที่ถูกแทนที่ ETR ยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี" zh="完整模式包含全部相关法规与 TAS 12 引擎。ETR 仍为当期税 ÷ 税前利润。" ja="コンプレックスは関連法令をすべて含む。ETRはなお当期税÷税引前利益。" />}
          </p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h4><T en="Appearance & language" th="รูปลักษณ์และภาษา" /></h4></div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ModeToggle />
          <LangToggle />
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h4><T en="Session" th="เซสชัน" /></h4></div>
        <div className="panel-body">
          <div className="wf-row"><span>User</span><span>{user.name}</span></div>
          <div className="wf-row"><span>Role</span><span>{user.role}</span></div>
          <div className="wf-row"><span>Org</span><span>{user.org}</span></div>
          <div className="wf-row"><span>Controls</span><span>SSO · MFA · entity ACL · PDPA · append-only log</span></div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h4><T en="AI boundary" th="ขอบเขต AI" /></h4></div>
        <div className="panel-body" style={{ fontSize: 13, lineHeight: 1.6 }}>
          <T en="Customer data is not used for model training. AI may classify, extract, detect and explain. AI may not change approved adjustments, select a legal position, post journals, submit returns, change rule versions, mark a regulation obsolete, or delete evidence." th="ไม่ใช้ข้อมูลลูกค้าฝึกโมเดล AI จำแนก สกัด ตรวจพบ และอธิบายได้ แต่ห้ามแก้รายการที่อนุมัติ เลือกจุดยืนทางกฎหมาย บันทึกบัญชี ยื่นแบบ เปลี่ยนเวอร์ชันกฎ ทำเครื่องหมายกฎหมายล้าสมัย หรือลบหลักฐาน" />
        </div>
      </div>
    </div>
  );
}
