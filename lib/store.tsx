"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEMES, normalizeTheme, type ThemeKey } from "./format";
import {
  ADVISOR_USER,
  CORPORATE_USER,
  DEFENCE_USER,
  FILES,
  type AdjStatus,
  type Adjustment,
  type Lang,
  type ProductMode,
  type LawMode,
} from "./model";
import { computeProvision, liveAdjustments, type AuditNode, type Provision } from "./engine";
import { computeBoiPnl, scenarioTax, type AllocDriver, type BoiPnl } from "./boi";
import { hydrateSeedFile, ingestBrowserFiles, type IngestedFile } from "./ingest";
import {
  ACCOUNT_SEED,
  EVIDENCE_SEED,
  LOSS_SEED,
  REVERSAL_SEED,
  WHT_SEED,
  appendLog,
  detectFromAccounts,
  fileFingerprint,
  mergeAccounts,
  parseTabular,
  reversalAdjustment,
  seedLog,
  stamp,
  utiliseLosses,
  type AccountRow,
  type AdjVersion,
  type AuditEvent,
  type LossYear,
  type MapEvent,
  type Pnd50Snap,
  type ReversalWatch,
  type WhtCert,
} from "./close";
import { PRIOR_FY2025 } from "./prior";
import {
  mintCorpusId,
  resolveCorpus,
  todayIso,
  type CorpusDraft,
  type CorpusInstrument,
  type CorpusPatch,
} from "./corpus";
import {
  mergeLawAlerts,
  reviewRelatedLaws,
  unreadLawAlertCount as countUnreadLawAlerts,
  type LawAlert,
} from "./lawReview";

function actorOf(mode: ProductMode) {
  if (mode === "corporate") return CORPORATE_USER;
  if (mode === "defence") return DEFENCE_USER;
  return ADVISOR_USER;
}

