"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  Check,
  Database,
  FileText,
  GitBranch,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Settings,
  Shield,
  Sparkles,
  Timer,
  Upload,
  X,
} from "lucide-react";
import { ADVISOR_USER, CLIENTS, CORPORATE_USER, DEFENCE_USER } from "@/lib/model";
import { useStore } from "@/lib/store";
import { ModeToggle } from "@/components/ModeToggle";
import { LangToggle } from "@/components/LangToggle";
import { Copilot } from "@/components/Copilot";
import { AuditTrail } from "@/components/AuditTrail";
import { T } from "@/lib/i18n";
import type { ReactNode } from "react";
import { useEffect } from "react";

const NAV = [
  { group: "Workspace", groupTh: "พื้นที่ทำงาน", items: [
    { href: "/clients", en: "Client portfolio", th: "พอร์ตลูกค้า", icon: Building2, advisor: true },
    { href: "/overview", en: "Tax close", th: "ปิดภาษี", icon: LayoutGrid },
    { href: "/entity", en: "Entity profile", th: "โปรไฟล์กิจการ", icon: Building2 },
  ]},
  { group: "Tax close", groupTh: "ปิดภาษี", items: [
    { href: "/data", en: "Data & mapping", th: "ข้อมูลและการจับคู่", icon: Upload },
    { href: "/ledger", en: "Tax Adjustment Ledger", th: "ทะเบียนรายการปรับปรุง", icon: GitBranch, badge: "14" },
    { href: "/rules", en: "Rule library", th: "คลังกฎภาษี", icon: BookOpen },
    { href: "/memory", en: "Tax Memory", th: "ความจำภาษี", icon: Sparkles },
  ]},
  { group: "Provision", groupTh: "ประมาณการ", items: [
    { href: "/provision", en: "Current tax", th: "ภาษีงวดปัจจุบัน", icon: FileText },
    { href: "/deferred", en: "Deferred tax", th: "ภาษีรอตัดบัญชี", icon: Timer },
  ]},
  { group: "Filings", groupTh: "การยื่นแบบ", items: [
    { href: "/pnd51", en: "ภ.ง.ด.51 simulator", th: "ภ.ง.ด.51 แบบจำลอง", icon: AlertTriangle, hot: true },
    { href: "/pnd50", en: "ภ.ง.ด.50 & filing", th: "ภ.ง.ด.50 และการยื่น", icon: FileText },
    { href: "/reports", en: "Reports", th: "รายงาน", icon: Database },
  ]},
  { group: "Control", groupTh: "การควบคุม", items: [
    { href: "/review", en: "Review & approval", th: "สอบทานและอนุมัติ", icon: Check },
    { href: "/evidence", en: "Audit defence", th: "แฟ้มต่อสู้คดี", icon: Shield },
    { href: "/ecosystem", en: "24 ecosystem", th: "ระบบนิเวศ 24", icon: Scale },
    { href: "/copilot", en: "Ask CIT24", th: "ถาม CIT24", icon: MessageSquare },
    { href: "/settings", en: "Settings", th: "ตั้งค่า", icon: Settings },
  ]},
];

const TABS = [
  { href: "/overview", label: "Home", icon: LayoutGrid },
  { href: "/ledger", label: "Ledger", icon: GitBranch },
  { href: "/pnd51", label: "51", icon: AlertTriangle },
  { href: "/pnd50", label: "50", icon: FileText },
  { href: "/review", label: "Review", icon: Check },
];

