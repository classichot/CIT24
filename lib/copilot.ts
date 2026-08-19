import { ADJUSTMENTS, type LawMode } from "./model";
import { rulesForLawMode } from "./rules";
import { ENGINE_VERSION, type Provision, type Pnd51Sim } from "./engine";
import { F } from "./format";
import {
  CORPUS_SEED,
  corpusForLawMode,
  corpusForRule,
  corpusStats,
  isCorpusStale,
  type CorpusInstrument,
} from "./corpus";
import { reviewRelatedLaws, type LawAlert } from "./lawReview";

export type CopilotMsg = {
  role: "user" | "assistant";
  text: string;
  cites?: { label: string; href?: string }[];
};

export const SUGGESTIONS = [
  "What law is CIT24 based on?",
  "Why is entertainment added back?",
  "Will PND51 attract a surcharge?",
  "Explain the latest law alerts",
];

export function copilotIntro(corpus: CorpusInstrument[] = CORPUS_SEED, lawMode: LawMode = "compliance"): CopilotMsg {
  const visible = corpusForLawMode(corpus, lawMode);
  const s = corpusStats(visible);
  const bar = lawMode === "compliance" ? "Compliance (acceptable filing bar)" : "Complex (full related law)";
  return {
    role: "assistant",
    text: lawMode === "compliance"
      ? `Ask CIT24. I am in ${bar}. I answer from the regulation corpus (${s.total} in-force instruments on this bar) and the approved Thai CIT rule pack — not from general model memory.\n\nI will not volunteer Pillar Two, TAS 12 DTL, TFRIC 23 or GMT24 unless you ask. ETR is always current tax ÷ PBT. I will not mark a regulation obsolete — that is a human action on the corpus page. Use Review related laws for alerts; I explain an alert after the deterministic review.`
      : `Ask CIT24. I am in ${bar}. I answer from the regulation corpus (${s.total} instruments, ${corpusStats(corpus).stale} obsolete) and the approved Thai CIT rule pack — not from general model memory.\n\nIf a cited instrument is obsolete or superseded, I will say so. I will not change an approved adjustment, pick a legal position, or mark a regulation obsolete. Use Review related laws for alerts; I explain an alert after the deterministic review.`,
    cites: [
      { label: "Regulation corpus", href: "/corpus" },
      { label: "Rule library", href: "/rules" },
      { label: "CIT24-CALC 2026.2" },
    ],
  };
}

function citeInst(c: CorpusInstrument) {
  return { label: `${c.id} · ${c.status}`, href: `/corpus?id=${c.id}` };
}

function staleWarn(c?: CorpusInstrument) {
  if (!c || !isCorpusStale(c.status)) return "";
  const suc = c.supersededBy ? ` Successor in the corpus: ${c.supersededBy}.` : "";
  return `\n\nWarning: ${c.id} (${c.cite}) is ${c.status}.${suc} Do not treat it as current law until a human reinstates it or remaps the rule pack.`;
}

function findInstrument(t: string, corpus: CorpusInstrument[]) {
  return corpus.find((c) => {
    const id = c.id.toLowerCase();
    const cite = c.cite.toLowerCase();
    return t.includes(id.toLowerCase()) || t.includes(cite) || t.includes(id.replace(/-/g, " "));
  });
}

