"use client";

import { useStore } from "@/lib/store";
import { F } from "@/lib/format";
import type { AuditNode } from "@/lib/engine";

export function Amount({
  n,
  audit,
  className,
}: {
  n: number;
  audit?: AuditNode;
  className?: string;
}) {
  const { openAudit } = useStore();
  const label = F(n);
  if (!audit) return <span className={className}>{label}</span>;
  return (
    <button
      type="button"
      className={`amt ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        openAudit(audit);
      }}
      title="Open tax trail — return field → adjustment → GL → evidence → rule → approval"
    >
      {label}
    </button>
  );
}
