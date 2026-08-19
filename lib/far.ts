import { money } from "./format";

/** Royal Decree 145 class ceilings (annual % of cost). */
export type FarClass = "building" | "machinery" | "vehicle" | "computer" | "furniture" | "tools";

export const RD145_RATE: Record<FarClass, number> = {
  building: 0.05,
  machinery: 0.20,
  vehicle: 0.20,
  computer: 0.20,
  furniture: 0.20,
  tools: 0.20,
};

export const FAR_CLASS_LABEL: Record<FarClass, { en: string; th: string; zh: string; ja: string }> = {
  building: { en: "Buildings 5%", th: "อาคาร 5%", zh: "房屋 5%", ja: "建物 5%" },
  machinery: { en: "Machinery 20%", th: "เครื่องจักร 20%", zh: "机器设备 20%", ja: "機械装置 20%" },
  vehicle: { en: "Vehicles 20%", th: "ยานพาหนะ 20%", zh: "车辆 20%", ja: "車両 20%" },
  computer: { en: "Computer 20%", th: "คอมพิวเตอร์ 20%", zh: "计算机 20%", ja: "コンピュータ 20%" },
  furniture: { en: "Furniture 20%", th: "เครื่องเรือน 20%", zh: "家具 20%", ja: "什器 20%" },
  tools: { en: "Tools 20%", th: "เครื่องมือ 20%", zh: "工具 20%", ja: "工具 20%" },
};

export type FarAsset = {
  id: string;
  name: string;
  nameTh: string;
  nameZh: string;
  nameJa: string;
  cls: FarClass;
  cost: number;
  bookRate: number;
  acquired: string;
  priorCatchUp: number;
};

/** Seeded so book 18,600,000 − tax 17,500,000 = excess 1,100,000 (ADJ-2026-0045) and catch-up 700,000. */
export const FAR_ASSETS: FarAsset[] = [
  { id: "FAR-0412", name: "Factory building — Bangplee", nameTh: "อาคารโรงงาน บางพลี", nameZh: "挽披工厂厂房", nameJa: "バンプリー工場建屋", cls: "building", cost: 67_600_000, bookRate: 0.05, acquired: "12 Mar 2019", priorCatchUp: 0 },
  { id: "FAR-0881", name: "CNC line A", nameTh: "สายซีเอ็นซี เอ", nameZh: "数控线 A", nameJa: "CNCラインA", cls: "machinery", cost: 10_000_000, bookRate: 0.25, acquired: "04 Jan 2023", priorCatchUp: 180_000 },
  { id: "FAR-0882", name: "CNC line B", nameTh: "สายซีเอ็นซี บี", nameZh: "数控线 B", nameJa: "CNCラインB", cls: "machinery", cost: 6_000_000, bookRate: 0.25, acquired: "18 Jun 2024", priorCatchUp: 90_000 },
  { id: "FAR-1104", name: "Press line", nameTh: "สายเพรส", nameZh: "冲压线", nameJa: "プレスライン", cls: "machinery", cost: 36_000_000, bookRate: 0.20, acquired: "09 Sep 2020", priorCatchUp: 200_000 },
  { id: "FAR-2011", name: "Delivery trucks (fleet)", nameTh: "รถบรรทุกจัดส่ง", nameZh: "配送货车", nameJa: "配送トラック", cls: "vehicle", cost: 4_000_000, bookRate: 0.25, acquired: "22 Feb 2022", priorCatchUp: 120_000 },
  { id: "FAR-2018", name: "Forklifts", nameTh: "รถโฟล์คลิฟท์", nameZh: "叉车", nameJa: "フォークリフト", cls: "vehicle", cost: 2_000_000, bookRate: 0.25, acquired: "03 Aug 2021", priorCatchUp: 40_000 },
  { id: "FAR-3302", name: "IT hardware", nameTh: "เครื่องคอมพิวเตอร์", nameZh: "计算机硬件", nameJa: "ITハードウェア", cls: "computer", cost: 1_200_000, bookRate: 0.20, acquired: "15 Jan 2026", priorCatchUp: 0 },
  { id: "FAR-4410", name: "Office furniture", nameTh: "เครื่องเรือนสำนักงาน", nameZh: "办公家具", nameJa: "什器備品", cls: "furniture", cost: 800_000, bookRate: 0.20, acquired: "01 Apr 2024", priorCatchUp: 0 },
  { id: "FAR-4502", name: "Office fit-out", nameTh: "ตกแต่งสำนักงาน", nameZh: "办公室装修", nameJa: "内装", cls: "furniture", cost: 1_000_000, bookRate: 0.20, acquired: "01 Apr 2024", priorCatchUp: 0 },
  { id: "FAR-5090", name: "Jigs and tools", nameTh: "จิ๊กและเครื่องมือ", nameZh: "夹具与工具", nameJa: "治具・工具", cls: "tools", cost: 3_000_000, bookRate: 0.20, acquired: "11 Nov 2022", priorCatchUp: 0 },
  { id: "FAR-6120", name: "Temporary site office", nameTh: "สำนักงานสนามชั่วคราว", nameZh: "临时现场办公", nameJa: "仮設事務所", cls: "building", cost: 2_400_000, bookRate: 0.05, acquired: "08 May 2025", priorCatchUp: 0 },
  { id: "FAR-7701", name: "Inspection equipment", nameTh: "เครื่องตรวจวัด", nameZh: "检测设备", nameJa: "検査装置", cls: "machinery", cost: 6_000_000, bookRate: 0.20, acquired: "19 Mar 2021", priorCatchUp: 70_000 },
];

export type FarLine = FarAsset & {
  taxRate: number;
  bookDep: number;
  taxDep: number;
  excess: number;
};

export function farRegister(assets: FarAsset[] = FAR_ASSETS): FarLine[] {
  return assets.map((a) => {
    const taxRate = RD145_RATE[a.cls];
    const bookDep = money(a.cost * a.bookRate);
    const taxDep = money(Math.min(bookDep, a.cost * taxRate));
    return { ...a, taxRate, bookDep, taxDep, excess: money(bookDep - taxDep) };
  });
}

export function farTotals(lines: FarLine[] = farRegister()) {
  const bookDep = money(lines.reduce((s, r) => s + r.bookDep, 0));
  const taxDep = money(lines.reduce((s, r) => s + r.taxDep, 0));
  const excess = money(lines.reduce((s, r) => s + r.excess, 0));
  const catchUp = money(lines.reduce((s, r) => s + r.priorCatchUp, 0));
  return { bookDep, taxDep, excess, catchUp, netAddBack: money(excess - catchUp), assets: lines.length };
}

export function farAssetName(a: Pick<FarAsset, "name" | "nameTh" | "nameZh" | "nameJa">, lang: "en" | "th" | "zh" | "ja") {
  if (lang === "th") return a.nameTh;
  if (lang === "zh") return a.nameZh;
  if (lang === "ja") return a.nameJa;
  return a.name;
}
