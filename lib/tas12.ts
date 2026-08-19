import type { Adjustment } from "./model";
import { ACCOUNTING_PROFIT, ENTITY, TAX_RATE } from "./model";
import { money } from "./format";
import { farTotals } from "./far";

export type TdKind = "DTA" | "DTL";
export type TdOrigin = "temporary" | "loss" | "credit" | "exception";

export type EnactedRate = {
  id: string;
  en: string;
  th: string;
  rate: number;
  enacted: string;
  status: "substantively enacted" | "not elected" | "blocked";
  appliesToDt: boolean;
  note: string;
};

export const ENACTED_RATES: EnactedRate[] = [
  { id: "cit20", en: "Thai CIT — ordinary companies", th: "ภาษีนิติบุคคลอัตราปกติ", rate: 0.20, enacted: "01 Jan 2015", status: "substantively enacted", appliesToDt: true, note: "s.65. Used for current tax and domestic DTA/DTL." },
  { id: "sme15", en: "SME progressive (not this profile)", th: "SME ก้าวหน้า (โปรไฟล์นี้ไม่ใช้)", rate: 0.15, enacted: "01 Jan 2023", status: "not elected", appliesToDt: false, note: "Scenario only. Restates DTA/DTL if selected; does not change PND50 unless the entity profile is SME." },
  { id: "p2-15", en: "Pillar Two GloBE minimum", th: "เสาหลักสอง อัตราขั้นต่ำ", rate: 0.15, enacted: "IAS 12 amendment", status: "blocked", appliesToDt: false, note: "TAS 12 exception: no DTA/DTL from Pillar Two income taxes." },
];

export const UNUSED_CREDITS = [
  { id: "FTC-SG-2025", name: "Foreign tax credit — Singapore", nameTh: "เครดิตภาษีต่างประเทศ — สิงคโปร์", amount: 420_000, expires: "FY2030", source: "s.60 / treaty", note: "Unused after limitation. Distinct from WHT that reduces current payable." },
];

export const PILLAR_TWO = {
  inScope: false,
  currentTax: 0,
  hypotheticalDtBlocked: 0,
  exception: "TAS 12 / IAS 12: do not recognise or disclose DTA/DTL arising from Pillar Two income taxes.",
  exposure: "Consolidated revenue THB 1.24bn is below the EUR 750m threshold. No top-up expected. GMT24 still receives covered-tax data so the exception is coded before the group is in scope.",
};

type Spec = {
  id: string;
  gl: string;
  name: string;
  nameTh: string;
  kind: TdKind;
  origin: TdOrigin;
  open: number;
  when: string;
  carrying: number;
  taxBase: number;
  exception?: "outside-basis" | "pillar-two" | "initial-recognition";
  fromFar?: boolean;
  seedAdd?: number;
};

