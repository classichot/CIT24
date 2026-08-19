import type { Adjustment, Lang } from "./model";
import type { Provision } from "./engine";
import type { LossYear, WhtCert } from "./close";
import type { FarLine } from "./far";
import { FAR_CLASS_LABEL, farAssetName, farTotals } from "./far";
import { F } from "./format";

type Copy = { en: string; th: string; zh?: string; ja?: string };

function pick(lang: Lang, o: Copy): string {
  if (lang === "th") return o.th;
  if (lang === "zh") return o.zh ?? o.en;
  if (lang === "ja") return o.ja ?? o.en;
  return o.en;
}

export type WorkpaperId = "btt" | "ledger" | "far" | "losses" | "wht" | "pnd50" | "provision" | "etr" | "roll" | "tas12" | "taxbase" | "gmt24";

export type Workpaper = {
  id: WorkpaperId;
  href: string;
  title: Copy;
  columns: Copy[];
  rows: string[][];
  note?: Copy;
};

function nameOf(lang: Lang, a: Adjustment) {
  return lang === "th" ? a.nameTh : a.name;
}

export function catalog(): { id: WorkpaperId; href: string; title: Copy }[] {
  return [
    { id: "btt", href: "/provision", title: { en: "Book-to-tax reconciliation", th: "กระทบยอดกำไรบัญชีเป็นกำไรภาษี", zh: "账面利润与应税利润调节", ja: "会計利益と課税所得の調整" } },
    { id: "ledger", href: "/ledger", title: { en: "Tax-adjustment register", th: "ทะเบียนรายการปรับปรุงภาษี", zh: "纳税调整登记簿", ja: "税務調整台帳" } },
    { id: "roll", href: "/deferred", title: { en: "Temporary-difference movement", th: "ตารางเคลื่อนไหวผลต่างชั่วคราว", zh: "暂时性差异滚动表", ja: "一時差異ロールフォワード" } },
    { id: "provision", href: "/provision", title: { en: "Current-tax provision", th: "ประมาณการภาษีงวดปัจจุบัน", zh: "当期所得税准备", ja: "当期税金引当" } },
    { id: "etr", href: "/provision", title: { en: "ETR reconciliation", th: "กระทบยอดอัตราภาษีที่แท้จริง", zh: "有效税率调节", ja: "実効税率調整" } },
    { id: "losses", href: "/losses", title: { en: "Tax-loss schedule", th: "ตารางผลขาดทุน", zh: "税务亏损明细", ja: "欠損金スケジュール" } },
    { id: "far", href: "/far", title: { en: "Fixed-asset tax depreciation", th: "ค่าเสื่อมราคาทางภาษี", zh: "固定资产税务折旧", ja: "固定資産税務減価償却" } },
    { id: "wht", href: "/data", title: { en: "Withholding-tax credit reconciliation", th: "กระทบยอดเครดิตภาษีหัก ณ ที่จ่าย", zh: "预提所得税抵免调节", ja: "源泉税額控除の突合" } },
    { id: "pnd50", href: "/pnd50", title: { en: "PND50 tax computation", th: "การคำนวณ ภ.ง.ด.50", zh: "PND50 税额计算", ja: "PND50 税額計算" } },
    { id: "tas12", href: "/disclosure", title: { en: "TAS 12 disclosure note", th: "หมายเหตุ ต.บ. 12", zh: "TAS 12 附注", ja: "TAS 12注記" } },
    { id: "taxbase", href: "/deferred", title: { en: "Tax-base register", th: "ทะเบียนฐานภาษี", zh: "计税基础台账", ja: "税務簿価台帳" } },
    { id: "gmt24", href: "/ecosystem", title: { en: "GMT24 covered-tax feed", th: "ข้อมูลภาษีครอบคลุมสำหรับ GMT24", zh: "GMT24 覆盖税数据", ja: "GMT24対象税フィード" } },
  ];
}

