export type ProductMode = "corporate" | "advisor" | "defence";
/** Depth of law — independent of advisor/corporate/defence role modes. */
export type LawMode = "compliance" | "complex";
export type Lang = "en" | "th" | "zh" | "ja";
export type AdjStatus = "Approved" | "In review" | "Query" | "Draft";
export type DiffKind = "P" | "T";
export type Risk = "High" | "Medium" | "Low";

export type Client = {
  id: string;
  name: string;
  nameTh: string;
  tin: string;
  period: string;
  fyLabel: string;
  stage: string;
  pct: number;
  adj: number;
  tax: number;
  next: string;
  days: number;
  risk: Risk;
  rateProfile: "normal" | "sme" | "listed";
  pnd51Method: "67bis1" | "67bis2";
  boi: boolean;
  /** True when created in this workspace (not a seed demo row). */
  custom?: boolean;
};

export type Adjustment = {
  id: string;
  name: string;
  nameTh: string;
  gl: string;
  acctAmt: number;
  adjAmt: number;
  pt: DiffKind;
  origin: string;
  conf: number;
  risk: Risk;
  status: AdjStatus;
  sec: string;
  ruleId: string;
  facts: string;
  factsTh: string;
  treatment: string;
  treatmentTh: string;
  priorYear?: string;
};

export type TaxRule = {
  id: string;
  name: string;
  sec: string;
  version: string;
  effective: string;
  risk: Risk;
  clients: number;
  logic: string;
  evidence: string;
  tests: string;
  legalUrl: string;
};

export const ADVISOR_USER = {
  name: "Kanit S.",
  initials: "KS",
  role: "Tax reviewer",
  org: "Kanit & Partners",
  email: "kanit@7l-advisory.com",
};

export const CORPORATE_USER = {
  name: "Pornthip R.",
  initials: "PR",
  role: "CFO",
  org: "Siam Precision Parts",
  email: "pornthip@siamprecision.co.th",
};

export const DEFENCE_USER = {
  name: "Niran K.",
  initials: "NK",
  role: "External auditor",
  org: "SGV Audit",
  email: "audit.partner@sgv.co.th",
};

export const CLIENTS: Client[] = [
  { id: "spp", name: "Siam Precision Parts Co., Ltd.", nameTh: "บริษัท สยามพรีซิชั่น พาร์ท จำกัด", tin: "0105548093271", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "Ledger review", pct: 72, adj: 14, tax: 17248680, next: "PND51", days: 13, risk: "Medium", rateProfile: "normal", pnd51Method: "67bis1", boi: false },
  { id: "thanaporn", name: "Thanaporn Logistics PLC", nameTh: "บริษัท ธนพร โลจิสติกส์ จำกัด (มหาชน)", tin: "0107558000442", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "Mapping", pct: 38, adj: 9, tax: 8420000, next: "PND51", days: 13, risk: "High", rateProfile: "listed", pnd51Method: "67bis2", boi: false },
  { id: "bff", name: "Bangkok Fresh Foods Co., Ltd.", nameTh: "บริษัท บางกอก เฟรช ฟู้ดส์ จำกัด", tin: "0105542011883", period: "FY2026 (Mar)", fyLabel: "1 Apr 2025 – 31 Mar 2026", stage: "Provision", pct: 84, adj: 11, tax: 4165200, next: "PND50", days: 27, risk: "Low", rateProfile: "sme", pnd51Method: "67bis1", boi: false },
  { id: "chao", name: "Chao Phraya Textile Co., Ltd.", nameTh: "บริษัท เจ้าพระยา เท็กซ์ไทล์ จำกัด", tin: "0105539012210", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "Ingestion", pct: 15, adj: 3, tax: 0, next: "PND51", days: 13, risk: "High", rateProfile: "normal", pnd51Method: "67bis1", boi: false },
  { id: "nks", name: "NKS Electronics (Thailand)", nameTh: "บริษัท เอ็นเคเอส อีเล็คทรอนิคส์ จำกัด", tin: "0105547003319", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "BOI allocation", pct: 61, adj: 18, tax: 2980400, next: "PND51", days: 44, risk: "Medium", rateProfile: "normal", pnd51Method: "67bis1", boi: true },
  { id: "isan", name: "Isan Agro Holdings Co., Ltd.", nameTh: "บริษัท อีสาน อะโกร โฮลดิ้งส์ จำกัด", tin: "0405558001124", period: "FY2025", fyLabel: "1 Jan – 31 Dec 2025", stage: "Filed", pct: 100, adj: 12, tax: 6112000, next: "PND50", days: 27, risk: "Low", rateProfile: "normal", pnd51Method: "67bis1", boi: false },
  { id: "phuket", name: "Phuket Resorts Group Co., Ltd.", nameTh: "บริษัท ภูเก็ต รีสอร์ท กรุ๊ป จำกัด", tin: "0835552014418", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "Audit defence", pct: 90, adj: 21, tax: 11740000, next: "RD audit", days: 9, risk: "High", rateProfile: "normal", pnd51Method: "67bis1", boi: false },
  { id: "rama", name: "Rama IX Property Co., Ltd.", nameTh: "บริษัท พระราม 9 พร็อพเพอร์ตี้ จำกัด", tin: "0105563019927", period: "FY2026", fyLabel: "1 Jan – 31 Dec 2026", stage: "Ledger review", pct: 55, adj: 7, tax: 3204800, next: "PND51", days: 13, risk: "Medium", rateProfile: "normal", pnd51Method: "67bis1", boi: false },
];

