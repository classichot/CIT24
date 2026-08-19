import { ACTIVITY_LOG, UNMAPPED_SEED, type Adjustment, type Risk } from "./model";
import { money } from "./format";

export type MapTag = "Permanent" | "Temporary" | "Tax-sensitive" | "Related party" | "Exempt" | "Ordinary";

export type AccountRow = {
  code: string;
  name: string;
  nameTh: string;
  balance: number;
  mapped: boolean;
  tag: MapTag;
  suggestion: string;
  suggestionTh: string;
  conf: number;
  ruleId?: string;
  priorMap: string;
};

export type WhtCert = {
  id: string;
  payer: string;
  amount: number;
  date: string;
  matched: boolean;
  gl?: string;
};

export type LossYear = {
  fy: string;
  fyTh: string;
  origin: number;
  utilisedPrior: number;
  expires: string;
};

export type ReversalWatch = {
  id: string;
  name: string;
  nameTh: string;
  amount: number;
  gl: string;
  status: "Claimed" | "Action needed" | "Scheduled";
  note: string;
  noteTh: string;
  evidence: string;
};

export type AuditEvent = {
  when: string;
  who: string;
  what: string;
  hash: string;
  prev: string;
};

export type AdjVersion = {
  adjId: string;
  version: number;
  oldAmt: number;
  newAmt: number;
  oldStatus: string;
  newStatus: string;
  reason: string;
  who: string;
  when: string;
};

export type MapEvent = {
  when: string;
  who: string;
  code: string;
  action: string;
};

export type Pnd50Snap = {
  v: number;
  when: string;
  who: string;
  accountingProfit: number;
  addBacks: number;
  deductions: number;
  losses: number;
  taxableProfit: number;
  currentTax: number;
  pnd51Credit: number;
  whtCredit: number;
  payable: number;
};

export function fnvHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 4);
}

export function appendLog(log: AuditEvent[], who: string, what: string, when = stamp()): AuditEvent[] {
  const prev = log[0]?.hash ?? "0000";
  const hash = fnvHash(`${prev}|${when}|${who}|${what}`);
  return [{ when, who, what, hash, prev }, ...log];
}

export function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())} Aug 2026 ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function fileFingerprint(name: string, size: string, conf: number) {
  return fnvHash(`${name}|${size}|${conf}`);
}

