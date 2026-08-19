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
import type { AdjStatus, Lang, ProductMode } from "./model";
import type { AuditNode } from "./engine";
import { UNMAPPED_SEED, FILES } from "./model";

type FileRow = (typeof FILES)[number];
type Unmapped = (typeof UNMAPPED_SEED)[number];

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
  setStatus: (id: string, s: AdjStatus) => void;
  approvedMaps: Record<string, boolean>;
  acceptMap: (code: string) => void;
  unmapped: Unmapped[];
  mappedCount: number;
  files: FileRow[];
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
  addNote: () => void;
  impactRan: boolean;
  runImpact: () => void;
  shareOpen: boolean;
  setShareOpen: (v: boolean) => void;
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
  const [approvedMaps, setApprovedMaps] = useState<Record<string, boolean>>({});
  const [unmapped, setUnmapped] = useState(UNMAPPED_SEED);
  const [mappedCount, setMappedCount] = useState(422);
  const [files, setFiles] = useState<FileRow[]>(FILES);
  const [locked, setLocked] = useState(false);
  const [materiality, setMateriality] = useState(500000);
  const [pnd51, setPnd51State] = useState<{ g: number; m: number; declared: number; scen: string; method: "m1" | "m2" }>({
    g: 3, m: 6.9, declared: 74000000, scen: "base", method: "m1",
  });
  const [evid, setEvid] = useState({ a: true, b: true, c: false, d: false });
  const [fileChecks, setFileChecks] = useState({ a: true, b: true, c: true, d: false, e: false });
  const [notes, setNotes] = useState<{ who: string; text: string }[]>([]);
  const [impactRan, setImpactRan] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("cit24_auth") === "1");
    setThemeState(normalizeTheme(localStorage.getItem("cit24_theme")));
    const m = localStorage.getItem("cit24_mode");
    if (m === "advisor" || m === "corporate" || m === "defence") setModeState(m);
    const l = localStorage.getItem("cit24_lang");
    if (l === "th" || l === "en") setLangState(l);
    const c = localStorage.getItem("cit24_client");
    if (c) setClientIdState(c);
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
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const ask = useCallback((q: string) => {
    setPendingAsk(q);
    setCopilotOpen(true);
  }, []);

  const consumeAsk = useCallback(() => {
    const q = pendingAsk;
    setPendingAsk(null);
    return q;
  }, [pendingAsk]);

  const setStatus = useCallback((id: string, s: AdjStatus) => {
    setStatusOverride((p) => ({ ...p, [id]: s }));
  }, []);

  const acceptMap = useCallback((code: string) => {
    setUnmapped((u) => u.filter((x) => x.code !== code));
    setMappedCount((n) => n + 1);
    setApprovedMaps((p) => ({ ...p, [code]: true }));
    flash(`Account ${code} mapped and tagged — mapping history updated`);
  }, [flash]);

  const addJulyGl = useCallback(() => {
    setFiles((f) => [
      { name: "GL_SPP_FY2026_Jul.csv", kind: "General ledger", period: "Jul 2026", status: "Extracted", conf: 0.98, size: "31,455 lines" },
      ...f,
    ]);
    flash("GL_SPP_FY2026_Jul.csv ingested — 31,455 lines, control totals matched");
  }, [flash]);

  const toggleLock = useCallback(() => {
    setLocked((l) => {
      const next = !l;
      flash(next
        ? "FY2026 period locked — reopening requires CFO authorisation and is logged"
        : "Period reopened by CFO authorisation — reason recorded in the activity log");
      return next;
    });
  }, [flash]);

  const setPnd51 = useCallback((p: Partial<Store["pnd51"]>) => {
    setPnd51State((s) => ({ ...s, ...p }));
  }, []);

  const toggleEv = useCallback((k: "a" | "b" | "c" | "d") => {
    setEvid((e) => ({ ...e, [k]: !e[k] }));
  }, []);

  const toggleFc = useCallback((k: "a" | "b" | "c" | "d" | "e") => {
    setFileChecks((e) => ({ ...e, [k]: !e[k] }));
  }, []);

  const addNote = useCallback(() => {
    setNotes((n) => n.concat([{ who: "Kanit S. · just now", text: "Please attach the debtor correspondence and confirm the collection steps taken before 31 December." }]));
    flash("Review note added and evidence request sent to the client");
  }, [flash]);

  const runImpact = useCallback(() => {
    setImpactRan(true);
    flash("Impact engine finished — 6 entities, 11 adjustments, THB 1.42m");
  }, [flash]);

  const themeVars = THEMES[theme].vars as unknown as Record<string, string>;

  const value = useMemo(
    () => ({
      ready, authed, login, logout, theme, setTheme, themeVars, mode, setMode, lang, setLang,
      clientId, setClientId, toast, flash, navOpen, setNavOpen, copilotOpen, setCopilotOpen,
      pendingAsk, ask, consumeAsk, audit, openAudit: setAudit, closeAudit: () => setAudit(null),
      statusOverride, setStatus, approvedMaps, acceptMap, unmapped, mappedCount, files, addJulyGl,
      locked, toggleLock, materiality, setMateriality, pnd51, setPnd51, evid, toggleEv,
      fileChecks, toggleFc, notes, addNote, impactRan, runImpact, shareOpen, setShareOpen,
    }),
    [ready, authed, login, logout, theme, setTheme, themeVars, mode, setMode, lang, setLang, clientId, setClientId, toast, flash, navOpen, copilotOpen, pendingAsk, ask, consumeAsk, audit, statusOverride, setStatus, approvedMaps, acceptMap, unmapped, mappedCount, files, addJulyGl, locked, toggleLock, materiality, pnd51, setPnd51, evid, toggleEv, fileChecks, toggleFc, notes, addNote, impactRan, runImpact, shareOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("Store missing");
  return s;
}