const TITLES: Record<string, [string, string, string, string]> = {
  "/overview": ["Corporate mode", "Tax close", "โหมดองค์กร", "ปิดภาษี"],
  "/clients": ["Advisory mode", "Client portfolio", "โหมดที่ปรึกษา", "พอร์ตลูกค้า"],
  "/entity": ["Entity", "Tax profile", "กิจการ", "โปรไฟล์ภาษี"],
  "/data": ["Step 1", "Data & mapping", "ขั้นตอน 1", "ข้อมูลและการจับคู่"],
  "/mapping": ["Step 1", "Account mapping", "ขั้นตอน 1", "จับคู่ผังบัญชี"],
  "/ledger": ["Control centre", "Tax Adjustment Ledger", "ศูนย์ควบคุม", "ทะเบียนรายการปรับปรุงภาษี"],
  "/rules": ["Killer feature", "Tax Law Impact Engine", "จุดเด่น", "เครื่องมือผลกระทบกฎหมายภาษี"],
  "/memory": ["Killer feature", "Corporate Tax Memory", "จุดเด่น", "ความจำภาษีนิติบุคคล"],
  "/provision": ["Continuous close", "Current tax provision", "ปิดภาษีต่อเนื่อง", "ภาษีเงินได้งวดปัจจุบัน"],
  "/deferred": ["TAS 12", "Deferred tax", "มาตรฐานบัญชี 12", "ภาษีเงินได้รอการตัดบัญชี"],
  "/pnd51": ["Section 67 bis (1)", "ภ.ง.ด.51 penalty-risk simulator", "มาตรา 67 ทวิ (1)", "ภ.ง.ด.51 แบบจำลองความเสี่ยงเงินเพิ่ม"],
  "/pnd50": ["Annual return", "ภ.ง.ด.50 computation & filing", "แบบประจำปี", "ภ.ง.ด.50 การคำนวณและชุดยื่น"],
  "/reports": ["Outputs", "Workpapers & packages", "ผลลัพธ์", "กระดาษทำการและชุดเอกสาร"],
  "/review": ["Workflow", "Review & approval", "ขั้นตอนงาน", "การสอบทานและอนุมัติ"],
  "/evidence": ["Audit defence mode", "Evidence room", "โหมดต่อสู้คดี", "ห้องหลักฐาน"],
  "/ecosystem": ["Integrated 24", "Tax ecosystem", "ระบบ 24", "ระบบนิเวศภาษี"],
  "/copilot": ["Intelligence", "Ask CIT24", "ปัญญาประดิษฐ์", "ถาม CIT24"],
  "/settings": ["Workspace", "Settings", "พื้นที่ทำงาน", "ตั้งค่า"],
};

