import type { AdjStatus, Adjustment, Client } from "./model";
import type { Provision } from "./engine";
import { F } from "./format";

export const HOST_KEY = "cit24_host_reviews";
export const HOST_DAYS_MIN = 1;
export const HOST_DAYS_MAX = 30;
export const HOST_DAYS_DEFAULT = 3;
export const HOST_DAY_MS = 24 * 60 * 60 * 1000;
export const HOST_DAY_PRESETS = [1, 3, 7, 14, 30] as const;

export type HostPurpose = "reviewer" | "cfo" | "auditor" | "client";

export type HostOpenItem = {
  id: string;
  name: string;
  amt: number;
  status: AdjStatus;
};

export type HostCheck = { id: string; en: string; th: string; ok: boolean };

export type HostPack = {
  currentTax: number;
  taxableProfit: number;
  payable: number;
  etr: number;
  accountingProfit: number;
  openCount: number;
  materialOpen: HostOpenItem[];
  checks: HostCheck[];
  briefEn: string;
  briefTh: string;
};

export type HostReview = {
  token: string;
  createdAt: string;
  expiresAt: string;
  days: number;
  recipient: string;
  purpose: HostPurpose;
  entity: string;
  entityTh: string;
  tin: string;
  period: string;
  actor: string;
  role: string;
  pack: HostPack;
  revoked: boolean;
  views: number;
  notes: { who: string; text: string; when: string }[];
};

export type HostStatus = "live" | "expired" | "revoked";

export function clampHostDays(n: unknown): number {
  const v = typeof n === "number" ? n : typeof n === "string" && n.trim() !== "" ? Number(n) : NaN;
  if (!Number.isFinite(v)) return HOST_DAYS_DEFAULT;
  return Math.min(HOST_DAYS_MAX, Math.max(HOST_DAYS_MIN, Math.round(v)));
}

export function mintHostToken() {
  const a = Math.random().toString(36).slice(2, 8);
  const b = Date.now().toString(36).slice(-5);
  return `rvw-${a}${b}`;
}

export function hostPath(token: string) {
  return `/r/${token}`;
}

export function hostAbsUrl(token: string) {
  if (typeof window === "undefined") return hostPath(token);
  return `${window.location.origin}${hostPath(token)}`;
}

export function hostExpiresAt(createdAt: number, days: number) {
  return new Date(createdAt + clampHostDays(days) * HOST_DAY_MS).toISOString();
}

export function hostStatus(row: HostReview, now = Date.now()): HostStatus {
  if (row.revoked) return "revoked";
  if (now >= Date.parse(row.expiresAt)) return "expired";
  return "live";
}

export function hostRemaining(row: HostReview, now = Date.now()) {
  const ms = Math.max(0, Date.parse(row.expiresAt) - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return { ms, days, hours, mins, label: `${days}d ${hours}h ${mins}m` };
}

export function formatHostWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function inferredDays(createdAt: string, expiresAt: string): number {
  const ms = Date.parse(expiresAt) - Date.parse(createdAt);
  if (!Number.isFinite(ms) || ms <= 0) return HOST_DAYS_DEFAULT;
  return clampHostDays(Math.round(ms / HOST_DAY_MS));
}

export function parseStoredHosts(raw: string | null): HostReview[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.flatMap((x) => {
      if (!x || typeof x !== "object") return [];
      const row = x as Partial<HostReview>;
      if (typeof row.token !== "string" || !row.pack || typeof row.pack !== "object") return [];
      const createdAt = typeof row.createdAt === "string" ? row.createdAt : new Date().toISOString();
      const expiresAt = typeof row.expiresAt === "string" ? row.expiresAt : hostExpiresAt(Date.parse(createdAt) || Date.now(), HOST_DAYS_DEFAULT);
      const days = typeof row.days === "number" ? clampHostDays(row.days) : inferredDays(createdAt, expiresAt);
      const purpose = row.purpose === "cfo" || row.purpose === "auditor" || row.purpose === "client" ? row.purpose : "reviewer";
      return [{
        token: row.token,
        createdAt,
        expiresAt,
        days,
        recipient: typeof row.recipient === "string" ? row.recipient : "",
        purpose,
        entity: typeof row.entity === "string" ? row.entity : "",
        entityTh: typeof row.entityTh === "string" ? row.entityTh : "",
        tin: typeof row.tin === "string" ? row.tin : "",
        period: typeof row.period === "string" ? row.period : "",
        actor: typeof row.actor === "string" ? row.actor : "",
        role: typeof row.role === "string" ? row.role : "",
        pack: row.pack as HostPack,
        revoked: Boolean(row.revoked),
        views: typeof row.views === "number" ? row.views : 0,
        notes: Array.isArray(row.notes) ? row.notes.filter((n): n is HostReview["notes"][number] => Boolean(n && typeof n === "object" && typeof n.text === "string")) : [],
      }];
    });
  } catch {
    return [];
  }
}

