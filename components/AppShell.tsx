"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  Check,
  Cog,
  Database,
  FileText,
  GitBranch,
  History,
  LayoutGrid,
  Library,
  Link2,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Timer,
  Upload,
  X,
} from "lucide-react";
import { ADVISOR_USER, CORPORATE_USER, DEFENCE_USER, type Lang } from "@/lib/model";
import { useStore } from "@/lib/store";
import { ModeToggle } from "@/components/ModeToggle";
import { LangToggle } from "@/components/LangToggle";
import { LawToggle } from "@/components/LawToggle";
import { BoiToggle } from "@/components/BoiToggle";
import { Copilot } from "@/components/Copilot";
import { AuditTrail } from "@/components/AuditTrail";
import { StartEngage } from "@/components/StartEngage";
import { HostLink } from "@/components/HostLink";
import { pick, T } from "@/lib/i18n";
import { formatExpiry, hoursLeft, readInviteSession } from "@/lib/invite";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const NAV = [
  { group: "Workspace", groupTh: "พื้นที่ทำงาน", groupZh: "工作区", groupJa: "ワークスペース", items: [
    { href: "/clients", en: "Client portfolio", th: "พอร์ตลูกค้า", zh: "客户组合", ja: "顧客ポートフォリオ", icon: Building2, advisor: true },
    { href: "/overview", en: "Tax close", th: "ปิดภาษี", zh: "税务关账", ja: "税務クローズ", icon: LayoutGrid },
    { href: "/entity", en: "Entity profile", th: "โปรไฟล์กิจการ", zh: "主体档案", ja: "事業体プロファイル", icon: Building2 },
  ]},
  { group: "Tax close", groupTh: "ปิดภาษี", groupZh: "税务关账", groupJa: "税務クローズ", items: [
    { href: "/data", en: "Data & mapping", th: "ข้อมูลและการจับคู่", zh: "数据与科目映射", ja: "データとマッピング", icon: Upload },
    { href: "/ledger", en: "Tax Adjustment Ledger", th: "ทะเบียนรายการปรับปรุง", zh: "纳税调整台账", ja: "税務調整台帳", icon: GitBranch },
    { href: "/far", en: "Tax depreciation", th: "ค่าเสื่อมราคาทางภาษี", zh: "税务折旧", ja: "税務減価償却", icon: Cog },
    { href: "/rules", en: "Rule library", th: "คลังกฎภาษี", zh: "税法规则库", ja: "税法ルール庫", icon: BookOpen },
    { href: "/corpus", en: "Regulation corpus", th: "คลังกฎหมาย", zh: "法规库", ja: "法令コーパス", icon: Library },
    { href: "/memory", en: "Tax Memory", th: "ความจำภาษี", zh: "税务记忆", ja: "税務メモリ", icon: Sparkles },
  ]},
  { group: "Provision", groupTh: "ประมาณการ", groupZh: "准备", groupJa: "引当", items: [
    { href: "/provision", en: "Current tax", th: "ภาษีงวดปัจจุบัน", zh: "当期所得税", ja: "当期税", icon: FileText },
    { href: "/losses", en: "Tax-loss schedule", th: "ตารางผลขาดทุน", zh: "税务亏损表", ja: "欠損金表", icon: History },
    { href: "/deferred", en: "Deferred tax", th: "ภาษีรอตัดบัญชี", zh: "递延所得税", ja: "繰延税金", icon: Timer },
    { href: "/disclosure", en: "TAS 12 disclosure", th: "หมายเหตุ ต.บ. 12", zh: "TAS 12 附注", ja: "TAS 12注記", icon: FileText },
  ]},
  { group: "BOI", groupTh: "BOI", groupZh: "BOI", groupJa: "BOI", items: [
    { href: "/boi", en: "BOI desk", th: "โต๊ะ BOI", zh: "BOI 工作台", ja: "BOIデスク", icon: Award },
    { href: "/boi/certificates", en: "Certificates", th: "บัตรส่งเสริม", zh: "促进证书", ja: "促進証書", icon: FileText },
    { href: "/boi/allocation", en: "Allocation AI", th: "ปันส่วน AI", zh: "分摊 AI", ja: "配賦AI", icon: Sparkles },
    { href: "/boi/pnl", en: "Project tax P&L", th: "กำไรภาษีโครงการ", zh: "项目税P&L", ja: "プロジェクト税P&L", icon: Scale },
  ]},
  { group: "Filings", groupTh: "การยื่นแบบ", groupZh: "申报", groupJa: "申告", items: [
    { href: "/pnd51", en: "PND51 simulator", th: "ภ.ง.ด.51 แบบจำลอง", zh: "PND51 模拟", ja: "PND51シミュレーター", icon: AlertTriangle, hot: true },
    { href: "/pnd50", en: "PND50 & filing", th: "ภ.ง.ด.50 และการยื่น", zh: "PND50 与申报", ja: "PND50と申告", icon: FileText },
    { href: "/reports", en: "Reports", th: "รายงาน", zh: "报告", ja: "レポート", icon: Database },
  ]},
  { group: "Control", groupTh: "การควบคุม", groupZh: "控制", groupJa: "統制", items: [
    { href: "/host", en: "Host desk", th: "โต๊ะโฮสต์", zh: "主机台", ja: "ホストデスク", icon: Link2, hot: true },
    { href: "/playbook", en: "Law-depth playbook", th: "คู่มือความลึกกฎหมาย", zh: "法规深度手册", ja: "法令プレイブック", icon: ScrollText },
    { href: "/review", en: "Review & approval", th: "สอบทานและอนุมัติ", zh: "复核与批准", ja: "レビューと承認", icon: Check },
    { href: "/evidence", en: "Audit defence", th: "แฟ้มต่อสู้คดี", zh: "税务稽查应对", ja: "税務調査対応", icon: Shield },
    { href: "/ecosystem", en: "24 ecosystem", th: "ระบบนิเวศ 24", zh: "24 生态", ja: "24エコシステム", icon: Scale },
    { href: "/copilot", en: "Ask CIT24", th: "ถาม CIT24", zh: "询问 CIT24", ja: "CIT24に質問", icon: MessageSquare },
    { href: "/settings", en: "Settings", th: "ตั้งค่า", zh: "设置", ja: "設定", icon: Settings },
  ]},
];

