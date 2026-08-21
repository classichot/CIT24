"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { T } from "@/lib/i18n";

export function HostLink({ block = false, compact = false }: { block?: boolean; compact?: boolean }) {
  const className = `btn btn-secondary${block ? " btn-block" : ""}`;
  return (
    <Link href="/host" className={className}>
      <Link2 size={15} />
      {compact
        ? <T en="Desk" th="โฮสต์" zh="主机台" ja="デスク" />
        : <T en="Host desk" th="โต๊ะโฮสต์" zh="主机台" ja="ホストデスク" />}
    </Link>
  );
}
