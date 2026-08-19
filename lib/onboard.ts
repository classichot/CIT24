import { CLIENTS, type Client } from "./model";
import { DOC_REQUIREMENTS } from "./ingest";

export const ENGAGEMENT_KEY = "cit24_engagements";

export type EngagementDraft = {
  name: string;
  nameTh: string;
  tin: string;
  period: string;
  fyLabel: string;
  rateProfile: Client["rateProfile"];
  pnd51Method: Client["pnd51Method"];
  boi: boolean;
  preparer: string;
  reviewer: string;
  cfo: string;
};

export const EMPTY_DRAFT: EngagementDraft = {
  name: "",
  nameTh: "",
  tin: "",
  period: "FY2026",
  fyLabel: "1 Jan – 31 Dec 2026",
  rateProfile: "normal",
  pnd51Method: "67bis1",
  boi: false,
  preparer: "",
  reviewer: "",
  cfo: "",
};

export const ONBOARD_STEPS = [
  {
    n: "01",
    id: "identity",
    href: "/onboard",
    en: "Legal identity",
    th: "ตัวตนทางกฎหมาย",
    doEn: "Legal name (EN/TH), 13-digit TIN, accounting period.",
    doTh: "ชื่อทางกฎหมาย (EN/TH) เลขผู้เสียภาษี 13 หลัก รอบบัญชี",
  },
  {
    n: "02",
    id: "profile",
    href: "/onboard",
    en: "Tax profile",
    th: "โปรไฟล์ภาษี",
    doEn: "Rate (normal / SME / listed), s.67 bis PND51 method, BOI yes/no.",
    doTh: "อัตรา (ทั่วไป / SME / จดทะเบียน) วิธี ม.67 ทวิ ภ.ง.ด.51 มี BOI หรือไม่",
  },
  {
    n: "03",
    id: "access",
    href: "/onboard",
    en: "People & SoD",
    th: "คนและแยกหน้าที่",
    doEn: "Preparer, reviewer, CFO. A preparer cannot approve their own adjustment.",
    doTh: "ผู้จัดทำ ผู้สอบทาน CFO ผู้จัดทำอนุมัติรายการของตนเองไม่ได้",
  },
  {
    n: "04",
    id: "pack",
    href: "/data",
    en: "Close pack",
    th: "ชุดปิดภาษี",
    doEn: "Drop required evidence. CIT24 classifies and scores each file. Score ≥ 70 to post.",
    doTh: "วางหลักฐานที่จำเป็น CIT24 จัดประเภทและให้คะแนน ต้อง ≥ 70 จึงบันทึกได้",
  },
  {
    n: "05",
    id: "map",
    href: "/mapping",
    en: "Chart mapping",
    th: "จับคู่ผังบัญชี",
    doEn: "Accept or retag AI mappings, then lock the chart for the period.",
    doTh: "ยอมรับหรือเปลี่ยนประเภทที่ AI จับคู่ แล้วล็อกผังบัญชีของงวด",
  },
  {
    n: "06",
    id: "ledger",
    href: "/ledger",
    en: "Tax ledger",
    th: "ทะเบียนภาษี",
    doEn: "AI detections become draft adjustments. Human posts. Versions are append-only.",
    doTh: "สิ่งที่ AI ตรวจพบเป็นร่าง ผู้คนบันทึก เวอร์ชันเพิ่มอย่างเดียว",
  },
  {
    n: "07",
    id: "provision",
    href: "/provision",
    en: "Current tax",
    th: "ภาษีงวดปัจจุบัน",
    doEn: "CIT24-CALC builds taxable profit and current tax. ETR = current tax ÷ PBT.",
    doTh: "CIT24-CALC สร้างกำไรสุทธิทางภาษีและภาษีงวดปัจจุบัน ETR = ภาษีงวดปัจจุบัน ÷ กำไรก่อนภาษี",
  },
  {
    n: "08",
    id: "file",
    href: "/pnd51",
    en: "File 51 then 50",
    th: "ยื่น 51 แล้ว 50",
    doEn: "PND51 simulator (surcharge risk), then PND50 pack, certify, lock.",
    doTh: "แบบจำลอง ภ.ง.ด.51 (ความเสี่ยงเงินเพิ่ม) แล้วชุด ภ.ง.ด.50 รับรอง ล็อกงวด",
  },
] as const;

export const PACK_DOCS = DOC_REQUIREMENTS;

export function slugEngagement(name: string, taken: string[]) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28) || "client";
  let id = base;
  let n = 2;
  while (taken.includes(id)) id = `${base}-${n++}`;
  return id;
}

export function tinOk(tin: string) {
  return /^\d{13}$/.test(tin.replace(/\s/g, ""));
}

export function parseStoredClients(raw: string | null): Client[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is Client => {
      if (!x || typeof x !== "object") return false;
      const r = x as Client;
      return typeof r.id === "string" && typeof r.name === "string" && typeof r.tin === "string";
    });
  } catch {
    return [];
  }
}

export function allClientIds(extra: Client[]) {
  return [...CLIENTS, ...extra].map((c) => c.id);
}

export function tinTaken(tin: string, extra: Client[]) {
  const n = tin.replace(/\s/g, "");
  return [...CLIENTS, ...extra].some((c) => c.tin === n);
}

export function draftToClient(draft: EngagementDraft, extra: Client[]): Client {
  const tin = draft.tin.replace(/\s/g, "");
  return {
    id: slugEngagement(draft.name, allClientIds(extra)),
    name: draft.name.trim(),
    nameTh: (draft.nameTh.trim() || draft.name.trim()),
    tin,
    period: draft.period.trim() || "FY2026",
    fyLabel: draft.fyLabel.trim() || "1 Jan – 31 Dec 2026",
    stage: "Onboarding",
    pct: 8,
    adj: 0,
    tax: 0,
    next: "PND51",
    days: 13,
    risk: "Medium",
    rateProfile: draft.rateProfile,
    pnd51Method: draft.pnd51Method,
    boi: draft.boi,
    custom: true,
  };
}