const SPECS: Spec[] = [
  { id: "TB-WAR", gl: "2340-00", name: "Warranty provision", nameTh: "ประมาณการค่ารับประกัน", kind: "DTA", origin: "temporary", open: 4_000_000, when: "FY2027–28", carrying: 4_600_000, taxBase: 0 },
  { id: "TB-BON", gl: "2310-00", name: "Accrued bonus", nameTh: "โบนัสค้างจ่าย", kind: "DTA", origin: "temporary", open: 2_200_000, when: "FY2027 (Mar)", carrying: 2_500_000, taxBase: 0 },
  { id: "TB-PPE", gl: "6410-00", name: "PPE — tax base above carrying amount", nameTh: "สินทรัพย์ถาวร — ฐานภาษีสูงกว่ามูลค่าตามบัญชี", kind: "DTA", origin: "temporary", open: 6_000_000, when: "FY2027–31", carrying: 0, taxBase: 0, fromFar: true },
  { id: "TB-INV", gl: "1450-00", name: "Inventory obsolescence provision", nameTh: "ค่าเผื่อสินค้าล้าสมัย", kind: "DTA", origin: "temporary", open: 0, when: "On scrapping", carrying: 3_250_000, taxBase: 0 },
  { id: "TB-FX", gl: "7120-00", name: "Unrealised FX on payables", nameTh: "ผลขาดทุนอัตราแลกเปลี่ยนที่ยังไม่เกิดขึ้น", kind: "DTA", origin: "temporary", open: 0, when: "FY2027 (settlement)", carrying: 1_846_000, taxBase: 0 },
  { id: "TB-BD", gl: "6810-00", name: "Bad-debt write-off (conditions not met)", nameTh: "หนี้สูญที่ยังไม่เข้าเงื่อนไข", kind: "DTA", origin: "temporary", open: 0, when: "On Min. Reg. 186", carrying: 920_000, taxBase: 0 },
  { id: "TB-PRE", gl: "1452-00", name: "Prepaid insurance (tax-deducted)", nameTh: "ค่าประกันจ่ายล่วงหน้า (หักภาษีแล้ว)", kind: "DTL", origin: "temporary", open: 1_500_000, when: "FY2027", carrying: 1_800_000, taxBase: 0, seedAdd: 300_000 },
  { id: "TB-INT", gl: "1130-00", name: "Accrued interest income (cash-taxed)", nameTh: "ดอกเบี้ยค้างรับ (ภาษีตามเงินสด)", kind: "DTL", origin: "temporary", open: 400_000, when: "FY2027", carrying: 600_000, taxBase: 0, seedAdd: 200_000 },
  { id: "TB-SUB", gl: "1218-00", name: "Investment in subsidiary — outside basis", nameTh: "เงินลงทุนในบริษัทย่อย — ฐานภายนอก", kind: "DTL", origin: "exception", open: 12_000_000, when: "Indefinite", carrying: 48_000_000, taxBase: 36_000_000, exception: "outside-basis" },
];

export type TdLine = {
  id: string;
  gl: string;
  name: string;
  nameTh: string;
  kind: TdKind;
  origin: TdOrigin;
  open: number;
  add: number;
  rev: number;
  close: number;
  carrying: number;
  taxBase: number;
  when: string;
  exception?: Spec["exception"];
  dtOpen: number;
  dtClose: number;
  recognised: number;
  unrecognised: number;
};

export type Recoverability = {
  horizonYears: number;
  forecastProfit: number;
  supportable: number;
  needed: number;
  allowance: number;
  probable: boolean;
  confirmed: boolean;
  conclusion: string;
};

export type Tas12Result = {
  enabled: boolean;
  rate: number;
  lines: TdLine[];
  lossOpen: number;
  lossUtilised: number;
  lossClose: number;
  lossDtOpen: number;
  lossDtClose: number;
  credit: number;
  creditDt: number;
  dtaGross: number;
  dtlGross: number;
  dtaRecognised: number;
  dtlRecognised: number;
  unrecognisedDta: number;
  unrecognisedDtl: number;
  allowance: number;
  dtExpense: number;
  taxExpense: number;
  recoverability: Recoverability;
  exceptions: { id: string; en: string }[];
  journal: { account: string; dr: number; cr: number }[];
  foreignCurrentTax: number;
  ociDeferred: number;
  utp: string;
  pillarTwo: typeof PILLAR_TWO;
};

function currentTaxJournal(opts: { currentTax: number; whtCredit: number; pnd51Credit: number; payable: number }) {
  return [
    { account: "Current income tax expense", dr: opts.currentTax, cr: 0 },
    { account: "Withholding tax receivable", dr: 0, cr: opts.whtCredit },
    { account: "Prepaid CIT — PND51", dr: 0, cr: opts.pnd51Credit },
    { account: "Corporate income tax payable", dr: 0, cr: opts.payable },
  ].filter((r) => r.dr || r.cr);
}

function glMove(adjs: Adjustment[], gl: string) {
  const rows = adjs.filter((a) => a.pt === "T" && a.gl === gl);
  const add = money(rows.filter((a) => a.adjAmt > 0).reduce((s, a) => s + a.adjAmt, 0));
  const rev = money(rows.filter((a) => a.adjAmt < 0).reduce((s, a) => s + a.adjAmt, 0));
  return { add, rev };
}

