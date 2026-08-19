"use client";

import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BoiToggle } from "@/components/BoiToggle";
import { T } from "@/lib/i18n";

export function BoiGate({ children }: { children: ReactNode }) {
  const { boiEnabled, setBoiEnabled } = useStore();
  if (!boiEnabled) {
    return (
      <div>
        <PageHead
          kickerEn="BOI Tax Segregation & Allocation Engine"
          kickerTh="เครื่องปันส่วนและแยกภาษี BOI"
          titleEn="BOI module is off"
          titleTh="โมดูล BOI ปิดอยู่"
          subEn="Turn the module on to segregate the ledger by certificate, allocate shared cost, qualify revenue, and produce BOI e-Tax and PND50 annex packs. Opening BOI also switches Law depth to Complex. Company current-tax ETR stays current tax ÷ PBT."
          subTh="เปิดโมดูลเพื่อแยกบัญชีตามบัตร ปันส่วนต้นทุนร่วม ตรวจคุณสมบัติรายได้ และสร้างชุด e-Tax กับเอกสารแนบ ภ.ง.ด.50 การเปิด BOI จะสลับความลึกเป็นครบทุกกฎหมายด้วย ETR ของบริษัทยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี"
          actions={
            <>
              <button className="btn btn-primary" onClick={() => setBoiEnabled(true)}><T en="Turn BOI on" th="เปิดโมดูล BOI" /></button>
              <BoiToggle />
            </>
          }
        />
      </div>
    );
  }
  return <>{children}</>;
}
