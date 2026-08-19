"use client";

import type { ReactNode } from "react";
import { T } from "@/lib/i18n";

export function PageHead({
  kickerEn,
  kickerTh,
  titleEn,
  titleTh,
  subEn,
  subTh,
  actions,
}: {
  kickerEn: string;
  kickerTh: string;
  titleEn: ReactNode;
  titleTh: ReactNode;
  subEn: ReactNode;
  subTh: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="page-kicker"><T en={kickerEn} th={kickerTh} /></div>
        <h2><T en={titleEn} th={titleTh} /></h2>
        <div className="page-sub"><T en={subEn} th={subTh} /></div>
      </div>
      {actions && <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function statusCls(status: string) {
  if (status === "Approved" || status === "Pass" || status === "Validated" || status === "Linked" || status === "Extracted" || status === "Filed" || status === "Closed — accepted" || status === "Response filed" || status === "Claimed") return "tag tag-neutral";
  if (status === "In review" || status === "Awaiting review" || status === "CFO approval" || status === "OCR (TH)" || status === "Review" || status === "Drafting response" || status === "Scheduled") return "tag tag-accent";
  if (status === "Query" || status === "Query open" || status === "Needs review" || status === "Warning" || status === "Action needed" || status === "Evidence gathering") return "tag tag-outline";
  return "tag tag-neutral";
}

export function riskCls(risk: string) {
  if (risk === "High") return "tag tag-signal";
  if (risk === "Medium") return "tag tag-accent";
  return "tag tag-neutral";
}

export function ptCls(pt: string) {
  return pt === "P" ? "tag tag-outline" : "tag tag-accent";
}

export function riskColor(risk: string) {
  if (risk === "High") return "var(--color-signal)";
  if (risk === "Medium") return "var(--color-signal-400)";
  return "var(--color-neutral-400)";
}