export const ENTITY = CLIENTS[0];

export const ADJUSTMENTS: Adjustment[] = [
  { id: "ADJ-2026-0041", name: "Entertainment expense over statutory limit", nameTh: "ค่ารับรองเกินเพดานที่กฎหมายกำหนด", gl: "6210-00", acctAmt: 6420000, adjAmt: 2700000, pt: "P", origin: "AI", conf: 0.94, risk: "Medium", status: "Approved", sec: "Section 65 ter (4)", ruleId: "RULE-65T-04", facts: "Gross revenue THB 1,240,000,000 × 0.3% = deductible ceiling 3,720,000. Entertainment 6,420,000 recorded in 6210-00.", factsTh: "รายได้รวม 1,240,000,000 × 0.3% = เพดานที่หักได้ 3,720,000 ค่ารับรอง 6,420,000 ในบัญชี 6210-00", treatment: "Permanent add-back of the excess 2,700,000. No deferred tax.", treatmentTh: "บวกกลับถาวรส่วนที่เกิน 2,700,000 ไม่รับรู้ภาษีรอตัดบัญชี", priorYear: "ADJ-2025-0039" },
  { id: "ADJ-2026-0042", name: "Warranty provision (unutilised)", nameTh: "ประมาณการหนี้สินค่ารับประกันสินค้า", gl: "2340-00", acctAmt: 4600000, adjAmt: 1500000, pt: "T", origin: "AI", conf: 0.97, risk: "Low", status: "Approved", sec: "Section 65 ter (1)", ruleId: "RULE-65T-01", facts: "Year-end warranty provision increased by 1,500,000. Expense not yet incurred.", factsTh: "ประมาณการค่ารับประกันเพิ่ม 1,500,000 รายจ่ายยังไม่เกิดขึ้นจริง", treatment: "Temporary add-back. Reversal Guardian watches utilisation.", treatmentTh: "บวกกลับชั่วคราว ผู้เฝ้าระวังจะติดตามการใช้จริง" },
  { id: "ADJ-2026-0043", name: "Accrued bonus unpaid at year-end", nameTh: "โบนัสค้างจ่าย ณ วันสิ้นรอบบัญชี", gl: "2310-00", acctAmt: 2500000, adjAmt: 2500000, pt: "T", origin: "AI", conf: 0.96, risk: "Low", status: "In review", sec: "Section 65 ter (9)", ruleId: "RULE-65T-09", facts: "Production bonus 1,720,000 and sales incentive 780,000 accrued at 31 Dec 2026, unpaid.", factsTh: "โบนัสผลิต 1,720,000 และสิ่งจูงใจขาย 780,000 ค้างจ่าย ณ 31 ธ.ค. 2569 ยังไม่จ่าย", treatment: "Temporary add-back. Deduct on payment — expected March 2027.", treatmentTh: "บวกกลับชั่วคราว หักได้เมื่อจ่าย — คาดมีนาคม 2570" },
  { id: "ADJ-2026-0044", name: "Reversal — FY2025 accrued bonus paid Mar 2026", nameTh: "กลับรายการ — โบนัสค้างจ่ายปี 2568 จ่ายแล้ว มี.ค. 2569", gl: "2310-00", acctAmt: 2200000, adjAmt: -2200000, pt: "T", origin: "Reversal Guardian", conf: 0.99, risk: "Low", status: "Approved", sec: "Section 65 (accrual)", ruleId: "RULE-65T-09", facts: "Payroll run 14 Mar 2026 matched to the FY2025 accrual. Condition for deduction now satisfied.", factsTh: "การจ่ายเงินเดือน 14 มี.ค. 2569 จับคู่กับรายการค้างจ่ายปี 2568 เงื่อนไขการหักครบแล้ว", treatment: "Automatic reversal of prior-year add-back. Deduct in FY2026.", treatmentTh: "กลับรายการบวกกลับปีก่อนอัตโนมัติ หักได้ในปี 2569", priorYear: "ADJ-2025-0028" },
  { id: "ADJ-2026-0045", name: "Depreciation: accounting in excess of tax", nameTh: "ค่าเสื่อมราคาทางบัญชีสูงกว่าทางภาษี", gl: "6410-00", acctAmt: 18600000, adjAmt: 1100000, pt: "T", origin: "Manual", conf: 1, risk: "Low", status: "Approved", sec: "Royal Decree 145", ruleId: "RULE-DEP-145", facts: "Book depreciation 18,600,000 vs tax ceiling 17,500,000 on the FAR. Excess 1,100,000 this year; 700,000 of prior excess now deductible.", factsTh: "ค่าเสื่อมบัญชี 18,600,000 เทียบเพดานภาษี 17,500,000 ส่วนเกินปีนี้ 1,100,000 ส่วนของปีก่อน 700,000 หักได้แล้ว", treatment: "Temporary. Tax-base register tracks each asset.", treatmentTh: "ชั่วคราว ทะเบียนฐานภาษีติดตามทีละสินทรัพย์" },
  { id: "ADJ-2026-0046", name: "Donations exceeding 2% of net profit", nameTh: "เงินบริจาคเกินร้อยละ 2 ของกำไรสุทธิ", gl: "6320-00", acctAmt: 2180000, adjAmt: 480000, pt: "P", origin: "AI", conf: 0.91, risk: "Low", status: "In review", sec: "Section 65 ter (3)", ruleId: "RULE-DON-65T3", facts: "Public-charity donations 2,180,000. 2% of net profit ceiling 1,700,000. Excess 480,000.", factsTh: "เงินบริจาคสาธารณกุศล 2,180,000 เพดาน 2% ของกำไรสุทธิ 1,700,000 ส่วนเกิน 480,000", treatment: "Permanent add-back of the excess.", treatmentTh: "บวกกลับถาวรส่วนที่เกิน" },
  { id: "ADJ-2026-0047", name: "Fines and surcharges (VAT assessment)", nameTh: "ค่าปรับและเงินเพิ่มภาษีมูลค่าเพิ่ม", gl: "6910-00", acctAmt: 185400, adjAmt: 185400, pt: "P", origin: "AI", conf: 0.99, risk: "Low", status: "Approved", sec: "Section 65 ter (6)", ruleId: "RULE-65T-06", facts: "VAT assessment surcharge posted 18 May 2026. Entirely non-deductible.", factsTh: "เงินเพิ่มจากการประเมิน VAT บันทึก 18 พ.ค. 2569 หักไม่ได้ทั้งจำนวน", treatment: "Permanent add-back. No reversal.", treatmentTh: "บวกกลับถาวร ไม่มีการกลับรายการ" },
  { id: "ADJ-2026-0048", name: "Inventory obsolescence provision", nameTh: "ค่าเผื่อสินค้าล้าสมัย", gl: "1450-00", acctAmt: 3250000, adjAmt: 3250000, pt: "T", origin: "AI", conf: 0.93, risk: "Medium", status: "In review", sec: "Section 65 ter (1)", ruleId: "RULE-65T-01", facts: "Slow-moving inventory allowance created in June 2026. Goods not yet scrapped.", factsTh: "ค่าเผื่อสินค้าเคลื่อนไหวช้าตั้งในมิ.ย. 2569 สินค้ายังไม่ได้ทำลาย", treatment: "Temporary. Guardian watches the disposal account and destruction report.", treatmentTh: "ชั่วคราว ผู้เฝ้าระวังติดตามบัญชีจำหน่ายและรายงานการทำลาย" },
  { id: "ADJ-2026-0049", name: "Unrealised FX loss on AP retranslation", nameTh: "ผลขาดทุนอัตราแลกเปลี่ยนที่ยังไม่เกิดขึ้น", gl: "7120-00", acctAmt: 1846000, adjAmt: 1846000, pt: "T", origin: "Manual", conf: 1, risk: "Medium", status: "Query", sec: "Section 65 bis (5)", ruleId: "RULE-FX-65B5", facts: "Year-end retranslation of USD payables at management rate. Query: confirm prescribed rate basis.", factsTh: "แปลงค่ายอดเจ้าหนี้ USD ปลายปีด้วยอัตราฝ่ายบริหาร สอบถาม: ยืนยันฐานอัตราตามที่กำหนด", treatment: "Temporary add-back until settlement, subject to the prescribed rate test.", treatmentTh: "บวกกลับชั่วคราวจนชำระ ขึ้นกับทดสอบอัตราที่กำหนด" },
  { id: "ADJ-2026-0050", name: "Bad debt written off — conditions not met", nameTh: "หนี้สูญที่ยังไม่เข้าเงื่อนไขการตัดจำหน่าย", gl: "6810-00", acctAmt: 920000, adjAmt: 920000, pt: "T", origin: "AI", conf: 0.89, risk: "High", status: "Query", sec: "Ministerial Reg. 186", ruleId: "RULE-BD-186", facts: "Write-off of 920,000 against a single debtor. Balance exceeds 500,000 so legal action is required before deduction.", factsTh: "ตัดหนี้สูญ 920,000 ลูกหนี้รายเดียว ยอดเกิน 500,000 ต้องดำเนินคดีก่อนหักได้", treatment: "Temporary add-back until collection steps are evidenced.", treatmentTh: "บวกกลับชั่วคราวจนกว่าจะมีหลักฐานขั้นตอนทวงหนี้" },
  { id: "ADJ-2026-0051", name: "Related-party management fee — TP adjustment", nameTh: "ค่าบริหารจัดการกับบริษัทในเครือ — ปรับปรุงราคาโอน", gl: "6150-00", acctAmt: 18400000, adjAmt: 4300000, pt: "P", origin: "TP24", conf: 0.88, risk: "High", status: "In review", sec: "Section 71 bis", ruleId: "RULE-TP-71B", facts: "Fee 18,400,000 paid to Singapore parent. TP24 median range implies 14,100,000. Excess 4,300,000.", factsTh: "ค่าธรรมเนียม 18,400,000 จ่ายบริษัทแม่สิงคโปร์ ช่วงมัธยฐาน TP24 ชี้ 14,100,000 ส่วนเกิน 4,300,000", treatment: "Permanent add-back of the amount above the arm’s-length range. Sourced from TP24.", treatmentTh: "บวกกลับถาวรส่วนที่เกินช่วงราคาตลาด นำเข้าจาก TP24" },
  { id: "ADJ-2026-0052", name: "Directors’ personal travel expenses", nameTh: "ค่าเดินทางส่วนตัวของกรรมการ", gl: "6260-00", acctAmt: 262000, adjAmt: 262000, pt: "P", origin: "RISK24", conf: 0.92, risk: "Medium", status: "Draft", sec: "Section 65 ter (13)", ruleId: "RULE-65T-13", facts: "RISK24 flagged personal travel coded to directors’ expenses. No business purpose memo.", factsTh: "RISK24 ตรวจพบการเดินทางส่วนตัวลงบัญชีค่าใช้จ่ายกรรมการ ไม่มีบันทึกวัตถุประสงค์ทางธุรกิจ", treatment: "Permanent add-back. Personal / non-business.", treatmentTh: "บวกกลับถาวร เป็นรายจ่ายส่วนตัว / ไม่เกี่ยวกับกิจการ" },
  { id: "ADJ-2026-0053", name: "Exempt dividend income from BOI subsidiary", nameTh: "เงินปันผลได้รับยกเว้นจากบริษัทลูก BOI", gl: "4910-00", acctAmt: 1500000, adjAmt: -1500000, pt: "P", origin: "Manual", conf: 1, risk: "Low", status: "Approved", sec: "Section 65 bis (10)", ruleId: "RULE-EX-65B10", facts: "Dividend 1,500,000 from 100%-owned BOI-promoted subsidiary. Exemption conditions met.", factsTh: "เงินปันผล 1,500,000 จากบริษัทลูก BOI ที่ถือหุ้น 100% เข้าเงื่อนไขยกเว้น", treatment: "Permanent deduction (exempt income).", treatmentTh: "หักถาวร (รายได้ยกเว้น)" },
  { id: "ADJ-2026-0054", name: "Prior-year warranty claims utilised", nameTh: "ค่ารับประกันที่เกิดขึ้นจริงจากปีก่อน", gl: "2340-00", acctAmt: 900000, adjAmt: -900000, pt: "T", origin: "Reversal Guardian", conf: 0.98, risk: "Low", status: "Approved", sec: "Section 65 (accrual)", ruleId: "RULE-65T-01", facts: "Warranty claims of 900,000 settled against the FY2024 provision. Guardian recommends the deduction.", factsTh: "เคลมรับประกัน 900,000 ตัดกับประมาณการปี 2567 ผู้เฝ้าระวังแนะนำให้หัก", treatment: "Reversal of prior add-back. Deduct in FY2026.", treatmentTh: "กลับรายการบวกกลับปีก่อน หักได้ในปี 2569", priorYear: "ADJ-2024-0017" },
];