function loc(lang: Lang, en: string, th: string, zh?: string, ja?: string) {
  return pick(lang, { en, th, zh, ja });
}

const TABS = [
  { href: "/overview", label: "Home", icon: LayoutGrid },
  { href: "/ledger", label: "Ledger", icon: GitBranch },
  { href: "/pnd51", label: "51", icon: AlertTriangle },
  { href: "/review", label: "Review", icon: Check },
  { href: "/host", label: "Desk", icon: Link2 },
];

const TITLES: Record<string, { kicker: { en: string; th: string; zh?: string; ja?: string }; title: { en: string; th: string; zh?: string; ja?: string } }> = {
  "/overview": { kicker: { en: "Corporate mode", th: "โหมดองค์กร", zh: "企业模式", ja: "コーポレート" }, title: { en: "Tax close", th: "ปิดภาษี", zh: "税务关账", ja: "税務クローズ" } },
  "/clients": { kicker: { en: "Advisory mode", th: "โหมดที่ปรึกษา", zh: "顾问模式", ja: "アドバイザリー" }, title: { en: "Client portfolio", th: "พอร์ตลูกค้า", zh: "客户组合", ja: "顧客ポートフォリオ" } },
  "/onboard": { kicker: { en: "Onboarding", th: "รับเข้าแพลตฟอร์ม", zh: "接入", ja: "オンボード" }, title: { en: "New engagement", th: "งานบริการใหม่", zh: "新委托", ja: "新規案件" } },
  "/entity": { kicker: { en: "Entity", th: "กิจการ", zh: "主体", ja: "事業体" }, title: { en: "Tax profile", th: "โปรไฟล์ภาษี", zh: "税务档案", ja: "税務プロファイル" } },
  "/data": { kicker: { en: "Step 1", th: "ขั้นตอน 1", zh: "步骤 1", ja: "ステップ1" }, title: { en: "Data & mapping", th: "ข้อมูลและการจับคู่", zh: "数据与映射", ja: "データとマッピング" } },
  "/mapping": { kicker: { en: "Step 1", th: "ขั้นตอน 1", zh: "步骤 1", ja: "ステップ1" }, title: { en: "Account mapping", th: "จับคู่ผังบัญชี", zh: "科目映射", ja: "勘定マッピング" } },
  "/ledger": { kicker: { en: "Control centre", th: "ศูนย์ควบคุม", zh: "控制中心", ja: "コントロールセンター" }, title: { en: "Tax Adjustment Ledger", th: "ทะเบียนรายการปรับปรุงภาษี", zh: "纳税调整台账", ja: "税務調整台帳" } },
  "/far": { kicker: { en: "Royal Decree 145", th: "พระราชกฤษฎีกา 145", zh: "第145号王室法令", ja: "勅令145号" }, title: { en: "Tax depreciation", th: "ค่าเสื่อมราคาทางภาษี", zh: "税务折旧", ja: "税務減価償却" } },
  "/rules": { kicker: { en: "Killer feature", th: "จุดเด่น", zh: "核心能力", ja: "中核機能" }, title: { en: "Tax Law Impact Engine", th: "เครื่องมือผลกระทบกฎหมายภาษี", zh: "税法影响引擎", ja: "税法インパクトエンジン" } },
  "/corpus": { kicker: { en: "Legal source of truth", th: "แหล่งกฎหมายที่เป็นจริง", zh: "法律事实来源", ja: "法令の根拠" }, title: { en: "Regulation corpus", th: "คลังกฎหมายภาษี", zh: "税法法规库", ja: "税法コーパス" } },
  "/memory": { kicker: { en: "Killer feature", th: "จุดเด่น", zh: "核心能力", ja: "中核機能" }, title: { en: "Corporate Tax Memory", th: "ความจำภาษีนิติบุคคล", zh: "企业税务记忆", ja: "法人税メモリ" } },
  "/provision": { kicker: { en: "Continuous close", th: "ปิดภาษีต่อเนื่อง", zh: "持续关账", ja: "継続クローズ" }, title: { en: "Current tax provision", th: "ภาษีเงินได้งวดปัจจุบัน", zh: "当期所得税准备", ja: "当期税金引当" } },
  "/losses": { kicker: { en: "Section 65", th: "มาตรา 65", zh: "第65条", ja: "65条" }, title: { en: "Tax-loss schedule", th: "ตารางผลขาดทุนทางภาษี", zh: "税务亏损表", ja: "欠損金スケジュール" } },
  "/pnd51": { kicker: { en: "Section 67 bis (1)", th: "มาตรา 67 ทวิ (1)", zh: "第67条之二(1)", ja: "67条の2(1)" }, title: { en: "PND51 penalty-risk simulator", th: "ภ.ง.ด.51 แบบจำลองความเสี่ยงเงินเพิ่ม", zh: "PND51 滞纳金风险模拟", ja: "PND51加算税シミュレーター" } },
  "/pnd50": { kicker: { en: "Annual return", th: "แบบประจำปี", zh: "年度申报", ja: "確定申告" }, title: { en: "PND50 computation & filing", th: "ภ.ง.ด.50 การคำนวณและชุดยื่น", zh: "PND50 计算与申报包", ja: "PND50計算と申告パック" } },
  "/deferred": { kicker: { en: "TAS 12", th: "ต.บ. 12", zh: "TAS 12", ja: "TAS 12" }, title: { en: "Deferred tax", th: "ภาษีรอตัดบัญชี", zh: "递延所得税", ja: "繰延税金" } },
  "/disclosure": { kicker: { en: "TAS 12 note", th: "หมายเหตุ ต.บ. 12", zh: "TAS 12 附注", ja: "TAS 12注記" }, title: { en: "Income-tax disclosure", th: "การเปิดเผยภาษีเงินได้", zh: "所得税披露", ja: "法人税の注記" } },
  "/reports": { kicker: { en: "EN · TH · ZH · JA", th: "EN · TH · ZH · JA", zh: "英 · 泰 · 中 · 日", ja: "英 · 泰 · 中 · 日" }, title: { en: "Workpapers & packages", th: "กระดาษทำการและชุดเอกสาร", zh: "工作底稿与资料包", ja: "ワークペーパーとパッケージ" } },
  "/review": { kicker: { en: "Workflow", th: "ขั้นตอนงาน", zh: "工作流", ja: "ワークフロー" }, title: { en: "Review & approval", th: "การสอบทานและอนุมัติ", zh: "复核与批准", ja: "レビューと承認" } },
  "/host": { kicker: { en: "7L host", th: "โฮสต์ 7L", zh: "7L 主机", ja: "7Lホスト" }, title: { en: "Host desk", th: "โต๊ะโฮสต์", zh: "主机台", ja: "ホストデスク" } },
  "/evidence": { kicker: { en: "Audit defence mode", th: "โหมดต่อสู้คดี", zh: "稽查应对模式", ja: "調査対応モード" }, title: { en: "Evidence room", th: "ห้องหลักฐาน", zh: "证据室", ja: "証憑ルーム" } },
  "/ecosystem": { kicker: { en: "Integrated 24", th: "ระบบ 24", zh: "24 集成", ja: "統合24" }, title: { en: "Tax ecosystem", th: "ระบบนิเวศภาษี", zh: "税务生态", ja: "税務エコシステム" } },
  "/copilot": { kicker: { en: "Intelligence", th: "ปัญญาประดิษฐ์", zh: "智能", ja: "インテリジェンス" }, title: { en: "Ask CIT24", th: "ถาม CIT24", zh: "询问 CIT24", ja: "CIT24に質問" } },
  "/playbook": { kicker: { en: "Playbook", th: "คู่มือ", zh: "手册", ja: "プレイブック" }, title: { en: "Compliance vs Complex", th: "เกณฑ์ขั้นต่ำกับครบทุกกฎหมาย", zh: "合规与完整", ja: "コンプライアンスとコンプレックス" } },
  "/settings": { kicker: { en: "Workspace", th: "พื้นที่ทำงาน", zh: "工作区", ja: "ワークスペース" }, title: { en: "Settings", th: "ตั้งค่า", zh: "设置", ja: "設定" } },
  "/boi": { kicker: { en: "BOI engine", th: "เครื่องยนต์ BOI", zh: "BOI 引擎", ja: "BOIエンジン" }, title: { en: "Incentive desk", th: "โต๊ะสิทธิประโยชน์", zh: "优惠工作台", ja: "インセンティブデスク" } },
  "/boi/certificates": { kicker: { en: "Digital certificate", th: "บัตรดิจิทัล", zh: "电子证书", ja: "デジタル証書" }, title: { en: "BOI certificates", th: "บัตรส่งเสริม BOI", zh: "BOI 证书", ja: "BOI証書" } },
  "/boi/allocation": { kicker: { en: "Killer feature", th: "จุดเด่น", zh: "核心能力", ja: "中核機能" }, title: { en: "BOI Allocation AI", th: "AI ปันส่วน BOI", zh: "BOI 分摊 AI", ja: "BOI配賦AI" } },
  "/boi/revenue": { kicker: { en: "Eligibility", th: "คุณสมบัติ", zh: "资格", ja: "適格性" }, title: { en: "Revenue qualification", th: "คุณสมบัติรายได้", zh: "收入资格", ja: "収益適格" } },
  "/boi/pnl": { kicker: { en: "Certificate P&L", th: "กำไรรายบัตร", zh: "证书损益", ja: "証書P&L" }, title: { en: "BOI tax P&L", th: "กำไรขาดทุนภาษี BOI", zh: "BOI 税损益", ja: "BOI税P&L" } },
  "/boi/losses": { kicker: { en: "Post-exemption window", th: "กรอบหลังยกเว้น", zh: "免税后窗口", ja: "免除後期間" }, title: { en: "BOI loss ledger", th: "ทะเบียนขาดทุน BOI", zh: "BOI 亏损台账", ja: "BOI欠損台帳" } },
  "/boi/packages": { kicker: { en: "e-Tax + PND50", th: "e-Tax + ภ.ง.ด.50", zh: "e-Tax + PND50", ja: "e-Tax + PND50" }, title: { en: "BOI and RD packs", th: "ชุด BOI และสรรพากร", zh: "BOI 与税局资料包", ja: "BOIと歳入パック" } },
};

