import { money } from "./format";
import { TAX_RATE } from "./model";

export type BoiBucket = "BOI-01" | "BOI-02" | "NON" | "SHARED";
export type BoiKind = "direct" | "shared" | "unallocated";
export type AllocDriver =
  | "direct"
  | "floor-area"
  | "revenue"
  | "machine-hours"
  | "headcount"
  | "timesheet"
  | "production"
  | "asset-value"
  | "users"
  | "shipments";

export type BoiCertificate = {
  id: "BOI-01" | "BOI-02";
  certNo: string;
  activity: string;
  activityTh: string;
  product: string;
  capacityUnits: number;
  actualUnits: number;
  salesUnits: number;
  location: string;
  firstRevenue: string;
  holidayFrom: string;
  holidayTo: string;
  reductionFrom?: string;
  reductionTo?: string;
  cap: number;
  used: number;
  conditions: string[];
  amendments: string[];
  status: "in-holiday" | "reduction" | "expired";
};

export type BoiLine = {
  id: string;
  gl: string;
  name: string;
  nameTh: string;
  amount: number;
  side: "revenue" | "cogs" | "opex" | "dep";
  bucket: BoiBucket;
  kind: BoiKind;
  policyId?: string;
  taxTreat: "exempt" | "taxable" | "deductible" | "add-back";
  adjId?: string;
  adjAmt?: number;
};

export type AllocPolicy = {
  id: string;
  expense: string;
  expenseTh: string;
  driver: AllocDriver;
  driverLabel: string;
  evidence: string;
  approvedBy: string;
  approvedOn: string;
  version: string;
  weights: { bucket: Exclude<BoiBucket, "SHARED">; qty: number; pct: number }[];
};

export type AiAllocRec = {
  id: string;
  lineId: string;
  title: string;
  amount: number;
  recommended: AllocDriver;
  reason: string;
  splits: { bucket: Exclude<BoiBucket, "SHARED">; pct: number }[];
  confidence: number;
  status: "proposed" | "approved" | "rejected";
};

export const BOI_BUCKETS: { id: Exclude<BoiBucket, "SHARED">; en: string; th: string }[] = [
  { id: "BOI-01", en: "BOI-01 · precision machining", th: "BOI-01 · เครื่องจักรกลความเที่ยง" },
  { id: "BOI-02", en: "BOI-02 · surface treatment", th: "BOI-02 · ชุบผิว" },
  { id: "NON", en: "Non-BOI activity", th: "กิจการนอกส่งเสริม" },
];

export const DRIVER_DEFAULTS: { expense: string; driver: AllocDriver; note: string }[] = [
  { expense: "Raw materials", driver: "production", note: "Actual production / BOM" },
  { expense: "Direct labor", driver: "timesheet", note: "Employee / timesheet" },
  { expense: "Machine depreciation", driver: "machine-hours", note: "Machine usage / production hours" },
  { expense: "Factory electricity", driver: "machine-hours", note: "Meter / machine hours" },
  { expense: "Factory rent", driver: "floor-area", note: "Floor area" },
  { expense: "Warehouse rent", driver: "floor-area", note: "Storage area / pallet usage" },
  { expense: "Executive salaries", driver: "revenue", note: "Revenue / management time" },
  { expense: "HR", driver: "headcount", note: "Employee headcount" },
  { expense: "Accounting", driver: "revenue", note: "Transaction count / revenue" },
  { expense: "IT", driver: "users", note: "Users / devices / headcount" },
  { expense: "Insurance", driver: "asset-value", note: "Insured asset value" },
  { expense: "Repair & maintenance", driver: "machine-hours", note: "Machine / asset usage" },
  { expense: "Logistics", driver: "shipments", note: "Shipment / weight / volume" },
  { expense: "Marketing", driver: "direct", note: "Product / project attribution" },
  { expense: "Bank charges", driver: "direct", note: "Specific transaction" },
  { expense: "Interest", driver: "direct", note: "Related borrowing if traceable" },
  { expense: "General HQ overhead", driver: "revenue", note: "Revenue ratio fallback" },
  { expense: "Audit / tax fee", driver: "revenue", note: "Revenue / complexity" },
  { expense: "Shared depreciation", driver: "floor-area", note: "Usage / floor area / production" },
];