export const GL_DETAIL: Record<string, [string, string][]> = {
  "ADJ-2026-0041": [
    ["12 Feb 2026 · JV-02-0188 · The Okura Prestige Bangkok", "842,000"],
    ["30 Apr 2026 · JV-04-0412 · Dealer conference, Pattaya", "1,915,000"],
    ["18 Jun 2026 · JV-06-0733 · Golf hospitality, Alpine GC", "688,000"],
    ["29 Jun 2026 · JV-06-0891 · Gift vouchers to dealers", "2,975,000"],
    ["— 31 further entries below THB 200,000", "—"],
  ],
  "ADJ-2026-0043": [
    ["31 Dec 2026 · JV-12-1204 · Production bonus accrual", "1,720,000"],
    ["31 Dec 2026 · JV-12-1205 · Sales incentive accrual", "780,000"],
  ],
};

export const DOCS: Record<string, [string, string]> = {
  "ADJ-2026-0041": ["INV-OKR-2026-0421.pdf", "Tax invoice bundle · 14 pages · OCR TH/EN 0.97"],
  "ADJ-2026-0043": ["HR-BONUS-ACCRUAL-2026.xlsx", "HR bonus schedule · signed by CFO · 4 pages"],
  "ADJ-2026-0051": ["TP24-BENCHMARK-2026.pdf", "Transfer-pricing benchmark study · 62 pages"],
};

