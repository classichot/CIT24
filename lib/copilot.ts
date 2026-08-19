import { ADJUSTMENTS } from "./model";
import { RULES } from "./rules";
import { ENGINE_VERSION, type Provision, type Pnd51Sim } from "./engine";
import { F } from "./format";

export type CopilotMsg = {
  role: "user" | "assistant";
  text: string;
  cites?: { label: string; href?: string }[];
};

export const SUGGESTIONS = [
  "Why is entertainment added back?",
  "Will PND51 attract a surcharge?",
  "Which reversals are due this year?",
];

export function answerCopilot(q: string, p: Provision, sim: Pnd51Sim): CopilotMsg {
  const t = q.toLowerCase();

  if (/entertain|รับรอง|65 ter \(4\)|65t-04/.test(t)) {
    const a = ADJUSTMENTS.find((x) => x.id === "ADJ-2026-0041")!;
    return {
      role: "assistant",
      text: `Entertainment is a permanent add-back under section 65 ter (4).\n\nGross revenue 1,240,000,000 × 0.3% = deductible ceiling 3,720,000.\nRecorded in 6210-00: ${F(a.acctAmt)}.\nExcess added back: ${F(a.adjAmt)} · tax at 20% ${F(Math.round(a.adjAmt * 0.2))}.\n\nI proposed the detection. The deterministic engine (CIT24-CALC ${ENGINE_VERSION}) posted the number after human approval. I cannot change an approved adjustment.`,
      cites: [
        { label: "ADJ-2026-0041", href: "/ledger" },
        { label: "RULE-65T-04 v3", href: "/rules" },
        { label: "s.65 ter guidance", href: "https://www.rd.go.th/827.html" },
      ],
    };
  }

  if (/51|surcharge|25%|ประมาณการ|ภ\.ง\.ด\.51|penalty/.test(t)) {
    return {
      role: "assistant",
      text: `PND51 uses section 67 bis (1) for this entity — estimated annual profit, half payable by 31 Aug 2026.\n\nProjected taxable profit ${F(sim.taxable)}.\n75% floor ${F(sim.floor)}.\nHalf-year tax on the projection ${F(sim.halfProj)} versus declared half-year ${F(sim.halfDec)}.\nUnderstatement ${sim.shortPct.toFixed(1)}%.\n${sim.breach ? `This estimate breaches the 25% test. 20% surcharge exposure ${F(sim.surcharge)}. Recommended defensible estimate ${F(sim.recommended)}.` : "The declared estimate sits above the 75% floor. Keep the assumption file current."}\n\nI explain the test. The engine calculates the surcharge. I cannot submit the return.`,
      cites: [
        { label: "PND51 simulator", href: "/pnd51" },
        { label: "Order ป.50/2537", href: "https://www.rd.go.th/3597.html" },
        { label: "s.67 bis", href: "https://www.rd.go.th/5939.html" },
      ],
    };
  }

  if (/revers|กลับรายการ|guardian|bonus|warranty/.test(t)) {
    return {
      role: "assistant",
      text: `Reversal Guardian is watching temporary add-backs from prior years.\n\n• Accrued bonus FY2025 2,200,000 — paid 14 Mar 2026 — deducted in FY2026 (ADJ-2026-0044).\n• Warranty FY2024 900,000 — utilised in FY2025 but never claimed — action needed.\n• Inventory provision FY2026 3,250,000 — reverses only on documented scrapping.\n\nThis is Corporate Tax Memory plus the ledger. I recommend. A reviewer posts.`,
      cites: [
        { label: "Reversal Guardian", href: "/deferred" },
        { label: "Tax Adjustment Ledger", href: "/ledger" },
      ],
    };
  }

  if (/taxable|provision|กำไรสุทธิ|current tax|etr/.test(t)) {
    return {
      role: "assistant",
      text: `Current-tax position (engine ${ENGINE_VERSION}):\n\nAccounting profit ${F(p.accountingProfit)}\n+ add-backs ${F(p.addBacks)}\n− deductions ${F(Math.abs(p.deductions))}\n= adjusted ${F(p.adjustedProfit)}\n− losses ${F(p.losses)}\n= taxable profit ${F(p.taxableProfit)}\n× 20% = current tax ${F(p.currentTax)}\n− PND51 ${F(p.pnd51Credit)} − WHT ${F(p.whtCredit)}\n= payable ${F(p.payable)}\nETR ${ (p.etr * 100).toFixed(2) }% versus statutory 20% — the gap is permanent items.\n\nClick any amount in Current tax for the full trail: return field → computation → adjustment → GL → evidence → rule → approval.`,
      cites: [
        { label: "Current tax", href: "/provision" },
        { label: "PND50", href: "/pnd50" },
        { label: "CIT24-CALC " + ENGINE_VERSION },
      ],
    };
  }

  if (/tp24|related.party|management fee|71 bis/.test(t)) {
    return {
      role: "assistant",
      text: `ADJ-2026-0051 is a transfer-pricing add-back sourced from TP24, not invented by CIT24.\n\nRelated-party management fee 18,400,000 versus TP24 median range 14,100,000. Excess 4,300,000 is a permanent add-back under s.71 bis. Status: in review. I cannot select the legal position — the tax reviewer must confirm.`,
      cites: [
        { label: "ADJ-2026-0051", href: "/ledger" },
        { label: "RULE-TP-71B", href: "/rules" },
        { label: "Ecosystem", href: "/ecosystem" },
      ],
    };
  }

  if (/memory|prior year|ปีก่อน|treatment changed/.test(t)) {
    return {
      role: "assistant",
      text: `Corporate Tax Memory compares FY2025 and FY2026 treatment by account.\n\nChanged this year:\n• 6810-00 Bad debts — deducted last year; this year added back (legal action missing).\n• 6150-00 Management fee — accepted in full last year; TP24 now proposes 4,300,000 excess.\n\nUnchanged: entertainment ceiling, accrued bonus pattern, exempt dividends.\n\nThis is why CIT24 is an operating system, not a form generator.`,
      cites: [{ label: "Corporate Tax Memory", href: "/memory" }],
    };
  }

  const rule = RULES.find((r) => t.includes(r.id.toLowerCase()) || t.includes(r.sec.toLowerCase().replace(/\s/g, "")));
  if (rule) {
    return {
      role: "assistant",
      text: `${rule.id} ${rule.version} · ${rule.sec} · effective ${rule.effective}.\n\n${rule.logic}\n\nRequired evidence: ${rule.evidence}\nTest cases ${rule.tests}. I retrieve the rule. I do not change the rule version.`,
      cites: [{ label: rule.id, href: "/rules" }, { label: rule.sec, href: rule.legalUrl }],
    };
  }

  return {
    role: "assistant",
    text: `CIT24 answers from the approved ledger and the versioned Thai CIT rule pack — not from general model memory.\n\nThis snapshot: taxable profit ${F(p.taxableProfit)}, current tax ${F(p.currentTax)}, payable ${F(p.payable)}.\n${ADJUSTMENTS.length} adjustments in the ledger. AI proposes and explains. The deterministic engine calculates. Nothing posts, files or changes a rule without a human.\n\nAsk about an adjustment, PND51 surcharge risk, a reversal, or a section 65 ter rule.`,
    cites: [
      { label: "Ledger", href: "/ledger" },
      { label: "Rule library", href: "/rules" },
      { label: "CIT24-CALC " + ENGINE_VERSION },
    ],
  };
}
