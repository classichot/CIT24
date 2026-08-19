"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { ResizableTable } from "@/components/ResizableTable";
import { T, pick } from "@/lib/i18n";
import { buildWorkpaper, catalog, downloadCsv, type WorkpaperId } from "@/lib/reports";
import { farRegister } from "@/lib/far";

export default function ReportsPage() {
  const { lang, adjustments, provision, losses, certs } = useStore();
  const [sel, setSel] = useState<WorkpaperId>("btt");
  const farLines = useMemo(() => farRegister(), []);
  const items = catalog();
  const wp = useMemo(
    () => buildWorkpaper(sel, lang, { adjustments, provision, losses, certs, farLines }),
    [sel, lang, adjustments, provision, losses, certs, farLines],
  );
  const cols = wp.columns.map((c) => pick(lang, c));
  const title = pick(lang, wp.title);

  return (
    <div className="reports-page">
      <PageHead
        kickerEn="English · Thai · Chinese · Japanese · CSV and print"
        kickerTh="อังกฤษ · ไทย · จีน · ญี่ปุ่น · CSV และพิมพ์"
        kickerZh="英 · 泰 · 中 · 日 · CSV 与打印"
        kickerJa="英 · 泰 · 中 · 日 · CSVと印刷"
        titleEn="Reports and outputs"
        titleTh="รายงานและผลลัพธ์"
        titleZh="报告与输出"
        titleJa="レポートと出力"
        subEn="Every workpaper is generated from the live ledger, provision, losses, WHT and FAR. Change an adjustment, then regenerate — never edit a number here."
        subTh="ทุกกระดาษทำการสร้างจากทะเบียน ประมาณการ ผลขาดทุน เครดิตหัก ณ ที่จ่าย และทะเบียนสินทรัพย์ที่มีอยู่ แก้รายการปรับปรุงแล้วสร้างใหม่ — ห้ามแก้ตัวเลขที่นี่"
        subZh="每份工作底稿均来自实时台账、准备、亏损、预提税与固定资产台账。请先改调整再重新生成——不要在此改数。"
        subJa="すべてのワークペーパーはライブの台帳・引当・欠損金・源泉税・FARから生成。数値はここで直さず、調整を変えて再生成。"
        actions={
          <>
            <button className="btn btn-secondary no-print" onClick={() => window.print()}>
              <T en="Print / PDF" th="พิมพ์ / PDF" zh="打印 / PDF" ja="印刷 / PDF" />
            </button>
            <button
              className="btn btn-primary no-print"
              onClick={() => downloadCsv(`CIT24-${sel}-FY2026-${lang}.csv`, cols, wp.rows)}
            >
              <T en="Download CSV" th="ดาวน์โหลด CSV" zh="下载 CSV" ja="CSVダウンロード" />
            </button>
          </>
        }
      />

      <div className="reports-split" style={{ marginTop: 8 }}>
        <aside className="col-aside no-print reports-catalog" style={{ borderRight: "1px solid var(--color-divider)" }}>
          <div className="card-kicker" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>CIT24</div>
          {items.map((r) => (
            <button
              key={r.id}
              onClick={() => setSel(r.id)}
              className="nav-btn"
              style={{
                width: "100%",
                textAlign: "left",
                marginBottom: 4,
                background: r.id === sel ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : undefined,
              }}
            >
              {pick(lang, r.title)}
            </button>
          ))}
        </aside>
        <section className="col-pad reports-detail" id="workpaper">
          <div className="reports-wp-head">
            <h5 className="sec-h" style={{ margin: 0 }}>{title}</h5>
            <Link href={wp.href} className="text-muted" style={{ fontSize: 12 }}><T en="Open source screen" th="เปิดหน้าต้นทาง" zh="打开源页面" ja="元画面を開く" /></Link>
            <span className="text-muted" style={{ fontSize: 11, marginLeft: "auto" }}>Siam Precision Parts · FY2026 · {lang.toUpperCase()}</span>
          </div>
          <ResizableTable
            storageKey={`reports:${sel}`}
            columns={cols}
            rows={wp.rows}
            thClassName={(c) => (c === "THB" || /amount|dep|cost|origin|THB|บาท|金额|金額/i.test(c) ? "num" : undefined)}
            tdClassName={(_cell, _i, j) => (j === cols.length - 1 || j >= 2 ? "num" : undefined)}
            tdStyle={(_cell, i) => {
              const line = wp.rows[i]?.[0] ?? "";
              const heavy =
                sel !== "ledger" &&
                (i === wp.rows.length - 1 ||
                  /^(Total |Adjusted profit|Taxable profit|Corporate income tax|Tax payable|Current tax)/i.test(line));
              return { fontWeight: heavy ? 700 : 500, fontSize: 13 };
            }}
          />
          {wp.note && <div className="callout" style={{ marginTop: 14, fontSize: 13 }}>{pick(lang, wp.note)}</div>}
        </section>
      </div>
    </div>
  );
}