export const FILES = [
  { name: "TB_SPP_FY2026_Jul.xlsx", kind: "Trial balance", period: "Jul 2026 YTD", status: "Validated", conf: 0.99, size: "428 accounts" },
  { name: "GL_SPP_FY2026_H1.csv", kind: "General ledger", period: "Jan–Jun 2026", status: "Validated", conf: 0.99, size: "184,392 lines" },
  { name: "FS_SPP_FY2025_audited.pdf", kind: "Financial statements", period: "FY2025", status: "Extracted", conf: 0.96, size: "48 pages" },
  { name: "FAR_SPP_2026.xlsx", kind: "Fixed-asset register", period: "FY2026", status: "Validated", conf: 0.98, size: "1,204 assets" },
  { name: "WHT_certs_Q1Q2_2026.pdf", kind: "WHT certificates", period: "H1 2026", status: "OCR (TH)", conf: 0.93, size: "41 certificates" },
  { name: "PND50_SPP_FY2025_filed.pdf", kind: "Prior-year PND50", period: "FY2025", status: "Linked", conf: 0.99, size: "11 pages" },
  { name: "Entertainment_invoices_H1.zip", kind: "Invoices & receipts", period: "H1 2026", status: "Needs review", conf: 0.71, size: "36 documents" },
  { name: "Bonus_schedule_2026.xlsx", kind: "Payroll / benefits", period: "FY2026", status: "Validated", conf: 0.97, size: "312 employees" },
];