export function buildWorkpaper(
  id: WorkpaperId,
  lang: Lang,
  ctx: {
    adjustments: Adjustment[];
    provision: Provision;
    losses: (LossYear & { available: number; utilised: number; remaining: number })[];
    certs: WhtCert[];
    farLines: FarLine[];
  },
): Workpaper {
  const { adjustments: adjs, provision: p, losses, certs, farLines } = ctx;
  const meta = catalog().find((c) => c.id === id)!;

  if (id === "btt") {
    const rows: string[][] = [
      [pick(lang, { en: "Accounting profit before tax", th: "กำไรก่อนภาษีทางบัญชี", zh: "税前会计利润", ja: "税引前会計利益" }), "TB / FS", F(p.accountingProfit)],
      ...adjs.filter((a) => a.adjAmt > 0).map((a) => [nameOf(lang, a), `${a.sec} · ${a.id}`, F(a.adjAmt)]),
      [pick(lang, { en: "Total add-backs", th: "รวมบวกกลับ", zh: "调增合计", ja: "加算合計" }), "", F(p.addBacks)],
      ...adjs.filter((a) => a.adjAmt < 0).map((a) => [nameOf(lang, a), `${a.origin} · ${a.id}`, F(a.adjAmt)]),
      [pick(lang, { en: "Total deductions", th: "รวมรายการหัก", zh: "调减合计", ja: "減算合計" }), "", F(p.deductions)],
      [pick(lang, { en: "Adjusted profit", th: "กำไรหลังปรับปรุง", zh: "调整后利润", ja: "調整後利益" }), "", F(p.adjustedProfit)],
      [pick(lang, { en: "Tax losses utilised", th: "ผลขาดทุนที่ใช้", zh: "已用税务亏损", ja: "欠損金使用" }), "s.65 FIFO", F(-p.losses)],
      [pick(lang, { en: "Taxable profit", th: "กำไรสุทธิทางภาษี", zh: "应税所得", ja: "課税所得" }), "CIT24-CALC 2026.2", F(p.taxableProfit)],
      [pick(lang, { en: "Corporate income tax at 20%", th: "ภาษีเงินได้นิติบุคคล 20%", zh: "企业所得税 20%", ja: "法人税 20%" }), "s.65", F(p.currentTax)],
    ];
    return { ...meta, columns: cols3(lang), rows };
  }

  if (id === "ledger") {
    return {
      ...meta,
      columns: [
        { en: "ID", th: "รหัส", zh: "编号", ja: "ID" },
        { en: "Adjustment", th: "รายการ", zh: "调整项目", ja: "調整項目" },
        { en: "GL", th: "บัญชี", zh: "科目", ja: "勘定" },
        { en: "P/T", th: "P/T", zh: "永久/暂时", ja: "永久/一時" },
        { en: "Amount", th: "จำนวน", zh: "金额", ja: "金額" },
        { en: "Status", th: "สถานะ", zh: "状态", ja: "ステータス" },
        { en: "Section", th: "มาตรา", zh: "条文", ja: "条文" },
      ],
      rows: adjs.map((a) => [a.id, nameOf(lang, a), a.gl, a.pt, F(a.adjAmt), a.status, a.sec]),
    };
  }

  if (id === "far") {
    const t = farTotals(farLines);
    return {
      ...meta,
      columns: [
        { en: "Asset", th: "สินทรัพย์", zh: "资产", ja: "資産" },
        { en: "Class", th: "ประเภท", zh: "类别", ja: "区分" },
        { en: "Cost", th: "ต้นทุน", zh: "原值", ja: "取得原価" },
        { en: "Book dep.", th: "เสื่อมบัญชี", zh: "会计折旧", ja: "会計償却" },
        { en: "Tax dep.", th: "เสื่อมภาษี", zh: "税务折旧", ja: "税務償却" },
        { en: "Excess", th: "ส่วนเกิน", zh: "超额", ja: "超過" },
        { en: "Catch-up", th: "ตามจับปีก่อน", zh: "以前年度补提", ja: "過年度キャッチアップ" },
      ],
      rows: [
        ...farLines.map((r) => [
          `${r.id} ${farAssetName(r, lang)}`,
          pick(lang, FAR_CLASS_LABEL[r.cls]),
          F(r.cost),
          F(r.bookDep),
          F(r.taxDep),
          F(r.excess, true),
          F(r.priorCatchUp, true),
        ]),
        [pick(lang, { en: "Total", th: "รวม", zh: "合计", ja: "合計" }), "", "", F(t.bookDep), F(t.taxDep), F(t.excess), F(t.catchUp)],
      ],
      note: { en: "ADJ-2026-0045 add-back equals excess. Catch-up is tracked on the tax-base register.", th: "ADJ-2026-0045 เท่ากับส่วนเกิน รายการตามจับอยู่ในทะเบียนฐานภาษี", zh: "ADJ-2026-0045 调增等于超额折旧。补提记在税基台账。", ja: "ADJ-2026-0045の加算は超過額。キャッチアップは税務簿価台帳で管理。" },
    };
  }

  if (id === "losses") {
    return {
      ...meta,
      columns: [
        { en: "Year of origin", th: "ปีที่เกิด", zh: "发生年度", ja: "発生年度" },
        { en: "Origin", th: "ยอดเกิด", zh: "发生额", ja: "発生額" },
        { en: "Used prior", th: "ใช้ปีก่อน", zh: "以前已用", ja: "過年度使用" },
        { en: "Available", th: "ยกมา", zh: "可用", ja: "使用可能" },
        { en: "Used FY2026", th: "ใช้ปี 2569", zh: "2026年使用", ja: "FY2026使用" },
        { en: "Remaining", th: "ยกไป", zh: "结转", ja: "繰越" },
        { en: "Expires", th: "หมดอายุ", zh: "到期", ja: "期限" },
      ],
      rows: losses.map((y) => [y.fy, F(y.origin, true), F(y.utilisedPrior, true), F(y.available, true), F(y.utilised, true), F(y.remaining, true), y.expires]),
    };
  }

  if (id === "wht") {
    return {
      ...meta,
      columns: [
        { en: "Certificate", th: "ใบรับรอง", zh: "完税凭证", ja: "証明書" },
        { en: "Payer", th: "ผู้จ่าย", zh: "支付方", ja: "支払者" },
        { en: "Date", th: "วันที่", zh: "日期", ja: "日付" },
        { en: "Amount", th: "จำนวน", zh: "金额", ja: "金額" },
        { en: "Matched", th: "จับคู่", zh: "已匹配", ja: "突合" },
        { en: "GL", th: "บัญชี", zh: "科目", ja: "勘定" },
      ],
      rows: certs.map((c) => [
        c.id,
        c.payer,
        c.date,
        F(c.amount),
        c.matched ? pick(lang, { en: "Matched", th: "จับคู่แล้ว", zh: "已匹配", ja: "突合済" }) : pick(lang, { en: "Unmatched", th: "ยังไม่จับคู่", zh: "未匹配", ja: "未突合" }),
        c.gl ?? "—",
      ]),
      note: { en: `Withholding credit in the provision: ${F(p.whtCredit)}`, th: `เครดิตหัก ณ ที่จ่ายในประมาณการ: ${F(p.whtCredit)}`, zh: `准备中的预提税抵免：${F(p.whtCredit)}`, ja: `引当に含まれる源泉税額控除：${F(p.whtCredit)}` },
    };
  }

  if (id === "pnd50") {
    return {
      ...meta,
      columns: cols3(lang),
      rows: [
        [pick(lang, { en: "Part 1 · accounting profit", th: "ส่วน 1 · กำไรทางบัญชี", zh: "第1部分 · 会计利润", ja: "第1部 · 会計利益" }), "TB / FS", F(p.accountingProfit)],
        [pick(lang, { en: "Part 3 · add-backs", th: "ส่วน 3 · บวกกลับ", zh: "第3部分 · 调增", ja: "第3部 · 加算" }), "Ledger", F(p.addBacks)],
        [pick(lang, { en: "Part 3 · deductions", th: "ส่วน 3 · หัก", zh: "第3部分 · 调减", ja: "第3部 · 減算" }), "Reversals / exempt", F(p.deductions)],
        [pick(lang, { en: "Part 3 · tax losses", th: "ส่วน 3 · ผลขาดทุน", zh: "第3部分 · 亏损", ja: "第3部 · 欠損金" }), "s.65 FIFO", F(-p.losses)],
        [pick(lang, { en: "Part 4 · taxable profit", th: "ส่วน 4 · กำไรทางภาษี", zh: "第4部分 · 应税所得", ja: "第4部 · 課税所得" }), "CIT24-CALC", F(p.taxableProfit)],
        [pick(lang, { en: "Part 4 · tax at 20%", th: "ส่วน 4 · ภาษี 20%", zh: "第4部分 · 税率20%", ja: "第4部 · 税率20%" }), "s.65", F(p.currentTax)],
        [pick(lang, { en: "Credit · PND51", th: "เครดิต · ภ.ง.ด.51", zh: "抵免 · PND51", ja: "控除 · PND51" }), "s.67 bis", F(-p.pnd51Credit)],
        [pick(lang, { en: "Credit · WHT", th: "เครดิต · หัก ณ ที่จ่าย", zh: "抵免 · 预提税", ja: "控除 · 源泉税" }), "Matched certs", F(-p.whtCredit)],
        [pick(lang, { en: "Tax payable", th: "ภาษีที่ต้องชำระ", zh: "应纳税额", ja: "納付税額" }), "PND50", F(p.payable)],
      ],
    };
  }

  if (id === "provision") {
    return {
      ...meta,
      columns: cols3(lang),
      rows: [
        [pick(lang, { en: "Taxable profit", th: "กำไรสุทธิทางภาษี", zh: "应税所得", ja: "課税所得" }), "Engine", F(p.taxableProfit)],
        [pick(lang, { en: "Current tax 20%", th: "ภาษีงวดปัจจุบัน 20%", zh: "当期税 20%", ja: "当期税 20%" }), "s.65", F(p.currentTax)],
        [pick(lang, { en: "PND51 credit", th: "เครดิต ภ.ง.ด.51", zh: "PND51 抵免", ja: "PND51控除" }), "", F(-p.pnd51Credit)],
        [pick(lang, { en: "WHT credit", th: "เครดิตหัก ณ ที่จ่าย", zh: "预提税抵免", ja: "源泉税控除" }), "", F(-p.whtCredit)],
        [pick(lang, { en: "Payable", th: "ต้องชำระ", zh: "应付", ja: "納付額" }), "", F(p.payable)],
        [pick(lang, { en: "Permanent differences", th: "ผลต่างถาวร", zh: "永久性差异", ja: "永久差異" }), "", F(p.permanent)],
        [pick(lang, { en: "Temporary differences", th: "ผลต่างชั่วคราว", zh: "暂时性差异", ja: "一時差異" }), "", F(p.temporary)],
        [pick(lang, { en: "Deferred tax asset recognised", th: "DTA ที่รับรู้", zh: "已确认递延所得税资产", ja: "認識済DTA" }), "TAS 12", F(p.dta)],
        [pick(lang, { en: "Deferred tax liability recognised", th: "DTL ที่รับรู้", zh: "已确认递延所得税负债", ja: "認識済DTL" }), "TAS 12", F(p.dtl)],
        [pick(lang, { en: "Deferred tax expense", th: "ค่าใช้จ่ายภาษีรอตัดบัญชี", zh: "递延所得税费用", ja: "繰延税金費用" }), "TAS 12", F(p.dtExpense)],
        [pick(lang, { en: "Income tax expense", th: "ค่าใช้จ่ายภาษีรวม", zh: "所得税费用", ja: "税金費用" }), "Current + deferred", F(p.taxExpense)],
      ],
    };
  }

  if (id === "etr") {
    const statutory = p.accountingProfit * 0.2;
    return {
      ...meta,
      columns: cols3(lang),
      rows: [
        [pick(lang, { en: "Tax at statutory 20%", th: "ภาษีที่อัตรา 20%", zh: "法定税率20%税额", ja: "法定税率20%の税額" }), F(p.accountingProfit), F(statutory)],
        [pick(lang, { en: "Permanent items × 20%", th: "รายการถาวร × 20%", zh: "永久性项目 × 20%", ja: "永久項目 × 20%" }), F(p.permanent), F(Math.round(p.permanent * 0.2))],
        [pick(lang, { en: "Current tax", th: "ภาษีงวดปัจจุบัน", zh: "当期税", ja: "当期税" }), "", F(p.currentTax)],
        [pick(lang, { en: "Effective tax rate", th: "อัตราภาษีที่แท้จริง", zh: "有效税率", ja: "実効税率" }), "", `${(p.etr * 100).toFixed(2)}%`],
      ],
    };
  }

  if (id === "tas12") {
    const t = p.tas12;
    return {
      ...meta,
      columns: cols3(lang),
      rows: [
        [pick(lang, { en: "Current tax — Thai CIT", th: "ภาษีงวดปัจจุบัน", zh: "当期税", ja: "当期税" }), "s.65", F(p.currentTax)],
        [pick(lang, { en: "Current tax — Pillar Two", th: "ภาษีเสาหลักสอง", zh: "第二支柱当期税", ja: "ピラー2当期税" }), "GMT24", F(t.pillarTwo.currentTax, true)],
        [pick(lang, { en: "Deferred tax expense", th: "ภาษีรอตัดบัญชี", zh: "递延税", ja: "繰延税金" }), `${(t.rate * 100).toFixed(0)}%`, F(t.dtExpense)],
        [pick(lang, { en: "Income tax expense", th: "ค่าใช้จ่ายภาษี", zh: "所得税费用", ja: "税金費用" }), "", F(t.taxExpense)],
        [pick(lang, { en: "DTA recognised", th: "DTA ที่รับรู้", zh: "已确认DTA", ja: "認識DTA" }), "", F(t.dtaRecognised)],
        [pick(lang, { en: "DTL recognised", th: "DTL ที่รับรู้", zh: "已确认DTL", ja: "認識DTL" }), "", F(t.dtlRecognised)],
        [pick(lang, { en: "Unrecognised DT", th: "ไม่รับรู้", zh: "未确认", ja: "未認識" }), "Exceptions", F(t.unrecognisedDta + t.unrecognisedDtl)],
        [pick(lang, { en: "Unused tax credit DTA", th: "DTA จากเครดิตที่ยังไม่ใช้", zh: "未用抵免DTA", ja: "未使用税額控除DTA" }), "s.60", F(t.creditDt)],
      ],
      note: t.enabled
        ? undefined
        : { en: "TAS 12 deferred tax is off — no DTA/DTL booked. Current tax, PND50 and ETR are unchanged.", th: "ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิด — ไม่บันทึก DTA/DTL ภาษีงวดปัจจุบัน ภ.ง.ด.50 และ ETR ไม่เปลี่ยน", zh: "TAS 12递延税已关闭，未入账DTA/DTL。", ja: "TAS 12繰延税金はオフ。DTA/DTLは計上していません。" },
    };
  }

  if (id === "gmt24") {
    const t = p.tas12;
    return {
      ...meta,
      columns: cols3(lang),
      rows: [
        ["currentTaxThai", "CIT24-CALC", F(p.currentTax)],
        ["deferredTaxDomestic", "TAS 12", F(t.dtExpense)],
        ["deferredIncludesPillarTwo", "", "false"],
        ["pillarTwoException", "TAS 12", "true"],
        ["pillarTwoCurrentTax", "GMT24", F(t.pillarTwo.currentTax, true)],
        ["pillarTwoInScope", "", String(t.pillarTwo.inScope)],
        ["whtCredit", "Matched certs", F(p.whtCredit)],
      ],
      note: { en: t.pillarTwo.exception, th: t.pillarTwo.exception, zh: t.pillarTwo.exception, ja: t.pillarTwo.exception },
    };
  }

  if (id === "taxbase") {
    const t = p.tas12;
    return {
      ...meta,
      columns: [
        { en: "Item", th: "รายการ", zh: "项目", ja: "項目" },
        { en: "Carrying amount", th: "มูลค่าตามบัญชี", zh: "账面价值", ja: "帳簿価額" },
        { en: "Tax base", th: "ฐานภาษี", zh: "计税基础", ja: "税務基準" },
        { en: "Temporary difference", th: "ผลต่างชั่วคราว", zh: "暂时性差异", ja: "一時差異" },
        { en: "Kind", th: "ประเภท", zh: "类型", ja: "区分" },
        { en: "Recognised DT", th: "DT ที่รับรู้", zh: "已确认递延税", ja: "認識済DT" },
      ],
      rows: t.lines.map((l) => [
        lang === "th" ? l.nameTh : l.name,
        l.id === "TB-PPE" ? "—" : F(l.carrying),
        F(l.taxBase, l.id !== "TB-PPE"),
        F(l.close),
        l.kind,
        F(l.recognised, true),
      ]),
      note: t.enabled
        ? undefined
        : { en: "TAS 12 deferred tax is off — carrying vs tax base is not booked as DTA/DTL.", th: "ภาษีรอตัดบัญชีตาม ต.บ. 12 ปิด — ไม่บันทึก DTA/DTL", zh: "TAS 12已关闭，未入账DTA/DTL。", ja: "TAS 12オフのためDTA/DTLは計上していません。" },
    };
  }

  const t = p.tas12;
  return {
    ...meta,
    columns: [
      { en: "Item", th: "รายการ", zh: "项目", ja: "項目" },
      { en: "Opening", th: "ยกมา", zh: "期初", ja: "期首" },
      { en: "Additions", th: "เพิ่มขึ้น", zh: "增加", ja: "増加" },
      { en: "Reversals", th: "กลับรายการ", zh: "转回", ja: "戻入" },
      { en: "Closing", th: "ยกไป", zh: "期末", ja: "期末" },
      { en: "Kind", th: "ประเภท", zh: "类型", ja: "区分" },
      { en: "Expected", th: "คาดว่าจะกลับ", zh: "预计转回", ja: "戻入見込" },
    ],
    rows: t.lines.filter((l) => l.origin === "temporary").map((r) => [
      lang === "th" ? r.nameTh : r.name,
      F(r.open),
      F(r.add),
      F(r.rev),
      F(r.close),
      r.kind,
      r.when,
    ]),
  };
}

function cols3(lang: Lang): Copy[] {
  void lang;
  return [
    { en: "Line", th: "รายการ", zh: "项目", ja: "項目" },
    { en: "Basis", th: "ฐาน", zh: "依据", ja: "根拠" },
    { en: "THB", th: "บาท", zh: "泰铢", ja: "THB" },
  ];
}

export function downloadCsv(filename: string, columns: string[], rows: string[][]) {
  const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
  const body = [columns, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
