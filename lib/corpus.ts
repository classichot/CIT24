import { RULES, type CitRule } from "./rules";
import type { LawMode } from "./model";

export type CorpusKind =
  | "statute"
  | "royal-decree"
  | "ministerial-reg"
  | "TAS"
  | "TFRIC"
  | "department-ruling"
  | "treaty";

export type CorpusStatus = "in-force" | "amended" | "obsolete" | "superseded";

export type CorpusUse = {
  ruleIds: string[];
  pages: string[];
  engineHooks: string[];
  note?: string;
};

export type CorpusInstrument = {
  id: string;
  cite: string;
  title: string;
  titleTh: string;
  kind: CorpusKind;
  jurisdiction: "TH";
  effectiveFrom: string;
  status: CorpusStatus;
  supersededBy?: string;
  obsoleteNote?: string;
  summary: string;
  summaryTh: string;
  cit24Use: CorpusUse;
  lastReviewed: string;
  legalUrl?: string;
  /** Compliance bar vs full related-law pack. */
  bar: "compliance" | "complex";
};

export type CorpusPatch = {
  status?: CorpusStatus;
  /** Set a successor id, or `null` to clear (reinstate). */
  supersededBy?: string | null;
  obsoleteNote?: string | null;
  lastReviewed?: string;
};

export type CorpusDraft = {
  cite: string;
  title: string;
  titleTh?: string;
  kind: CorpusKind;
  effectiveFrom: string;
  summary: string;
  summaryTh?: string;
};

export const CORPUS_KINDS: { id: CorpusKind; en: string; th: string; zh: string; ja: string }[] = [
  { id: "statute", en: "Statute", th: "กฎหมาย", zh: "法律", ja: "法律" },
  { id: "royal-decree", en: "Royal decree", th: "พระราชกฤษฎีกา", zh: "王室法令", ja: "勅令" },
  { id: "ministerial-reg", en: "Ministerial regulation", th: "กฎกระทรวง", zh: "部颁规章", ja: "省令" },
  { id: "TAS", en: "TAS / TFRS", th: "ต.บ. / TFRS", zh: "TAS / TFRS", ja: "TAS / TFRS" },
  { id: "TFRIC", en: "TFRIC", th: "ตีความ TFRIC", zh: "TFRIC", ja: "TFRIC" },
  { id: "department-ruling", en: "Department ruling", th: "คำสั่งกรม", zh: "部门裁定", ja: "局通達" },
  { id: "treaty", en: "Treaty", th: "อนุสัญญา", zh: "税收协定", ja: "租税条約" },
];

export const CORPUS_STATUSES: { id: CorpusStatus; en: string; th: string; zh: string; ja: string }[] = [
  { id: "in-force", en: "In force", th: "ใช้บังคับ", zh: "现行有效", ja: "施行中" },
  { id: "amended", en: "Amended", th: "แก้ไขแล้ว", zh: "已修订", ja: "改正済" },
  { id: "obsolete", en: "Obsolete", th: "ล้าสมัย", zh: "已废止", ja: "失効" },
  { id: "superseded", en: "Superseded", th: "ถูกแทนที่", zh: "已被取代", ja: "廃止・承継" },
];

const RC = "https://www.rd.go.th/5939.html";
const TER = "https://www.rd.go.th/827.html";
const PND50 = "https://www.rd.go.th/840.html";
const P51 = "https://www.rd.go.th/3597.html";
const REVIEWED = "2026-08-19";

function I(
  id: string,
  cite: string,
  title: string,
  titleTh: string,
  kind: CorpusKind,
  effectiveFrom: string,
  status: CorpusStatus,
  summary: string,
  summaryTh: string,
  cit24Use: CorpusUse,
  extra?: Partial<Pick<CorpusInstrument, "supersededBy" | "obsoleteNote" | "legalUrl" | "lastReviewed" | "bar">>,
): CorpusInstrument {
  return {
    id,
    cite,
    title,
    titleTh,
    kind,
    jurisdiction: "TH",
    effectiveFrom,
    status,
    summary,
    summaryTh,
    cit24Use,
    lastReviewed: extra?.lastReviewed ?? REVIEWED,
    supersededBy: extra?.supersededBy,
    obsoleteNote: extra?.obsoleteNote,
    legalUrl: extra?.legalUrl,
    bar: extra?.bar ?? "compliance",
  };
}