export const UNMAPPED_SEED = [
  { code: "6265-04", name: "ค่าที่ปรึกษาต่างประเทศ / Overseas consultancy fee", suggestion: "Deductible — WHT & TP review required", conf: 0.87, tag: "Tax-sensitive" },
  { code: "6912-00", name: "ค่าปรับจากหน่วยงานรัฐ / Government fines", suggestion: "Non-deductible — s.65 ter (6)", conf: 0.98, tag: "Permanent" },
  { code: "1455-02", name: "ค่าเผื่อสินค้าเสียหาย / Provision for damaged goods", suggestion: "Non-deductible reserve — s.65 ter (1)", conf: 0.94, tag: "Temporary" },
  { code: "4915-00", name: "รายได้เงินปันผล / Dividend income", suggestion: "Partially exempt — s.65 bis (10)", conf: 0.90, tag: "Tax-sensitive" },
  { code: "6155-01", name: "ค่าสิทธิจ่ายบริษัทแม่ / Royalty to parent", suggestion: "Deductible — TP24 benchmark applies", conf: 0.85, tag: "Related party" },
  { code: "6820-00", name: "หนี้สงสัยจะสูญ / Doubtful debt allowance", suggestion: "Non-deductible until conditions met", conf: 0.96, tag: "Temporary" },
];

