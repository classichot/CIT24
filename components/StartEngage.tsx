"use client";

import Link from "next/link";
import { T } from "@/lib/i18n";

export function StartEngage({
  kind = "new",
  block = false,
  onClick,
}: {
  kind?: "new" | "create";
  block?: boolean;
  onClick?: () => void;
}) {
  const className = `btn btn-start${block ? " btn-block" : ""}`;
  const label = kind === "create"
    ? <T en="Create engagement" th="สร้างงานบริการ" zh="创建委托" ja="案件を作成" />
    : <T en="New engagement" th="งานใหม่" zh="新委托" ja="新規案件" />;
  const inner = (
    <>
      <span className="btn-start-mark" aria-hidden>+</span>
      {label}
    </>
  );
  if (kind === "create") {
    return (
      <button type="button" className={className} onClick={onClick}>
        {inner}
      </button>
    );
  }
  return (
    <Link href="/onboard" className={className}>
      {inner}
    </Link>
  );
}