/** Seeded from instruments CIT24 already codes — summaries and citations, not full statute text. */
export const CORPUS_SEED: CorpusInstrument[] = [
  I(
    "RC-65",
    "Revenue Code s.65",
    "Net profit for corporate income tax; five-year loss carry-forward",
    "กำไรสุทธิเพื่อภาษีนิติบุคคล และการยกผลขาดทุนไป 5 ปี",
    "statute",
    "1939-04-01",
    "in-force",
    "Section 65 is the taxable-profit rule: accounting profit is adjusted, then tax losses may be carried forward five consecutive accounting periods and used FIFO. Ordinary companies are taxed at 20% unless a special profile applies.",
    "มาตรา 65 เป็นฐานกำไรสุทธิ: ปรับกำไรทางบัญชี แล้วยกผลขาดทุนไปได้ห้าปีบัญชีติดต่อกันแบบ FIFO บริษัททั่วไปเสียภาษีร้อยละ 20 เว้นแต่มีโปรไฟล์พิเศษ",
    {
      ruleIds: ["RULE-LOSS-65", "RULE-RATE-20", "RULE-INT-65", "RULE-AUDIT-ADJ"],
      pages: ["/provision", "/losses", "/pnd50"],
      engineHooks: ["lib/engine.ts computeProvision", "lib/close.ts utiliseLosses"],
      note: "ETR identity is currentTax / ACCOUNTING_PROFIT and is not changed by this corpus.",
    },
    { legalUrl: RC },
  ),
  I(
    "RC-65-BIS",
    "Revenue Code s.65 bis",
    "Income measurement and prescribed bases",
    "การวัดรายได้และฐานตามที่กำหนด (ม.65 ทวิ)",
    "statute",
    "1939-04-01",
    "in-force",
    "Section 65 bis sets how certain income is measured for tax — including prescribed FX, inventory at cost, and exemptions such as qualifying dividends — so book revenue may be deferred or excluded until the tax event.",
    "มาตรา 65 ทวิ กำหนดวิธีวัดรายได้ทางภาษี เช่น อัตราแลกเปลี่ยนตามที่กำหนด สินค้าคงเหลือตามต้นทุน และเงินปันผลที่เข้าเงื่อนไขยกเว้น",
    {
      ruleIds: ["RULE-65B-01", "RULE-FX-65B5", "RULE-65B-08", "RULE-EX-65B10", "RULE-65B-13"],
      pages: ["/ledger", "/rules"],
      engineHooks: ["lib/engine.ts liveAdjustments"],
    },
    { legalUrl: RC },
  ),
  I(
    "RC-65-TER",
    "Revenue Code s.65 ter",
    "Non-deductible expenses and statutory ceilings",
    "รายจ่ายที่ห้ามหักและเพดานตามกฎหมาย (ม.65 ตรี)",
    "statute",
    "1939-04-01",
    "in-force",
    "Section 65 ter lists amounts that are not deductible, or deductible only within a ceiling (entertainment, donations, unpaid accruals, CIT expense, fines). CIT24 posts these as permanent or temporary add-backs with evidence, not as a single non-deductible switch.",
    "มาตรา 65 ตรี รายการที่หักไม่ได้หรือหักได้ภายในเพดาน (ค่ารับรอง เงินบริจาค ค้างจ่าย ภาษีนิติบุคคล ค่าปรับ) CIT24 บันทึกเป็นบวกกลับทีละกฎ",
    {
      ruleIds: [],
      pages: ["/ledger", "/rules"],
      engineHooks: ["lib/engine.ts computeProvision"],
    },
    { legalUrl: TER },
  ),
  I(
    "RC-67-BIS",
    "Revenue Code s.67 bis",
    "Half-year corporate tax (PND51)",
    "ภาษีครึ่งปี ภ.ง.ด.51 (ม.67 ทวิ)",
    "statute",
    "1939-04-01",
    "in-force",
    "Section 67 bis requires a mid-year payment: ordinary companies estimate annual profit and pay one half (67 bis (1)); listed companies and specified financial businesses pay on actual first-half profit (67 bis (2)). Tax paid credits the annual PND50.",
    "มาตรา 67 ทวิ ให้เสียภาษีกลางปี: บริษัททั่วไปประมาณการกำไรทั้งปีแล้วชำระกึ่งหนึ่ง (1) บริษัทจดทะเบียนและกิจการการเงินที่กำหนดเสียจากกำไรจริงหกเดือนแรก (2) ยอดที่จ่ายเครดิตใน ภ.ง.ด.50",
    {
      ruleIds: ["RULE-67B-51", "RULE-67B-51B", "RULE-PND51-CR"],
      pages: ["/pnd51", "/pnd50", "/provision"],
      engineHooks: ["lib/engine.ts simulatePnd51"],
    },
    { legalUrl: RC },
  ),
  I(
    "RC-68",
    "Revenue Code s.68 / s.67",
    "Annual return (PND50) filing deadline",
    "กำหนดยื่นแบบประจำปี ภ.ง.ด.50 (ม.68 / ม.67)",
    "statute",
    "1939-04-01",
    "in-force",
    "The annual corporate return is generally due within 150 days after the accounting-period end. CIT24 tracks the deadline and builds the filing pack; it does not e-file.",
    "แบบประจำปีโดยทั่วไปยื่นภายใน 150 วันหลังวันสิ้นรอบบัญชี CIT24 ติดตามกำหนดและจัดชุดยื่น แต่ไม่ยื่นอิเล็กทรอนิกส์แทนผู้เสียภาษี",
    {
      ruleIds: ["RULE-67-50"],
      pages: ["/pnd50"],
      engineHooks: ["lib/close.ts pnd50Lines"],
    },
    { legalUrl: PND50 },
  ),
  I(
    "RC-60",
    "Revenue Code s.60",
    "Withholding-tax credit and foreign-tax credit",
    "เครดิตภาษีหัก ณ ที่จ่ายและเครดิตภาษีต่างประเทศ (ม.60)",
    "statute",
    "1939-04-01",
    "in-force",
    "Section 60 (with the WHT machinery) allows credit for Thai withholding that matches included income, and for foreign tax on foreign-source income limited to Thai tax on that income. Unmatched certificates do not reduce payable.",
    "มาตรา 60 ให้เครดิตภาษีหัก ณ ที่จ่ายที่ตรงกับรายได้ที่นำมารวม และเครดิตภาษีต่างประเทศไม่เกินภาษีไทยบนรายได้นั้น ใบรับที่ยังไม่จับคู่ไม่ลดยอดที่ต้องชำระ",
    {
      ruleIds: ["RULE-WHT-CR", "RULE-FTC", "RULE-65T-14"],
      pages: ["/provision", "/pnd50", "/data"],
      engineHooks: ["lib/engine.ts computeProvision (whtCredit)"],
    },
    { legalUrl: RC },
  ),
  I(
    "RD-145",
    "Royal Decree No. 145",
    "Tax depreciation ceilings (FAR)",
    "เพดานค่าเสื่อมราคาทางภาษี (พ.ร.ฎ. 145)",
    "royal-decree",
    "1984-01-01",
    "in-force",
    "Royal Decree 145 limits deductible depreciation to prescribed rates on cost (buildings 5%, machinery/vehicles/IT typically 20%, with passenger-car cost caps). Book depreciation above the tax ceiling is a temporary add-back until the tax base is consumed.",
    "พ.ร.ฎ. 145 จำกัดค่าเสื่อมที่หักได้ตามอัตราที่กำหนดบนราคาทุน (อาคาร 5% เครื่องจักร/ยานพาหนะ/ไอทีโดยทั่วไป 20%) ส่วนที่บัญชีสูงกว่าเพดานเป็นบวกกลับชั่วคราว",
    {
      ruleIds: ["RULE-DEP-145", "RULE-DEP-BLDG", "RULE-DEP-MCH", "RULE-DEP-VEH", "RULE-DEP-IT", "RULE-65T-02"],
      pages: ["/far", "/deferred", "/ledger"],
      engineHooks: ["lib/far.ts farRegister", "lib/tas12.ts PPE tax-base line"],
    },
    { legalUrl: RC },
  ),
  I(
    "MR-186",
    "Ministerial Regulation No. 186",
    "Bad-debt write-off conditions",
    "เงื่อนไขการตัดหนี้สูญ (กฎกระทรวง ฉบับที่ 186)",
    "ministerial-reg",
    "1999-01-01",
    "in-force",
    "A bad-debt write-off is deductible only where the prescribed collection steps for the debt size have been taken and documented before year-end. Until those steps are evidenced, CIT24 posts a temporary add-back.",
    "ตัดหนี้สูญหักได้เมื่อได้ดำเนินการทวงหนี้ตามขั้นที่กำหนดตามขนาดหนี้และมีเอกสารก่อนสิ้นปี หากยังไม่ครบ CIT24 บวกกลับชั่วคราว",
    {
      ruleIds: ["RULE-BD-186"],
      pages: ["/ledger", "/deferred"],
      engineHooks: ["lib/tas12.ts TB-BD temporary difference"],
    },
    { legalUrl: RC },
  ),
  I(
    "TAS-12",
    "TAS 12",
    "Income taxes — current and deferred",
    "ภาษีเงินได้ — งวดปัจจุบันและรอตัดบัญชี (ต.บ. 12)",
    "TAS",
    "2015-01-01",
    "in-force",
    "TAS 12 is the financial-reporting standard for income taxes. CIT24 books DTA/DTL from temporary differences, unused losses and credits when the toggle is on. Current tax, PND50 and ETR (current tax ÷ PBT) do not change when deferred tax is switched off.",
    "ต.บ. 12 เป็นมาตรฐานรายงานภาษีเงินได้ CIT24 บันทึก DTA/DTL จากผลต่างชั่วคราว ผลขาดทุนและเครดิตที่ยังไม่ใช้เมื่อเปิดสวิตช์ ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยนเมื่อปิดภาษีรอตัดบัญชี",
    {
      ruleIds: [],
      pages: ["/deferred", "/disclosure", "/provision"],
      engineHooks: ["lib/tas12.ts computeTas12", "lib/tas12.ts currentTaxEtrRecon", "lib/tas12.ts tas12NoteLines"],
      note: "ETR remains currentTax / ACCOUNTING_PROFIT. TAS 12 deferred tax is not in the ETR identity.",
    },
  ),
  I(
    "TAS-2",
    "TAS 2",
    "Inventories — cost and net realisable value",
    "สินค้าคงเหลือ — ต้นทุนและมูลค่าสุทธิที่จะได้รับ (ต.บ. 2)",
    "TAS",
    "2015-01-01",
    "in-force",
    "TAS 2 requires inventories at the lower of cost and NRV. The NRV / obsolescence allowance is generally not a tax deduction until the goods are sold, scrapped or destroyed, so CIT24 posts a temporary add-back and a TAS 12 DTA.",
    "ต.บ. 2 ให้วัดสินค้าคงเหลือที่ต่ำกว่าระหว่างต้นทุนกับ NRV ค่าเผื่อล้าสมัยโดยทั่วไปหักภาษีไม่ได้จนกว่าจะขายหรือทำลาย จึงเป็นบวกกลับชั่วคราวและ DTA ตาม ต.บ. 12",
    {
      ruleIds: ["RULE-65B-08", "RULE-INV-OBS"],
      pages: ["/deferred", "/ledger"],
      engineHooks: ["lib/tas12.ts TB-INV inventory obsolescence DTA"],
    },
    { bar: "complex" },
  ),
  I(
    "TAS-34",
    "TAS 34",
    "Interim financial reporting",
    "การรายงานทางการเงินระหว่างกาล (ต.บ. 34)",
    "TAS",
    "2015-01-01",
    "in-force",
    "TAS 34 addresses interim reporting, including a tax expense estimated at the expected annual effective rate. CIT24’s FY close engine does not yet compute an interim TAS 34 tax expense; PND51 is a statutory half-year payment, not a TAS 34 interim.",
    "ต.บ. 34 ว่าด้วยรายงานระหว่างกาล รวมค่าใช้จ่ายภาษีโดยประมาณจากอัตราที่คาดทั้งปี เครื่องปิดปีของ CIT24 ยังไม่คำนวณค่าใช้จ่ายภาษีระหว่างกาลตาม ต.บ. 34 — ภ.ง.ด.51 เป็นการชำระตามกฎหมาย ไม่ใช่รายงานระหว่างกาล",
    {
      ruleIds: [],
      pages: ["/pnd51"],
      engineHooks: [],
      note: "Not yet engine-backed. Do not treat the PND51 simulator as a TAS 34 interim tax computation.",
    },
    { bar: "complex" },
  ),
  I(
    "TFRIC-23",
    "TFRIC 23",
    "Uncertainty over income tax treatments",
    "ความไม่แน่นอนของวิธีปฏิบัติทางภาษีเงินได้ (TFRIC 23)",
    "TFRIC",
    "2019-01-01",
    "in-force",
    "TFRIC 23 requires a provision when it is probable that a tax authority will not accept a treatment. CIT24’s TAS 12 engine currently records no TFRIC 23 provision; open ledger queries (FX basis, bad-debt steps) are classification, not uncertain tax treatments.",
    "TFRIC 23 ให้ตั้งประมาณการเมื่อมีความเป็นไปได้ที่หน่วยงานภาษีจะไม่รับวิธีปฏิบัติ เครื่อง ต.บ. 12 ของ CIT24 ยังไม่ตั้งประมาณการตาม TFRIC 23 — คำถามในทะเบียนเป็นเรื่องการจัดประเภท ไม่ใช่ฐานภาษีที่ไม่แน่นอน",
    {
      ruleIds: [],
      pages: ["/disclosure", "/deferred"],
      engineHooks: ["lib/tas12.ts utp (no TFRIC 23 provision this close)"],
    },
    { bar: "complex" },
  ),
  I(
    "TFRIC-13",
    "TFRIC 13",
    "Customer loyalty programmes (withdrawn)",
    "โปรแกรมสิทธิพิเศษแก่ลูกค้า (ยกเลิกแล้ว)",
    "TFRIC",
    "2009-01-01",
    "superseded",
    "TFRIC 13 used to allocate consideration between sale and award credits. It was withdrawn when TFRS 15 became effective. CIT24 does not apply TFRIC 13; loyalty / deferred revenue follows TFRS 15 if ever coded.",
    "TFRIC 13 เคยปันส่วนสิ่งตอบแทนระหว่างการขายกับคะแนนสะสม ถูกยกเลิกเมื่อ TFRS 15 มีผล CIT24 ไม่ใช้ TFRIC 13",
    {
      ruleIds: ["RULE-LOYAL-13"],
      pages: ["/corpus", "/rules", "/deferred"],
      engineHooks: [],
      note: "Example of an obsolete instrument with a successor, so the corpus update flow is visible. RULE-LOYAL-13 still cites this id — remap to TFRS-15.",
    },
    {
      supersededBy: "TFRS-15",
      obsoleteNote: "Withdrawn on TFRS 15 effective date. Do not ground new CIT24 rules in TFRIC 13.",
      bar: "complex",
    },
  ),
  I(
    "TFRS-15",
    "TFRS 15",
    "Revenue from contracts with customers",
    "รายได้จากสัญญาที่ทำกับลูกค้า (TFRS 15)",
    "TAS",
    "2019-01-01",
    "in-force",
    "TFRS 15 replaced TFRIC 13 (and related revenue interpretations) with a five-step revenue model. CIT24 still taxes revenue under s.65 / s.65 bis; TFRS 15 timing differences, if any, would be temporary items — no loyalty engine is coded yet.",
    "TFRS 15 แทนที่ TFRIC 13 ด้วยโมเดลรายได้ห้าขั้นตอน CIT24 ยังเก็บภาษีรายได้ตาม ม.65 / ม.65 ทวิ ความต่างเวลาถ้ามีจะเป็นรายการชั่วคราว — ยังไม่มีเครื่องคะแนนสะสม",
    {
      ruleIds: ["RULE-65B-01"],
      pages: ["/ledger"],
      engineHooks: [],
      note: "Successor to TFRIC 13. Light note only — revenue tax timing remains s.65 / s.65 bis.",
    },
    { bar: "complex" },
  ),
  I(
    "IAS-12-P2",
    "IAS 12 / TAS 12 Pillar Two amendment",
    "Mandatory exception — no Pillar Two DTA/DTL",
    "ข้อยกเว้นบังคับ — ห้าม DTA/DTL จากเสาหลักสอง",
    "TAS",
    "2023-05-23",
    "in-force",
    "The IAS 12 amendment on International Tax Reform—Pillar Two Model Rules forbids recognising or disclosing deferred tax arising from Pillar Two income taxes. CIT24 blocks P2 DTA/DTL, discloses Pillar Two current tax as a separate line when GMT24 returns it, and does not put Pillar Two into ETR.",
    "การแก้ไข IAS 12 เรื่องเสาหลักสองห้ามรับรู้หรือเปิดเผยภาษีรอตัดบัญชีจากภาษีเสาหลักสอง CIT24 บล็อก DTA/DTL จาก P2 เปิดเผยภาษีงวดปัจจุบันเสาหลักสองแยกบรรทัด และไม่ใส่เสาหลักสองใน ETR",
    {
      ruleIds: [],
      pages: ["/deferred", "/disclosure", "/ecosystem"],
      engineHooks: ["lib/tas12.ts PILLAR_TWO", "lib/tas12.ts gmt24CoveredTax"],
      note: "Does not change currentTax / ACCOUNTING_PROFIT. GMT24 is the Pillar Two engine; CIT24 supplies covered-tax data.",
    },
    { bar: "complex" },
  ),
  I(
    "RC-71-BIS",
    "Revenue Code s.71 bis",
    "Related-party pricing (transfer pricing)",
    "ราคาโอนระหว่างบริษัทที่เกี่ยวข้องกัน (ม.71 ทวิ)",
    "statute",
    "2019-01-01",
    "in-force",
    "Section 71 bis requires related-party charges to be at arm’s length. Amounts above the TP24 benchmarked range are a permanent add-back. CIT24 does not invent the range — it imports TP24 and will not select the legal position.",
    "มาตรา 71 ทวิ ให้ค่าตอบแทนระหว่างบริษัทที่เกี่ยวข้องเป็นไปตามราคาตลาด ส่วนที่เกินช่วงที่ TP24 เทียบแล้วเป็นบวกกลับถาวร CIT24 ไม่สร้างช่วงเอง และไม่เลือกจุดยืนทางกฎหมาย",
    {
      ruleIds: ["RULE-TP-71B", "RULE-65T-19"],
      pages: ["/ledger", "/ecosystem"],
      engineHooks: ["lib/tas12.ts currentTaxEtrRecon (TP permanent)"],
    },
    { legalUrl: RC, bar: "complex" },
  ),
  I(
    "RC-71-TER",
    "Revenue Code s.71 ter",
    "Transfer-pricing disclosure completeness",
    "ความครบถ้วนของเอกสารราคาโอน (ม.71 ตรี)",
    "statute",
    "2019-01-01",
    "in-force",
    "Section 71 ter requires prescribed TP documentation. CIT24 flags a missing TP24 package as a compliance event; it does not calculate the penalty.",
    "มาตรา 71 ตรี กำหนดให้จัดทำเอกสารราคาโอน CIT24 ติดธงเมื่อชุด TP24 ไม่ครบ แต่ไม่คำนวณค่าปรับ",
    {
      ruleIds: ["RULE-TP-71T"],
      pages: ["/ecosystem", "/rules"],
      engineHooks: [],
    },
    { legalUrl: RC, bar: "complex" },
  ),
  I(
    "BOI-ACT",
    "Investment Promotion Act B.E. 2520",
    "BOI-promoted activity — exempt profit and cost allocation",
    "กิจการที่ได้รับการส่งเสริม — กำไรยกเว้นและการปันส่วนต้นทุน",
    "statute",
    "1977-04-29",
    "in-force",
    "The Investment Promotion Act (with BOI certificates) can exempt promoted-activity profit for a holiday period. Shared costs must be allocated on an approved basis. CIT24 does not mix BOI and non-BOI tax bases in the MVP engine.",
    "พ.ร.บ. ส่งเสริมการลงทุน (พร้อมบัตร BOI) อาจยกเว้นกำไรกิจการที่ส่งเสริม ต้นทุนร่วมต้องปันส่วนตามฐานที่อนุมัติ CIT24 ไม่ผสมฐาน BOI กับนอก BOI ในเครื่อง MVP",
    {
      ruleIds: ["RULE-BOI-ALLOC", "RULE-BOI-EX"],
      pages: ["/entity", "/rules"],
      engineHooks: [],
    },
    { legalUrl: PND50, bar: "complex" },
  ),
  I(
    "ORDER-P50-2537",
    "RD Order ป.50/2537",
    "PND51 25% understatement surcharge",
    "เงินเพิ่มกรณียื่น ภ.ง.ด.51 ต่ำไปเกิน 25%",
    "department-ruling",
    "1994-01-01",
    "in-force",
    "Order Por. 50/2537 is the administrative test CIT24 uses for s.67 bis (1): if the declared half-year estimate is more than 25% below projected tax without reasonable cause, a 20% surcharge applies to the shortfall. Method (2) entities are outside this test.",
    "คำสั่ง ป.50/2537 เป็นเกณฑ์ที่ CIT24 ใช้กับ ม.67 ทวิ (1): ถ้าประมาณการครึ่งปีต่ำกว่าภาษีที่คาดเกิน 25% โดยไม่มีเหตุอันสมควร มีเงินเพิ่มร้อยละ 20 ของส่วนขาด วิธี (2) ไม่อยู่ในเกณฑ์นี้",
    {
      ruleIds: ["RULE-67B-51"],
      pages: ["/pnd51"],
      engineHooks: ["lib/engine.ts simulatePnd51"],
    },
    { legalUrl: P51 },
  ),
];