export const ACCOUNT_SEED: AccountRow[] = [
  { code: "6210-00", name: "Entertainment", nameTh: "ค่ารับรอง", balance: 6420000, mapped: true, tag: "Permanent", suggestion: "Permanent add-back of excess over 0.3%", suggestionTh: "บวกกลับถาวรส่วนที่เกิน 0.3%", conf: 0.99, ruleId: "RULE-65T-04", priorMap: "FY2025 · same treatment" },
  { code: "2340-00", name: "Warranty provision", nameTh: "ประมาณการค่ารับประกัน", balance: 4600000, mapped: true, tag: "Temporary", suggestion: "Temporary add-back until utilised", suggestionTh: "บวกกลับชั่วคราวจนกว่าจะใช้จริง", conf: 0.99, ruleId: "RULE-65T-01", priorMap: "FY2025 · reversed on claims" },
  { code: "2310-00", name: "Accrued bonus", nameTh: "โบนัสค้างจ่าย", balance: 2500000, mapped: true, tag: "Temporary", suggestion: "Temporary add-back until paid", suggestionTh: "บวกกลับชั่วคราวจนกว่าจะจ่าย", conf: 0.99, ruleId: "RULE-65T-09", priorMap: "FY2025 · reversed Mar 2026" },
  { code: "6410-00", name: "Depreciation", nameTh: "ค่าเสื่อมราคา", balance: 18600000, mapped: true, tag: "Temporary", suggestion: "Tax ceiling per Royal Decree 145", suggestionTh: "เพดานภาษีตาม พ.ร.ฎ. 145", conf: 1, ruleId: "RULE-DEP-145", priorMap: "FY2025 · tax-base register" },
  { code: "6320-00", name: "Donations", nameTh: "เงินบริจาค", balance: 2180000, mapped: true, tag: "Permanent", suggestion: "Permanent add-back of excess over 2%", suggestionTh: "บวกกลับถาวรส่วนที่เกิน 2%", conf: 0.97, ruleId: "RULE-DON-65T3", priorMap: "FY2025 · same ceiling" },
  { code: "6910-00", name: "Fines and surcharges", nameTh: "ค่าปรับและเงินเพิ่ม", balance: 185400, mapped: true, tag: "Permanent", suggestion: "Permanent add-back in full", suggestionTh: "บวกกลับถาวรทั้งจำนวน", conf: 0.99, ruleId: "RULE-65T-06", priorMap: "FY2025 · same treatment" },
  { code: "1450-00", name: "Inventory obsolescence", nameTh: "ค่าเผื่อสินค้าล้าสมัย", balance: 3250000, mapped: true, tag: "Temporary", suggestion: "Temporary until scrapped", suggestionTh: "ชั่วคราวจนทำลายสินค้า", conf: 0.96, ruleId: "RULE-65T-01", priorMap: "New in FY2026" },
  { code: "7120-00", name: "Unrealised FX loss", nameTh: "ผลขาดทุนอัตราแลกเปลี่ยนที่ยังไม่เกิดขึ้น", balance: 1846000, mapped: true, tag: "Temporary", suggestion: "Temporary until settlement", suggestionTh: "ชั่วคราวจนชำระ", conf: 0.95, ruleId: "RULE-FX-65B5", priorMap: "FY2025 · prescribed rate" },
  { code: "6810-00", name: "Bad debts written off", nameTh: "หนี้สูญตัดจำหน่าย", balance: 920000, mapped: true, tag: "Temporary", suggestion: "Add back until Min. Reg. 186 met", suggestionTh: "บวกกลับจนกว่าจะเข้า กฎกระทรวง 186", conf: 0.93, ruleId: "RULE-BD-186", priorMap: "FY2025 · deducted (conditions met)" },
  { code: "6150-00", name: "Related-party management fee", nameTh: "ค่าบริหารจัดการบริษัทในเครือ", balance: 18400000, mapped: true, tag: "Related party", suggestion: "TP24 range excess is permanent", suggestionTh: "ส่วนเกินช่วง TP24 เป็นรายการถาวร", conf: 0.94, ruleId: "RULE-TP-71B", priorMap: "FY2025 · accepted in full" },
  { code: "6260-00", name: "Directors’ travel", nameTh: "ค่าเดินทางกรรมการ", balance: 262000, mapped: true, tag: "Permanent", suggestion: "Personal / non-business add-back", suggestionTh: "บวกกลับรายจ่ายส่วนตัว", conf: 0.92, ruleId: "RULE-65T-13", priorMap: "New RISK24 detection" },
  { code: "4910-00", name: "Dividend income", nameTh: "รายได้เงินปันผล", balance: -1500000, mapped: true, tag: "Exempt", suggestion: "Exempt s.65 bis (10)", suggestionTh: "ยกเว้น ม.65 ทวิ (10)", conf: 1, ruleId: "RULE-EX-65B10", priorMap: "FY2025 · same subsidiary" },
  ...UNMAPPED_SEED.map((u) => ({
    code: u.code,
    name: u.name.split(" / ").slice(-1)[0],
    nameTh: u.name.split(" / ")[0],
    balance: u.code === "4915-00" ? -820000 : u.code === "6265-04" ? 1540000 : u.code === "6912-00" ? 96000 : u.code === "1455-02" ? 410000 : u.code === "6155-01" ? 2760000 : 640000,
    mapped: false,
    tag: (u.tag === "Permanent" || u.tag === "Temporary" || u.tag === "Related party" ? u.tag : "Tax-sensitive") as MapTag,
    suggestion: u.suggestion,
    suggestionTh: u.suggestion,
    conf: u.conf,
    priorMap: "Unmapped · new account",
  })),
];

export const WHT_SEED: WhtCert[] = [
  { id: "WHT-0001", payer: "Bangkok Industrial Estate", amount: 486000, date: "15 Feb 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0008", payer: "Siam Motors Assembly", amount: 312400, date: "28 Feb 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0014", payer: "Eastern Seaboard OEM", amount: 528000, date: "31 Mar 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0022", payer: "Ayutthaya Components", amount: 274050, date: "30 Apr 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0029", payer: "Pathumthani Tooling", amount: 196000, date: "31 May 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0035", payer: "Chonburi Precision", amount: 390000, date: "30 Jun 2026", matched: true, gl: "1150-00" },
  { id: "WHT-0040", payer: "Siam Steel Coil", amount: 41200, date: "30 Jun 2026", matched: false },
  { id: "WHT-0041", payer: "Eastern Parts Ltd", amount: 45200, date: "30 Jun 2026", matched: false },
];

