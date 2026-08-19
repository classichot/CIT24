import type { Lang } from "./model";

export type DocKind =
  | "Trial balance"
  | "General ledger"
  | "Financial statements"
  | "Fixed-asset register"
  | "WHT certificates"
  | "Prior-year PND50"
  | "Prior-year PND51"
  | "Invoices & receipts"
  | "Payroll / benefits"
  | "Inventory / provisions"
  | "Tax-payment evidence"
  | "BOI certificates"
  | "Related-party data"
  | "Contracts"
  | "Audit adjustments"
  | "Other";

export type RequirementLevel = "required" | "recommended" | "supporting";

export type Issue = { en: string; th: string };

export type IngestedFile = {
  id: string;
  name: string;
  kind: DocKind;
  period: string;
  status: string;
  conf: number;
  size: string;
  score: number;
  loadedOk: boolean;
  duplicate: boolean;
  issues: Issue[];
};

export type DocRequirement = {
  kind: DocKind;
  level: RequirementLevel;
  weight: number;
  en: string;
  th: string;
  need: string;
  needTh: string;
};

export const DOC_REQUIREMENTS: DocRequirement[] = [
  { kind: "Trial balance", level: "required", weight: 18, en: "Trial balance", th: "งบทดลอง", need: "YTD TB through the close date", needTh: "งบทดลองถึงวันปิดงวด" },
  { kind: "General ledger", level: "required", weight: 18, en: "General ledger", th: "บัญชีแยกประเภท", need: "Detailed GL with control totals", needTh: "บัญชีแยกประเภทพร้อมยอดคุม" },
  { kind: "Financial statements", level: "required", weight: 12, en: "Financial statements", th: "งบการเงิน", need: "Audited or management FS", needTh: "งบการเงินที่สอบบัญชีหรือฝ่ายบริหาร" },
  { kind: "Fixed-asset register", level: "required", weight: 12, en: "Fixed-asset register", th: "ทะเบียนสินทรัพย์", need: "Book and tax bases by asset", needTh: "ฐานบัญชีและฐานภาษีรายสินทรัพย์" },
  { kind: "WHT certificates", level: "required", weight: 12, en: "WHT certificates", th: "หนังสือรับรองภาษีหัก ณ ที่จ่าย", need: "Certificates matching GL receipts", needTh: "หนังสือรับรองที่จับคู่กับบัญชี" },
  { kind: "Prior-year PND50", level: "required", weight: 10, en: "Prior-year PND50", th: "ภ.ง.ด.50 ปีก่อน", need: "Filed return for opening positions", needTh: "แบบที่ยื่นแล้วสำหรับยอดยกมา" },
  { kind: "Invoices & receipts", level: "recommended", weight: 6, en: "Invoices & receipts", th: "ใบกำกับและใบเสร็จ", need: "Tax-sensitive expense packs", needTh: "ชุดเอกสารรายจ่ายที่มีนัยทางภาษี" },
  { kind: "Payroll / benefits", level: "recommended", weight: 4, en: "Payroll / benefits", th: "เงินเดือนและสวัสดิการ", need: "Bonus and director remuneration", needTh: "โบนัสและค่าตอบแทนกรรมการ" },
  { kind: "Inventory / provisions", level: "recommended", weight: 3, en: "Inventory / provisions", th: "สินค้าคงเหลือและประมาณการ", need: "Obsolescence and warranty schedules", needTh: "ตารางสินค้าล้าสมัยและรับประกัน" },
  { kind: "Tax-payment evidence", level: "recommended", weight: 3, en: "Tax-payment evidence", th: "หลักฐานการชำระภาษี", need: "PND51 receipts and WHT payments", needTh: "ใบเสร็จ ภ.ง.ด.51 และการชำระหัก ณ ที่จ่าย" },
  { kind: "Prior-year PND51", level: "recommended", weight: 2, en: "Prior-year PND51", th: "ภ.ง.ด.51 ปีก่อน", need: "Prior estimate for true-up", needTh: "ประมาณการปีก่อนสำหรับกระทบยอด" },
  { kind: "Related-party data", level: "supporting", weight: 2, en: "Related-party data", th: "ข้อมูลกิจการที่เกี่ยวข้อง", need: "TP24 charges and agreements", needTh: "ค่าบริการระหว่างกันและสัญญา" },
  { kind: "BOI certificates", level: "supporting", weight: 1, en: "BOI certificates", th: "บัตรส่งเสริม BOI", need: "Required if a promoted project exists", needTh: "จำเป็นหากมีโครงการส่งเสริม" },
  { kind: "Contracts", level: "supporting", weight: 1, en: "Contracts", th: "สัญญา", need: "Material service and lease contracts", needTh: "สัญญาบริการและเช่าที่มีสาระ" },
  { kind: "Audit adjustments", level: "supporting", weight: 1, en: "Audit adjustments", th: "รายการปรับปรุงผู้สอบบัญชี", need: "Year-end audit entries", needTh: "รายการปรับปรุงปลายปี" },
];