export function answerCopilot(
  q: string,
  p: Provision,
  sim: Pnd51Sim,
  corpus: CorpusInstrument[] = CORPUS_SEED,
  lawMode: LawMode = "compliance",
  lawAlerts: LawAlert[] = [],
): CopilotMsg {
  const t = q.toLowerCase();
  const visible = corpusForLawMode(corpus, lawMode);
  const pack = rulesForLawMode(lawMode);
  const rc65ter = visible.find((c) => c.id === "RC-65-TER") ?? corpus.find((c) => c.id === "RC-65-TER");
  const rc65 = visible.find((c) => c.id === "RC-65") ?? corpus.find((c) => c.id === "RC-65");
  const tas12 = visible.find((c) => c.id === "TAS-12") ?? corpus.find((c) => c.id === "TAS-12");
  const deep = lawMode === "complex";
  const openAlerts = lawAlerts.filter((a) => !a.dismissed);

  if (/mark.{0,48}obsolete|obsolete.{0,24}(regulation|corpus|statute|decree|tas|tfric)|reinstate.{0,20}(corpus|regulation)|supersede.{0,24}(regulation|corpus)|delete.{0,20}(statute|regulation|corpus)/.test(t)) {
    return {
      role: "assistant",
      text: "I cannot mark a regulation obsolete, reinstate one, or link a successor. That is a human-only corpus action (Advisory or Corporate, period unlocked). Open Regulation corpus, choose the instrument, and use Mark obsolete / Link successor / Reinstate. The activity log will record who did it. I will not pick a legal position.",
      cites: [{ label: "Regulation corpus", href: "/corpus" }],
    };
  }

  if (/review related law|ตรวจกฎหมายที่เกี่ยวข้อง|law review ran|run (a |the )?law review/.test(t) && !/explain/.test(t)) {
    return {
      role: "assistant",
      text: "I do not dump a related-law review into chat. Use the Review related laws button on Regulation corpus (or the compact control on the rule library). The deterministic review writes alerts — severity, cite, affected rules/pages, recommended human action. I can then explain a specific alert. I will not mark a regulation obsolete, change an approved adjustment, post a journal, submit a return, or change a rule version.",
      cites: [
        { label: "Regulation corpus", href: "/corpus" },
        { label: "Rule library", href: "/rules" },
      ],
    };
  }

  const alertIdHit = t.match(/law-(?:superseded|obsolete-cited|missing-successor|amended|tas-tfric|pillar-two|complex-gap)-[a-z0-9-]+/);
  const wantAlert = /explain (law )?alert|explain the latest law alert|อธิบาย.*แจ้งเตือน/.test(t) || !!alertIdHit;
  if (wantAlert) {
    const pool = openAlerts.length ? openAlerts : reviewRelatedLaws(corpus, lawMode);
    const hit = alertIdHit
      ? pool.find((a) => a.id.toLowerCase() === alertIdHit[0])
      : pool[0];
    if (!hit) {
      return {
        role: "assistant",
        text: "No law alerts yet. Run Review related laws on the corpus page. I explain an alert after that review — I do not replace it with a chat dump, and I will not mark a regulation obsolete.",
        cites: [{ label: "Regulation corpus", href: "/corpus" }],
      };
    }
    return {
      role: "assistant",
      text: `Alert ${hit.id} · ${hit.severity} · ${hit.cite} (${hit.corpusId}).\n\n${hit.whatsNew}\n\nAffected rules: ${hit.affectedRules.join(", ") || "none"}.\nPages: ${hit.affectedPages.join(", ") || "none"}.\n\nRecommended human action: ${hit.action}\n\nI classified and explained. I cannot mark a regulation obsolete, change an approved adjustment, post a journal, submit a return, or change a rule version.`,
      cites: [
        { label: hit.cite, href: hit.corpusId === "BAR" ? "/corpus" : `/corpus?id=${hit.corpusId}` },
        { label: "Rule library", href: "/rules" },
        { label: "Regulation corpus", href: "/corpus?review=1" },
      ],
    };
  }

  if (!deep && /pillar|globe|gmt24|tfric 23|tas 34|outside.basis|unused credit|p2 dta/.test(t) && !/entertain|51|surcharge/.test(t)) {
    return {
      role: "assistant",
      text: "That is Complex-mode depth. Switch Law depth to Complex for Pillar Two / GMT24, TFRIC 23, TAS 34, unused FTC DTA and the outside-basis exception.\n\nCompliance mode is the filing bar: Revenue Code s.65 (taxable profit, five-year FIFO losses), material s.65 bis/ter add-backs, s.67 bis PND51, WHT credits, PND50, Royal Decree 145 if PPE exists, and current-tax provision. ETR is always current tax ÷ PBT. TAS 12 deferred defaults off.",
      cites: [{ label: "Settings · Law depth", href: "/settings" }, { label: "Regulation corpus", href: "/corpus" }],
    };
  }

  if (/based on|what law|regulation corpus|คลังกฎหมาย|แหล่งกฎหมาย|what (are we|is cit24) (based|grounded)|tfric 13|tfrs 15/.test(t) && !/entertain|51|surcharge/.test(t)) {
    const s = corpusStats(visible);
    const stale = deep ? corpus.filter((c) => isCorpusStale(c.status)) : [];
    const staleList = stale.map((c) => `${c.id} (${c.cite}) — ${c.status}${c.supersededBy ? ` → ${c.supersededBy}` : ""}`).join("\n");
    return {
      role: "assistant",
      text: deep
        ? `CIT24 is based on the regulation corpus and the approved rule pack 2026.2 — not on general model memory. Law depth: Complex.\n\n${corpus.length} instruments · ${s.active} in force / amended · ${corpusStats(corpus).stale} obsolete or superseded.\nCore CIT: Revenue Code s.65, s.65 bis, s.65 ter, s.67 bis, s.60, s.71 bis; Royal Decree 145; Min. Reg. 186.\nReporting: TAS 12 (ETR remains current tax ÷ PBT), TAS 2 inventory NRV, TFRIC 23 (no UTP booked this close), IAS 12 Pillar Two DT exception.\nTAS 34 is in the corpus but not yet engine-backed.\n\nObsolete in this file:\n${staleList || "None."}\n\nI retrieve the corpus. I do not update it.`
        : `CIT24 is based on the regulation corpus and the approved rule pack 2026.2 — not on general model memory. Law depth: Compliance (acceptable filing bar).\n\n${s.total} in-force instruments on this bar: Revenue Code s.65 (taxable profit, five-year FIFO losses), s.65 bis, s.65 ter, s.67 bis (PND51), s.68 (PND50), s.60 (WHT), Royal Decree 145, Min. Reg. 186, Order ป.50/2537, TAS 12 (deferred off unless you turn it on).\nETR is always current tax ÷ PBT.\n\nI will not volunteer Pillar Two, TFRIC 23, TAS 34 or superseded history. Switch to Complex for the full pack.\n\nI retrieve the corpus. I do not update it.`,
      cites: [
        { label: "Regulation corpus", href: "/corpus" },
        { label: "Rule library", href: "/rules" },
        ...(tas12 ? [citeInst(tas12)] : []),
        ...stale.slice(0, 2).map(citeInst),
      ],
    };
  }

  if (/entertain|รับรอง|65 ter \(4\)|65t-04/.test(t)) {
    const a = ADJUSTMENTS.find((x) => x.id === "ADJ-2026-0041")!;
    return {
      role: "assistant",
      text: `Entertainment is a permanent add-back under section 65 ter (4) in the regulation corpus (${rc65ter?.id ?? "RC-65-TER"} · ${rc65ter?.status ?? "in-force"}).\n\nGross revenue 1,240,000,000 × 0.3% = deductible ceiling 3,720,000.\nRecorded in 6210-00: ${F(a.acctAmt)}.\nExcess added back: ${F(a.adjAmt)} · tax at 20% ${F(Math.round(a.adjAmt * 0.2))}.\n\nI proposed the detection. The deterministic engine (CIT24-CALC ${ENGINE_VERSION}) posted the number after human approval. I cannot change an approved adjustment.${staleWarn(rc65ter)}`,
      cites: [
        { label: "ADJ-2026-0041", href: "/ledger" },
        { label: "RULE-65T-04 v3", href: "/rules" },
        ...(rc65ter ? [citeInst(rc65ter)] : [{ label: "s.65 ter guidance", href: "https://www.rd.go.th/827.html" }]),
      ],
    };
  }

  if (/51|surcharge|25%|ประมาณการ|ภ\.ง\.ด\.51|penalty/.test(t)) {
    const rc67 = corpus.find((c) => c.id === "RC-67-BIS");
    const order = corpus.find((c) => c.id === "ORDER-P50-2537");
    return {
      role: "assistant",
      text: `PND51 uses section 67 bis (1) for this entity — estimated annual profit, half payable by 31 Aug 2026. Corpus: ${rc67?.id ?? "RC-67-BIS"} (${rc67?.status ?? "in-force"}); surcharge test ${order?.id ?? "ORDER-P50-2537"} (${order?.status ?? "in-force"}).\n\nProjected taxable profit ${F(sim.taxable)}.\n75% floor ${F(sim.floor)}.\nHalf-year tax on the projection ${F(sim.halfProj)} versus declared half-year ${F(sim.halfDec)}.\nUnderstatement ${sim.shortPct.toFixed(1)}%.\n${sim.breach ? `This estimate breaches the 25% test. 20% surcharge exposure ${F(sim.surcharge)}. Recommended defensible estimate ${F(sim.recommended)}.` : "The declared estimate sits above the 75% floor. Keep the assumption file current."}\n\nI explain the test. The engine calculates the surcharge. I cannot submit the return.${staleWarn(rc67)}${staleWarn(order)}`,
      cites: [
        { label: "PND51 simulator", href: "/pnd51" },
        ...(rc67 ? [citeInst(rc67)] : []),
        ...(order ? [citeInst(order)] : [{ label: "Order ป.50/2537", href: "https://www.rd.go.th/3597.html" }]),
      ],
    };
  }

  if (/revers|กลับรายการ|guardian|bonus|warranty/.test(t)) {
    return {
      role: "assistant",
      text: `Reversal Guardian is watching temporary add-backs from prior years (s.65 ter accruals in the corpus).\n\n• Accrued bonus FY2025 2,200,000 — paid 14 Mar 2026 — deducted in FY2026 (ADJ-2026-0044).\n• Warranty FY2024 900,000 — utilised in FY2025 but never claimed — action needed.\n• Inventory provision FY2026 3,250,000 — reverses only on documented scrapping.\n\nThis is Corporate Tax Memory plus the ledger. I recommend. A reviewer posts.`,
      cites: [
        { label: "Reversal Guardian", href: "/deferred" },
        { label: "Tax Adjustment Ledger", href: "/ledger" },
        { label: "Regulation corpus", href: "/corpus" },
      ],
    };
  }

  if (/taxable|provision|กำไรสุทธิ|current tax|etr/.test(t)) {
    return {
      role: "assistant",
      text: `Current-tax position (engine ${ENGINE_VERSION}), grounded in ${rc65?.id ?? "RC-65"} (${rc65?.status ?? "in-force"})${deep ? ` and TAS 12 (${tas12?.status ?? "in-force"})` : ""}. ETR is always current tax ÷ PBT.\n\nAccounting profit ${F(p.accountingProfit)}\n+ add-backs ${F(p.addBacks)}\n− deductions ${F(Math.abs(p.deductions))}\n= adjusted ${F(p.adjustedProfit)}\n− losses ${F(p.losses)}\n= taxable profit ${F(p.taxableProfit)}\n× 20% = current tax ${F(p.currentTax)}\n− PND51 ${F(p.pnd51Credit)} − WHT ${F(p.whtCredit)}\n= payable ${F(p.payable)}\nETR ${ (p.etr * 100).toFixed(2) }% versus statutory 20% — the gap is permanent items.\n\n${deep ? "Click any amount in Current tax for the full trail: return field → computation → adjustment → GL → evidence → rule → corpus → approval." : "Compliance mode does not volunteer TAS 12 DTL. Switch to Complex for the deferred-tax register."}${staleWarn(rc65)}${deep ? staleWarn(tas12) : ""}`,
      cites: [
        { label: "Current tax", href: "/provision" },
        { label: "PND50", href: "/pnd50" },
        ...(rc65 ? [citeInst(rc65)] : []),
        ...(deep && tas12 ? [citeInst(tas12)] : []),
        { label: "CIT24-CALC " + ENGINE_VERSION },
      ],
    };
  }

  if (/tp24|related.party|management fee|71 bis/.test(t)) {
    const tp = corpus.find((c) => c.id === "RC-71-BIS");
    return {
      role: "assistant",
      text: `ADJ-2026-0051 is a transfer-pricing add-back sourced from TP24, not invented by CIT24.\n\nRelated-party management fee 18,400,000 versus TP24 median range 14,100,000. Excess 4,300,000 is a permanent add-back under s.71 bis (${tp?.id ?? "RC-71-BIS"} · ${tp?.status ?? "in-force"}). Status: in review. I cannot select the legal position — the tax reviewer must confirm.${staleWarn(tp)}`,
      cites: [
        { label: "ADJ-2026-0051", href: "/ledger" },
        { label: "RULE-TP-71B", href: "/rules" },
        ...(tp ? [citeInst(tp)] : []),
        { label: "Ecosystem", href: "/ecosystem" },
      ],
    };
  }

  if (/memory|prior year|ปีก่อน|treatment changed/.test(t)) {
    return {
      role: "assistant",
      text: `Corporate Tax Memory compares FY2025 and FY2026 treatment by account. The legal source of truth behind those treatments is the regulation corpus — not staff recollection.\n\nChanged this year:\n• 6810-00 Bad debts — deducted last year; this year added back (legal action missing).\n• 6150-00 Management fee — accepted in full last year; TP24 now proposes 4,300,000 excess.\n\nUnchanged: entertainment ceiling, accrued bonus pattern, exempt dividends.\n\nThis is why CIT24 is an operating system, not a form generator.`,
      cites: [
        { label: "Corporate Tax Memory", href: "/memory" },
        { label: "Regulation corpus", href: "/corpus" },
      ],
    };
  }

  const instHit = findInstrument(t, deep ? corpus : visible);
  if (instHit && !/rule-/.test(t)) {
    return {
      role: "assistant",
      text: `${instHit.id} · ${instHit.cite} · ${instHit.status} · effective ${instHit.effectiveFrom}.\n\n${instHit.summary}${instHit.cit24Use.note ? `\n\n${instHit.cit24Use.note}` : ""}${staleWarn(instHit)}\n\nI retrieve the corpus. I do not mark it obsolete.`,
      cites: [citeInst(instHit), { label: "Regulation corpus", href: "/corpus" }],
    };
  }

  const rule = pack.find((r) => t.includes(r.id.toLowerCase()) || t.includes(r.sec.toLowerCase().replace(/\s/g, "")));
  if (rule) {
    const grounded = corpusForRule(rule, corpus);
    return {
      role: "assistant",
      text: `${rule.id} ${rule.version} · ${rule.sec} · effective ${rule.effective}${grounded ? ` · corpus ${grounded.id} (${grounded.status})` : ""}.\n\n${rule.logic}\n\nRequired evidence: ${rule.evidence}\nTest cases ${rule.tests}. I retrieve the rule. I do not change the rule version.${staleWarn(grounded)}`,
      cites: [
        { label: rule.id, href: "/rules" },
        ...(grounded ? [citeInst(grounded)] : [{ label: rule.sec, href: rule.legalUrl }]),
      ],
    };
  }

  const s = corpusStats(visible);
  return {
    role: "assistant",
    text: `CIT24 answers from the regulation corpus (${s.total} instruments on ${lawMode} mode) and the versioned Thai CIT rule pack — not from general model memory.\n\nThis snapshot: taxable profit ${F(p.taxableProfit)}, current tax ${F(p.currentTax)}, payable ${F(p.payable)}.\n${ADJUSTMENTS.length} adjustments in the ledger. AI proposes and explains. The deterministic engine calculates. Nothing posts, files, changes a rule, or marks a regulation obsolete without a human.\n\nAsk about the corpus, an adjustment, PND51 surcharge risk, a reversal, or a section 65 ter rule.`,
    cites: [
      { label: "Regulation corpus", href: "/corpus" },
      { label: "Ledger", href: "/ledger" },
      { label: "Rule library", href: "/rules" },
      { label: "CIT24-CALC " + ENGINE_VERSION },
    ],
  };
}