export const BOI_CERTS: BoiCertificate[] = [
  {
    id: "BOI-01",
    certNo: "60-1234-1-00-1-0",
    activity: "Manufacture of precision automotive parts (category 4.5)",
    activityTh: "ผลิตชิ้นส่วนยานยนต์ความเที่ยง (ประเภท 4.5)",
    product: "CNC-machined transmission housings",
    capacityUnits: 1_000_000,
    actualUnits: 1_100_000,
    salesUnits: 1_040_000,
    location: "Amata City, Chonburi — Building A",
    firstRevenue: "12 Mar 2025",
    holidayFrom: "12 Mar 2025",
    holidayTo: "11 Mar 2032",
    cap: 150_000_000,
    used: 97_000_000,
    conditions: ["Export ≥ 30% of promoted product", "Machinery must remain at approved location", "Annual production report to BOI"],
    amendments: ["Amd 1 · 2025-08-14 · capacity restated to 1,000,000 units"],
    status: "in-holiday",
  },
  {
    id: "BOI-02",
    certNo: "60-1234-2-00-1-0",
    activity: "Surface treatment of metal parts (category 4.8)",
    activityTh: "ชุบผิวชิ้นส่วนโลหะ (ประเภท 4.8)",
    product: "Anodised / plated precision parts",
    capacityUnits: 600_000,
    actualUnits: 412_000,
    salesUnits: 390_000,
    location: "Amata City, Chonburi — Building B",
    firstRevenue: "04 Jan 2026",
    holidayFrom: "04 Jan 2026",
    holidayTo: "03 Jan 2033",
    reductionFrom: "04 Jan 2033",
    reductionTo: "03 Jan 2038",
    cap: 80_000_000,
    used: 12_400_000,
    conditions: ["Wastewater treatment plant in operation", "No subcontract of promoted process off-site"],
    amendments: [],
    status: "in-holiday",
  },
];

export const ALLOC_POLICIES: AllocPolicy[] = [
  {
    id: "ALLOC-RENT-001",
    expense: "Factory rental",
    expenseTh: "ค่าเช่าโรงงาน",
    driver: "floor-area",
    driverLabel: "Occupied floor area (sqm)",
    evidence: "Factory layout FY2026.xlsx",
    approvedBy: "Nattaya P. · Tax manager",
    approvedOn: "14 Jul 2026",
    version: "v3",
    weights: [
      { bucket: "BOI-01", qty: 4000, pct: 0.40 },
      { bucket: "BOI-02", qty: 3000, pct: 0.30 },
      { bucket: "NON", qty: 3000, pct: 0.30 },
    ],
  },
  {
    id: "ALLOC-PAY-001",
    expense: "Executive salaries",
    expenseTh: "เงินเดือนผู้บริหาร",
    driver: "revenue",
    driverLabel: "Project revenue (fallback — no management timesheet)",
    evidence: "TB revenue by SKU · CIT24-GL-2026-07",
    approvedBy: "Pornthip R. · CFO",
    approvedOn: "18 Jul 2026",
    version: "v1",
    weights: [
      { bucket: "BOI-01", qty: 400, pct: 0.40 },
      { bucket: "BOI-02", qty: 250, pct: 0.25 },
      { bucket: "NON", qty: 350, pct: 0.35 },
    ],
  },
  {
    id: "ALLOC-ELEC-001",
    expense: "Factory electricity",
    expenseTh: "ค่าไฟฟ้าโรงงาน",
    driver: "machine-hours",
    driverLabel: "Machine hours · production lines A/B",
    evidence: "MES run-hours FY2026 YTD",
    approvedBy: "Somchai W. · Plant controller",
    approvedOn: "02 Aug 2026",
    version: "v2",
    weights: [
      { bucket: "BOI-01", qty: 6140, pct: 0.614 },
      { bucket: "BOI-02", qty: 3860, pct: 0.386 },
      { bucket: "NON", qty: 0, pct: 0 },
    ],
  },
  {
    id: "ALLOC-HQ-001",
    expense: "General HQ overhead",
    expenseTh: "ค่าใช้จ่ายสำนักงานใหญ่",
    driver: "revenue",
    driverLabel: "Revenue ratio fallback (RD 0706/152)",
    evidence: "No more specific driver",
    approvedBy: "Kanit S. · Reviewer",
    approvedOn: "08 Aug 2026",
    version: "v1",
    weights: [
      { bucket: "BOI-01", qty: 400, pct: 0.40 },
      { bucket: "BOI-02", qty: 250, pct: 0.25 },
      { bucket: "NON", qty: 350, pct: 0.35 },
    ],
  },
];