const KIND_KEYS: { kind: DocKind; keys: string[] }[] = [
  { kind: "Trial balance", keys: ["trial balance", "trial_balance", "_tb_", " tb", "tb_", "งบทดลอง", "ngodlong"] },
  { kind: "General ledger", keys: ["general ledger", "ledger", "_gl_", " gl", "gl_", "บัญชีแยก", "gl_spp"] },
  { kind: "Financial statements", keys: ["financial statement", "audited", "_fs_", " fs_", "งบการเงิน", "fs_spp"] },
  { kind: "Fixed-asset register", keys: ["fixed-asset", "fixed asset", "far_", "asset register", "ทะเบียนสินทรัพย์", "depreciation"] },
  { kind: "WHT certificates", keys: ["wht", "withholding", "50 bis", "50 ทวิ", "หัก ณ ที่จ่าย", "certificate"] },
  { kind: "Prior-year PND50", keys: ["pnd50", "pnd 50", "ภ.ง.ด.50", "ภงด50", "ภ.ง.ด. 50"] },
  { kind: "Prior-year PND51", keys: ["pnd51", "pnd 51", "ภ.ง.ด.51", "ภงด51", "ภ.ง.ด. 51"] },
  { kind: "Invoices & receipts", keys: ["invoice", "receipt", "ใบกำกับ", "ใบเสร็จ", "entertainment"] },
  { kind: "Payroll / benefits", keys: ["payroll", "bonus", "salary", "welfare", "เงินเดือน", "โบนัส"] },
  { kind: "Inventory / provisions", keys: ["inventory", "obsolesc", "provision schedule", "สินค้า", "ค่าเผื่อ"] },
  { kind: "Tax-payment evidence", keys: ["payment", "ชำระ", "receipt_tax", "tax paid", "ใบเสร็จภาษี"] },
  { kind: "BOI certificates", keys: ["boi", "promoted", "ส่งเสริม"] },
  { kind: "Related-party data", keys: ["related", "intercompany", "tp24", "transfer.pric", "บริษัทในเครือ"] },
  { kind: "Contracts", keys: ["contract", "agreement", "สัญญา"] },
  { kind: "Audit adjustments", keys: ["audit adj", "audit_adj", "aja", "ปรับปรุงสอบบัญชี"] },
];

export function fileExt(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function classifyKind(name: string): DocKind {
  const n = name.toLowerCase().replace(/\s+/g, " ");
  for (const row of KIND_KEYS) {
    if (row.keys.some((k) => n.includes(k))) return row.kind;
  }
  return "Other";
}

export function detectPeriod(name: string) {
  const n = name.toLowerCase();
  if (/fy2025|2568/.test(n) && /pnd50|ภ\.ง\.ด\.50|filed|audited/.test(n)) return "FY2025";
  if (/h1|jan.?jun|q1q2/.test(n)) return "H1 2026";
  if (/jul|july|ก\.ค/.test(n)) return "Jul 2026";
  if (/fy2026|2569/.test(n)) return "FY2026";
  if (/2026/.test(n)) return "FY2026";
  if (/2025|2568/.test(n)) return "FY2025";
  return "Unknown";
}

function formatBytes(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} MB`;
  if (n >= 1_000) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${n} B`;
}