export function generateReviewPack(input: {
  client: Client;
  provision: Provision;
  adjustments: Adjustment[];
  materiality: number;
  mappingLocked: boolean;
  certified: boolean;
  locked: boolean;
  fileChecks: Record<"a" | "b" | "c" | "d" | "e", boolean>;
  actor: string;
  days?: number;
}): HostPack {
  const { client, provision: p, adjustments, materiality, mappingLocked, certified, locked, fileChecks, actor } = input;
  const days = clampHostDays(input.days);
  const open = adjustments.filter((a) => a.status !== "Approved");
  const materialOpen = open
    .filter((a) => Math.abs(a.adjAmt) >= materiality || a.status === "Query")
    .map((a) => ({ id: a.id, name: a.name, amt: a.adjAmt, status: a.status }));
  const done = Object.values(fileChecks).filter(Boolean).length;
  const checks: HostCheck[] = [
    { id: "map", en: "Chart mapping locked", th: "ล็อกการจับคู่ผังบัญชี", ok: mappingLocked },
    { id: "adj", en: "Material adjustments approved or queried", th: "รายการสาระสำคัญอนุมัติหรือมีข้อสอบถาม", ok: fileChecks.a },
    { id: "wht", en: "WHT certificates matched", th: "จับคู่หนังสือรับรองหัก ณ ที่จ่าย", ok: fileChecks.c },
    { id: "cfo", en: "CFO certification", th: "CFO รับรองแบบ", ok: certified },
    { id: "lock", en: "Period lock + PND50 pack", th: "ล็อกงวดและชุด ภ.ง.ด.50", ok: locked && fileChecks.e },
  ];
  const briefEn = `${client.name} ${client.period}: current tax ${F(p.currentTax)} on taxable profit ${F(p.taxableProfit)}. ETR ${(p.etr * 100).toFixed(2)}% (current tax ÷ PBT). ${open.length} adjustment${open.length === 1 ? "" : "s"} still open (${materialOpen.length} at or above materiality ${F(materiality)}). PND50 completeness ${done}/5. Generated by ${actor} for a ${days}-day hosted review. The engine calculated these figures; this page does not recompute tax.`;
  const briefTh = `${client.nameTh} ${client.period}: ภาษีงวดปัจจุบัน ${F(p.currentTax)} บนกำไรสุทธิทางภาษี ${F(p.taxableProfit)} ETR ${(p.etr * 100).toFixed(2)}% (ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี) รายการยังไม่ปิด ${open.length} รายการ (สาระสำคัญ ${materialOpen.length} รายการ ที่เกณฑ์ ${F(materiality)}) ความครบถ้วน ภ.ง.ด.50 ${done}/5 สร้างโดย ${actor} สำหรับการสอบทานโฮสต์ ${days} วัน เครื่องคำนวณเป็นผู้คิดตัวเลข หน้านี้ไม่คำนวณภาษีใหม่`;
  return {
    currentTax: p.currentTax,
    taxableProfit: p.taxableProfit,
    payable: p.payable,
    etr: p.etr,
    accountingProfit: p.accountingProfit,
    openCount: open.length,
    materialOpen,
    checks,
    briefEn,
    briefTh,
  };
}

export function buildHostReview(input: {
  client: Client;
  provision: Provision;
  adjustments: Adjustment[];
  materiality: number;
  mappingLocked: boolean;
  certified: boolean;
  locked: boolean;
  fileChecks: Record<"a" | "b" | "c" | "d" | "e", boolean>;
  actor: { name: string; role: string };
  recipient: string;
  purpose: HostPurpose;
  days?: number;
}): HostReview {
  const days = clampHostDays(input.days);
  const created = Date.now();
  return {
    token: mintHostToken(),
    createdAt: new Date(created).toISOString(),
    expiresAt: hostExpiresAt(created, days),
    days,
    recipient: input.recipient.trim(),
    purpose: input.purpose,
    entity: input.client.name,
    entityTh: input.client.nameTh,
    tin: input.client.tin,
    period: input.client.period,
    actor: input.actor.name,
    role: input.actor.role,
    pack: generateReviewPack({ ...input, actor: input.actor.name, days }),
    revoked: false,
    views: 0,
    notes: [],
  };
}

export const HOST_PURPOSES: { id: HostPurpose; en: string; th: string }[] = [
  { id: "reviewer", en: "Tax reviewer", th: "ผู้สอบทานภาษี" },
  { id: "cfo", en: "CFO / approver", th: "CFO / ผู้อนุมัติ" },
  { id: "auditor", en: "External auditor", th: "ผู้สอบบัญชีภายนอก" },
  { id: "client", en: "Client tax lead", th: "หัวหน้าภาษีลูกค้า" },
];
