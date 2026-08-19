import type { LawMode } from "./model";
import {
  isCorpusActive,
  isCorpusStale,
  linkedRules,
  type CorpusInstrument,
} from "./corpus";
import { RULES, type CitRule } from "./rules";

export type LawAlertSeverity = "info" | "watch" | "block";

export type LawAlertKind =
  | "superseded"
  | "obsolete-cited"
  | "missing-successor"
  | "amended"
  | "tas-tfric"
  | "pillar-two"
  | "complex-gap";

export type LawAlert = {
  id: string;
  kind: LawAlertKind;
  severity: LawAlertSeverity;
  corpusId: string;
  cite: string;
  title: string;
  titleTh: string;
  whatsNew: string;
  whatsNewTh: string;
  affectedRules: string[];
  affectedPages: string[];
  action: string;
  actionTh: string;
  lastReviewed?: string;
  read: boolean;
  dismissed: boolean;
  ranAt: string;
};

const SEV_RANK: Record<LawAlertSeverity, number> = { block: 0, watch: 1, info: 2 };

function aid(kind: LawAlertKind, key: string) {
  return `LAW-${kind}-${key}`;
}

function uniq(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

function pagesOf(inst?: CorpusInstrument, extra: string[] = []) {
  return uniq([...(inst?.cit24Use.pages ?? []), ...extra]);
}

function rulesOf(inst: CorpusInstrument | undefined, pack: CitRule[], extra: string[] = []) {
  const linked = inst ? linkedRules(inst, pack).map((r) => r.id) : [];
  return uniq([...extra, ...linked]);
}

function stampIso() {
  return new Date().toISOString();
}

function base(
  partial: Omit<LawAlert, "read" | "dismissed" | "ranAt"> & { ranAt?: string },
): LawAlert {
  return {
    ...partial,
    read: false,
    dismissed: false,
    ranAt: partial.ranAt ?? stampIso(),
  };
}

/**
 * Deterministic related-law review. Classifies corpus + rule-pack links.
 * Does not mutate instrument status, rule versions, journals, or returns.
 */
export function reviewRelatedLaws(
  corpus: CorpusInstrument[],
  lawMode: LawMode,
  rules: CitRule[] = RULES,
): LawAlert[] {
  const byId = new Map(corpus.map((c) => [c.id, c]));
  const out: LawAlert[] = [];

  const tfric13 = byId.get("TFRIC-13");
  const tfrs15 = byId.get("TFRS-15");
  const tas12 = byId.get("TAS-12");
  const p2 = byId.get("IAS-12-P2");
  const tas34 = byId.get("TAS-34");
  const tfric23 = byId.get("TFRIC-23");

  if (tfric13 && isCorpusStale(tfric13.status)) {
    const suc = tfric13.supersededBy ? byId.get(tfric13.supersededBy) : tfrs15;
    out.push(base({
      id: aid("superseded", tfric13.id),
      kind: "superseded",
      severity: "watch",
      corpusId: tfric13.id,
      cite: tfric13.cite,
      title: tfric13.title,
      titleTh: tfric13.titleTh,
      lastReviewed: tfric13.lastReviewed,
      whatsNew: `${tfric13.cite} is ${tfric13.status}${suc ? ` by ${suc.cite}` : ""}. Any remaining loyalty / deferred-revenue temporary difference should follow TFRS 15 timing and TAS 12 measurement (Complex). CIT24 does not apply TFRIC 13.`,
      whatsNewTh: `${tfric13.cite} สถานะ ${tfric13.status}${suc ? ` โดย ${suc.cite}` : ""} ผลต่างชั่วคราวคะแนนสะสมที่เหลือให้ใช้จังหวะตาม TFRS 15 และวัดตาม ต.บ. 12 (โหมดครบทุกกฎหมาย) CIT24 ไม่ใช้ TFRIC 13`,
      affectedRules: rulesOf(tfric13, rules, rulesOf(suc, rules, ["RULE-65B-01"])),
      affectedPages: pagesOf(tfric13, pagesOf(suc, pagesOf(tas12, ["/corpus", "/deferred", "/ledger"]))),
      action: suc
        ? `Confirm successor ${suc.id} on the corpus page. Do not ground new rules in TFRIC 13. Switch to Complex to see TFRS 15 / TAS 12.`
        : "Link a successor (TFRS 15) on the corpus page. AI cannot mark this obsolete or remap the rule.",
      actionTh: suc
        ? `ยืนยันฉบับแทนที่ ${suc.id} ในคลังกฎหมาย อย่ายึดกฎใหม่กับ TFRIC 13 สลับโหมดครบทุกกฎหมายเพื่อดู TFRS 15 / ต.บ. 12`
        : "โยงฉบับแทนที่ (TFRS 15) ในคลังกฎหมาย AI ทำเครื่องหมายล้าสมัยหรือโยงกฎแทนไม่ได้",
    }));
  }

  if (p2) {
    out.push(base({
      id: aid("pillar-two", p2.id),
      kind: "pillar-two",
      severity: "block",
      corpusId: p2.id,
      cite: p2.cite,
      title: p2.title,
      titleTh: p2.titleTh,
      lastReviewed: p2.lastReviewed,
      whatsNew: "IAS 12 / TAS 12 Pillar Two amendment: mandatory exception — no Pillar Two DTA/DTL. GMT24 is the Pillar Two engine and is Complex-only. ETR stays current tax ÷ PBT; Pillar Two is not in the ETR identity.",
      whatsNewTh: "การแก้ไข IAS 12 / ต.บ. 12 เสาหลักสอง: ข้อยกเว้นบังคับ — ห้าม DTA/DTL จากเสาหลักสอง GMT24 เป็นเครื่องเสาหลักสองและอยู่เฉพาะโหมดครบทุกกฎหมาย ETR ยังเป็นภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี",
      affectedRules: rulesOf(p2, rules),
      affectedPages: pagesOf(p2, ["/deferred", "/disclosure", "/ecosystem", "/settings"]),
      action: lawMode === "compliance"
        ? "Do not book P2 DTA/DTL on the compliance bar. Switch Law depth to Complex to see IAS-12-P2 and GMT24 covered-tax. Human confirms; AI will not change TAS 12 settings."
        : "Keep P2 DTA/DTL blocked. Disclose Pillar Two current tax from GMT24 as a separate line. Do not put Pillar Two into ETR.",
      actionTh: lawMode === "compliance"
        ? "ห้ามบันทึก DTA/DTL เสาหลักสองบนเกณฑ์ขั้นต่ำ สลับความลึกกฎหมายเป็นครบทุกกฎหมายเพื่อดู IAS-12-P2 และภาษีที่ครอบคลุมของ GMT24 คนยืนยัน AI ไม่เปลี่ยนสวิตช์ ต.บ. 12"
        : "คงการบล็อก DTA/DTL จากเสาหลักสอง เปิดเผยภาษีงวดปัจจุบันเสาหลักสองจาก GMT24 เป็นบรรทัดแยก ห้ามใส่เสาหลักสองใน ETR",
    }));
  }

  if (tas34) {
    out.push(base({
      id: aid("tas-tfric", tas34.id),
      kind: "tas-tfric",
      severity: "info",
      corpusId: tas34.id,
      cite: tas34.cite,
      title: tas34.title,
      titleTh: tas34.titleTh,
      lastReviewed: tas34.lastReviewed,
      whatsNew: "TAS 34 interim reporting (including tax expense at the expected annual effective rate) is in the corpus but not engine-backed. PND51 is a statutory half-year payment under s.67 bis, not a TAS 34 interim tax computation.",
      whatsNewTh: "ต.บ. 34 การรายงานระหว่างกาล (รวมค่าใช้จ่ายภาษีจากอัตราที่คาดทั้งปี) อยู่ในคลังแต่ยังไม่ผูกเครื่องคำนวณ ภ.ง.ด.51 เป็นการชำระตาม ม.67 ทวิ ไม่ใช่ภาษีระหว่างกาลตาม ต.บ. 34",
      affectedRules: rulesOf(tas34, rules, ["RULE-67B-51", "RULE-67B-51B"]),
      affectedPages: pagesOf(tas34, ["/pnd51", "/corpus"]),
      action: lawMode === "compliance"
        ? "Info only on the filing bar. Switch to Complex to see TAS 34. Do not treat the PND51 simulator as TAS 34."
        : "Leave TAS 34 as library / disclosure. Do not treat the PND51 simulator as an interim TAS 34 ETR engine.",
      actionTh: lawMode === "compliance"
        ? "ข้อมูลบนเกณฑ์ขั้นต่ำ สลับโหมดครบทุกกฎหมายเพื่อดู ต.บ. 34 อย่าใช้แบบจำลอง ภ.ง.ด.51 เป็น ต.บ. 34"
        : "คง ต.บ. 34 เป็นคลัง / เปิดเผย อย่าใช้แบบจำลอง ภ.ง.ด.51 เป็นเครื่อง ETR ระหว่างกาลตาม ต.บ. 34",
    }));
  }

  if (tfric23 && lawMode === "complex") {
    out.push(base({
      id: aid("tas-tfric", tfric23.id),
      kind: "tas-tfric",
      severity: "info",
      corpusId: tfric23.id,
      cite: tfric23.cite,
      title: tfric23.title,
      titleTh: tfric23.titleTh,
      lastReviewed: tfric23.lastReviewed,
      whatsNew: "TFRIC 23 is in force. CIT24 currently records no uncertain-tax-treatment provision this close; open ledger queries are classification, not TFRIC 23 UTP.",
      whatsNewTh: "TFRIC 23 ยังใช้บังคับ CIT24 ยังไม่ตั้งประมาณการฐานภาษีที่ไม่แน่นอนในการปิดนี้ คำถามในทะเบียนเป็นการจัดประเภท ไม่ใช่ TFRIC 23",
      affectedRules: rulesOf(tfric23, rules),
      affectedPages: pagesOf(tfric23, ["/disclosure", "/deferred"]),
      action: "No engine change. Human decides whether a TFRIC 23 provision is required; AI will not post one.",
      actionTh: "ไม่เปลี่ยนเครื่อง คนตัดสินว่าต้องตั้งประมาณการ TFRIC 23 หรือไม่ AI จะไม่บันทึกให้",
    }));
  }

  for (const rule of rules) {
    const inst = byId.get(rule.corpusId);
    if (!inst || !isCorpusStale(inst.status)) continue;
    const suc = inst.supersededBy ? byId.get(inst.supersededBy) : undefined;
    const onBar = rule.bar === "compliance";
    out.push(base({
      id: aid("obsolete-cited", rule.id),
      kind: "obsolete-cited",
      severity: onBar ? "block" : (lawMode === "complex" ? "block" : "watch"),
      corpusId: inst.id,
      cite: `${rule.id} → ${inst.cite}`,
      title: rule.name,
      titleTh: rule.name,
      lastReviewed: inst.lastReviewed,
      whatsNew: `${rule.id} corpusId points at ${inst.id} (${inst.cite}) which is ${inst.status}${suc ? ` — successor ${suc.id} (${suc.cite}) is in the corpus` : " and has no successor linked"}.`,
      whatsNewTh: `${rule.id} ชี้ corpusId ไป ${inst.id} (${inst.cite}) สถานะ ${inst.status}${suc ? ` — ฉบับแทนที่ ${suc.id} (${suc.cite}) อยู่ในคลัง` : " และยังไม่โยงฉบับแทนที่"}`,
      affectedRules: [rule.id],
      affectedPages: uniq(["/rules", "/corpus", ...pagesOf(inst), ...pagesOf(suc)]),
      action: suc
        ? `Human remaps ${rule.id} to ${suc.id} or withdraws the legacy rule. AI will not change the rule version or mark ${inst.id} obsolete.`
        : `Human links a successor on ${inst.id} then remaps ${rule.id}. AI will not change the rule pack.`,
      actionTh: suc
        ? `คนโยง ${rule.id} ไป ${suc.id} หรือถอนกฎเดิม AI จะไม่เปลี่ยนเวอร์ชันกฎและไม่ทำเครื่องหมาย ${inst.id} ล้าสมัย`
        : `คนโยงฉบับแทนที่บน ${inst.id} แล้วโยง ${rule.id} ใหม่ AI จะไม่เปลี่ยนชุดกฎ`,
    }));
  }

  for (const inst of corpus) {
    if (!isCorpusStale(inst.status)) continue;
    if (inst.supersededBy && byId.has(inst.supersededBy)) continue;
    out.push(base({
      id: aid("missing-successor", inst.id),
      kind: "missing-successor",
      severity: "watch",
      corpusId: inst.id,
      cite: inst.cite,
      title: inst.title,
      titleTh: inst.titleTh,
      lastReviewed: inst.lastReviewed,
      whatsNew: `${inst.cite} is ${inst.status} but no successor instrument is linked in the corpus.`,
      whatsNewTh: `${inst.cite} สถานะ ${inst.status} แต่ยังไม่โยงฉบับแทนที่ในคลัง`,
      affectedRules: rulesOf(inst, rules),
      affectedPages: pagesOf(inst, ["/corpus"]),
      action: `On the corpus page, add or link a successor for ${inst.id}. AI cannot link a successor.`,
      actionTh: `ในคลังกฎหมาย เพิ่มหรือโยงฉบับแทนที่ของ ${inst.id} AI โยงฉบับแทนที่ไม่ได้`,
    }));
  }

  for (const inst of corpus) {
    if (inst.status !== "amended") continue;
    if (lawMode === "compliance" && inst.bar !== "compliance") continue;
    out.push(base({
      id: aid("amended", inst.id),
      kind: "amended",
      severity: "watch",
      corpusId: inst.id,
      cite: inst.cite,
      title: inst.title,
      titleTh: inst.titleTh,
      lastReviewed: inst.lastReviewed,
      whatsNew: `${inst.cite} is marked amended (last reviewed ${inst.lastReviewed}). Check whether the CIT24 rule pack still matches the amended text.`,
      whatsNewTh: `${inst.cite} สถานะแก้ไขแล้ว (ทบทวนล่าสุด ${inst.lastReviewed}) ตรวจว่าชุดกฎ CIT24 ยังตรงกับข้อความที่แก้ไข`,
      affectedRules: rulesOf(inst, rules),
      affectedPages: pagesOf(inst, ["/corpus", "/rules"]),
      action: "Human reviews the amendment and updates lastReviewed. AI will not change a rule version.",
      actionTh: "คนทบทวนการแก้ไขและอัปเดตวันทบทวน AI จะไม่เปลี่ยนเวอร์ชันกฎ",
    }));
  }

  if (lawMode === "compliance") {
    const extra = corpus.filter((c) => c.bar === "complex");
    const activeExtra = extra.filter((c) => isCorpusActive(c.status));
    const staleExtra = extra.filter((c) => isCorpusStale(c.status));
    const sample = extra.slice(0, 8).map((c) => c.cite).join(", ");
    out.push(base({
      id: aid("complex-gap", "bar"),
      kind: "complex-gap",
      severity: "watch",
      corpusId: "BAR",
      cite: "Compliance bar",
      title: `${extra.length} Complex-only instruments not in the bar`,
      titleTh: `${extra.length} ฉบับในโหมดครบทุกกฎหมายที่ไม่อยู่บนเกณฑ์ขั้นต่ำ`,
      whatsNew: `${extra.length} related-law instruments sit outside the compliance bar (${activeExtra.length} in force / amended, ${staleExtra.length} obsolete or superseded): ${sample}${extra.length > 8 ? "…" : ""}. These include TFRS 15, TAS 34, TFRIC 23, Pillar Two DT exception, s.71 bis/ter and BOI. They would change the filing picture if GMT, TP or promoted activity applies.`,
      whatsNewTh: `${extra.length} ฉบับกฎหมายเกี่ยวเนื่องอยู่นอกเกณฑ์ขั้นต่ำ (ใช้บังคับ/แก้ไข ${activeExtra.length} ล้าสมัย ${staleExtra.length}): ${sample}${extra.length > 8 ? "…" : ""} รวม TFRS 15 ต.บ. 34 TFRIC 23 ข้อยกเว้นเสาหลักสอง ม.71 ทวิ/ตรี และ BOI อาจเปลี่ยนภาพการยื่นถ้ามี GMT ราคาโอน หรือกิจการส่งเสริม`,
      affectedRules: uniq(extra.flatMap((c) => rulesOf(c, rules))).slice(0, 12),
      affectedPages: ["/corpus", "/rules", "/settings", "/deferred", "/ecosystem"],
      action: "Switch Law depth to Complex to review related law. The compliance filing bar is unchanged until a human remaps rules. AI will not switch mode for you in a way that books DTA/DTL.",
      actionTh: "สลับความลึกกฎหมายเป็นครบทุกกฎหมายเพื่อตรวจกฎหมายเกี่ยวเนื่อง เกณฑ์ยื่นยังไม่เปลี่ยนจนกว่าคนจะโยงกฎ AI จะไม่สลับโหมดเพื่อบันทึก DTA/DTL ให้",
    }));
  }

  const seen = new Set<string>();
  return out
    .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
    .sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || a.id.localeCompare(b.id));
}