export function scoreDocument(input: {
  name: string;
  kind: DocKind;
  period: string;
  status: string;
  conf: number;
  duplicate: boolean;
}): { score: number; loadedOk: boolean; issues: Issue[] } {
  const ext = fileExt(input.name);
  const issues: Issue[] = [];
  let score = 40;

  score += Math.round(input.conf * 35);

  const structured = ["xlsx", "xls", "csv"].includes(ext);
  const pdf = ext === "pdf";
  const image = ["png", "jpg", "jpeg", "tif", "tiff", "heic", "webp"].includes(ext);
  const zip = ext === "zip";
  const books = input.kind === "Trial balance" || input.kind === "General ledger" || input.kind === "Fixed-asset register" || input.kind === "Payroll / benefits";
  const filings = input.kind === "Prior-year PND50" || input.kind === "Prior-year PND51" || input.kind === "WHT certificates" || input.kind === "Financial statements";

  if (books && structured) score += 12;
  else if (filings && pdf) score += 12;
  else if (zip) {
    score += 4;
    issues.push({ en: "Archive — extract and index individual documents", th: "ไฟล์บีบอัด — ต้องแตกไฟล์และจัดทำดัชนีรายฉบับ" });
  } else if (image) {
    score += 2;
    issues.push({ en: "Image scan — OCR quality may be below filing standard", th: "ภาพสแกน — คุณภาพ OCR อาจต่ำกว่ามาตรฐานยื่นแบบ" });
  } else if (books && pdf) {
    score += 6;
    issues.push({ en: "Books uploaded as PDF — structured TB/GL/FAR preferred", th: "บัญชีเป็น PDF — ควรเป็นไฟล์ตาราง TB/GL/FAR" });
  } else score += 8;

  if (input.period === "Unknown") {
    score -= 10;
    issues.push({ en: "Accounting period not detected in the file name", th: "ตรวจไม่พบรอบบัญชีในชื่อไฟล์" });
  } else score += 8;

  if (input.conf < 0.85) {
    score -= 12;
    issues.push({ en: `Extraction confidence ${input.conf.toFixed(2)} is below the 0.85 posting floor`, th: `ความเชื่อมั่นในการถอดข้อมูล ${input.conf.toFixed(2)} ต่ำกว่าเกณฑ์ 0.85` });
  }

  if (input.status === "Needs review") {
    score -= 8;
    issues.push({ en: "Needs reviewer validation before posting", th: "ต้องให้ผู้สอบทานตรวจก่อนบันทึก" });
  }
  if (input.status === "OCR (TH)") {
    issues.push({ en: "Thai OCR complete — match certificates to GL receipts", th: "OCR ภาษาไทยเสร็จแล้ว — จับคู่หนังสือรับรองกับบัญชี" });
  }

  if (input.duplicate) {
    score -= 18;
    issues.push({ en: "Duplicate of a file already in the pack", th: "ซ้ำกับไฟล์ที่มีอยู่ในชุดเอกสาร" });
  }

  if (input.kind === "Other") {
    score -= 8;
    issues.push({ en: "Type not recognised — classify before the rule engine can use it", th: "ยังไม่ทราบประเภท — ต้องจัดประเภทก่อนเครื่องกฎจะใช้ได้" });
  }

  score = Math.max(0, Math.min(100, score));
  const loadedOk =
    score >= 70 &&
    !input.duplicate &&
    input.conf >= 0.85 &&
    input.status !== "Needs review" &&
    input.kind !== "Other";

  if (!loadedOk && !issues.length) {
    issues.push({ en: "Loaded but not yet validated for the tax pack", th: "นำเข้าแล้วแต่ยังไม่ผ่านการตรวจสำหรับชุดภาษี" });
  }

  return { score, loadedOk, issues };
}

let seq = 0;
function nextId() {
  seq += 1;
  return `DOC-${Date.now().toString(36)}-${seq}`;
}

export function hydrateSeedFile(row: {
  name: string;
  kind: string;
  period: string;
  status: string;
  conf: number;
  size: string;
}): IngestedFile {
  const kind = (DOC_REQUIREMENTS.some((r) => r.kind === row.kind) ? row.kind : classifyKind(row.name)) as DocKind;
  const scored = scoreDocument({
    name: row.name,
    kind,
    period: row.period,
    status: row.status,
    conf: row.conf,
    duplicate: false,
  });
  return {
    id: `seed-${row.name}`,
    name: row.name,
    kind,
    period: row.period,
    status: row.status,
    conf: row.conf,
    size: row.size,
    score: scored.score,
    loadedOk: scored.loadedOk,
    duplicate: false,
    issues: scored.issues,
  };
}

