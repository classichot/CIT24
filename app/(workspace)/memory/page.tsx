"use client";

import { MEMORY } from "@/lib/model";
import { PageHead, ptCls, statusCls } from "@/components/PageHead";
import { T } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { F } from "@/lib/format";
import Link from "next/link";

export default function MemoryPage() {
  const { priorImported, priorRows, importPriorYear, canMutate, lang, adjustments } = useStore();
  const linked = priorImported
    ? adjustments.filter((a) => a.priorYear && priorRows.some((p) => p.id === a.priorYear))
    : adjustments.filter((a) => a.priorYear);

  return (
    <div>
      <PageHead
        kickerEn="Killer feature · knowledge that survives staff change"
        kickerTh="จุดเด่น · ความรู้ที่ไม่หายไปเมื่อคนเปลี่ยน"
        kickerZh="核心能力 · 不随人员更替丢失的知识"
        kickerJa="中核機能 · 担当変更でも残る知識"
        titleEn="Corporate Tax Memory"
        titleTh="ความจำภาษีนิติบุคคล"
        titleZh="企业税务记忆"
        titleJa="法人税メモリ"
        subEn="How the account was treated, why it was adjusted, which evidence supported it, who approved it, whether it should reverse, and whether treatment changed."
        subTh="บัญชีถูกปฏิบัติอย่างไร เหตุใดจึงปรับปรุง หลักฐานใดรองรับ ใครอนุมัติ ควรกลับรายการหรือไม่ และการปฏิบัติเปลี่ยนจากปีก่อนหรือไม่"
        subZh="科目如何处理、为何调整、依据何种证据、由谁批准、是否应转回、以及处理是否较上年变化。"
        subJa="勘定の扱い、調整理由、根拠証憑、承認者、戻入の要否、前年からの変更。"
        actions={
          <button className="btn btn-primary" onClick={importPriorYear} disabled={!canMutate || priorImported}>
            {priorImported
              ? <T en="FY2025 imported" th="นำเข้าปี 2568 แล้ว" zh="已导入 FY2025" ja="FY2025取込済" />
              : <T en="Import FY2025 ledger" th="นำเข้าทะเบียนปี 2568" zh="导入 FY2025 台账" ja="FY2025台帳を取込" />}
          </button>
        }
      />
      <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
        <T
          en="Legal source of truth is the regulation corpus — not staff recollection."
          th="แหล่งกฎหมายที่เป็นจริงคือคลังกฎหมาย — ไม่ใช่ความจำของพนักงาน"
          zh="法律事实来源是法规库，而非人员记忆。"
          ja="法令の根拠はコーパスであり、担当者の記憶ではない。"
        />{" "}
        <Link href="/corpus"><T en="Open regulation corpus" th="เปิดคลังกฎหมาย" zh="打开法规库" ja="法令コーパスを開く" /></Link>
      </div>
      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th><T en="Account" th="บัญชี" zh="科目" ja="勘定" /></th>
            <th>FY2025</th>
            <th>FY2026</th>
            <th><T en="Changed?" th="เปลี่ยน?" zh="是否变化" ja="変更?" /></th>
          </tr>
        </thead>
        <tbody>
          {MEMORY.map((m) => (
            <tr key={m.account}>
              <td style={{ fontWeight: 600 }}>{m.account}</td>
              <td style={{ fontSize: 13 }}>{m.fy2025}</td>
              <td style={{ fontSize: 13 }}>{m.fy2026}</td>
              <td>{m.changed ? <span className="tag tag-outline"><T en="Changed" th="เปลี่ยน" zh="已变化" ja="変更あり" /></span> : <span className="tag tag-neutral"><T en="Consistent" th="สอดคล้อง" zh="一致" ja="一貫" /></span>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {priorImported && (
        <>
          <h5 className="sec-h" style={{ marginTop: 28 }}>
            <T en="Imported FY2025 ledger · 12 positions (append-only)" th="ทะเบียนปี 2568 ที่นำเข้า · 12 รายการ (เพิ่มอย่างเดียว)" zh="已导入的 FY2025 台账 · 12 项（只追加）" ja="取込済FY2025台帳 · 12件（追記のみ）" />
          </h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th><T en="Position" th="รายการ" zh="项目" ja="項目" /></th>
                <th>GL</th>
                <th>P/T</th>
                <th className="num"><T en="Amount" th="จำนวน" zh="金额" ja="金額" /></th>
                <th><T en="Status" th="สถานะ" zh="状态" ja="ステータス" /></th>
                <th><T en="FY2026 link" th="โยงปี 2569" zh="2026年链接" ja="FY2026リンク" /></th>
              </tr>
            </thead>
            <tbody>
              {priorRows.map((r) => {
                const next = adjustments.find((a) => a.priorYear === r.id);
                return (
                  <tr key={r.id}>
                    <td className="mono" style={{ fontSize: 11, fontWeight: 800 }}>{r.id}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{lang === "th" ? r.nameTh : r.name}</td>
                    <td style={{ fontSize: 12 }}>{r.gl}</td>
                    <td><span className={ptCls(r.pt)}>{r.pt}</span></td>
                    <td className="num">{F(r.adjAmt)}</td>
                    <td><span className={statusCls(r.status)}>{r.status}</span></td>
                    <td style={{ fontSize: 12 }}>{next ? next.id : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {!priorImported && (
        <div className="callout" style={{ marginTop: 20, fontSize: 13 }}>
          <T
            en="Import writes the filed FY2025 Tax Adjustment Ledger into memory. Current-year numbers do not change. Positions are never overwritten."
            th="การนำเข้าจะบันทึกทะเบียนรายการปรับปรุงปี 2568 ที่ยื่นแล้วเข้าความจำ ไม่เปลี่ยนตัวเลขปีนี้ และไม่เขียนทับรายการ"
            zh="导入将已申报的 FY2025 纳税调整台账写入记忆。不改变当年数字。项目永不覆盖。"
            ja="取込は提出済FY2025税務調整台帳をメモリに書き込む。当年数値は変わらない。上書きしない。"
          />
          {" "}
          <Link href="/ledger"><T en="Import from the ledger" th="นำเข้าจากทะเบียน" zh="从台账导入" ja="台帳から取込" /></Link>
        </div>
      )}

      {linked.length > 0 && priorImported && (
        <div className="callout" style={{ marginTop: 16, fontSize: 13 }}>
          <T
            en={`${linked.length} FY2026 adjustments now point at an imported prior-year id.`}
            th={`${linked.length} รายการปี 2569 ชี้ไปที่รหัสปีก่อนที่นำเข้าแล้ว`}
            zh={`${linked.length} 项 FY2026 调整已指向导入的上年编号。`}
            ja={`${linked.length}件のFY2026調整が取込済の前年IDを参照。`}
          />
        </div>
      )}
    </div>
  );
}
