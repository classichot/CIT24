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
        ? <T en="Host" th="โฮสต์" zh="托管" ja="ホスト" />
        : <T en="Mint demo link" th="สร้างลิงก์เดโม" zh="生成演示链接" ja="デモリンク発行" />}
    </Link>
  );
}