export function computeTas12(opts: {
  adjs: Adjustment[];
  taxableProfit: number;
  currentTax: number;
  pnd51Credit: number;
  whtCredit: number;
  payable: number;
  losses: { origin: number; utilised: number; remaining: number }[];
  rate?: number;
  recoverabilityConfirmed?: boolean;
  enabled?: boolean;
}): Tas12Result {
  const rate = opts.rate ?? TAX_RATE;
  const far = farTotals();
  const confirmed = opts.recoverabilityConfirmed ?? false;
  const enabled = opts.enabled ?? true;

  const lines: TdLine[] = SPECS.map((spec) => {
    let add = 0;
    let rev = 0;
    let carrying = spec.carrying;
    let taxBase = spec.taxBase;
    if (spec.fromFar) {
      add = far.excess;
      rev = -far.catchUp;
      carrying = 0;
      taxBase = money(spec.open + add + rev);
    } else if (spec.origin === "temporary" && !spec.exception) {
      const m = glMove(opts.adjs, spec.gl);
      add = m.add || spec.seedAdd || 0;
      rev = m.rev;
    }
    const close = money(spec.open + add + rev);
    const dtOpen = money(spec.open * rate);
    const dtClose = money(close * rate);
    return {
      id: spec.id,
      gl: spec.gl,
      name: spec.name,
      nameTh: spec.nameTh,
      kind: spec.kind,
      origin: spec.origin,
      open: spec.open,
      add,
      rev,
      close,
      carrying: spec.fromFar ? money(0) : carrying,
      taxBase: spec.fromFar ? money(close) : (spec.kind === "DTL" ? 0 : taxBase),
      when: spec.when,
      exception: spec.exception,
      dtOpen,
      dtClose,
      recognised: 0,
      unrecognised: 0,
    };
  });

  const lossOpenAmt = money(opts.losses.reduce((s, y) => s + y.utilised + y.remaining, 0));
  const lossUtilised = money(opts.losses.reduce((s, y) => s + y.utilised, 0));
  const lossClose = money(opts.losses.reduce((s, y) => s + y.remaining, 0));
  const lossDtOpen = money(lossOpenAmt * rate);
  const lossDtClose = money(lossClose * rate);

  const credit = money(UNUSED_CREDITS.reduce((s, c) => s + c.amount, 0));
  const creditDt = credit; // already a tax amount

  const deductibleClose = money(lines.filter((l) => l.kind === "DTA" && !l.exception).reduce((s, l) => s + l.close, 0) + lossClose);
  const horizonYears = 5;
  const forecastProfit = Math.max(0, opts.taxableProfit);
  const supportable = money(forecastProfit * horizonYears);
  const needed = deductibleClose;
  const shortfall = Math.max(0, needed - supportable);
  const allowance = money(shortfall * rate);
  const probable = supportable >= needed || forecastProfit > 0;

  const exceptionBlock = (l: TdLine) => Boolean(l.exception) || l.origin === "exception";

  for (const l of lines) {
    if (exceptionBlock(l) || l.id === "TB-SUB") {
      l.recognised = 0;
      l.unrecognised = l.dtClose;
      continue;
    }
    if (l.kind === "DTL") {
      l.recognised = l.dtClose;
      l.unrecognised = 0;
      continue;
    }
    const book = confirmed && probable ? Math.max(0, l.dtClose) : (probable ? l.dtClose : 0);
    l.recognised = money(book);
    l.unrecognised = money(l.dtClose - l.recognised);
  }

  let remainingAllowance = allowance;
  if (confirmed && probable && remainingAllowance > 0) {
    const order = ["TB-INV", "TB-FX", "TB-BD"];
    for (const id of order) {
      const l = lines.find((x) => x.id === id);
      if (!l || remainingAllowance <= 0) continue;
      const cut = Math.min(l.recognised, remainingAllowance);
      l.recognised = money(l.recognised - cut);
      l.unrecognised = money(l.unrecognised + cut);
      remainingAllowance = money(remainingAllowance - cut);
    }
  }

  const lossRecognised = confirmed && probable ? lossDtClose : (probable ? lossDtClose : 0);
  const creditRecognised = confirmed && probable ? creditDt : (probable ? creditDt : 0);

  const dtaGross = money(lines.filter((l) => l.kind === "DTA").reduce((s, l) => s + l.dtClose, 0) + lossDtClose + creditDt);
  const dtlGross = money(lines.filter((l) => l.kind === "DTL").reduce((s, l) => s + l.dtClose, 0));
  const dtaRecognised = money(lines.filter((l) => l.kind === "DTA").reduce((s, l) => s + l.recognised, 0) + lossRecognised + creditRecognised);
  const dtlRecognised = money(lines.filter((l) => l.kind === "DTL").reduce((s, l) => s + l.recognised, 0));
  const unrecognisedDta = money(dtaGross - dtaRecognised);
  const unrecognisedDtl = money(dtlGross - dtlRecognised);

  const dtaOpen = money(lines.filter((l) => l.kind === "DTA" && !exceptionBlock(l)).reduce((s, l) => s + l.dtOpen, 0) + lossDtOpen + creditDt);
  const dtlOpen = money(lines.filter((l) => l.kind === "DTL" && !exceptionBlock(l)).reduce((s, l) => s + l.dtOpen, 0));
  const dtExpense = money((dtaOpen - dtaRecognised) + (dtlRecognised - dtlOpen));
  const taxExpense = money(opts.currentTax + dtExpense);

  const recoverability: Recoverability = {
    horizonYears,
    forecastProfit,
    supportable,
    needed,
    allowance,
    probable,
    confirmed,
    conclusion: !probable
      ? "Not probable — no DTA booked."
      : !confirmed
        ? "Probable on forecast taxable profit. CFO recoverability memo required before the DTA is recognised in the financial statements."
        : allowance > 0
          ? `Probable in part. Valuation allowance ${allowance.toLocaleString("en-US")} on items reversing beyond the ${horizonYears}-year forecast.`
          : `Probable. ${horizonYears}-year forecast taxable profit covers deductible differences and remaining losses.`,
  };

  const currentJe = currentTaxJournal({
    currentTax: opts.currentTax,
    whtCredit: opts.whtCredit,
    pnd51Credit: opts.pnd51Credit,
    payable: opts.payable,
  });
  const dtJe = enabled
    ? [
        { account: "Deferred tax expense / (income)", dr: Math.max(0, dtExpense), cr: Math.max(0, -dtExpense) },
        { account: "Deferred tax asset", dr: Math.max(0, dtaRecognised - dtaOpen), cr: Math.max(0, dtaOpen - dtaRecognised) },
        { account: "Deferred tax liability", dr: Math.max(0, dtlOpen - dtlRecognised), cr: Math.max(0, dtlRecognised - dtlOpen) },
      ].filter((r) => r.dr || r.cr)
    : [];
  const journal = [...currentJe, ...dtJe];

  if (!enabled) {
    for (const l of lines) {
      l.recognised = 0;
      l.unrecognised = 0;
    }
  }

  return {
    enabled,
    rate,
    lines,
    lossOpen: lossOpenAmt,
    lossUtilised,
    lossClose,
    lossDtOpen: enabled ? lossDtOpen : 0,
    lossDtClose: enabled ? (confirmed && probable ? lossDtClose : 0) : 0,
    credit: enabled ? credit : 0,
    creditDt: enabled ? creditRecognised : 0,
    dtaGross: enabled ? dtaGross : 0,
    dtlGross: enabled ? dtlGross : 0,
    dtaRecognised: enabled ? dtaRecognised : 0,
    dtlRecognised: enabled ? dtlRecognised : 0,
    unrecognisedDta: enabled ? unrecognisedDta : 0,
    unrecognisedDtl: enabled ? unrecognisedDtl : 0,
    allowance: enabled ? allowance : 0,
    dtExpense: enabled ? dtExpense : 0,
    taxExpense: enabled ? taxExpense : opts.currentTax,
    recoverability,
    exceptions: [
      { id: "TB-SUB", en: "Outside basis on subsidiary — TAS 12.39; reversal not probable; DTL not recognised." },
      { id: "P2", en: PILLAR_TWO.exception },
      { id: "IR", en: "No initial-recognition exemption items this period. No goodwill." },
    ],
    journal,
    foreignCurrentTax: 0,
    ociDeferred: 0,
    utp: "No TFRIC 23 provision. Open ledger queries (FX rate basis, bad-debt steps) are classification, not uncertain tax treatments.",
    pillarTwo: PILLAR_TWO,
  };
}