const KIND_PREFIX: Record<CorpusKind, string> = {
  statute: "RC",
  "royal-decree": "RD",
  "ministerial-reg": "MR",
  TAS: "TAS",
  TFRIC: "TFRIC",
  "department-ruling": "RDGO",
  treaty: "TRY",
};

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function isCorpusStale(status: CorpusStatus) {
  return status === "obsolete" || status === "superseded";
}

export function isCorpusActive(status: CorpusStatus) {
  return status === "in-force" || status === "amended";
}

export function applyCorpusPatch(row: CorpusInstrument, patch?: CorpusPatch): CorpusInstrument {
  if (!patch) return row;
  const status = patch.status ?? row.status;
  const supersededBy = patch.supersededBy === null
    ? undefined
    : (patch.supersededBy !== undefined ? patch.supersededBy : row.supersededBy);
  const obsoleteNote = patch.obsoleteNote === null
    ? undefined
    : (patch.obsoleteNote !== undefined ? patch.obsoleteNote : row.obsoleteNote);
  return {
    ...row,
    status,
    lastReviewed: patch.lastReviewed ?? row.lastReviewed,
    supersededBy,
    obsoleteNote,
  };
}

export function resolveCorpus(extra: CorpusInstrument[], patches: Record<string, CorpusPatch>): CorpusInstrument[] {
  return CORPUS_SEED.concat(extra).map((row) => applyCorpusPatch(row, patches[row.id]));
}