export const CHECKS = [
  { name: "TB to financial statements", detail: "Matched to audited FY2025 FS and July management accounts", result: "Pass", amt: 0 },
  { name: "Opening to closing balances", detail: "428 of 428 accounts roll forward", result: "Pass", amt: 0 },
  { name: "GL control totals vs TB", detail: "Debits 2,418,904,221 / credits 2,418,904,221", result: "Pass", amt: 0 },
  { name: "Duplicate document detection", detail: "Entertainment_invoices_H1.zip contains 2 files already uploaded in June", result: "Warning", amt: 188400 },
  { name: "Document-to-transaction matching", detail: "94% of tax-sensitive entries carry a linked document", result: "Review", amt: 1204000 },
  { name: "Withholding-tax certificate coverage", detail: "39 of 41 certificates matched to GL receipts", result: "Review", amt: 86400 },
  { name: "Related-party transaction completeness", detail: "TP24 confirms 4 counterparties, 6 charge types", result: "Pass", amt: 0 },
  { name: "Period integrity", detail: "No postings after the 31 Jul 2026 continuous-close cut-off", result: "Pass", amt: 0 },
];

export const ROLLFORWARD = [
  { name: "Warranty provision", nameTh: "ประมาณการค่ารับประกันสินค้า", open: 4000000, add: 1500000, rev: -900000, when: "FY2027–28" },
  { name: "Accrued bonus", nameTh: "โบนัสค้างจ่าย", open: 2200000, add: 2500000, rev: -2200000, when: "FY2027 (Mar)" },
  { name: "Depreciation difference", nameTh: "ผลต่างค่าเสื่อมราคา", open: 6000000, add: 1100000, rev: -700000, when: "FY2027–31" },
  { name: "Inventory obsolescence provision", nameTh: "ค่าเผื่อสินค้าล้าสมัย", open: 0, add: 3250000, rev: 0, when: "On scrapping" },
  { name: "Unrealised FX loss", nameTh: "ผลขาดทุนอัตราแลกเปลี่ยนที่ยังไม่เกิดขึ้น", open: 0, add: 1846000, rev: 0, when: "FY2027 (settlement)" },
  { name: "Doubtful-debt allowance", nameTh: "ค่าเผื่อหนี้สงสัยจะสูญ", open: 0, add: 920000, rev: 0, when: "On conditions met" },
];