export function mergeLawAlerts(prev: LawAlert[], next: LawAlert[]): LawAlert[] {
  const old = new Map(prev.map((a) => [a.id, a]));
  return next.map((a) => {
    const p = old.get(a.id);
    if (!p) return a;
    return { ...a, read: p.read, dismissed: p.dismissed };
  });
}

export function visibleLawAlerts(alerts: LawAlert[]) {
  return alerts.filter((a) => !a.dismissed);
}

export function unreadLawAlertCount(alerts: LawAlert[]) {
  return alerts.filter((a) => !a.dismissed && !a.read).length;
}

export function explainLawAlertPrompt(alert: LawAlert): string {
  return [
    `Explain law alert ${alert.id}.`,
    `Severity: ${alert.severity}. Instrument: ${alert.cite} (${alert.corpusId}).`,
    `What is new or related: ${alert.whatsNew}`,
    `Affected CIT24 rules: ${alert.affectedRules.join(", ") || "none"}.`,
    `Affected pages: ${alert.affectedPages.join(", ") || "none"}.`,
    `Recommended human action: ${alert.action}`,
    "Classify and explain only. Do not mark a regulation obsolete, change an approved adjustment, post a journal, submit a return, or change a rule version.",
  ].join(" ");
}

export function severityLabel(sev: LawAlertSeverity, lang: "en" | "th" | "zh" | "ja") {
  if (sev === "block") return lang === "th" ? "บล็อก" : lang === "zh" ? "阻断" : lang === "ja" ? "ブロック" : "Block";
  if (sev === "watch") return lang === "th" ? "เฝ้าระวัง" : lang === "zh" ? "关注" : lang === "ja" ? "監視" : "Watch";
  return lang === "th" ? "ข้อมูล" : lang === "zh" ? "提示" : lang === "ja" ? "情報" : "Info";
}

export function severityCls(sev: LawAlertSeverity) {
  if (sev === "block") return "tag tag-signal";
  if (sev === "watch") return "tag tag-warn";
  return "tag tag-neutral";
}