export const LOSS_SEED: LossYear[] = [
  { fy: "FY2021", fyTh: "2564", origin: 12_000_000, utilisedPrior: 0, expires: "FY2026" },
  { fy: "FY2022", fyTh: "2565", origin: 0, utilisedPrior: 0, expires: "FY2027" },
  { fy: "FY2023", fyTh: "2566", origin: 0, utilisedPrior: 0, expires: "FY2028" },
  { fy: "FY2024", fyTh: "2567", origin: 0, utilisedPrior: 0, expires: "FY2029" },
  { fy: "FY2025", fyTh: "2568", origin: 0, utilisedPrior: 0, expires: "FY2030" },
];

export const REVERSAL_SEED: ReversalWatch[] = [
  {
    id: "REV-BONUS-25",
    name: "Accrued bonus FY2025 · 2,200,000",
    nameTh: "โบนัสค้างจ่ายปี 2568 · 2,200,000",
    amount: 2200000,
    gl: "2310-00",
    status: "Claimed",
    note: "Payroll run 14 Mar 2026 matched to the FY2025 accrual. Deduction posted as ADJ-2026-0044.",
    noteTh: "จ่ายเงินเดือน 14 มี.ค. 2569 จับคู่ค้างจ่ายปี 2568 บันทึกหักเป็น ADJ-2026-0044",
    evidence: "Bonus_schedule_2026.xlsx",
  },
  {
    id: "REV-WARR-24",
    name: "Warranty provision FY2024 · 900,000",
    nameTh: "ประมาณการรับประกันปี 2567 · 900,000",
    amount: 900000,
    gl: "2340-00",
    status: "Action needed",
    note: "Claims settled against the FY2024 provision. GL 6415-00 warranty claims 18 Jun 2026. Deduction not yet posted.",
    noteTh: "เคลมตัดกับประมาณการปี 2567 บัญชี 6415-00 เมื่อ 18 มิ.ย. 2569 ยังไม่บันทึกหัก",
    evidence: "Warranty_claims_Jun2026.pdf",
  },
  {
    id: "REV-FEE-25",
    name: "Accrued professional fees FY2025 · 360,000",
    nameTh: "ค่าวิชาชีพค้างจ่ายปี 2568 · 360,000",
    amount: 360000,
    gl: "6120-00",
    status: "Action needed",
    note: "Invoice paid 12 Feb 2026. Prior-year add-back should reverse in FY2026.",
    noteTh: "จ่ายตามใบแจ้งหนี้ 12 ก.พ. 2569 รายการบวกกลับปีก่อนควรกลับในปี 2569",
    evidence: "INV-LEGAL-2026-0212.pdf",
  },
  {
    id: "REV-INV-26",
    name: "Inventory provision FY2026 · 3,250,000",
    nameTh: "ค่าเผื่อสินค้าล้าสมัยปี 2569 · 3,250,000",
    amount: 3250000,
    gl: "1450-00",
    status: "Scheduled",
    note: "Reverses only on documented scrapping. Guardian watches the disposal account.",
    noteTh: "กลับรายการเมื่อมีรายงานการทำลาย ผู้เฝ้าระวังติดตามบัญชีจำหน่าย",
    evidence: "Pending destruction report",
  },
];

export const EVIDENCE_SEED: Record<string, string[]> = {
  "ADJ-2026-0041": ["seed-Entertainment_invoices_H1.zip"],
  "ADJ-2026-0043": ["seed-Bonus_schedule_2026.xlsx"],
  "ADJ-2026-0044": ["seed-Bonus_schedule_2026.xlsx"],
  "ADJ-2026-0045": ["seed-FAR_SPP_2026.xlsx"],
  "ADJ-2026-0051": ["seed-PND50_SPP_FY2025_filed.pdf"],
};

export function seedLog(): AuditEvent[] {
  const chrono = [...ACTIVITY_LOG].reverse();
  let prev = "0000";
  const chained: AuditEvent[] = [];
  for (const row of chrono) {
    const hash = row.hash;
    chained.push({ when: row.when, who: row.who, what: row.what, hash, prev });
    prev = hash;
  }
  return chained.reverse();
}