export const REVGUARD = [
  { id: "ADJ-2026-0044", name: "Accrued bonus FY2025 · 2,200,000", note: "Payroll run 14 Mar 2026 matched to the FY2025 accrual. Deduction applied in FY2026.", status: "Claimed" },
  { id: "ADJ-2025-0031", name: "Warranty provision FY2024 · 900,000", note: "Warranty claims settled in FY2025 but no deduction was taken in the FY2025 return. Amend or claim in FY2026.", status: "Action needed" },
  { id: "ADJ-2026-0048", name: "Inventory provision FY2026 · 3,250,000", note: "Reverses only on documented scrapping. Guardian will watch the disposal account and the destruction report.", status: "Scheduled" },
];

export const QUEUE = [
  { id: "ADJ-2026-0051", name: "Related-party management fee — TP adjustment", kind: "Adjustment", amt: 4300000, prep: "Nattaya P.", age: 6, status: "Awaiting review" },
  { id: "ADJ-2026-0043", name: "Accrued bonus unpaid at year-end", kind: "Adjustment", amt: 2500000, prep: "Nattaya P.", age: 3, status: "Awaiting review" },
  { id: "ADJ-2026-0048", name: "Inventory obsolescence provision", kind: "Adjustment", amt: 3250000, prep: "Somchai W.", age: 4, status: "Awaiting review" },
  { id: "ADJ-2026-0050", name: "Bad debt — conditions not met", kind: "Adjustment", amt: 920000, prep: "Somchai W.", age: 9, status: "Query open" },
  { id: "ADJ-2026-0049", name: "Unrealised FX loss", kind: "Adjustment", amt: 1846000, prep: "Nattaya P.", age: 5, status: "Query open" },
  { id: "ADJ-2026-0046", name: "Donations over the 2% ceiling", kind: "Adjustment", amt: 480000, prep: "Somchai W.", age: 2, status: "Awaiting review" },
  { id: "ADJ-2026-0052", name: "Directors’ personal travel", kind: "Adjustment", amt: 262000, prep: "RISK24 feed", age: 1, status: "Awaiting review" },
  { id: "MAP-2026-004", name: "Chart-of-account mapping — 6 new accounts", kind: "Mapping", amt: 0, prep: "Nattaya P.", age: 1, status: "Awaiting review" },
  { id: "DTA-2026-001", name: "Deferred tax asset recognition", kind: "Provision", amt: 3903200, prep: "Kanit S.", age: 2, status: "CFO approval" },
  { id: "EST-2026-051", name: "PND51 estimate and assumption file", kind: "Filing", amt: 74000000, prep: "Kanit S.", age: 1, status: "CFO approval" },
];

export const ACTIVITY_LOG = [
  { when: "21 Jul 2026 16:20", who: "Pornthip R. (CFO)", what: "Approved ADJ-2026-0041 · v2 · 2,700,000", hash: "a91f" },
  { when: "21 Jul 2026 11:04", who: "Kanit S.", what: "Raised query on ADJ-2026-0050 · evidence requested from client", hash: "77c2" },
  { when: "20 Jul 2026 09:18", who: "CIT24 rule engine", what: "Recomputed taxable profit after RULE-65T-04 v3 · +180,000", hash: "e30b" },
  { when: "18 Jul 2026 15:41", who: "Kanit S.", what: "Reviewed 6 adjustments · 1 amended, 5 accepted", hash: "4d18" },
  { when: "17 Jul 2026 08:02", who: "AI evidence engine", what: "Matched 41 WHT certificates · 2 unmatched flagged", hash: "b6aa" },
  { when: "15 Jul 2026 17:30", who: "Somsak T. (client)", what: "Uploaded Entertainment_invoices_H1.zip · 36 documents", hash: "2f54" },
];


export const REQUESTS = [
  { id: "RD-2026-118", recd: "04 Aug 2026", due: "03 Sep 2026", topic: "Entertainment expenses FY2024–FY2025", status: "Drafting response", owner: "Kanit S." },
  { id: "RD-2026-104", recd: "11 Jul 2026", due: "10 Aug 2026", topic: "Related-party management fees", status: "Response filed", owner: "Kanit S." },
  { id: "RD-2026-092", recd: "02 Jun 2026", due: "02 Jul 2026", topic: "Bad-debt write-off FY2024", status: "Closed — accepted", owner: "Nattaya P." },
  { id: "RD-2025-311", recd: "18 Nov 2025", due: "18 Dec 2025", topic: "Tax-loss carry-forward order", status: "Closed — accepted", owner: "Kanit S." },
  { id: "RD-2026-121", recd: "12 Aug 2026", due: "11 Sep 2026", topic: "Withholding-tax credit support", status: "Evidence gathering", owner: "Somchai W." },
];

