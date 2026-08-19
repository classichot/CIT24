import type { Risk, TaxRule } from "./model";

export type RuleFamily = "65ter" | "65bis" | "rate" | "credit" | "filing" | "asset" | "tp" | "boi";

export type CitRule = TaxRule & {
  family: RuleFamily;
  formula?: string;
};

function R(
  id: string,
  name: string,
  sec: string,
  family: RuleFamily,
  risk: Risk,
  logic: string,
  evidence: string,
  extra?: Partial<CitRule>,
): CitRule {
  return {
    id, name, sec, family, risk, logic, evidence,
    version: extra?.version ?? "v2",
    effective: extra?.effective ?? "01 Jan 2023",
    clients: extra?.clients ?? 8,
    tests: extra?.tests ?? "8 / 8",
    legalUrl: extra?.legalUrl ?? "https://www.rd.go.th/827.html",
    formula: extra?.formula,
  };
}

const TER = "https://www.rd.go.th/827.html";
const RC = "https://www.rd.go.th/5939.html";

export const RULES: CitRule[] = [
  R("RULE-65T-01", "Reserves and provisions not yet incurred", "s.65 ter (1)", "65ter", "Medium", "Provisions, reserves and allowances are not deductible until the expense is actually incurred and determinable. Creates a temporary difference with a scheduled reversal.", "Provision movement, utilisation evidence", { formula: "add_back = provision_expense; reverse_on = utilisation", tests: "9 / 9" }),
  R("RULE-65T-02", "Capital expenditure claimed as expense", "s.65 ter (2)", "65ter", "Medium", "Expenditure that creates a lasting asset must be capitalised and depreciated under Royal Decree 145. Expensing in full is a permanent or temporary add-back depending on remaining tax base.", "Invoice, FAR coding, capitalisation memo", { legalUrl: RC }),
  R("RULE-DON-65T3", "Donations and public-charity deductions", "s.65 ter (3)", "65ter", "Low", "Public-charity donations are deductible up to 2% of net profit; education and sports donations follow their own limits. Excess is a permanent add-back.", "Receipts from approved organisations", { formula: "excess = max(0, donations - 0.02 * net_profit)", tests: "9 / 9" }),
  R("RULE-65T-04", "Entertainment expenses — statutory ceiling", "s.65 ter (4)", "65ter", "High", "Deductible entertainment is capped at 0.3% of gross revenue or paid-up capital, whichever is higher, and at THB 10,000,000 in total. The excess is a permanent add-back.", "Tax invoice, business-purpose note, attendee record", { version: "v3", effective: "01 Jan 2024", clients: 6, formula: "ceiling = min(10000000, max(0.003 * gross_revenue, 0.003 * paid_up_capital)); add_back = max(0, entertainment - ceiling)", tests: "12 / 12" }),
  R("RULE-65T-05", "Gifts and giveaways without business purpose", "s.65 ter (5)", "65ter", "Medium", "Gifts that are not exclusively for the purpose of the business are not deductible. Dealer gift vouchers and personal presents are added back unless a business-purpose file exists.", "Recipient list, purpose memo, tax invoice"),
  R("RULE-65T-06", "Fines, penalties and surcharges", "s.65 ter (6)", "65ter", "Low", "Fines, penalties and tax surcharges are not deductible. Permanent add-back in full.", "Assessment notice, payment evidence", { clients: 14, formula: "add_back = fines + penalties + tax_surcharges", tests: "8 / 8" }),
  R("RULE-65T-07", "Corporate income tax expense", "s.65 ter (7)", "65ter", "Low", "Corporate income tax itself is not a deductible expense in arriving at taxable profit. Book current-tax expense is added back in the computation (and is not a P/T difference in the ledger).", "Provision workpaper", { legalUrl: RC, formula: "add_back = current_tax_expense" }),
  R("RULE-65T-08", "Input VAT recorded as expense", "s.65 ter (8)", "65ter", "Low", "Output and recoverable input VAT are not deductible expenses. VAT posted to P&L in error is a permanent add-back.", "VAT return, GL analysis"),
  R("RULE-65T-09", "Accrued expenses without a fixed obligation", "s.65 ter (9)", "65ter", "Medium", "Accruals are deductible in the period the liability becomes fixed and determinable. Bonuses accrued but unpaid at year-end are added back and reversed on payment.", "Payroll register, board resolution, payment evidence", { formula: "add_back = unpaid_accrual; reverse_on = payment_date", tests: "7 / 7" }),
  R("RULE-65T-10", "Life and savings insurance premiums (restricted)", "s.65 ter (10)", "65ter", "Low", "Certain life and savings insurance premiums on directors or employees are not deductible unless they meet the prescribed welfare conditions.", "Policy schedule, welfare rules"),
  R("RULE-65T-11", "Employee welfare above prescribed limits", "s.65 ter (11)", "65ter", "Medium", "Medical, housing and other welfare above the statutory or ministerial limits is a permanent add-back. PIT24 may flag the employee-side benefit.", "Welfare policy, PIT24 extract", { clients: 9 }),
  R("RULE-65T-12", "Provident and pension fund contributions (excess)", "s.65 ter (12)", "65ter", "Low", "Employer contributions to a registered provident fund are deductible within the prescribed percentage of wages. Excess is permanent.", "Fund rules, contribution schedule"),
  R("RULE-65T-13", "Personal and non-business expenses", "s.65 ter (13)", "65ter", "Medium", "Private expenses of directors, shareholders or employees are not deductible. RISK24 detections are proposed, never posted.", "Expense analysis, business-purpose memo", { clients: 10, tests: "6 / 6" }),
  R("RULE-65T-14", "Foreign taxes treated as expense (wrong column)", "s.65 ter / s.60", "65ter", "Medium", "Foreign income tax should be claimed as a credit where a treaty or s.60 applies, not as a deduction, unless the taxpayer elects otherwise where permitted.", "Foreign tax receipts, treaty file", { legalUrl: RC }),
  R("RULE-65T-15", "Interest on late tax and RD assessments", "s.65 ter (15)", "65ter", "Low", "Interest paid to the Revenue Department on underpaid tax is not deductible. Distinct from commercial interest on working-capital loans.", "RD assessment, payment advice"),
  R("RULE-65T-16", "Loss on revaluation of assets (unrealised)", "s.65 ter / TAS", "65ter", "Medium", "Unrealised revaluation losses are not incurred for tax until realised. Temporary add-back until disposal.", "Valuation report, FAR"),
  R("RULE-65T-17", "Written-off assets without tax disposal", "s.65 ter", "65ter", "Medium", "Book write-off of PPE or intangibles is not a tax deduction unless the tax-base disposal conditions are met. Difference follows the tax-base register.", "Board write-off, FAR tax base", { legalUrl: RC }),
  R("RULE-65T-18", "Illegal or unsubstantiated payments", "s.65 ter", "65ter", "High", "Payments that are illegal, unsubstantiated or lacking a tax invoice (where required) are not deductible. RISK24 may originate the detection.", "Invoice, payment trail, purpose memo", { clients: 4 }),
  R("RULE-65T-19", "Related-party charges without service evidence", "s.65 ter / s.71 bis", "tp", "High", "Management fees, royalties and allocations without contemporaneous service evidence fail both deductibility and arm’s-length tests.", "Service report, timesheets, TP24 file", { legalUrl: RC, clients: 9 }),
  R("RULE-65T-20", "Private use of motor vehicles", "s.65 ter", "65ter", "Medium", "Passenger-car costs above the tax depreciation cap and private-use running costs are permanent add-backs. Logbooks support the business-use ratio.", "Vehicle log, FAR, fuel analysis", { legalUrl: RC }),
  R("RULE-65B-01", "Income not yet realised for tax", "s.65 / 65 bis", "65bis", "Medium", "Accounting revenue recognised on a percentage-of-completion or fair-value basis may be deferred for tax until the tax recognition event.", "Contract, billing schedule", { legalUrl: RC }),
  R("RULE-FX-65B5", "Foreign-exchange gains and losses", "s.65 bis (5)", "65bis", "Medium", "Unrealised differences on monetary items follow the prescribed rate basis; unrealised losses outside that basis are added back until settlement.", "Retranslation workpaper, BOT/RD rate", { legalUrl: RC, formula: "add_back = unrealised_fx_outside_prescribed_rate", tests: "6 / 6", clients: 7 }),
  R("RULE-65B-08", "Stock and WIP valuation differences", "s.65 bis", "65bis", "Medium", "Tax inventory follows cost. Accounting write-downs to NRV are non-deductible until the goods are sold or destroyed.", "Inventory ageing, destruction report", { legalUrl: RC }),
  R("RULE-EX-65B10", "Exempt dividend income", "s.65 bis (10)", "65bis", "Low", "Dividends from a promoted or qualifying Thai company may be exempt where ownership and holding-period conditions are met.", "Share register, BOI certificate, dividend voucher", { legalUrl: RC, tests: "5 / 5", clients: 7 }),
  R("RULE-65B-13", "Exempt income under other laws", "s.65 bis", "65bis", "Low", "Income specifically exempt under the Revenue Code or a special law is removed from taxable profit. Permanent deduction.", "Exemption instrument", { legalUrl: RC }),
  R("RULE-LOSS-65", "Tax-loss carry-forward and expiry", "s.65", "rate", "Medium", "Losses may be carried forward for five consecutive accounting periods and must be used in order of age. Expiry is tracked per period.", "Prior-year returns, loss schedule", { version: "v3", effective: "01 Jan 2024", legalUrl: RC, formula: "utilised = min(available_fifo, max(0, adjusted_profit))", tests: "10 / 10", clients: 12 }),
  R("RULE-DEP-145", "Depreciation — tax rate ceilings", "Royal Decree 145", "asset", "Low", "Tax depreciation is limited to the rates in Royal Decree 145. Accounting depreciation in excess is added back; catch-up is deducted when tax base remains.", "FAR with tax and book bases", { version: "v4", effective: "01 Jan 2025", legalUrl: RC, formula: "tax_dep = min(book_dep, cost * rd145_rate, remaining_tax_base); add_back = max(0, book_dep - tax_dep)", tests: "21 / 21", clients: 14 }),
  R("RULE-DEP-BLDG", "Buildings — 5% tax ceiling", "RD 145 s.4", "asset", "Low", "Permanent buildings: tax depreciation ceiling 5% per year on cost. Temporary buildings may use a higher rate where prescribed.", "Building cost, title, FAR", { legalUrl: RC, formula: "tax_dep = min(book_dep, 0.05 * cost)", version: "v4", effective: "01 Jan 2025" }),
  R("RULE-DEP-MCH", "Machinery and equipment — 20% ceiling", "RD 145 s.4", "asset", "Low", "Machinery, equipment and factory tools: tax ceiling 20% per year. Book rates above 20% create a temporary add-back.", "FAR class, commissioning date", { legalUrl: RC, formula: "tax_dep = min(book_dep, 0.20 * cost)", version: "v4", effective: "01 Jan 2025" }),
  R("RULE-DEP-VEH", "Motor vehicles — 20% and cost cap", "RD 145 s.4", "asset", "Medium", "Vehicles depreciate at a 20% tax ceiling. Passenger cars are often subject to an acquisition-cost cap; excess cost is never depreciated for tax.", "Logbook, invoice, FAR", { legalUrl: RC, version: "v4", effective: "01 Jan 2025", clients: 11 }),
  R("RULE-DEP-IT", "Computer hardware — 20% ceiling", "RD 145 s.4", "asset", "Low", "Computer hardware follows the 20% machinery ceiling unless a specific notification allows a shorter life. Software follows its own rules.", "IT register", { legalUrl: RC, version: "v4", effective: "01 Jan 2025" }),
  R("RULE-BD-186", "Bad debt write-off conditions", "Min. Reg. 186", "65ter", "High", "A write-off is deductible only where the prescribed collection steps for the debt size have been taken and documented before year-end.", "Demand letters, legal filings, debtor correspondence", { version: "v3", effective: "01 Jan 2024", legalUrl: RC, tests: "11 / 12", clients: 5 }),
  R("RULE-TP-71B", "Related-party pricing adjustment", "s.71 bis", "tp", "High", "Related-party charges must be at arm’s length. Amounts above the benchmarked range are treated as non-deductible, sourced from TP24.", "Benchmark study, intercompany agreement", { legalUrl: RC, tests: "8 / 8", clients: 9 }),
  R("RULE-TP-71T", "Transfer-pricing disclosure completeness", "s.71 ter", "tp", "High", "Failure to prepare or file the prescribed TP documentation is a compliance event. CIT24 flags missing TP24 packages; it does not calculate the penalty.", "TP24 local file, disclosure form", { legalUrl: RC, clients: 6 }),
  R("RULE-67B-51", "PND51 estimated annual profit", "s.67 bis (1)", "filing", "High", "Ordinary companies estimate annual profit and pay one half. Understatement of more than 25% without reasonable cause produces a 20% surcharge on the shortfall (Order ป.50/2537).", "Board budget, H1 accounts, assumption file", { version: "v3", effective: "01 Jan 2024", legalUrl: "https://www.rd.go.th/3597.html", formula: "surcharge = 0.20 * max(0, 0.5*tax(proj) - 0.5*tax(declared)) if declared < 0.75 * proj_taxable", tests: "9 / 9", clients: 14 }),
  R("RULE-67B-51B", "PND51 actual six-month method", "s.67 bis (2)", "filing", "High", "Listed companies, banks and specified financial businesses pay tax on actual net profit of the first six months. The 25% estimation test does not apply.", "H1 management accounts", { version: "v3", effective: "01 Jan 2024", legalUrl: RC, clients: 3 }),
  R("RULE-67-50", "PND50 annual return deadline", "s.68 / s.67", "filing", "Medium", "The annual return is generally due within 150 days after the accounting-period end. CIT24 tracks the deadline; it does not e-file.", "Year-end date, filing calendar", { legalUrl: "https://www.rd.go.th/840.html", clients: 14 }),
  R("RULE-RATE-20", "Standard corporate tax rate 20%", "s.65", "rate", "Low", "Ordinary companies are taxed at 20% of taxable profit unless an SME, BOI or other special rate applies.", "Rate-profile election", { legalUrl: RC, formula: "current_tax = 0.20 * taxable_profit", clients: 14 }),
  R("RULE-RATE-SME", "SME progressive rates", "RD / notification", "rate", "Medium", "Qualifying SMEs apply progressive bands on taxable profit. CIT24 uses the entity rate profile; it will not silently switch a normal company to SME.", "Paid-up capital, revenue test", { legalUrl: RC, clients: 5 }),
  R("RULE-WHT-CR", "Withholding-tax credit matching", "s.60 / s.3", "credit", "Medium", "WHT credits are allowed only where the certificate matches a GL receipt and the income was included. Unmatched certificates do not reduce payable.", "Certificates, GL 1150-00", { legalUrl: RC, formula: "wht_credit = sum(matched_certificates)", clients: 14, tests: "10 / 10" }),
  R("RULE-FTC", "Foreign-tax credit limitation", "s.60 / treaties", "credit", "Medium", "Foreign tax credit is limited to Thai tax on the foreign-source income. Excess credit is not refundable in the ordinary case.", "Foreign assessments, treaty article", { legalUrl: RC, clients: 4 }),
  R("RULE-PND51-CR", "PND51 payment credited on PND50", "s.67 bis", "credit", "Low", "Half-year tax paid with PND51 is credited against PND50 payable. True-up is a payment difference, not a P/T item.", "PND51 receipt", { legalUrl: RC, formula: "payable = current_tax - pnd51_paid - wht_credit", clients: 14 }),
  R("RULE-BOI-ALLOC", "BOI and non-BOI cost allocation", "BOI Act / RD", "boi", "High", "Shared costs are allocated between promoted and non-promoted activity on an approved, consistently applied basis. Exempt income is removed from taxable profit.", "BOI certificate, allocation memo", { version: "v1", effective: "01 Jan 2026", legalUrl: "https://www.rd.go.th/840.html", tests: "4 / 6", clients: 3 }),
  R("RULE-BOI-EX", "BOI-exempt profit computation", "BOI / s.65", "boi", "High", "Promoted-activity profit is exempt for the holiday period. CIT24 does not mix BOI and non-BOI tax bases in the MVP engine.", "Project P&L, BOI card", { legalUrl: "https://www.rd.go.th/840.html", clients: 3 }),
  R("RULE-INT-65", "Interest deductibility and thin capitalisation", "s.65 / notifications", "65ter", "Medium", "Commercial interest is deductible when incurred for the business. Related-party interest must also clear the arm’s-length and any thin-cap notification.", "Loan agreements, TP24", { legalUrl: RC, clients: 7 }),
  R("RULE-DIR-REM", "Directors’ remuneration", "s.65 ter", "65ter", "Medium", "Directors’ fees are deductible when paid or when a fixed obligation exists. PIT24 should confirm withholding on the individual.", "Board minutes, PIT24", { clients: 8 }),
  R("RULE-INV-OBS", "Inventory obsolescence and destruction", "s.65 ter (1)", "65ter", "Medium", "An obsolescence provision is not deductible until the goods are sold, scrapped or destroyed with a report. Reversal Guardian watches the disposal account.", "Ageing, destruction report", { formula: "add_back = inventory_provision; reverse_on = scrap_or_sale" }),
  R("RULE-AUDIT-ADJ", "Prior-period and audit adjustments", "s.65", "65bis", "Medium", "Audit adjustments after year-end follow their tax character: timing items reverse, permanent items stay. Import of the prior ledger preserves the trail.", "Signed audit entries, prior PND50", { legalUrl: RC, clients: 10 }),
];

