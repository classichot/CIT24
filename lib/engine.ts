import {
  ACCOUNTING_PROFIT,
  ADJUSTMENTS,
  ANNUAL_TAX_ADJ_NET,
  DOCS,
  GL_DETAIL,
  H1_PROFIT,
  H1_REVENUE,
  PND51_CREDIT,
  ROLLFORWARD,
  TAX_LOSSES_AVAILABLE,
  TAX_RATE,
  WHT_CREDIT,
  type Adjustment,
  type AdjStatus,
} from "./model";
import { money } from "./format";
import { RULES } from "./rules";
import { farTotals } from "./far";

export type AuditNode = {
  id: string;
  label: string;
  amount?: number;
  kind: "result" | "formula" | "rule" | "entity" | "account" | "source" | "approval";
  detail: string;
  ruleId?: string;
  ruleVersion?: string;
  sourceFile?: string;
  children?: AuditNode[];
};

export type Provision = {
  accountingProfit: number;
  addBacks: number;
  deductions: number;
  adjustedProfit: number;
  losses: number;
  taxableProfit: number;
  currentTax: number;
  pnd51Credit: number;
  whtCredit: number;
  payable: number;
  etr: number;
  permanent: number;
  temporary: number;
  dta: number;
  audit: AuditNode;
};

export function liveAdjustments(statusOverride: Record<string, AdjStatus>, extras: Adjustment[] = []): Adjustment[] {
  const far = farTotals();
  const base = ADJUSTMENTS.map((a) => {
    const status = statusOverride[a.id] ?? a.status;
    if (a.id === "ADJ-2026-0045") {
      return { ...a, status, acctAmt: far.bookDep, adjAmt: far.excess };
    }
    return { ...a, status };
  });
  const extra = extras
    .filter((e) => !ADJUSTMENTS.some((a) => a.id === e.id))
    .map((a) => ({ ...a, status: statusOverride[a.id] ?? a.status }));
  return base.concat(extra);
}

export function computeProvision(adjs: Adjustment[] = ADJUSTMENTS, opts?: { whtCredit?: number }): Provision {
  const addBacks = money(adjs.filter((a) => a.adjAmt > 0).reduce((s, a) => s + a.adjAmt, 0));
  const deductions = money(adjs.filter((a) => a.adjAmt < 0).reduce((s, a) => s + a.adjAmt, 0));
  const adjustedProfit = money(ACCOUNTING_PROFIT + addBacks + deductions);
  const losses = money(Math.min(TAX_LOSSES_AVAILABLE, Math.max(0, adjustedProfit)));
  const taxableProfit = money(adjustedProfit - losses);
  const currentTax = money(taxableProfit * TAX_RATE);
  const whtCredit = opts?.whtCredit ?? WHT_CREDIT;
  const payable = money(currentTax - PND51_CREDIT - whtCredit);
  const permanent = money(adjs.filter((a) => a.pt === "P").reduce((s, a) => s + a.adjAmt, 0));
  const temporary = money(adjs.filter((a) => a.pt === "T").reduce((s, a) => s + a.adjAmt, 0));
  const dta = money(ROLLFORWARD.reduce((s, r) => s + (r.open + r.add + r.rev) * TAX_RATE, 0));
  const etr = currentTax / ACCOUNTING_PROFIT;

  const audit: AuditNode = {
    id: "cit-taxable",
    label: "Taxable profit · FY2026",
    amount: taxableProfit,
    kind: "result",
    ruleId: "CIT24-CALC",
    ruleVersion: "2026.2",
    detail: "Accounting profit + Σ add-backs − Σ deductions − tax losses. Posted by the deterministic engine. The LLM never calculated this figure.",
    children: [
      {
        id: "acct-pbt",
        label: "Accounting profit before tax",
        amount: ACCOUNTING_PROFIT,
        kind: "entity",
        sourceFile: "TB_SPP_FY2026_Jul.xlsx",
        detail: "July management accounts / continuous close through 31 Jul 2026.",
      },
      ...adjs.map(traceAdjustment),
      {
        id: "loss-cf",
        label: "Tax losses utilised",
        amount: -losses,
        kind: "formula",
        ruleId: "RULE-LOSS-65",
        ruleVersion: "v3",
        detail: "FY2021 loss · expires FY2026 · five-year carry-forward, FIFO.",
      },
    ],
  };

  return {
    accountingProfit: ACCOUNTING_PROFIT,
    addBacks,
    deductions,
    adjustedProfit,
    losses,
    taxableProfit,
    currentTax,
    pnd51Credit: PND51_CREDIT,
    whtCredit,
    payable,
    etr,
    permanent,
    temporary,
    dta,
    audit,
  };
}

