"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { LangToggle } from "@/components/LangToggle";
import { useStore } from "@/lib/store";
import { ADVISOR_USER, CORPORATE_USER, DEFENCE_USER } from "@/lib/model";
import { T } from "@/lib/i18n";

export default function SettingsPage() {
  const { mode, setMode, flash } = useStore();
  const router = useRouter();
  const user = mode === "advisor" ? ADVISOR_USER : mode === "defence" ? DEFENCE_USER : CORPORATE_USER;
  return (
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head"><h4><T en="Operating mode" th="โหมดการทำงาน" /></h4></div>
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
          <T en="Customer data is not used for model training. AI may classify, extract, detect and explain. AI may not change approved adjustments, select a legal position, post journals, submit returns, change rule versions or delete evidence. Configurable AI-data boundary for enterprise deployments." th="ไม่ใช้ข้อมูลลูกค้าฝึกโมเดล AI จำแนก สกัด ตรวจพบ และอธิบายได้ แต่ห้ามแก้รายการที่อนุมัติ เลือกจุดยืนทางกฎหมาย บันทึกบัญชี ยื่นแบบ เปลี่ยนเวอร์ชันกฎ หรือลบหลักฐาน" />
        </div>
      </div>
    </div>
  );
}