export const BOI_LINES: BoiLine[] = [
  { id: "R-A", gl: "4100-00", name: "Product A — transmission housings", nameTh: "สินค้า A — เสื้อเกียร์", amount: 400_000_000, side: "revenue", bucket: "BOI-01", kind: "direct", taxTreat: "exempt" },
  { id: "R-B", gl: "4110-00", name: "Product B — surface treatment", nameTh: "สินค้า B — ชุบผิว", amount: 250_000_000, side: "revenue", bucket: "BOI-02", kind: "direct", taxTreat: "exempt" },
  { id: "R-C", gl: "4120-00", name: "Product C — aftermarket (non-promoted)", nameTh: "สินค้า C — อะไหล่หลังการขาย", amount: 350_000_000, side: "revenue", bucket: "NON", kind: "direct", taxTreat: "taxable" },
  { id: "C-01", gl: "5100-00", name: "Direct materials — BOI-01", nameTh: "วัตถุดิบตรง BOI-01", amount: 200_000_000, side: "cogs", bucket: "BOI-01", kind: "direct", taxTreat: "deductible" },
  { id: "C-02", gl: "5110-00", name: "Direct materials — BOI-02", nameTh: "วัตถุดิบตรง BOI-02", amount: 120_000_000, side: "cogs", bucket: "BOI-02", kind: "direct", taxTreat: "deductible" },
  { id: "C-N", gl: "5120-00", name: "Direct materials — Non-BOI", nameTh: "วัตถุดิบตรง นอก BOI", amount: 180_000_000, side: "cogs", bucket: "NON", kind: "direct", taxTreat: "deductible" },
  { id: "E-01", gl: "6100-00", name: "Direct factory expense — BOI-01", nameTh: "ค่าใช้จ่ายโรงงานตรง BOI-01", amount: 50_000_000, side: "opex", bucket: "BOI-01", kind: "direct", taxTreat: "deductible" },
  { id: "E-02", gl: "6110-00", name: "Direct factory expense — BOI-02", nameTh: "ค่าใช้จ่ายโรงงานตรง BOI-02", amount: 30_000_000, side: "opex", bucket: "BOI-02", kind: "direct", taxTreat: "deductible" },
  { id: "E-N", gl: "6120-00", name: "Direct factory expense — Non-BOI", nameTh: "ค่าใช้จ่ายโรงงานตรง นอก BOI", amount: 60_000_000, side: "opex", bucket: "NON", kind: "direct", taxTreat: "deductible" },
  { id: "S-RENT", gl: "6210-00", name: "Factory rental", nameTh: "ค่าเช่าโรงงาน", amount: 10_000_000, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-RENT-001", taxTreat: "deductible" },
  { id: "S-PAY", gl: "6310-00", name: "Executive salaries", nameTh: "เงินเดือนผู้บริหาร", amount: 28_000_000, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-PAY-001", taxTreat: "deductible" },
  { id: "S-ELEC", gl: "6220-00", name: "Factory electricity", nameTh: "ค่าไฟฟ้าโรงงาน", amount: 1_823_400, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-ELEC-001", taxTreat: "deductible" },
  { id: "S-HQ", gl: "7100-00", name: "HQ IT and overhead", nameTh: "ไอทีและค่าโสหุ้ยสำนักงานใหญ่", amount: 22_176_600, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-HQ-001", taxTreat: "deductible" },
  { id: "S-INS", gl: "6410-00", name: "Shared plant insurance (review)", nameTh: "ประกันโรงงานร่วม (รอสอบทาน)", amount: 8_000_000, side: "opex", bucket: "SHARED", kind: "unallocated", taxTreat: "deductible" },
  { id: "D-01", gl: "6410-00", name: "Machine depreciation — BOI-01 line", nameTh: "ค่าเสื่อมเครื่องจักรสาย BOI-01", amount: 18_000_000, side: "dep", bucket: "BOI-01", kind: "direct", taxTreat: "deductible", adjId: "ADJ-2026-0045", adjAmt: 1_100_000 },
  { id: "A-ENT", gl: "5210-00", name: "Entertainment (add-back)", nameTh: "ค่าเลี้ยงรับรอง (บวกกลับ)", amount: 0, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-PAY-001", taxTreat: "add-back", adjId: "ADJ-2026-0046", adjAmt: 2_730_000 },
  { id: "A-WAR", gl: "2340-00", name: "Warranty provision (add-back)", nameTh: "ประมาณการรับประกัน (บวกกลับ)", amount: 0, side: "opex", bucket: "SHARED", kind: "shared", policyId: "ALLOC-RENT-001", taxTreat: "add-back", adjId: "ADJ-2026-0041", adjAmt: 10_000_000 },
];

export const AI_ALLOCS: AiAllocRec[] = [
  {
    id: "AI-ELEC",
    lineId: "S-ELEC",
    title: "Electricity THB 1,823,400",
    amount: 1_823_400,
    recommended: "machine-hours",
    reason: "Used by BOI-01 and BOI-02 production lines. MES hours exist. Do not use revenue.",
    splits: [
      { bucket: "BOI-01", pct: 0.614 },
      { bucket: "BOI-02", pct: 0.386 },
    ],
    confidence: 0.94,
    status: "proposed",
  },
  {
    id: "AI-PAY",
    lineId: "S-PAY",
    title: "Executive payroll cannot be attributed to a single certificate",
    amount: 28_000_000,
    recommended: "revenue",
    reason: "Centrally managed. No reliable management-hours file. RD 0706/152 revenue fallback is supportable.",
    splits: [
      { bucket: "BOI-01", pct: 0.40 },
      { bucket: "BOI-02", pct: 0.25 },
      { bucket: "NON", pct: 0.35 },
    ],
    confidence: 0.81,
    status: "proposed",
  },
  {
    id: "AI-INS",
    lineId: "S-INS",
    title: "Shared plant insurance — tax-team review",
    amount: 8_000_000,
    recommended: "asset-value",
    reason: "Insured-asset schedule not linked. Recommend asset-value; do not default to revenue until the FAR is tagged by certificate.",
    splits: [
      { bucket: "BOI-01", pct: 0.48 },
      { bucket: "BOI-02", pct: 0.27 },
      { bucket: "NON", pct: 0.25 },
    ],
    confidence: 0.62,
    status: "proposed",
  },
];

export type BoiLossYear = {
  cert: "BOI-01" | "BOI-02";
  fy: string;
  origin: number;
  utilised: number;
  remaining: number;
  window: "in-holiday" | "post-exemption";
  expires: string;
};

export const BOI_LOSSES: BoiLossYear[] = [
  { cert: "BOI-01", fy: "FY2024", origin: 24_000_000, utilised: 5_600_000, remaining: 18_400_000, window: "post-exemption", expires: "31 Dec 2027" },
  { cert: "BOI-01", fy: "FY2025", origin: 0, utilised: 0, remaining: 0, window: "in-holiday", expires: "—" },
  { cert: "BOI-02", fy: "FY2025", origin: 3_200_000, utilised: 0, remaining: 3_200_000, window: "in-holiday", expires: "post-holiday + 5y" },
];

export type BoiCol = Exclude<BoiBucket, "SHARED">;

const EMPTY: Record<BoiCol, number> = { "BOI-01": 0, "BOI-02": 0, NON: 0 };

function add(map: Record<BoiCol, number>, k: BoiCol, n: number) {
  map[k] = money(map[k] + n);
}

function policyOf(id?: string) {
  return ALLOC_POLICIES.find((p) => p.id === id);
}

function splitShared(amount: number, policy: AllocPolicy | undefined, driverOverride?: AllocDriver) {
  const out = { ...EMPTY };
  if (!policy) return out;
  let weights = policy.weights;
  if (driverOverride && driverOverride !== policy.driver && policy.id === "ALLOC-RENT-001") {
    weights = [
      { bucket: "BOI-01", qty: 400, pct: 0.40 },
      { bucket: "BOI-02", qty: 250, pct: 0.25 },
      { bucket: "NON", qty: 350, pct: 0.35 },
    ];
  }
  for (const w of weights) add(out, w.bucket, money(amount * w.pct));
  return out;
}

export type BoiPnl = {
  revenue: Record<BoiCol, number>;
  directCost: Record<BoiCol, number>;
  directExp: Record<BoiCol, number>;
  allocated: Record<BoiCol, number>;
  accounting: Record<BoiCol, number>;
  taxAdj: Record<BoiCol, number>;
  taxProfit: Record<BoiCol, number>;
  exemption: Record<BoiCol, number>;
  taxable: Record<BoiCol, number>;
};

export function computeBoiPnl(opts?: { rentDriver?: AllocDriver; approvedRecs?: string[] }): BoiPnl {
  const rentDriver = opts?.rentDriver ?? "floor-area";
  const revenue = { ...EMPTY };
  const directCost = { ...EMPTY };
  const directExp = { ...EMPTY };
  const allocated = { ...EMPTY };
  const taxAdj = { ...EMPTY };

  for (const line of BOI_LINES) {
    if (line.side === "revenue" && line.bucket !== "SHARED") add(revenue, line.bucket, line.amount);
    if (line.side === "cogs" && line.bucket !== "SHARED") add(directCost, line.bucket, line.amount);
    if ((line.side === "opex" || line.side === "dep") && line.kind === "direct" && line.bucket !== "SHARED") {
      add(directExp, line.bucket, line.amount);
    }
    if (line.kind === "shared" && line.amount) {
      const pol = policyOf(line.policyId);
      const driver = line.policyId === "ALLOC-RENT-001" ? rentDriver : pol?.driver;
      const parts = splitShared(line.amount, pol, driver);
      (Object.keys(parts) as BoiCol[]).forEach((k) => add(allocated, k, parts[k]));
    }
    if (line.kind === "unallocated" && opts?.approvedRecs?.includes("AI-INS")) {
      const rec = AI_ALLOCS.find((a) => a.id === "AI-INS")!;
      rec.splits.forEach((s) => add(allocated, s.bucket, money(line.amount * s.pct)));
    }
    if (line.adjAmt) {
      const pol = policyOf(line.policyId) ?? policyOf("ALLOC-PAY-001");
      if (line.bucket !== "SHARED") add(taxAdj, line.bucket, line.adjAmt);
      else {
        const parts = splitShared(line.adjAmt, pol);
        (Object.keys(parts) as BoiCol[]).forEach((k) => add(taxAdj, k, parts[k]));
      }
    }
  }

  const accounting = { ...EMPTY };
  const taxProfit = { ...EMPTY };
  const exemption = { ...EMPTY };
  const taxable = { ...EMPTY };
  (Object.keys(EMPTY) as BoiCol[]).forEach((k) => {
    accounting[k] = money(revenue[k] - directCost[k] - directExp[k] - allocated[k]);
    taxProfit[k] = money(accounting[k] + taxAdj[k]);
    exemption[k] = k === "NON" ? 0 : Math.max(0, taxProfit[k]);
    taxable[k] = k === "NON" ? Math.max(0, taxProfit[k]) : 0;
  });

  return { revenue, directCost, directExp, allocated, accounting, taxAdj, taxProfit, exemption, taxable };
}

export function tot(row: Record<BoiCol, number>) {
  return money(row["BOI-01"] + row["BOI-02"] + row.NON);
}

export function classifyTotals() {
  const directBoi = BOI_LINES.filter((l) => l.kind === "direct" && l.amount && (l.bucket === "BOI-01" || l.bucket === "BOI-02") && l.side !== "revenue").reduce((s, l) => s + l.amount, 0);
  const directNon = BOI_LINES.filter((l) => l.kind === "direct" && l.amount && l.bucket === "NON" && l.side !== "revenue").reduce((s, l) => s + l.amount, 0);
  const shared = BOI_LINES.filter((l) => l.kind === "shared" && l.amount).reduce((s, l) => s + l.amount, 0);
  const review = BOI_LINES.filter((l) => l.kind === "unallocated" && l.amount).reduce((s, l) => s + l.amount, 0);
  const exp = directBoi + directNon + shared + review;
  return {
    expense: exp,
    directBoi,
    directNon,
    shared,
    review,
    autoPct: (directBoi + directNon) / exp,
    policyPct: shared / exp,
    reviewPct: review / exp,
  };
}

export function incentive(c: BoiCertificate) {
  const remaining = money(c.cap - c.used);
  const holidayEnd = new Date(c.holidayTo);
  const now = new Date("2026-08-19");
  const months = Math.max(0, (holidayEnd.getFullYear() - now.getFullYear()) * 12 + (holidayEnd.getMonth() - now.getMonth()));
  const unusedRisk = money(remaining * 0.34);
  return { remaining, months, unusedRisk };
}

export function capacityAlert(c: BoiCertificate) {
  if (c.actualUnits <= c.capacityUnits) return null;
  const over = c.actualUnits - c.capacityUnits;
  const overPct = over / c.actualUnits;
  const extraRev = money((c.id === "BOI-01" ? 400_000_000 : 250_000_000) * overPct);
  return { over, extraRev };
}

export function scenarioTax(rentDriver: AllocDriver) {
  const pnl = computeBoiPnl({ rentDriver });
  const currentTax = money(pnl.taxable.NON * TAX_RATE);
  return { pnl, currentTax };
}

export function boiFeedsCit(rentDriver: AllocDriver = "floor-area") {
  const { pnl, currentTax } = scenarioTax(rentDriver);
  return {
    nonBoiTaxable: pnl.taxable.NON,
    currentTax,
    exempt: money(pnl.exemption["BOI-01"] + pnl.exemption["BOI-02"]),
    etrNote: "ETR remains current tax ÷ company PBT when the BOI figure is adopted.",
  };
}