export const RULE_FAMILIES: { id: RuleFamily; en: string; th: string; zh: string; ja: string }[] = [
  { id: "65ter", en: "s.65 ter deductions", th: "มาตรา 65 ตรี รายจ่าย", zh: "第65条之三 不得扣除", ja: "65条の3 損金不算入" },
  { id: "65bis", en: "s.65 bis income", th: "มาตรา 65 ทวิ รายได้", zh: "第65条之二 收入", ja: "65条の2 益金" },
  { id: "asset", en: "Tax depreciation", th: "ค่าเสื่อมราคาทางภาษี", zh: "税务折旧", ja: "税務減価償却" },
  { id: "rate", en: "Rates and losses", th: "อัตราและผลขาดทุน", zh: "税率与亏损", ja: "税率と欠損金" },
  { id: "credit", en: "Credits", th: "เครดิตภาษี", zh: "税收抵免", ja: "税額控除" },
  { id: "filing", en: "PND51 / PND50", th: "ภ.ง.ด.51 / ภ.ง.ด.50", zh: "PND51 / PND50", ja: "PND51 / PND50" },
  { id: "tp", en: "Transfer pricing", th: "ราคาโอน", zh: "转让定价", ja: "移転価格" },
  { id: "boi", en: "BOI", th: "BOI", zh: "BOI 投资促进", ja: "BOI" },
];