type Store = {
  ready: boolean;
  authed: boolean;
  login: (mode: ProductMode) => void;
  logout: () => void;
  theme: ThemeKey;
  setTheme: (k: ThemeKey) => void;
  themeVars: Record<string, string>;
  mode: ProductMode;
  setMode: (m: ProductMode) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  clientId: string;
  setClientId: (id: string) => void;
  toast: string | null;
  flash: (m: string) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  pendingAsk: string | null;
  ask: (q: string) => void;
  consumeAsk: () => string | null;
  audit: AuditNode | null;
  openAudit: (n: AuditNode) => void;
  closeAudit: () => void;
  statusOverride: Record<string, AdjStatus>;
  setStatus: (id: string, s: AdjStatus, reason?: string) => boolean;
  approvedMaps: Record<string, boolean>;
  acceptMap: (code: string) => void;
  changeMap: (code: string, tag: AccountRow["tag"]) => void;
  accounts: AccountRow[];
  unmapped: AccountRow[];
  mappedCount: number;
  mappingLocked: boolean;
  toggleMappingLock: () => void;
  mappingHistory: MapEvent[];
  files: IngestedFile[];
  ingestFiles: (list: File[]) => void;
  addJulyGl: () => void;
  locked: boolean;
  toggleLock: () => void;
  materiality: number;
  setMateriality: (n: number) => void;
  pnd51: { g: number; m: number; declared: number; scen: string; method: "m1" | "m2" };
  setPnd51: (p: Partial<Store["pnd51"]>) => void;
  evid: Record<"a" | "b" | "c" | "d", boolean>;
  toggleEv: (k: "a" | "b" | "c" | "d") => void;
  fileChecks: Record<"a" | "b" | "c" | "d" | "e", boolean>;
  toggleFc: (k: "a" | "b" | "c" | "d" | "e") => void;
  notes: { who: string; text: string }[];
  addNote: (text?: string) => void;
  impactRan: boolean;
  runImpact: () => void;
  shareOpen: boolean;
  setShareOpen: (v: boolean) => void;
  adjustments: Adjustment[];
  extraAdjs: Adjustment[];
  provision: Provision;
  actor: { name: string; role: string; initials: string };
  canMutate: boolean;
  isCfo: boolean;
  log: AuditEvent[];
  versions: AdjVersion[];
  evidence: Record<string, string[]>;
  linkEvidence: (adjId: string, fileId: string) => void;
  certs: WhtCert[];
  matchCert: (id: string) => void;
  unmatchCert: (id: string) => void;
  whtCredit: number;
  whtUnmatched: number;
  losses: ReturnType<typeof utiliseLosses>;
  lossYears: LossYear[];
  reversals: ReversalWatch[];
  claimReversal: (id: string) => void;
  runDetection: () => void;
  detections: Adjustment[];
  acceptDetection: (id: string) => void;
  dismissDetection: (id: string) => void;
  certified: boolean;
  certifyReturn: () => void;
  pnd50Snaps: Pnd50Snap[];
  snapshotPnd50: () => void;
  priorImported: boolean;
  priorRows: Adjustment[];
  importPriorYear: () => void;
  dtRate: number;
  setDtRate: (n: number) => void;
  recoverabilityConfirmed: boolean;
  confirmRecoverability: () => void;
  tas12Enabled: boolean;
  setTas12Enabled: (on: boolean) => void;
  readOnly: boolean;
  lawMode: LawMode;
  setLawMode: (m: LawMode) => void;
  corpus: CorpusInstrument[];
  markCorpusObsolete: (id: string, opts?: { supersededBy?: string; note?: string }) => boolean;
  reinstateCorpus: (id: string) => boolean;
  linkCorpusSuccessor: (id: string, successorId: string) => boolean;
  addCorpusInstrument: (draft: CorpusDraft) => string | null;
  lawAlerts: LawAlert[];
  lawReviewOpen: boolean;
  setLawReviewOpen: (v: boolean) => void;
  runLawReview: () => LawAlert[];
  markLawAlertRead: (id: string) => void;
  markLawAlertsRead: () => void;
  dismissLawAlert: (id: string) => void;
  unreadLawAlertCount: number;
  boiEnabled: boolean;
  setBoiEnabled: (on: boolean) => void;
  rentDriver: AllocDriver;
  setRentDriver: (d: AllocDriver) => void;
  approvedBoiRecs: string[];
  approveBoiRec: (id: string) => void;
  certExtracted: boolean;
  extractBoiCert: () => void;
  boiPnl: BoiPnl;
  scenario: { areaTax: number; revTax: number; diff: number };
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [theme, setThemeState] = useState<ThemeKey>("light");
  const [mode, setModeState] = useState<ProductMode>("advisor");
  const [lang, setLangState] = useState<Lang>("en");
  const [clientId, setClientIdState] = useState("spp");
  const [toast, setToast] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [pendingAsk, setPendingAsk] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditNode | null>(null);
  const [statusOverride, setStatusOverride] = useState<Record<string, AdjStatus>>({});
  const [accounts, setAccounts] = useState<AccountRow[]>(ACCOUNT_SEED);
  const [mappingLocked, setMappingLocked] = useState(false);
  const [mappingHistory, setMappingHistory] = useState<MapEvent[]>([]);
  const [files, setFiles] = useState<IngestedFile[]>(() => FILES.map(hydrateSeedFile));
  const [locked, setLocked] = useState(false);
  const [materiality, setMateriality] = useState(500000);
  const [pnd51, setPnd51State] = useState<{ g: number; m: number; declared: number; scen: string; method: "m1" | "m2" }>({
    g: 3, m: 6.9, declared: 74000000, scen: "base", method: "m1",
  });
  const [evid, setEvid] = useState({ a: true, b: true, c: false, d: false });
  const [notes, setNotes] = useState<{ who: string; text: string }[]>([]);
  const [impactRan, setImpactRan] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [extraAdjs, setExtraAdjs] = useState<Adjustment[]>([]);
  const [detections, setDetections] = useState<Adjustment[]>([]);
  const [log, setLog] = useState<AuditEvent[]>(seedLog);
  const [versions, setVersions] = useState<AdjVersion[]>([]);
  const [evidence, setEvidence] = useState<Record<string, string[]>>(EVIDENCE_SEED);
  const [certs, setCerts] = useState<WhtCert[]>(WHT_SEED);
  const [lossYears] = useState<LossYear[]>(LOSS_SEED);
  const [reversals, setReversals] = useState<ReversalWatch[]>(REVERSAL_SEED);
  const [certified, setCertified] = useState(false);
  const [pnd50Snaps, setPnd50Snaps] = useState<Pnd50Snap[]>([]);
  const [priorImported, setPriorImported] = useState(false);
  const [priorRows, setPriorRows] = useState<Adjustment[]>([]);
  const [dtRate, setDtRateState] = useState(0.2);
  const [recoverabilityConfirmed, setRecoverabilityConfirmed] = useState(true);
  const [tas12Enabled, setTas12EnabledState] = useState(false);
  const [lawMode, setLawModeState] = useState<LawMode>("compliance");
  const [corpusExtra, setCorpusExtra] = useState<CorpusInstrument[]>([]);
  const [corpusPatches, setCorpusPatches] = useState<Record<string, CorpusPatch>>({});
  const [lawAlerts, setLawAlerts] = useState<LawAlert[]>([]);
  const [lawReviewOpen, setLawReviewOpen] = useState(false);
  const [boiEnabled, setBoiEnabledState] = useState(false);
  const [rentDriver, setRentDriverState] = useState<AllocDriver>("floor-area");
  const [approvedBoiRecs, setApprovedBoiRecs] = useState<string[]>([]);
  const [certExtracted, setCertExtracted] = useState(false);

  const actor = actorOf(mode);
  const readOnly = mode === "defence";
  const canMutate = !readOnly && !locked;
  const isCfo = mode === "corporate";
  const corpus = useMemo(() => resolveCorpus(corpusExtra, corpusPatches), [corpusExtra, corpusPatches]);

  useEffect(() => {
    setLawAlerts((prev) => {
      if (prev.length === 0) return prev;
      return mergeLawAlerts(prev, reviewRelatedLaws(corpus, lawMode));
    });
  }, [corpus, lawMode]);

  const adjustments = useMemo(
    () => liveAdjustments(statusOverride, extraAdjs),
    [statusOverride, extraAdjs],
  );
  const whtCredit = useMemo(
    () => certs.filter((c) => c.matched).reduce((s, c) => s + c.amount, 0),
    [certs],
  );
  const whtUnmatched = useMemo(
    () => certs.filter((c) => !c.matched).reduce((s, c) => s + c.amount, 0),
    [certs],
  );
  const provision = useMemo(
    () => computeProvision(adjustments, { whtCredit, dtRate, recoverabilityConfirmed, tas12Enabled }),
    [adjustments, whtCredit, dtRate, recoverabilityConfirmed, tas12Enabled],
  );
  const losses = useMemo(
    () => utiliseLosses(lossYears, provision.adjustedProfit),
    [lossYears, provision.adjustedProfit],
  );
  const unmapped = useMemo(() => accounts.filter((a) => !a.mapped), [accounts]);
  const mappedCount = 428 - unmapped.length;

  const allApproved = adjustments.every((a) => a.status === "Approved" || a.status === "Query");
  const fileChecks = {
    a: allApproved,
    b: mappingLocked,
    c: whtUnmatched === 0,
    d: certified,
    e: locked && pnd50Snaps.length > 0,
  };

  useEffect(() => {
    setAuthed(localStorage.getItem("cit24_auth") === "1");
    setThemeState(normalizeTheme(localStorage.getItem("cit24_theme")));
    const m = localStorage.getItem("cit24_mode");
    if (m === "advisor" || m === "corporate" || m === "defence") setModeState(m);
    const l = localStorage.getItem("cit24_lang");
    if (l === "th" || l === "en" || l === "zh" || l === "ja") setLangState(l);
    const c = localStorage.getItem("cit24_client");
    if (c) setClientIdState(c);
    const law = localStorage.getItem("cit24_law");
    const nextLaw: LawMode = law === "complex" ? "complex" : "compliance";
    setLawModeState(nextLaw);
    const t12 = localStorage.getItem("cit24_tas12");
    if (t12 === "1" || t12 === "0") setTas12EnabledState(t12 === "1");
    else setTas12EnabledState(nextLaw === "complex");
    const boi = localStorage.getItem("cit24_boi");
    setBoiEnabledState(nextLaw === "complex" && boi === "1");
    setReady(true);
  }, []);

  const login = useCallback((m: ProductMode) => {
    setModeState(m);
    setAuthed(true);
    localStorage.setItem("cit24_auth", "1");
    localStorage.setItem("cit24_mode", m);
    if (m === "corporate") {
      setClientIdState("spp");
      localStorage.setItem("cit24_client", "spp");
    }
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    localStorage.removeItem("cit24_auth");
  }, []);

  const setTheme = useCallback((k: ThemeKey) => {
    setThemeState(k);
    localStorage.setItem("cit24_theme", k);
  }, []);

  const setMode = useCallback((m: ProductMode) => {
    setModeState(m);
    localStorage.setItem("cit24_mode", m);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("cit24_lang", l);
  }, []);

  const setClientId = useCallback((id: string) => {
    setClientIdState(id);
    localStorage.setItem("cit24_client", id);
  }, []);

  const flash = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const logEvent = useCallback((what: string, who = actor.name) => {
    setLog((l) => appendLog(l, who, what));
  }, [actor.name]);

  const ask = useCallback((q: string) => {
    setPendingAsk(q);
    setCopilotOpen(true);
  }, []);

  const consumeAsk = useCallback(() => {
    const q = pendingAsk;
    setPendingAsk(null);
    return q;
  }, [pendingAsk]);

  const setStatus = useCallback((id: string, s: AdjStatus, reason?: string) => {
    if (readOnly) {
      flash("Audit-defence mode is read-only — no status change recorded");
      return false;
    }
    if (locked) {
      flash("Period is locked — reopen with CFO authorisation before changing an adjustment");
      return false;
    }
    if (s === "Approved" && actor.role === "Tax reviewer" && /Kanit/.test(id) === false) {
      /* reviewer may approve preparer work */
    }
    const adj = adjustments.find((a) => a.id === id);
    if (s === "Approved" && adj && adj.origin === "Manual" && actor.role === "Tax preparer") {
      flash("Segregation of duties: a preparer cannot approve their own adjustment");
      return false;
    }
    const prev = adj?.status ?? "Draft";
    setStatusOverride((p) => ({ ...p, [id]: s }));
    setVersions((v) => [{
      adjId: id,
      version: v.filter((x) => x.adjId === id).length + 1,
      oldAmt: adj?.adjAmt ?? 0,
      newAmt: adj?.adjAmt ?? 0,
      oldStatus: prev,
      newStatus: s,
      reason: reason ?? (s === "Approved" ? "Approved" : s === "Query" ? "Query raised" : s),
      who: actor.name,
      when: stamp(),
    }, ...v]);
    logEvent(`${s} ${id}${reason ? ` · ${reason}` : ""} · prior version retained`);
    flash(`${id} ${s.toLowerCase()} — version written, prior version retained`);
    return true;
  }, [readOnly, locked, actor, adjustments, flash, logEvent]);

  const acceptMap = useCallback((code: string) => {
    if (readOnly || mappingLocked) {
      flash(mappingLocked ? "Mapping is locked for FY2026" : "Read-only mode");
      return;
    }
    setAccounts((rows) => rows.map((a) => a.code === code ? { ...a, mapped: true } : a));
    setMappingHistory((h) => [{ when: stamp(), who: actor.name, code, action: "Accepted AI mapping" }, ...h]);
    logEvent(`Accepted mapping ${code}`);
    flash(`Account ${code} mapped and tagged — mapping history updated`);
  }, [readOnly, mappingLocked, actor.name, flash, logEvent]);

  const changeMap = useCallback((code: string, tag: AccountRow["tag"]) => {
    if (readOnly || mappingLocked) {
      flash(mappingLocked ? "Mapping is locked for FY2026" : "Read-only mode");
      return;
    }
    setAccounts((rows) => rows.map((a) => a.code === code ? { ...a, tag, mapped: true } : a));
    setMappingHistory((h) => [{ when: stamp(), who: actor.name, code, action: `Retagged ${tag}` }, ...h]);
    logEvent(`Changed mapping ${code} → ${tag}`);
  }, [readOnly, mappingLocked, actor.name, flash, logEvent]);

  const toggleMappingLock = useCallback(() => {
    if (readOnly) return;
    setMappingLocked((l) => {
      const next = !l;
      logEvent(next ? "Locked chart-of-account mapping for FY2026" : "Reopened mapping lock");
      flash(next ? "Mapping locked for FY2026 — changes are blocked" : "Mapping reopened — further changes are logged");
      return next;
    });
  }, [readOnly, flash, logEvent]);

  const ingestFiles = useCallback((list: File[]) => {
    if (!list.length) return;
    const { added, skipped } = ingestBrowserFiles(list, files);
    if (added.length) {
      setFiles((f) => [...added, ...f]);
      logEvent(`Ingested ${added.map((a) => a.name).join(", ")} · scored ${added.map((a) => a.score).join("/")}`);
    }
    for (const file of list) {
      const lower = file.name.toLowerCase();
      if (!(lower.endsWith(".csv") || lower.endsWith(".txt") || lower.endsWith(".tsv"))) continue;
      void file.text().then((text) => {
        const parsed = parseTabular(file.name, text);
        if (parsed.accounts.length) {
          setAccounts((a) => mergeAccounts(a, parsed.accounts));
          logEvent(`Parsed ${parsed.accounts.length} accounts from ${file.name}`);
          flash(`${parsed.accounts.length} accounts extracted from ${file.name} — mapping assistant updated`);
        }
        if (parsed.certs.length) {
          setCerts((c) => {
            const ids = new Set(c.map((x) => x.id));
            return parsed.certs.filter((x) => !ids.has(x.id)).concat(c);
          });
          logEvent(`Parsed ${parsed.certs.length} WHT certificates from ${file.name}`);
        }
      });
    }
    if (added.length && skipped.length) {
      flash(`${added.length} file${added.length === 1 ? "" : "s"} scored and posted · ${skipped.length} duplicate name${skipped.length === 1 ? "" : "s"} skipped`);
    } else if (added.length) {
      const weak = added.filter((a) => !a.loadedOk).length;
      flash(weak
        ? `${added.length} file${added.length === 1 ? "" : "s"} ingested — ${weak} below the evidence floor (score < 70)`
        : `${added.length} file${added.length === 1 ? "" : "s"} ingested and scored`);
    } else if (skipped.length) {
      flash(`Already in the pack: ${skipped.join(", ")}`);
    }
  }, [files, flash, logEvent]);

  const addJulyGl = useCallback(() => {
    setFiles((f) => {
      if (f.some((x) => x.name === "GL_SPP_FY2026_Jul.csv")) return f;
      return [
        hydrateSeedFile({
          name: "GL_SPP_FY2026_Jul.csv",
          kind: "General ledger",
          period: "Jul 2026",
          status: "Extracted",
          conf: 0.98,
          size: "31,455 lines",
        }),
        ...f,
      ];
    });
    logEvent("Ingested GL_SPP_FY2026_Jul.csv · 31,455 lines · control totals matched");
    flash("GL_SPP_FY2026_Jul.csv ingested — 31,455 lines, control totals matched · pack re-scored");
  }, [flash, logEvent]);

  const toggleLock = useCallback(() => {
    if (readOnly) {
      flash("Audit-defence mode cannot lock or reopen the period");
      return;
    }
    if (locked && !isCfo) {
      flash("Reopening a locked period requires CFO authorisation (switch to Corporate mode)");
      return;
    }
    setLocked((l) => {
      const next = !l;
      logEvent(next
        ? "FY2026 period locked"
        : "Period reopened by CFO authorisation");
      flash(next
        ? "FY2026 period locked — reopening requires CFO authorisation and is logged"
        : "Period reopened by CFO authorisation — reason recorded in the activity log");
      return next;
    });
  }, [readOnly, locked, isCfo, flash, logEvent]);

  const setPnd51 = useCallback((p: Partial<Store["pnd51"]>) => {
    setPnd51State((s) => ({ ...s, ...p }));
  }, []);

  const toggleEv = useCallback((k: "a" | "b" | "c" | "d") => {
    setEvid((e) => ({ ...e, [k]: !e[k] }));
  }, []);

  const toggleFc = useCallback((_k: "a" | "b" | "c" | "d" | "e") => {
    flash("Completeness items are driven by mapping lock, WHT matching, approval, certification and period lock");
  }, [flash]);

  const addNote = useCallback((text?: string) => {
    if (readOnly) return;
    const body = text ?? "Please attach the debtor correspondence and confirm the collection steps taken before 31 December.";
    setNotes((n) => n.concat([{ who: `${actor.name} · just now`, text: body }]));
    logEvent("Review note added");
    flash("Review note added and logged");
  }, [readOnly, actor.name, flash, logEvent]);

  const runImpact = useCallback(() => {
    setImpactRan(true);
    logEvent("Tax Law Impact Engine run — 6 entities, 11 adjustments, THB 1.42m");
    flash("Impact engine finished — 6 entities, 11 adjustments, THB 1.42m");
  }, [flash, logEvent]);

  const linkEvidence = useCallback((adjId: string, fileId: string) => {
    if (!canMutate) {
      flash(locked ? "Period locked" : "Read-only");
      return;
    }
    setEvidence((e) => {
      const cur = e[adjId] ?? [];
      if (cur.includes(fileId)) return e;
      return { ...e, [adjId]: [...cur, fileId] };
    });
    const file = files.find((f) => f.id === fileId);
    logEvent(`Linked evidence ${file?.name ?? fileId} → ${adjId} · hash ${fileFingerprint(file?.name ?? fileId, file?.size ?? "", file?.conf ?? 0)}`);
    flash(`Evidence linked to ${adjId}`);
  }, [canMutate, locked, files, flash, logEvent]);

  const matchCert = useCallback((id: string) => {
    if (!canMutate) return;
    setCerts((c) => c.map((x) => x.id === id ? { ...x, matched: true, gl: x.gl ?? "1150-00" } : x));
    logEvent(`Matched WHT certificate ${id} to GL 1150-00`);
    flash(`${id} matched — withholding credit updated in the provision`);
  }, [canMutate, flash, logEvent]);

  const unmatchCert = useCallback((id: string) => {
    if (!canMutate) return;
    setCerts((c) => c.map((x) => x.id === id ? { ...x, matched: false, gl: undefined } : x));
    logEvent(`Unmatched WHT certificate ${id}`);
  }, [canMutate, logEvent]);

  const claimReversal = useCallback((id: string) => {
    if (!canMutate) {
      flash(locked ? "Period locked" : "Read-only");
      return;
    }
    const watch = reversals.find((r) => r.id === id);
    if (!watch || watch.status !== "Action needed") return;
    const adj = reversalAdjustment(watch);
    setExtraAdjs((a) => [adj, ...a]);
    setReversals((rows) => rows.map((r) => r.id === id ? { ...r, status: "Claimed" as const, note: `${r.note} Posted as ${adj.id}.` } : r));
    logEvent(`Reversal Guardian posted ${adj.id} · deduction ${watch.amount.toLocaleString()}`);
    flash(`${adj.id} drafted — ${watch.amount.toLocaleString()} deduction pending review`);
  }, [canMutate, locked, reversals, flash, logEvent]);

  const runDetection = useCallback(() => {
    if (!canMutate) return;
    const found = detectFromAccounts(accounts, adjustments.concat(detections));
    setDetections((d) => {
      const ids = new Set(d.map((x) => x.gl));
      return d.concat(found.filter((x) => !ids.has(x.gl)));
    });
    logEvent(`AI detection run — ${found.length} proposed adjustment${found.length === 1 ? "" : "s"} (not posted)`);
    flash(found.length
      ? `${found.length} proposed adjustment${found.length === 1 ? "" : "s"} — AI proposed, engine will calculate after approval`
      : "No new detections. Mapped accounts already have ledger rows.");
  }, [canMutate, accounts, adjustments, detections, flash, logEvent]);

  const acceptDetection = useCallback((id: string) => {
    if (!canMutate) return;
    const row = detections.find((d) => d.id === id);
    if (!row) return;
    setExtraAdjs((a) => [{ ...row, status: "In review" }, ...a]);
    setDetections((d) => d.filter((x) => x.id !== id));
    logEvent(`Accepted AI detection ${id} as In review — engine will include it after approval`);
    flash(`${id} sent to the ledger as In review`);
  }, [canMutate, detections, flash, logEvent]);

  const dismissDetection = useCallback((id: string) => {
    if (!canMutate) return;
    setDetections((d) => d.filter((x) => x.id !== id));
    logEvent(`Dismissed AI detection ${id}`);
  }, [canMutate, logEvent]);

  const certifyReturn = useCallback(() => {
    if (!isCfo) {
      flash("Return-level certification is a CFO action — switch to Corporate mode");
      return;
    }
    if (locked) {
      flash("Period locked");
      return;
    }
    setCertified(true);
    logEvent("CFO certified the FY2026 PND50 computation");
    flash("FY2026 return certified by CFO — logged");
  }, [isCfo, locked, flash, logEvent]);

  const snapshotPnd50 = useCallback(() => {
    if (readOnly) return;
    setPnd50Snaps((s) => {
      const v = s.length + 1;
      const snap: Pnd50Snap = {
        v,
        when: stamp(),
        who: actor.name,
        accountingProfit: provision.accountingProfit,
        addBacks: provision.addBacks,
        deductions: provision.deductions,
        losses: provision.losses,
        taxableProfit: provision.taxableProfit,
        currentTax: provision.currentTax,
        pnd51Credit: provision.pnd51Credit,
        whtCredit: provision.whtCredit,
        payable: provision.payable,
      };
      logEvent(`PND50 filing pack v${v} generated · payable ${provision.payable.toLocaleString()}`);
      return [snap, ...s];
    });
    flash("Filing package snapshot written to the audit trail");
  }, [readOnly, actor.name, provision, flash, logEvent]);

  const importPriorYear = useCallback(() => {
    if (readOnly) {
      flash("Audit-defence mode is read-only");
      return;
    }
    if (priorImported) {
      flash("FY2025 ledger is already in Corporate Tax Memory — import is one-shot");
      return;
    }
    setPriorRows(PRIOR_FY2025);
    setPriorImported(true);
    logEvent(`FY2025 Tax Adjustment Ledger imported · ${PRIOR_FY2025.length} positions linked into Corporate Tax Memory`);
    flash("FY2025 ledger imported — 12 positions written to Corporate Tax Memory, not overwritten");
  }, [readOnly, priorImported, flash, logEvent]);

  const setDtRate = useCallback((n: number) => {
    setDtRateState(n);
    logEvent(`Deferred-tax enacted rate restated to ${(n * 100).toFixed(0)}% — current tax remains 20%`);
    flash(`DTA/DTL restated at ${(n * 100).toFixed(0)}%. Current tax (PND50) stays at 20%.`);
  }, [flash, logEvent]);

  const confirmRecoverability = useCallback(() => {
    if (readOnly) {
      flash("Audit-defence mode is read-only");
      return;
    }
    if (!isCfo) {
      flash("DTA recoverability is a CFO conclusion — switch to Corporate mode");
      return;
    }
    if (!tas12Enabled) {
      flash("Turn on TAS 12 deferred tax before signing recoverability");
      return;
    }
    setRecoverabilityConfirmed(true);
    logEvent("CFO signed TAS 12 recoverability memo — DTA recognition criteria met");
    flash("Recoverability memo signed — DTA recognised against five-year forecast taxable profit");
  }, [readOnly, isCfo, tas12Enabled, flash, logEvent]);

  const corpusBlocked = useCallback(() => {
    if (readOnly) {
      flash("Audit-defence mode is read-only — the regulation corpus cannot be changed");
      return true;
    }
    if (!canMutate) {
      flash("Period is locked — reopen with CFO authorisation before updating the corpus");
      return true;
    }
    return false;
  }, [readOnly, canMutate, flash]);

  const markCorpusObsolete = useCallback((id: string, opts?: { supersededBy?: string; note?: string }) => {
    if (corpusBlocked()) return false;
    const row = corpus.find((c) => c.id === id);
    if (!row) {
      flash("Instrument not in the corpus");
      return false;
    }
    if (opts?.supersededBy) {
      const suc = corpus.find((c) => c.id === opts.supersededBy);
      if (!suc) {
        flash("Successor instrument is not in the corpus");
        return false;
      }
      if (suc.id === id) {
        flash("An instrument cannot supersede itself");
        return false;
      }
    }
    const status = opts?.supersededBy ? "superseded" as const : "obsolete" as const;
    setCorpusPatches((p) => ({
      ...p,
      [id]: {
        ...p[id],
        status,
        supersededBy: opts?.supersededBy,
        obsoleteNote: opts?.note,
        lastReviewed: todayIso(),
      },
    }));
    const suc = opts?.supersededBy ? ` — superseded by ${opts.supersededBy}` : "";
    const note = opts?.note ? ` · ${opts.note}` : "";
    logEvent(`${id} marked ${status}${suc}${note}`);
    flash(`${id} marked ${status}${suc}. Rule pack still coded; Copilot must warn if a rule cites this instrument.`);
    return true;
  }, [corpusBlocked, corpus, flash, logEvent]);

  const reinstateCorpus = useCallback((id: string) => {
    if (corpusBlocked()) return false;
    const row = corpus.find((c) => c.id === id);
    if (!row) {
      flash("Instrument not in the corpus");
      return false;
    }
    setCorpusPatches((p) => ({
      ...p,
      [id]: {
        ...p[id],
        status: "in-force",
        supersededBy: null,
        obsoleteNote: null,
        lastReviewed: todayIso(),
      },
    }));
    logEvent(`${id} reinstated to in-force`);
    flash(`${id} reinstated — in force. Prior obsolete mark remains in the activity log.`);
    return true;
  }, [corpusBlocked, corpus, flash, logEvent]);

  const linkCorpusSuccessor = useCallback((id: string, successorId: string) => {
    if (corpusBlocked()) return false;
    const row = corpus.find((c) => c.id === id);
    const suc = corpus.find((c) => c.id === successorId);
    if (!row || !suc) {
      flash("Instrument or successor not in the corpus");
      return false;
    }
    if (id === successorId) {
      flash("An instrument cannot succeed itself");
      return false;
    }
    const nextStatus = row.status === "obsolete" ? "superseded" : row.status;
    setCorpusPatches((p) => ({
      ...p,
      [id]: {
        ...p[id],
        status: nextStatus,
        supersededBy: successorId,
        lastReviewed: todayIso(),
      },
    }));
    logEvent(`${id} linked successor ${successorId}${row.status === "obsolete" ? " — status superseded" : ""}`);
    flash(`${id} successor set to ${successorId}`);
    return true;
  }, [corpusBlocked, corpus, flash, logEvent]);

  const addCorpusInstrument = useCallback((draft: CorpusDraft) => {
    if (corpusBlocked()) return null;
    const cite = draft.cite.trim();
    const title = draft.title.trim();
    if (!cite || !title) {
      flash("Cite and title are required");
      return null;
    }
    const used = new Set(corpus.map((c) => c.id));
    const id = mintCorpusId(draft.kind, cite, used);
    const row: CorpusInstrument = {
      id,
      cite,
      title,
      titleTh: (draft.titleTh ?? "").trim() || title,
      kind: draft.kind,
      jurisdiction: "TH",
      effectiveFrom: draft.effectiveFrom.trim() || todayIso(),
      status: "in-force",
      summary: draft.summary.trim() || "Added by tax team — summary pending.",
      summaryTh: (draft.summaryTh ?? "").trim() || draft.summary.trim() || "เพิ่มโดยทีมภาษี — สรุปยังไม่ระบุ",
      cit24Use: { ruleIds: [], pages: ["/corpus"], engineHooks: [], note: "Human-added instrument. Not yet wired to the engine." },
      lastReviewed: todayIso(),
      bar: lawMode === "complex" ? "complex" : "compliance",
    };
    setCorpusExtra((e) => [row, ...e]);
    logEvent(`${id} added to regulation corpus · ${cite}`);
    flash(`${id} added — in force. Link rules from the rule library when the pack is updated.`);
    return id;
  }, [corpusBlocked, corpus, flash, logEvent, lawMode]);

  const setLawMode = useCallback((next: LawMode) => {
    setLawModeState(next);
    localStorage.setItem("cit24_law", next);
    logEvent(`Law depth switched to ${next === "compliance" ? "Compliance (acceptable bar)" : "Complex (full related law)"}`);
    flash(next === "compliance"
      ? "Compliance mode — filing bar. TAS 12 deferred defaults off. ETR stays current tax ÷ PBT."
      : "Complex mode — full rule pack, TAS 12 engine, corpus history and Pillar Two exception.");
    if (readOnly || !canMutate) return;
    const on = next === "complex";
    setTas12EnabledState(on);
    localStorage.setItem("cit24_tas12", on ? "1" : "0");
    logEvent(on
      ? "TAS 12 deferred tax turned on — Complex mode default"
      : "TAS 12 deferred tax turned off — Compliance mode default");
    if (!on) {
      setBoiEnabledState(false);
      localStorage.setItem("cit24_boi", "0");
      logEvent("BOI module closed — Compliance mode does not mix promoted and non-promoted tax bases");
    }
  }, [readOnly, canMutate, flash, logEvent]);

  const runLawReview = useCallback(() => {
    const fresh = reviewRelatedLaws(corpus, lawMode);
    setLawAlerts((prev) => mergeLawAlerts(prev, fresh));
    logEvent(`AI law review ran — ${fresh.length} alert${fresh.length === 1 ? "" : "s"} (propose only)`);
    flash(`${fresh.length} law alert${fresh.length === 1 ? "" : "s"}`);
    return fresh;
  }, [corpus, lawMode, flash, logEvent]);

  const markLawAlertRead = useCallback((id: string) => {
    setLawAlerts((rows) => rows.map((a) => a.id === id ? { ...a, read: true } : a));
  }, []);

  const markLawAlertsRead = useCallback(() => {
    setLawAlerts((rows) => {
      if (rows.every((a) => a.dismissed || a.read)) return rows;
      return rows.map((a) => a.dismissed || a.read ? a : { ...a, read: true });
    });
  }, []);

  const dismissLawAlert = useCallback((id: string) => {
    setLawAlerts((rows) => rows.map((a) => a.id === id ? { ...a, dismissed: true, read: true } : a));
    logEvent(`Dismissed law alert ${id} (propose only — corpus unchanged)`);
  }, [logEvent]);

  const unreadLawAlertCount = useMemo(() => countUnreadLawAlerts(lawAlerts), [lawAlerts]);

  const boiPnl = useMemo(
    () => computeBoiPnl({ rentDriver, approvedRecs: approvedBoiRecs }),
    [rentDriver, approvedBoiRecs],
  );
  const scenario = useMemo(() => {
    const areaTax = scenarioTax("floor-area").currentTax;
    const revTax = scenarioTax("revenue").currentTax;
    return { areaTax, revTax, diff: Math.abs(areaTax - revTax) };
  }, []);

  const setBoiEnabled = useCallback((on: boolean) => {
    if (on && lawMode !== "complex") {
      flash("Switch Law depth to Complex before opening the BOI module");
      return;
    }
    if (readOnly) {
      flash("Audit-defence mode is read-only");
      return;
    }
    setBoiEnabledState(on);
    localStorage.setItem("cit24_boi", on ? "1" : "0");
    logEvent(on
      ? "BOI Tax Segregation & Allocation Engine opened — certificate-level tax ledger"
      : "BOI module closed");
    flash(on
      ? "BOI module on. Ledger is classified BOI-01 / BOI-02 / Non-BOI / Shared. ETR stays current tax ÷ PBT."
      : "BOI module off.");
  }, [lawMode, readOnly, flash, logEvent]);

  const setRentDriver = useCallback((d: AllocDriver) => {
    setRentDriverState(d);
    logEvent(`BOI factory-rent allocation driver set to ${d}`);
  }, [logEvent]);

  const approveBoiRec = useCallback((id: string) => {
    if (!canMutate) {
      flash("Period is locked");
      return;
    }
    setApprovedBoiRecs((s) => (s.includes(id) ? s : [...s, id]));
    logEvent(`Human approved BOI allocation AI proposal ${id} — engine did not auto-post`);
    flash(`Allocation ${id} approved. AI proposed; human posted the policy.`);
  }, [canMutate, flash, logEvent]);

  const extractBoiCert = useCallback(() => {
    setCertExtracted(true);
    logEvent("BOI certificate AI reader extracted 60-1234-1-00-1-0 and 60-1234-2-00-1-0 — awaiting human confirm");
    flash("Two BOI cards extracted. Human must confirm activity, capacity, holiday and cap before the profile is live.");
  }, [flash, logEvent]);

  const setTas12Enabled = useCallback((on: boolean) => {
    if (readOnly) {
      flash("Audit-defence mode is read-only");
      return;
    }
    if (!canMutate) {
      flash("Period is locked — TAS 12 deferred tax cannot be switched");
      return;
    }
    setTas12EnabledState(on);
    localStorage.setItem("cit24_tas12", on ? "1" : "0");
    logEvent(on
      ? "TAS 12 deferred tax turned on — live DTA/DTL, recoverability and tax-expense journal"
      : "TAS 12 deferred tax turned off — current tax, PND50 and ETR unchanged; no DTA/DTL booked");
    flash(on
      ? "TAS 12 deferred tax on. ETR remains current tax ÷ PBT."
      : "TAS 12 deferred tax off. Current tax, PND50 and ETR are unchanged.");
  }, [readOnly, canMutate, flash, logEvent]);

  const approvedMaps = useMemo(
    () => Object.fromEntries(accounts.filter((a) => a.mapped).map((a) => [a.code, true])),
    [accounts],
  );

  const themeVars = THEMES[theme].vars as unknown as Record<string, string>;

  const value = useMemo(
    () => ({
      ready, authed, login, logout, theme, setTheme, themeVars, mode, setMode, lang, setLang,
      clientId, setClientId, toast, flash, navOpen, setNavOpen, copilotOpen, setCopilotOpen,
      pendingAsk, ask, consumeAsk, audit, openAudit: setAudit, closeAudit: () => setAudit(null),
      statusOverride, setStatus, approvedMaps, acceptMap, changeMap, accounts, unmapped, mappedCount,
      mappingLocked, toggleMappingLock, mappingHistory, files, ingestFiles, addJulyGl,
      locked, toggleLock, materiality, setMateriality, pnd51, setPnd51, evid, toggleEv,
      fileChecks, toggleFc, notes, addNote, impactRan, runImpact, shareOpen, setShareOpen,
      adjustments, extraAdjs, provision, actor, canMutate, isCfo, log, versions, evidence, linkEvidence,
      certs, matchCert, unmatchCert, whtCredit, whtUnmatched, losses, lossYears, reversals, claimReversal,
      runDetection, detections, acceptDetection, dismissDetection, certified, certifyReturn, pnd50Snaps, snapshotPnd50,
      priorImported, priorRows, importPriorYear, dtRate, setDtRate, recoverabilityConfirmed, confirmRecoverability, tas12Enabled, setTas12Enabled, readOnly,
      lawMode, setLawMode, corpus, markCorpusObsolete, reinstateCorpus, linkCorpusSuccessor, addCorpusInstrument,
      lawAlerts, lawReviewOpen, setLawReviewOpen, runLawReview, markLawAlertRead, markLawAlertsRead, dismissLawAlert, unreadLawAlertCount,
      boiEnabled, setBoiEnabled, rentDriver, setRentDriver, approvedBoiRecs, approveBoiRec, certExtracted, extractBoiCert, boiPnl, scenario,
    }),
    [ready, authed, login, logout, theme, setTheme, themeVars, mode, setMode, lang, setLang, clientId, setClientId, toast, flash, navOpen, copilotOpen, pendingAsk, ask, consumeAsk, audit, statusOverride, setStatus, approvedMaps, acceptMap, changeMap, accounts, unmapped, mappedCount, mappingLocked, toggleMappingLock, mappingHistory, files, ingestFiles, addJulyGl, locked, toggleLock, materiality, pnd51, setPnd51, evid, toggleEv, fileChecks, toggleFc, notes, addNote, impactRan, runImpact, shareOpen, adjustments, extraAdjs, provision, actor, canMutate, isCfo, log, versions, evidence, linkEvidence, certs, matchCert, unmatchCert, whtCredit, whtUnmatched, losses, lossYears, reversals, claimReversal, runDetection, detections, acceptDetection, dismissDetection, certified, certifyReturn, pnd50Snaps, snapshotPnd50, priorImported, priorRows, importPriorYear, dtRate, setDtRate, recoverabilityConfirmed, confirmRecoverability, tas12Enabled, setTas12Enabled, readOnly, lawMode, setLawMode, corpus, markCorpusObsolete, reinstateCorpus, linkCorpusSuccessor, addCorpusInstrument, lawAlerts, lawReviewOpen, runLawReview, markLawAlertRead, markLawAlertsRead, dismissLawAlert, unreadLawAlertCount, boiEnabled, setBoiEnabled, rentDriver, setRentDriver, approvedBoiRecs, approveBoiRec, certExtracted, extractBoiCert, boiPnl, scenario],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("Store missing");
  return s;
}
