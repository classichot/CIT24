"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { F } from "@/lib/format";
import { T } from "@/lib/i18n";
import type { AuditNode } from "@/lib/engine";

function Step({ node, depth = 0 }: { node: AuditNode; depth?: number }) {
  const value = node.amount == null ? null : F(node.amount);
  return (
    <div className="audit-step" style={{ marginLeft: depth ? 8 : 0 }}>
      <div className="audit-k" style={{ fontSize: 13 }}>{node.label}{value != null ? ` · ${value}` : ""}</div>
      <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>{node.detail}</div>
      {(node.ruleId || node.sourceFile) && (
        <div style={{ marginTop: 6, fontSize: 11 }}>
          {node.ruleId && (
            <Link href="/rules" className="tag tag-accent mono" onClick={(e) => e.stopPropagation()}>
              {node.ruleId} · {node.ruleVersion}
            </Link>
          )}
          {node.sourceFile && (
            <Link href="/data" className="tag tag-neutral" style={{ marginLeft: 6 }} onClick={(e) => e.stopPropagation()}>
              {node.sourceFile}
            </Link>
          )}
        </div>
      )}
      {node.children?.map((c) => <Step key={c.id} node={c} depth={depth + 1} />)}
    </div>
  );
}

export function AuditTrail() {
  const { audit, closeAudit } = useStore();
  if (!audit) return null;
  return (
    <div className="drawer-shell no-print" onClick={closeAudit}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>
              <T en="One-click tax traceability" th="ตรวจสอบย้อนกลับได้ในคลิกเดียว" />
            </div>
            <h4 style={{ margin: 0 }}>{audit.label}</h4>
          </div>
          <button className="icon-btn" onClick={closeAudit} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="panel-body">
          <p className="text-muted" style={{ fontSize: 13 }}>
            <T
              en="Every CIT24 amount is posted by the deterministic engine. This trail walks return field → tax computation → adjustment note → GL transactions → source document → legal rule → approval history. The LLM never calculates taxable profit."
              th="ทุกจำนวนใน CIT24 ถูกบันทึกโดยเครื่องคำนวณที่กำหนดได้ เส้นทางนี้เดินจากช่องในแบบ → การคำนวณ → รายการปรับปรุง → บัญชีแยกประเภท → เอกสารต้นทาง → กฎกฎหมาย → ประวัติการอนุมัติ โมเดลภาษาไม่ได้คำนวณกำไรทางภาษี"
            />
          </p>
          <Step node={audit} />
        </div>
      </div>
    </div>
  );
}