export function traceAdjustment(a: Adjustment): AuditNode {
  const rule = RULES.find((r) => r.id === a.ruleId);
  const gl = GL_DETAIL[a.id] ?? [[`Aggregated from ${a.gl} · 6 entries`, String(a.acctAmt)], [`GL extract CIT24-GL-2026-07`, "—"]];
  const doc = DOCS[a.id] ?? [`EVIDENCE-${a.id}.pdf`, "Supporting document pack · OCR TH/EN"];
  return {
    id: a.id,
    label: a.name,
    amount: a.adjAmt,
    kind: "formula",
    ruleId: a.ruleId,
    ruleVersion: rule?.version ?? "v1",
    sourceFile: doc[0],
    detail: `${a.sec} · GL ${a.gl} · ${a.pt === "P" ? "permanent" : "temporary"} · origin ${a.origin} · ${a.status}`,
    children: [
      { id: `${a.id}-acct`, label: "Accounting amount", amount: a.acctAmt, kind: "account", detail: `Account ${a.gl}` },
      {
        id: `${a.id}-gl`,
        label: "GL transactions",
        kind: "account",
        detail: gl.map((g) => `${g[0]} · ${g[1]}`).join(" · "),
      },
      {
        id: `${a.id}-doc`,
        label: doc[0],
        kind: "source",
        sourceFile: doc[0],
        detail: doc[1],
      },
      {
        id: `${a.id}-rule`,
        label: a.sec,
        kind: "rule",
        ruleId: a.ruleId,
        ruleVersion: rule?.version,
        detail: rule?.logic ?? a.treatment,
      },
      {
        id: `${a.id}-appr`,
        label: a.status,
        kind: "approval",
        detail: a.status === "Approved"
          ? "Prepared Nattaya P. · reviewed Kanit S. · approved Pornthip R. (CFO) 21 Jul 2026 16:20"
          : `${a.status} · locked from filing until approved`,
      },
    ],
  };
}

export type Pnd51Method = "m1" | "m2";

export type Pnd51Sim = {
  h2Rev: number;
  acct: number;
  taxable: number;
  tax: number;
  halfProj: number;
  floor: number;
  breach: boolean;
  surcharge: number;
  shortPct: number;
  declaredTax: number;
  halfDec: number;
  recommended: number;
  grid: { label: string; cells: { v: number; hot: boolean; warn: boolean }[] }[];
};

export function simulatePnd51(g: number, m: number, declared: number, method: Pnd51Method): Pnd51Sim {
  const run = (gg: number, mm: number) => {
    const h2 = H1_REVENUE * (1 + gg / 100) * (mm / 100);
    const acct = H1_PROFIT + h2;
    const taxable = acct + ANNUAL_TAX_ADJ_NET - TAX_LOSSES_AVAILABLE;
    return { h2rev: H1_REVENUE * (1 + gg / 100), acct, taxable, tax: taxable * TAX_RATE };
  };

  if (method === "m2") {
    const actualSix = 47_900_000;
    const payable = money(actualSix * TAX_RATE);
    return {
      h2Rev: H1_REVENUE,
      acct: H1_PROFIT,
      taxable: actualSix,
      tax: payable * 2,
      halfProj: payable,
      floor: actualSix,
      breach: false,
      surcharge: 0,
      shortPct: 0,
      declaredTax: payable,
      halfDec: payable,
      recommended: actualSix,
      grid: [],
    };
  }

  const S = run(g, m);
  const floor = S.taxable * 0.75;
  const breach = declared < floor;
  const halfProj = S.tax / 2;
  const halfDec = (declared * TAX_RATE) / 2;
  const surcharge = breach ? (halfProj - halfDec) * 0.2 : 0;
  const shortPct = ((S.taxable - declared) / S.taxable) * 100;
  const grid = [-10, 0, 10].map((rd) => ({
    label: `${rd > 0 ? "+" : ""}${rd}% revenue`,
    cells: [-1.5, 0, 1.5].map((md) => {
      const t = run(g + rd, m + md).taxable;
      const p = ((t - declared) / t) * 100;
      return { v: p, hot: p > 25, warn: p > 18 };
    }),
  }));

  return {
    h2Rev: S.h2rev,
    acct: S.acct,
    taxable: S.taxable,
    tax: S.tax,
    halfProj,
    floor,
    breach,
    surcharge,
    shortPct,
    declaredTax: declared * TAX_RATE,
    halfDec,
    recommended: Math.round((S.taxable * 0.85) / 100000) * 100000,
    grid,
  };
}

export function dtaRegister() {
  return [
    { name: "2340-00 Warranty provision", diff: 4_600_000 },
    { name: "2310-00 Accrued bonus", diff: 2_500_000 },
    { name: "1600-00 PPE — tax base lower", diff: 6_400_000 },
    { name: "1455-00 Inventory provision", diff: 3_250_000 },
    { name: "2110-00 FX on payables", diff: 1_846_000 },
    { name: "1210-00 Doubtful-debt allowance", diff: 920_000 },
  ].map((r) => ({ ...r, dt: money(r.diff * TAX_RATE), kind: "Asset" as const }));
}

export const ENGINE_ID = "CIT24-CALC";
export const ENGINE_VERSION = "2026.2";
export const RULE_PACK = "Thai CIT 2026.2 · s.65 / 65 bis / 65 ter";