export function currentTaxEtrRecon(adjs: Adjustment[], currentTax: number, pbt = ACCOUNTING_PROFIT, rate = TAX_RATE) {
  const statutory = money(pbt * rate);
  const permanents = adjs.filter((a) => a.pt === "P");
  const exempt = money(permanents.filter((a) => a.adjAmt < 0).reduce((s, a) => s + a.adjAmt, 0) * rate);
  const tp = money(permanents.filter((a) => a.ruleId === "RULE-TP-71B").reduce((s, a) => s + a.adjAmt, 0) * rate);
  const otherP = money(permanents.filter((a) => a.adjAmt > 0 && a.ruleId !== "RULE-TP-71B").reduce((s, a) => s + a.adjAmt, 0) * rate);
  const permTax = money(permanents.reduce((s, a) => s + a.adjAmt, 0) * rate);
  return {
    statutory,
    permTax,
    exempt,
    tp,
    otherP,
    currentTax,
    etr: currentTax / pbt,
  };
}

export function gmt24CoveredTax(opts: {
  currentTax: number;
  dtExpense: number;
  whtCredit: number;
  adjs: Adjustment[];
}) {
  const tp = opts.adjs.find((a) => a.ruleId === "RULE-TP-71B");
  return {
    product: "CIT24 → GMT24",
    entity: ENTITY.name,
    tin: ENTITY.tin,
    fy: "FY2026",
    currentTaxThai: opts.currentTax,
    deferredTaxDomestic: opts.dtExpense,
    deferredIncludesPillarTwo: false,
    pillarTwoException: true,
    pillarTwoCurrentTax: PILLAR_TWO.currentTax,
    pillarTwoInScope: PILLAR_TWO.inScope,
    whtCredit: opts.whtCredit,
    tp24PermanentAddBack: tp?.adjAmt ?? 0,
    globeMapping: tp
      ? [{ id: tp.id, globe: "Add-back to GloBE income · non-economic / non-deductible related-party charge above arm’s length" }]
      : [],
    note: "GMT24 must not request a Pillar Two DTA or DTL. CIT24 will disclose Pillar Two current tax as a separate line when GMT24 returns it.",
  };
}

export function tas12NoteLines(t: Tas12Result, currentTax: number, pbt = ACCOUNTING_PROFIT) {
  return [
    { en: "Current tax — Thai CIT", th: "ภาษีงวดปัจจุบัน — นิติบุคคลไทย", amount: currentTax },
    { en: "Current tax — foreign", th: "ภาษีงวดปัจจุบัน — ต่างประเทศ", amount: t.foreignCurrentTax },
    { en: "Current tax — Pillar Two (GMT24)", th: "ภาษีงวดปัจจุบัน — เสาหลักสอง", amount: t.pillarTwo.currentTax },
    { en: "Deferred tax — temporary differences", th: "ภาษีรอตัดบัญชี — ผลต่างชั่วคราว", amount: t.dtExpense },
    { en: "Income tax expense", th: "ค่าใช้จ่ายภาษีเงินได้", amount: t.taxExpense },
    { en: "Accounting profit before tax", th: "กำไรก่อนภาษีทางบัญชี", amount: pbt },
  ];
}
