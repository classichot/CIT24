"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/i18n";

const ITEMS = [
  { href: "/boi", en: "Incentive desk", th: "โต๊ะสิทธิประโยชน์" },
  { href: "/boi/certificates", en: "Certificates", th: "บัตรส่งเสริม" },
  { href: "/boi/allocation", en: "Allocation", th: "การปันส่วน" },
  { href: "/boi/revenue", en: "Revenue qualify", th: "คุณสมบัติรายได้" },
  { href: "/boi/pnl", en: "Project tax P&L", th: "กำไรขาดทุนภาษีโครงการ" },
  { href: "/boi/losses", en: "BOI losses", th: "ผลขาดทุน BOI" },
  { href: "/boi/packages", en: "BOI / RD packs", th: "ชุด BOI / สรรพากร" },
];

export function BoiNav() {
  const path = usePathname();
  return (
    <div className="flow-bar" style={{ marginTop: 0 }}>
      <div className="flow-steps">
        {ITEMS.map((i) => (
          <Link key={i.href} href={i.href} className={path === i.href ? "on" : ""}>
            <T en={i.en} th={i.th} />
          </Link>
        ))}
      </div>
    </div>
  );
}