export function linkedRules(inst: CorpusInstrument, rules: CitRule[] = RULES): CitRule[] {
  const ids = new Set([
    ...inst.cit24Use.ruleIds,
    ...rules.filter((r) => r.corpusId === inst.id).map((r) => r.id),
  ]);
  return rules.filter((r) => ids.has(r.id));
}

export function corpusForRule(rule: Pick<CitRule, "corpusId">, list: CorpusInstrument[]): CorpusInstrument | undefined {
  return list.find((c) => c.id === rule.corpusId);
}

export function corpusStats(list: CorpusInstrument[]) {
  const stale = list.filter((c) => isCorpusStale(c.status)).length;
  const active = list.filter((c) => isCorpusActive(c.status)).length;
  return { total: list.length, stale, active, obsolete: stale };
}

export function corpusForLawMode(list: CorpusInstrument[], mode: LawMode): CorpusInstrument[] {
  if (mode === "complex") return list;
  return list.filter((c) => c.bar === "compliance" && isCorpusActive(c.status));
}

export function mintCorpusId(kind: CorpusKind, cite: string, used: Set<string>): string {
  const slug = cite.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 18) || "NEW";
  let id = `${KIND_PREFIX[kind]}-${slug}`;
  let n = 2;
  while (used.has(id)) id = `${KIND_PREFIX[kind]}-${slug}-${n++}`;
  return id;
}

export function corpusStatusCls(status: CorpusStatus) {
  if (status === "in-force") return "tag tag-ok";
  if (status === "amended") return "tag tag-accent";
  if (status === "obsolete") return "tag tag-warn";
  return "tag tag-outline";
}

export function kindLabel(kind: CorpusKind, lang: "en" | "th" | "zh" | "ja") {
  const row = CORPUS_KINDS.find((k) => k.id === kind);
  if (!row) return kind;
  if (lang === "th") return row.th;
  if (lang === "zh") return row.zh;
  if (lang === "ja") return row.ja;
  return row.en;
}

export function statusLabel(status: CorpusStatus, lang: "en" | "th" | "zh" | "ja") {
  const row = CORPUS_STATUSES.find((s) => s.id === status);
  if (!row) return status;
  if (lang === "th") return row.th;
  if (lang === "zh") return row.zh;
  if (lang === "ja") return row.ja;
  return row.en;
}