export function classifyAccount(code: string, name: string): Pick<AccountRow, "tag" | "suggestion" | "suggestionTh" | "conf" | "ruleId"> {
  const n = `${code} ${name}`.toLowerCase();
  if (/fine|penalty|surcharge|ค่าปรับ|6912/.test(n)) return { tag: "Permanent", suggestion: "Non-deductible — s.65 ter (6)", suggestionTh: "หักไม่ได้ — ม.65 ตรี (6)", conf: 0.98, ruleId: "RULE-65T-06" };
  if (/entertain|รับรอง|6210/.test(n)) return { tag: "Permanent", suggestion: "Ceiling test s.65 ter (4)", suggestionTh: "ทดสอบเพดาน ม.65 ตรี (4)", conf: 0.94, ruleId: "RULE-65T-04" };
  if (/provision|allowance|ค่าเผื่อ|ประมาณการ/.test(n)) return { tag: "Temporary", suggestion: "Non-deductible reserve — s.65 ter (1)", suggestionTh: "สำรองหักไม่ได้ — ม.65 ตรี (1)", conf: 0.94, ruleId: "RULE-65T-01" };
  if (/dividend|ปันผล|491/.test(n)) return { tag: "Exempt", suggestion: "Partially exempt — s.65 bis (10)", suggestionTh: "ยกเว้นบางส่วน — ม.65 ทวิ (10)", conf: 0.90, ruleId: "RULE-EX-65B10" };
  if (/royalty|management fee|parent|บริษัทแม่|615/.test(n)) return { tag: "Related party", suggestion: "Deductible — TP24 benchmark applies", suggestionTh: "หักได้ — ใช้เกณฑ์ TP24", conf: 0.85, ruleId: "RULE-TP-71B" };
  if (/doubtful|bad debt|หนี้สงสัย|หนี้สูญ|682/.test(n)) return { tag: "Temporary", suggestion: "Non-deductible until conditions met", suggestionTh: "หักไม่ได้จนกว่าจะเข้าเงื่อนไข", conf: 0.96, ruleId: "RULE-BD-186" };
  if (/consult|ที่ปรึกษา|6265/.test(n)) return { tag: "Tax-sensitive", suggestion: "Deductible — WHT & TP review required", suggestionTh: "หักได้ — ต้องตรวจ WHT และ TP", conf: 0.87 };
  return { tag: "Tax-sensitive", suggestion: "Review — tax-sensitive new account", suggestionTh: "สอบทาน — บัญชีใหม่ที่มีนัยทางภาษี", conf: 0.72 };
}