export function ingestBrowserFiles(list: File[], existing: IngestedFile[]): { added: IngestedFile[]; skipped: string[] } {
  const added: IngestedFile[] = [];
  const skipped: string[] = [];
  const names = new Set(existing.map((f) => f.name.toLowerCase()));

  for (const file of list) {
    if (names.has(file.name.toLowerCase())) {
      skipped.push(file.name);
      continue;
    }
    const kind = classifyKind(file.name);
    const period = detectPeriod(file.name);
    const ext = fileExt(file.name);
    const conf = ["xlsx", "xls", "csv"].includes(ext) ? 0.97 : ext === "pdf" ? 0.92 : ext === "zip" ? 0.74 : 0.68;
    const uniqueKinds: DocKind[] = ["Trial balance", "Financial statements", "Fixed-asset register", "Prior-year PND50", "Prior-year PND51"];
    const duplicateKind = uniqueKinds.includes(kind) && existing.concat(added).some((f) => f.kind === kind);
    const status = duplicateKind ? "Needs review" : conf < 0.85 ? "Needs review" : ext === "pdf" && kind === "WHT certificates" ? "OCR (TH)" : "Extracted";
    const scored = scoreDocument({
      name: file.name,
      kind,
      period,
      status,
      conf,
      duplicate: duplicateKind,
    });
    if (duplicateKind) {
      scored.issues.unshift({
        en: `A ${kind} is already in the pack — confirm which file is authoritative`,
        th: `มี${kind} ในชุดแล้ว — ยืนยันไฟล์ที่ใช้เป็นหลัก`,
      });
    }
    const row: IngestedFile = {
      id: nextId(),
      name: file.name,
      kind,
      period,
      status: duplicateKind ? "Duplicate" : status,
      conf,
      size: formatBytes(file.size),
      score: scored.score,
      loadedOk: scored.loadedOk && !duplicateKind,
      duplicate: duplicateKind,
      issues: scored.issues,
    };
    added.push(row);
    names.add(file.name.toLowerCase());
  }
  return { added, skipped };
}

export type PackSlot = {
  req: DocRequirement;
  files: IngestedFile[];
  best: IngestedFile | null;
  missing: boolean;
  loadedOk: boolean;
};

export type EvidencePack = {
  slots: PackSlot[];
  packScore: number;
  requiredOk: number;
  requiredTotal: number;
  recommendedOk: number;
  recommendedTotal: number;
  coveragePct: number;
  blocking: Issue[];
  warnings: Issue[];
};

export function evaluatePack(files: IngestedFile[]): EvidencePack {
  const slots: PackSlot[] = DOC_REQUIREMENTS.map((req) => {
    const matches = files.filter((f) => f.kind === req.kind);
    const best = matches.slice().sort((a, b) => b.score - a.score)[0] ?? null;
    const missing = !best;
    const loadedOk = !!best && best.loadedOk;
    return { req, files: matches, best, missing, loadedOk };
  });

  const required = slots.filter((s) => s.req.level === "required");
  const recommended = slots.filter((s) => s.req.level === "recommended");
  const requiredOk = required.filter((s) => s.loadedOk).length;
  const recommendedOk = recommended.filter((s) => s.loadedOk).length;

  const reqWeight = required.reduce((s, x) => s + x.req.weight, 0);
  const reqPts = required.reduce((s, x) => s + (x.best ? x.best.score * x.req.weight : 0), 0);
  const recWeight = recommended.reduce((s, x) => s + x.req.weight, 0);
  const recPts = recommended.reduce((s, x) => s + (x.best ? x.best.score * x.req.weight : 0), 0);
  let packScore = Math.round((reqPts / reqWeight) * 0.8 + (recPts / recWeight) * 0.2);
  packScore -= (required.length - requiredOk) * 8;
  packScore = Math.max(0, Math.min(100, packScore));

  const blocking: Issue[] = [];
  const warnings: Issue[] = [];
  for (const s of required) {
    if (s.missing) {
      blocking.push({
        en: `Required ${s.req.en} is not loaded`,
        th: `ยังไม่ได้นำเข้า${s.req.th} ที่จำเป็น`,
      });
    } else if (!s.loadedOk) {
      blocking.push({
        en: `${s.req.en} is loaded but not validated (score ${s.best!.score})`,
        th: `${s.req.th} นำเข้าแล้วแต่ยังไม่ผ่านการตรวจ (คะแนน ${s.best!.score})`,
      });
    }
  }
  for (const s of recommended) {
    if (s.missing) {
      warnings.push({
        en: `Recommended ${s.req.en} is missing`,
        th: `ยังไม่มี${s.req.th} ที่แนะนำ`,
      });
    } else if (!s.loadedOk) {
      warnings.push({
        en: `${s.req.en} scored ${s.best!.score} — below the 70 evidence floor`,
        th: `${s.req.th} ได้ ${s.best!.score} — ต่ำกว่าเกณฑ์หลักฐาน 70`,
      });
    }
  }

  const covered = required.filter((s) => !s.missing).length;
  return {
    slots,
    packScore,
    requiredOk,
    requiredTotal: required.length,
    recommendedOk,
    recommendedTotal: recommended.length,
    coveragePct: Math.round((covered / required.length) * 100),
    blocking,
    warnings,
  };
}

export function kindLabel(kind: DocKind, lang: Lang) {
  const row = DOC_REQUIREMENTS.find((r) => r.kind === kind);
  if (!row) return kind;
  return lang === "th" ? row.th : row.en;
}
