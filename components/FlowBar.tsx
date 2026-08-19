"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/i18n";

const STEPS = [
  { href: "/data", en: "Upload", th: "นำเข้า" },
  { href: "/mapping", en: "Map", th: "จับคู่" },
  { href: "/ledger", en: "Ledger", th: "ทะเบียน" },
  { href: "/provision", en: "Provision", th: "ประมาณการ" },
  { href: "/pnd51", en: "ภ.ง.ด.51", th: "ภ.ง.ด.51" },
  { href: "/pnd50", en: "ภ.ง.ด.50", th: "ภ.ง.ด.50" },
  { href: "/review", en: "Approve", th: "อนุมัติ" },
];

export function FlowBar() {
  const path = usePathname();
  const idx = STEPS.findIndex((s) => path === s.href || path.startsWith(s.href + "/"));
  return (
    <div className="flow-bar">
      <div className="flow-steps">
        {STEPS.map((s, i) => (
          <Link key={s.href} href={s.href} className={i === idx ? "on" : i < idx ? "done" : ""}>
            <T en={s.en} th={s.th} />
          </Link>
        ))}
      </div>
    </div>
  );
}