function isActive(path: string, href: string) {
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { logout, toast, navOpen, setNavOpen, mode, clientId, setCopilotOpen, copilotOpen, lang } = useStore();
  const user = mode === "advisor" ? ADVISOR_USER : mode === "defence" ? DEFENCE_USER : CORPORATE_USER;
  const client = CLIENTS.find((c) => c.id === clientId) ?? CLIENTS[0];
  const [kickerEn, titleEn, kickerTh, titleTh] = TITLES[path] || ["CIT24", "Thai CIT OS", "CIT24", "ระบบภาษีนิติบุคคล"];

  useEffect(() => { setNavOpen(false); }, [path, setNavOpen]);

  return (
    <div className="shell">
      <div className={`sidebar-backdrop${navOpen ? " open" : ""}`} onClick={() => setNavOpen(false)} />
      <aside className={`sidebar${navOpen ? " open" : ""}`}>
        <div style={{ padding: "14px 16px 12px", borderBottom: "2px solid var(--color-divider)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 14, height: 14, background: "var(--color-accent)", flex: "none" }} />
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1 }}>CIT24</div>
            </div>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 50%, transparent)", marginTop: 6 }}>Thai CIT operating system</div>
          </div>
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <Link href={mode === "advisor" ? "/clients" : "/overview"} onClick={() => setNavOpen(false)} style={{ display: "block", padding: "12px 14px", borderBottom: "2px solid var(--color-divider)", background: "var(--color-surface)", textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
            {mode === "advisor" ? (lang === "th" ? "งานบริการ" : "Engagement") : mode === "defence" ? (lang === "th" ? "แฟ้มตรวจสอบ" : "Audit file") : (lang === "th" ? "กิจการ" : "Entity")}
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13 }}>{lang === "th" ? client.nameTh : client.name}</div>
          <div style={{ fontSize: 11, color: "var(--color-neutral-600)", marginTop: 2 }}>TIN {client.tin} · {client.period}</div>
        </Link>
        <nav style={{ flex: 1, overflow: "auto", padding: "10px 8px" }}>
          {NAV.map((g) => {
            const items = g.items.filter((i) => !("advisor" in i && i.advisor) || mode === "advisor");
            if (!items.length) return null;
            return (
              <div key={g.group}>
                <div className="nav-group">{lang === "th" ? g.groupTh : g.group}</div>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setNavOpen(false)} className={`nav-btn${isActive(path, item.href) ? " active" : ""}`}>
                      <Icon size={15} />
                      <span style={{ flex: 1 }}>{lang === "th" ? item.th : item.en}</span>
                      {"badge" in item && item.badge && <span style={{ fontSize: 10, fontWeight: 800, opacity: 0.7 }}>{item.badge}</span>}
                      {"hot" in item && item.hot && <span style={{ width: 6, height: 6, background: "var(--color-accent)", flex: "none" }} />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
          <div style={{ margin: "14px 8px 0", paddingTop: 14, borderTop: "2px solid var(--color-divider)" }}>
            <div className="nav-group">Ecosystem</div>
            <div className="eco-tags" style={{ padding: "4px 8px 8px" }}>
              <span className="tag tag-neutral">TP24</span>
              <span className="tag tag-neutral">GMT24</span>
              <span className="tag tag-neutral">RISK24</span>
              <span className="tag tag-neutral">PIT24</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.5, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", padding: "0 8px 8px" }}>
              <T en="Continuous close: GL read through 31 Jul 2026." th="ปิดภาษีต่อเนื่อง: อ่านบัญชีแยกประเภทถึง 31 ก.ค. 2569" />
            </div>
          </div>
        </nav>
        <div className="sidebar-foot">
          <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent-700)" }}>
            {mode === "advisor" ? "Advisor firm" : mode === "defence" ? "Audit defence" : "Corporate"}
          </span>
          <span>Rule pack 2026.2</span>
          <span>Engine CIT24-CALC · deterministic</span>
          <div className="user-frame">
            <span style={{ width: 30, height: 30, flex: "none", background: "var(--color-neutral-900)", color: "var(--color-bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: 12 }}>{user.initials}</span>
            <div style={{ flex: 1, lineHeight: 1.2, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }}>{user.name}</div>
              <div>{user.role}</div>
            </div>
            <button title="Sign out" onClick={() => { logout(); router.push("/"); }} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--color-neutral-600)", display: "inline-flex", width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>{lang === "th" ? kickerTh : kickerEn}</div>
            <h3 style={{ margin: "2px 0 0" }}>{lang === "th" ? titleTh : titleEn}</h3>
          </div>
          <div className="deadline-pill header-hide-sm">
            <AlertTriangle size={13} />
            ภ.ง.ด.51 · due 31 Aug 2026 · 13 days
          </div>
          <LangToggle />
          <ModeToggle compact />
          <button className="btn btn-secondary header-hide-sm" onClick={() => setCopilotOpen(!copilotOpen)}><MessageSquare size={16} /><T en="Ask CIT24" th="ถาม CIT24" /></button>
          <Link href="/pnd50" className="btn btn-primary header-hide-sm"><FileText size={16} /><T en="Filing pack" th="ชุดยื่นแบบ" /></Link>
        </header>
        <div className="workspace">
          <main className="page-main">{children}</main>
          <Copilot />
        </div>
      </div>

      <nav className="bottom-nav no-print">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className={isActive(path, t.href) ? "active" : ""}>
              <Icon size={18} />
              {t.label}
            </Link>
          );
        })}
      </nav>
      <AuditTrail />
      {toast && (
        <div className="toast">
          <Check size={16} color="var(--color-accent-400)" />
          {toast}
        </div>
      )}
    </div>
  );
}
