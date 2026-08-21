"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/i18n";

const STEPS = [
  { href: "/data", en: "Upload", th: "นำเข้า", zh: "导入", ja: "取込" },
  { href: "/mapping", en: "Map", th: "จับคู่", zh: "映射", ja: "対応" },
  { href: "/ledger", en: "Ledger", th: "ทะเบียน", zh: "台账", ja: "台帳" },
  { href: "/provision", en: "Provision", th: "ประมาณการ", zh: "准备", ja: "引当" },
  { href: "/pnd51", en: "PND51", th: "ภ.ง.ด.51", zh: "PND51", ja: "PND51" },
  { href: "/pnd50", en: "PND50", th: "ภ.ง.ด.50", zh: "PND50", ja: "PND50" },
  { href: "/review", en: "Approve", th: "อนุมัติ", zh: "批准", ja: "承認" },
  { href: "/host", en: "Host", th: "โฮสต์", zh: "托管", ja: "ホスト" },
];

export function FlowBar() {
  const path = usePathname();
  const idx = STEPS.findIndex((s) => path === s.href || path.startsWith(s.href + "/"));
  return (
    <div className="flow-bar">
      <div className="flow-steps">
        {STEPS.map((s, i) => (
          <Link key={s.href} href={s.href} className={i === idx ? "on" : i < idx ? "done" : ""}>
            <T en={s.en} th={s.th} zh={s.zh} ja={s.ja} />
          </Link>
        ))}
      </div>
    </div>
  );
}