export const FEED = [
  { text: "Detected entertainment expense above the 0.3% limit", meta: "ADJ-2026-0041 · confidence 0.94 · awaiting approval", color: "var(--color-accent)" },
  { text: "Matched 41 withholding-tax certificates to GL receipts", meta: "2 unmatched · THB 86,400 · Siam Precision", color: "var(--color-neutral-500)" },
  { text: "Prior-year treatment changed: bad-debt write-off", meta: "FY2025 deducted / FY2026 added back — explain", color: "var(--color-accent)" },
  { text: "Drafted adjustment note for related-party service fee", meta: "Imported from TP24 benchmark study · 0.88", color: "var(--color-neutral-500)" },
];

export const MEMORY = [
  { account: "6210-00 Entertainment", fy2025: "Permanent add-back of excess over 0.3%", fy2026: "Same treatment · ADJ-2026-0041", changed: false },
  { account: "2310-00 Accrued bonus", fy2025: "Temporary add-back 2,200,000 · reversed Mar 2026", fy2026: "New accrual 2,500,000 added back", changed: false },
  { account: "6810-00 Bad debts", fy2025: "Deducted 640,000 — conditions met", fy2026: "Write-off 920,000 added back — legal action missing", changed: true },
  { account: "6150-00 Management fee", fy2025: "Accepted in full · no TP adjustment", fy2026: "TP24 range excess 4,300,000 proposed", changed: true },
  { account: "4910-00 Dividend income", fy2025: "Exempt s.65 bis (10)", fy2026: "Exempt s.65 bis (10) · same subsidiary", changed: false },
];

export const PND50_FIELDS = [
  { field: "Part 1 · accounting profit", amount: 84500000, src: "Audited TB / July management accounts" },
  { field: "Part 3 line 4.2 · add-backs 65 bis / 65 ter", amount: 19043400, src: "Tax Adjustment Ledger" },
  { field: "Part 3 line 5 · deductions / reversals", amount: -5300000, src: "Reversal Guardian + exempt income" },
  { field: "Part 3 · tax losses utilised", amount: -12000000, src: "Loss schedule · FY2021 expires FY2026" },
  { field: "Part 4 · taxable profit", amount: 86243400, src: "CIT24-CALC 2026.2" },
  { field: "Part 4 · tax at 20%", amount: 17248680, src: "Standard rate · non-BOI · not SME" },
  { field: "Credit · PND51", amount: -7400000, src: "Half-year payment due 31 Aug 2026" },
  { field: "Credit · withholding tax", amount: -2186450, src: "39 of 41 certificates matched" },
  { field: "Tax payable", amount: 7662230, src: "Due with PND50 · 30 May 2027" },
];

export const ACCOUNTING_PROFIT = 84_500_000;
export const TAX_RATE = 0.2;
export const TAX_LOSS_UTILISED = 12_000_000;
export const PND51_CREDIT = 7_400_000;
export const WHT_CREDIT = 2_186_450;
export const H1_REVENUE = 612_000_000;
export const H1_PROFIT = 41_200_000;
export const ANNUAL_TAX_ADJ_NET = 13_700_000;
export const TAX_LOSSES_AVAILABLE = 12_000_000;
export const GROSS_REVENUE = 1_240_000_000;

export const ECOSYSTEM = [
  { id: "TP24", role: "Related-party charges and transfer-pricing adjustments", status: "Linked · ADJ-2026-0051" },
  { id: "GMT24", role: "Current / deferred tax and Pillar Two covered-tax data", status: "Ready to push" },
  { id: "RISK24", role: "Suspicious expenses, vendors and journal entries", status: "Linked · ADJ-2026-0052" },
  { id: "PIT24", role: "Director and employee benefit information", status: "Mapped · bonus schedule" },
];