export function parseTabular(name: string, text: string): { accounts: AccountRow[]; certs: WhtCert[] } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return { accounts: [], certs: [] };
  const delim = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delim).map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  const rows = lines.slice(1).map((l) => l.split(delim).map((c) => c.trim().replace(/^["']|["']$/g, "")));
  const idx = (keys: string[]) => headers.findIndex((h) => keys.some((k) => h.includes(k)));
  const accounts: AccountRow[] = [];
  const certs: WhtCert[] = [];
  const iCode = idx(["code", "account", "acct", "รหัส"]);
  const iName = idx(["name", "description", "desc", "ชื่อ"]);
  const iDr = idx(["debit", "dr", "เดบิต"]);
  const iCr = idx(["credit", "cr", "เครดิต"]);
  const iAmt = idx(["amount", "amt", "wht", "ภาษี", "withheld"]);
  const iPayer = idx(["payer", "customer", "vendor", "ผู้จ่าย"]);
  const iDate = idx(["date", "วันที่"]);
  const iCert = idx(["cert", "certificate", "เลขที่"]);
  const looksWht = /wht|withhold|หัก ณ|certificate/.test(name.toLowerCase()) || iCert >= 0 && iPayer >= 0;
  if (looksWht && iAmt >= 0) {
    rows.forEach((r, n) => {
      const amount = Math.abs(Number((r[iAmt] ?? "0").replace(/,/g, "")));
      if (!amount) return;
      certs.push({
        id: (iCert >= 0 ? r[iCert] : "") || `WHT-U-${n + 1}`,
        payer: (iPayer >= 0 ? r[iPayer] : "") || "Unknown payer",
        amount,
        date: (iDate >= 0 ? r[iDate] : "") || "FY2026",
        matched: false,
      });
    });
    return { accounts, certs };
  }
  if (iCode >= 0) {
    for (const r of rows) {
      const code = r[iCode] || "";
      if (!code) continue;
      const dr = iDr >= 0 ? Number((r[iDr] ?? "0").replace(/,/g, "")) || 0 : 0;
      const cr = iCr >= 0 ? Number((r[iCr] ?? "0").replace(/,/g, "")) || 0 : 0;
      const balance = iAmt >= 0 && iDr < 0 ? Number((r[iAmt] ?? "0").replace(/,/g, "")) || 0 : dr - cr;
      const nm = iName >= 0 ? r[iName] : code;
      const cls = classifyAccount(code, nm);
      accounts.push({
        code,
        name: nm,
        nameTh: nm,
        balance,
        mapped: false,
        tag: cls.tag,
        suggestion: cls.suggestion,
        suggestionTh: cls.suggestionTh,
        conf: cls.conf,
        ruleId: cls.ruleId,
        priorMap: "Imported this session",
      });
    }
  }
  return { accounts, certs };
}

export function mergeAccounts(base: AccountRow[], incoming: AccountRow[]) {
  const map = new Map(base.map((a) => [a.code, a]));
  for (const a of incoming) {
    const prev = map.get(a.code);
    if (prev) map.set(a.code, { ...prev, balance: a.balance, name: a.name || prev.name });
    else map.set(a.code, a);
  }
  return [...map.values()];
}

export function detectFromAccounts(accounts: AccountRow[], existing: Adjustment[]): Adjustment[] {
  const haveGl = new Set(existing.map((a) => a.gl));
  const out: Adjustment[] = [];
  let n = 60;
  for (const a of accounts) {
    if (!a.mapped || haveGl.has(a.code)) continue;
    const template = detectionTemplate(a);
    if (!template) continue;
    n += 1;
    out.push({
      id: `ADJ-2026-00${n}`,
      gl: a.code,
      origin: "AI",
      conf: a.conf,
      status: "Draft",
      ...template,
      acctAmt: Math.abs(a.balance),
    });
  }
  return out;
}

function detectionTemplate(a: AccountRow): Omit<Adjustment, "id" | "gl" | "acctAmt" | "origin" | "conf" | "status"> | null {
  if (a.ruleId === "RULE-65T-06" || a.tag === "Permanent" && /fine|6912/.test(a.code + a.name.toLowerCase())) {
    return {
      name: `Fines / surcharges — ${a.code}`,
      nameTh: `ค่าปรับ — ${a.code}`,
      adjAmt: Math.abs(a.balance),
      pt: "P",
      risk: "Low",
      sec: "Section 65 ter (6)",
      ruleId: "RULE-65T-06",
      facts: `${a.name} ${Math.abs(a.balance).toLocaleString()} in ${a.code}. Entirely non-deductible.`,
      factsTh: `${a.nameTh} ${Math.abs(a.balance).toLocaleString()} ใน ${a.code} หักไม่ได้ทั้งจำนวน`,
      treatment: "Permanent add-back. No reversal.",
      treatmentTh: "บวกกลับถาวร ไม่กลับรายการ",
    };
  }
  if (a.ruleId === "RULE-65T-01" || a.tag === "Temporary") {
    return {
      name: `Provision not yet incurred — ${a.code}`,
      nameTh: `สำรองที่ยังไม่เกิดขึ้น — ${a.code}`,
      adjAmt: Math.abs(a.balance),
      pt: "T",
      risk: "Medium",
      sec: "Section 65 ter (1)",
      ruleId: "RULE-65T-01",
      facts: `${a.name} ${Math.abs(a.balance).toLocaleString()} is a reserve. Expense not yet incurred.`,
      factsTh: `${a.nameTh} ${Math.abs(a.balance).toLocaleString()} เป็นสำรอง รายจ่ายยังไม่เกิดขึ้น`,
      treatment: "Temporary add-back. Reversal Guardian will watch utilisation.",
      treatmentTh: "บวกกลับชั่วคราว ผู้เฝ้าระวังจะติดตามการใช้จริง",
    };
  }
  if (a.ruleId === "RULE-EX-65B10" || a.tag === "Exempt") {
    const amt = -Math.abs(a.balance);
    return {
      name: `Exempt dividend income — ${a.code}`,
      nameTh: `เงินปันผลได้รับยกเว้น — ${a.code}`,
      adjAmt: amt,
      pt: "P",
      risk: "Low",
      sec: "Section 65 bis (10)",
      ruleId: "RULE-EX-65B10",
      facts: `Dividend ${Math.abs(a.balance).toLocaleString()} in ${a.code}. Exemption conditions to be confirmed.`,
      factsTh: `เงินปันผล ${Math.abs(a.balance).toLocaleString()} ใน ${a.code} ต้องยืนยันเงื่อนไขยกเว้น`,
      treatment: "Permanent deduction if exemption conditions are met.",
      treatmentTh: "หักถาวรถ้าเข้าเงื่อนไขยกเว้น",
    };
  }
  if (a.ruleId === "RULE-TP-71B" || a.tag === "Related party") {
    const excess = money(Math.abs(a.balance) * 0.15);
    return {
      name: `Related-party charge — TP review ${a.code}`,
      nameTh: `รายการระหว่างกัน — ตรวจ TP ${a.code}`,
      adjAmt: excess,
      pt: "P",
      risk: "High",
      sec: "Section 71 bis",
      ruleId: "RULE-TP-71B",
      facts: `${a.name} ${Math.abs(a.balance).toLocaleString()}. AI proposes a 15% range excess pending TP24.`,
      factsTh: `${a.nameTh} ${Math.abs(a.balance).toLocaleString()} AI เสนอส่วนเกินช่วง 15% รอ TP24`,
      treatment: "Proposed permanent add-back. Human must confirm the legal position.",
      treatmentTh: "เสนอบวกกลับถาวร มนุษย์ต้องยืนยันจุดยืนทางกฎหมาย",
    };
  }
  return null;
}

export function reversalAdjustment(watch: ReversalWatch): Adjustment {
  return {
    id: `ADJ-2026-${watch.id.replace(/\W/g, "").slice(-4)}`,
    name: `Reversal — ${watch.name}`,
    nameTh: `กลับรายการ — ${watch.nameTh}`,
    gl: watch.gl,
    acctAmt: watch.amount,
    adjAmt: -watch.amount,
    pt: "T",
    origin: "Reversal Guardian",
    conf: 0.97,
    risk: "Low" as Risk,
    status: "In review",
    sec: "Section 65 (accrual)",
    ruleId: "RULE-65T-01",
    facts: watch.note,
    factsTh: watch.noteTh,
    treatment: "Automatic reversal of prior-year add-back. Deduct in FY2026.",
    treatmentTh: "กลับรายการบวกกลับปีก่อน หักได้ในปี 2569",
  };
}

export function utiliseLosses(years: LossYear[], adjustedProfit: number) {
  let remain = Math.max(0, adjustedProfit);
  return years.map((y) => {
    const available = Math.max(0, y.origin - y.utilisedPrior);
    const utilised = y.expires === "FY2026" || y.expires < "FY2027" ? Math.min(available, remain) : Math.min(available, remain);
    remain -= utilised;
    return { ...y, available, utilised, remaining: available - utilised, expired: y.expires === "FY2026" && available - utilised > 0 ? 0 : 0 };
  });
}

export function pnd50Lines(p: {
  accountingProfit: number;
  addBacks: number;
  deductions: number;
  losses: number;
  taxableProfit: number;
  currentTax: number;
  pnd51Credit: number;
  whtCredit: number;
  payable: number;
}, whtNote: string) {
  return [
    { field: "Part 1 · accounting profit", amount: p.accountingProfit, src: "Audited TB / July management accounts", live: true },
    { field: "Part 3 line 4.2 · add-backs 65 bis / 65 ter", amount: p.addBacks, src: "Tax Adjustment Ledger", live: true },
    { field: "Part 3 line 5 · deductions / reversals", amount: p.deductions, src: "Reversal Guardian + exempt income", live: true },
    { field: "Part 3 · tax losses utilised", amount: -p.losses, src: "Loss schedule · FIFO · FY2021 expires FY2026", live: true },
    { field: "Part 4 · taxable profit", amount: p.taxableProfit, src: "CIT24-CALC 2026.2", live: true },
    { field: "Part 4 · tax at 20%", amount: p.currentTax, src: "Standard rate · non-BOI · not SME", live: true },
    { field: "Credit · PND51", amount: -p.pnd51Credit, src: "Half-year payment due 31 Aug 2026", live: true },
    { field: "Credit · withholding tax", amount: -p.whtCredit, src: whtNote, live: true },
    { field: "Tax payable", amount: p.payable, src: "Due with PND50 · 30 May 2027", live: true },
  ];
}

export function evidenceCoverage(adjs: Adjustment[], links: Record<string, string[]>) {
  const need = adjs.filter((a) => Math.abs(a.adjAmt) >= 500000);
  const ok = need.filter((a) => (links[a.id] ?? []).length > 0);
  return { need: need.length, linked: ok.length, pct: need.length ? Math.round((ok.length / need.length) * 100) : 100 };
}
