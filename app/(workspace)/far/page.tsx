"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { FlowBar } from "@/components/FlowBar";
import { T, pick } from "@/lib/i18n";
import { F, pct } from "@/lib/format";
import { FAR_CLASS_LABEL, farAssetName, farRegister, farTotals } from "@/lib/far";

export default function FarPage() {
  const { lang } = useStore();
  const lines = farRegister();
  const t = farTotals(lines);

  return (
    <div>
      <FlowBar />
      <PageHead
        kickerEn="Royal Decree 145 · tax-base register"
        kickerTh="พระราชกฤษฎีกา 145 · ทะเบียนฐานภาษี"
        kickerZh="第145号王室法令 · 税基台账"
        kickerJa="勅令145号 · 税務簿価台帳"
        titleEn="Fixed-asset tax depreciation"
        titleTh="ค่าเสื่อมราคาทางภาษีของสินทรัพย์ถาวร"
        titleZh="固定资产税务折旧"
        titleJa="固定資産の税務減価償却"
        subEn="Book depreciation above the RD 145 ceiling is a temporary add-back. Catch-up is deducted when tax base remains. Totals post to ADJ-2026-0045."
        subTh="ค่าเสื่อมบัญชีที่เกินเพดาน พ.ร.ฎ. 145 เป็นรายการบวกกลับชั่วคราว ตามจับจะหักเมื่อยังมีฐานภาษี ยอดรวมไปที่ ADJ-2026-0045"
        subZh="会计折旧超过第145号法令上限的部分为暂时性调增。税基仍在时作补提扣除。合计过入 ADJ-2026-0045。"
        subJa="会計償却が勅令145号の上限を超える部分は一時的加算。税務簿価が残る場合にキャッチアップ控除。合計はADJ-2026-0045へ。"
      />

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(5, 1fr)", borderTop: "2px solid var(--color-divider)" }}>
        <div className="stat-cell">
          <div className="stat-label"><T en="Assets" th="สินทรัพย์" zh="资产" ja="資産" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{t.assets}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Book depreciation" th="ค่าเสื่อมทางบัญชี" zh="会计折旧" ja="会計償却" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(t.bookDep)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Tax depreciation" th="ค่าเสื่อมทางภาษี" zh="税务折旧" ja="税務償却" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(t.taxDep)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Excess add-back" th="ส่วนเกินบวกกลับ" zh="超额调增" ja="超過加算" /></div>
          <div className="stat-val" style={{ fontSize: 26, color: "var(--color-accent)" }}>{F(t.excess)}</div>
          <div className="stat-hint">ADJ-2026-0045</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label"><T en="Prior-year catch-up" th="ตามจับปีก่อน" zh="以前年度补提" ja="過年度キャッチアップ" /></div>
          <div className="stat-val" style={{ fontSize: 26 }}>{F(t.catchUp)}</div>
        </div>
      </div>

      <table className="table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th><T en="Asset" th="สินทรัพย์" zh="资产" ja="資産" /></th>
            <th><T en="Class" th="ประเภท" zh="类别" ja="区分" /></th>
            <th><T en="Acquired" th="ได้มา" zh="取得" ja="取得" /></th>
            <th className="num"><T en="Cost" th="ต้นทุน" zh="原值" ja="取得原価" /></th>
            <th className="num"><T en="Book %" th="% บัญชี" zh="会计%" ja="会計%" /></th>
            <th className="num"><T en="Tax %" th="% ภาษี" zh="税务%" ja="税務%" /></th>
            <th className="num"><T en="Book dep." th="เสื่อมบัญชี" zh="会计折旧" ja="会計償却" /></th>
            <th className="num"><T en="Tax dep." th="เสื่อมภาษี" zh="税务折旧" ja="税務償却" /></th>
            <th className="num"><T en="Excess" th="ส่วนเกิน" zh="超额" ja="超過" /></th>
            <th className="num"><T en="Catch-up" th="ตามจับ" zh="补提" ja="キャッチアップ" /></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((r) => (
            <tr key={r.id} style={{ background: r.excess ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : undefined }}>
              <td className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{r.id}</td>
              <td style={{ fontWeight: 600, fontSize: 13 }}>{farAssetName(r, lang)}</td>
              <td style={{ fontSize: 12 }}>{pick(lang, FAR_CLASS_LABEL[r.cls])}</td>
              <td style={{ fontSize: 12 }}>{r.acquired}</td>
              <td className="num">{F(r.cost)}</td>
              <td className="num">{pct(r.bookRate, 1)}</td>
              <td className="num">{pct(r.taxRate, 0)}</td>
              <td className="num">{F(r.bookDep)}</td>
              <td className="num">{F(r.taxDep)}</td>
              <td className="num" style={{ fontWeight: 800 }}>{F(r.excess, true)}</td>
              <td className="num">{F(r.priorCatchUp, true)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={7} style={{ fontWeight: 800 }}><T en="Total · posts to ADJ-2026-0045" th="รวม · บันทึกเข้า ADJ-2026-0045" zh="合计 · 过入 ADJ-2026-0045" ja="合計 · ADJ-2026-0045へ" /></td>
            <td className="num" style={{ fontWeight: 800 }}>{F(t.bookDep)}</td>
            <td className="num" style={{ fontWeight: 800 }}>{F(t.taxDep)}</td>
            <td className="num" style={{ fontWeight: 800 }}>{F(t.excess)}</td>
            <td className="num" style={{ fontWeight: 800 }}>{F(t.catchUp)}</td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
        <T
          en={`CIT24-CALC applies min(book, cost × RD 145 rate) per asset. Excess ${F(t.excess)} is the FY2026 temporary add-back. Prior catch-up ${F(t.catchUp)} remains on the tax-base register until deducted.`}
          th={`CIT24-CALC ใช้ค่าต่ำกว่าระหว่างค่าเสื่อมบัญชีกับต้นทุน × อัตรา พ.ร.ฎ. 145 ทีละสินทรัพย์ ส่วนเกิน ${F(t.excess)} คือรายการบวกกลับชั่วคราวปี 2569 ตามจับปีก่อน ${F(t.catchUp)} ยังอยู่ในทะเบียนฐานภาษี`}
          zh={`CIT24-CALC 按资产取 min(会计折旧, 原值 × 第145号法令比率)。超额 ${F(t.excess)} 为 2026 年暂时性调增。以前年度补提 ${F(t.catchUp)} 留在税基台账直至扣除。`}
          ja={`CIT24-CALCは資産ごとに min(会計償却, 取得原価 × 勅令145号率) を適用。超過 ${F(t.excess)} がFY2026の一時的加算。過年度キャッチアップ ${F(t.catchUp)} は控除まで税務簿価台帳に残る。`}
        />
        {" "}
        <Link href="/ledger"><T en="Open ledger" th="เปิดทะเบียน" zh="打开台账" ja="台帳を開く" /></Link>
        {" · "}
        <Link href="/reports"><T en="Export workpaper" th="ส่งออกกระดาษทำการ" zh="导出工作底稿" ja="ワークペーパー出力" /></Link>
      </div>
    </div>
  );
}
