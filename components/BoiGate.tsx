"use client";

import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiToggle } from "@/components/BoiToggle";
import { T } from "@/lib/i18n";

export function BoiGate({ children }: { children: ReactNode }) {
  const { lawMode, boiEnabled, setLawMode } = useStore();
  if (lawMode !== "complex") {
    return (
      <div>
        <PageHead
          kickerEn="BOI Tax Segregation & Allocation Engine"
          kickerTh="เครื่องปันส่วนและแยกภาษี BOI"
          titleEn="BOI is Complex-mode"
          titleTh="BOI อยู่ในโหมดครบทุกกฎหมาย"
          subEn="Promotion is project-by-project. The compliance bar does not mix BOI and non-BOI tax bases. Switch Law depth to Complex, then turn the BOI module on."
          subTh="การส่งเสริมเป็นรายโครงการ เกณฑ์ขั้นต่ำไม่ผสมฐาน BOI กับนอก BOI สลับความลึกเป็นครบทุกกฎหมาย แล้วเปิดโมดูล BOI"
          actions={<button className="btn btn-primary" onClick={() => setLawMode("complex")}><T en="Switch to Complex" th="สลับเป็นครบทุกกฎหมาย" /></button>}
        />
      </div>
    );
  }
  if (!boiEnabled) {
    return (
      <div>
        <PageHead
          kickerEn="BOI Tax Segregation & Allocation Engine"
          kickerTh="เครื่องปันส่วนและแยกภาษี BOI"
          titleEn="BOI module is off"
          titleTh="โมดูล BOI ปิดอยู่"
          subEn="Turn the module on to segregate the ledger by certificate, allocate shared cost, qualify revenue, and produce BOI e-Tax and PND50 annex packs. Company current-tax ETR stays current tax ÷ PBT."
          subTh="เปิดโมดูลเพื่อแยกบัญชีตามบัตร ปันส่วนต้นทุนร่วม ตรวจคุณสมบัติรายได้ และสร้างชุด e-Tax กับเอกสารแนบ ภ.ง.ด.50 ETR ของบริษัทยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี"
          actions={<BoiToggle />}
        />
      </div>
    );
  }
  return <>{children}</>;
}