function isActive(path: string, href: string) {
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { logout, toast, navOpen, setNavOpen, mode, clientId, setCopilotOpen, copilotOpen, lang, adjustments, lawMode, boiEnabled, clients } = useStore();
  const user = mode === "advisor" ? ADVISOR_USER : mode === "defence" ? DEFENCE_USER : CORPORATE_USER;
  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const title = TITLES[path] || { kicker: { en: "CIT24", th: "CIT24" }, title: { en: "Thai CIT OS", th: "ระบบภาษีนิติบุคคล", zh: "泰国企业所得税系统", ja: "タイ法人税OS" } };
  const [invite, setInvite] = useState<ReturnType<typeof readInviteSession>>(null);
  const inviteHours = invite ? hoursLeft(invite.exp) : 0;

  useEffect(() => { setNavOpen(false); }, [path, setNavOpen]);
  useEffect(() => { setInvite(readInviteSession()); }, [path]);

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
            {mode === "advisor" ? loc(lang, "Engagement", "งานบริการ", "委托", "エンゲージメント") : mode === "defence" ? loc(lang, "Audit file", "แฟ้มตรวจสอบ", "稽查档案", "調査ファイル") : loc(lang, "Entity", "กิจการ", "主体", "事業体")}
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13 }}>{lang === "th" ? client.nameTh : client.name}</div>
          <div style={{ fontSize: 11, color: "var(--color-neutral-600)", marginTop: 2 }}>TIN {client.tin} · {client.period}</div>
        </Link>
        <div className="sidebar-start">
          <div className="sidebar-start-kicker"><T en="Start here" th="เริ่มที่นี่" zh="从这里开始" ja="ここから開始" /></div>
          <StartEngage block />
          <div className="sidebar-start-kicker" style={{ marginTop: 12 }}><T en="Host desk" th="โต๊ะโฮสต์" zh="主机台" ja="ホストデスク" /></div>
          <HostLink block />
        </div>
        <div className="sidebar-law">
          <LawToggle variant="block" />
          <div style={{ marginTop: 10 }}><BoiToggle variant="block" /></div>
        </div>
        <nav style={{ flex: 1, overflow: "auto", padding: "10px 8px" }}>
          {NAV.map((g) => {
            const items = g.items.filter((i) => !("advisor" in i && i.advisor) || mode === "advisor");
            if (!items.length) return null;
            return (
              <div key={g.group}>
                <div className="nav-group">{loc(lang, g.group, g.groupTh, g.groupZh, g.groupJa)}</div>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setNavOpen(false)} className={`nav-btn${isActive(path, item.href) ? " active" : ""}`}>
                      <Icon size={15} />
                      <span style={{ flex: 1 }}>{loc(lang, item.en, item.th, item.zh, item.ja)}</span>
                      {item.href === "/ledger" && <span style={{ fontSize: 10, fontWeight: 800, opacity: 0.7 }}>{adjustments.length}</span>}
                      {item.href === "/boi" && !boiEnabled && <span className="tag tag-neutral" style={{ fontSize: 9, padding: "1px 6px" }}><T en="Off" th="ปิด" zh="关" ja="オフ" /></span>}
                      {"hot" in item && Boolean((item as { hot?: boolean }).hot) && <span style={{ width: 6, height: 6, background: "var(--color-accent)", flex: "none" }} />}
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
              <T en="Continuous close: GL read through 31 Jul 2026." th="ปิดภาษีต่อเนื่อง: อ่านบัญชีแยกประเภทถึง 31 ก.ค. 2569" zh="持续关账：总账读取至 2026年7月31日。" ja="継続クローズ：GLは2026年7月31日まで。" />
            </div>
          </div>
        </nav>
        <div className="sidebar-foot">
          <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent-700)" }}>
            {mode === "advisor" ? "Advisor firm" : mode === "defence" ? "Audit defence" : "Corporate"}
          </span>
          <span>Rule pack 2026.2 · {lawMode === "compliance" ? loc(lang, "Compliance", "เกณฑ์ขั้นต่ำ", "合规", "コンプライアンス") : loc(lang, "Complex", "ครบทุกกฎหมาย", "完整", "コンプレックス")}</span>
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
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>{pick(lang, title.kicker)}</div>
            <h3 style={{ margin: "2px 0 0" }}>{pick(lang, title.title)}</h3>
          </div>
          <div className="deadline-pill header-hide-sm">
            <AlertTriangle size={13} />
            {lang === "th" ? "ภ.ง.ด.51" : "PND51"} · {loc(lang, "due 31 Aug 2026 · 13 days", "ครบ 31 ส.ค. 2569 · 13 วัน", "截止 2026年8月31日 · 13天", "期限 2026年8月31日 · 13日")}
          </div>
          <StartEngage />
          <HostLink compact />
          <LawToggle />
          <BoiToggle />
          <LangToggle />
          <ModeToggle compact />
          <button className="btn btn-secondary header-hide-sm" onClick={() => setCopilotOpen(!copilotOpen)}><MessageSquare size={16} /><T en="Ask CIT24" th="ถาม CIT24" zh="询问 CIT24" ja="CIT24に質問" /></button>
          <Link href="/pnd50" className="btn btn-primary header-hide-sm"><FileText size={16} /><T en="Filing pack" th="ชุดยื่นแบบ" zh="申报包" ja="申告パック" /></Link>
        </header>
        {invite && (
          <div className="deadline-pill" style={{ borderRadius: 0, justifyContent: "center" }}>
            <AlertTriangle size={13} />
            {loc(lang, `Demo review link · until ${formatExpiry(invite.exp)} · ~${Math.max(1, Math.ceil(inviteHours / 24))}d left`, `ลิงก์เดโม · ถึง ${formatExpiry(invite.exp)} · เหลือราว ${Math.max(1, Math.ceil(inviteHours / 24))} วัน`)}
          </div>
        )}
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
